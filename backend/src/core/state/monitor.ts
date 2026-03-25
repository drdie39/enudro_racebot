import pino from 'pino';
import { detectLongPitstops, detectMeatball } from '../alerts/detector.js';
import { identifyMyCar, sameClassAhead } from '../classification/identify.js';
import { createAdapter } from '../../integrations/itelemetry/factory.js';
import { DiscordNotifier } from '../../integrations/discord/client.js';
import type { InMemoryStateStore } from './store.js';

const logger = pino({ name: 'monitor' });

export class MonitorService {
  private timer?: NodeJS.Timeout;
  private discord = new DiscordNotifier();

  constructor(private readonly store: InMemoryStateStore, private readonly onEmit: () => void) {}

  start(): void {
    this.stop();
    this.store.setStatus({ running: true, message: 'Monitoring', connectionHealth: 'ok' });
    const tick = async (): Promise<void> => {
      const state = this.store.getState();
      try {
        const adapter = createAdapter(state.config);
        const snapshot = await adapter.getSnapshot(state.config.sessionIdOrUrl);
        this.store.updateSession(snapshot);

        const myCar = identifyMyCar(snapshot.cars, state.config.identity, state.config.ambiguousMap);
        if (!myCar) {
          this.store.setStatus({ connectionHealth: 'degraded', message: 'Could not identify your car' });
          this.onEmit();
          return;
        }
        const ahead = snapshot.sessionType === 'race' ? sameClassAhead(snapshot.cars, myCar) : [];
        if (snapshot.sessionType !== 'race') {
          this.store.setStatus({ message: `Session type ${snapshot.sessionType}: ahead-of logic degraded` });
        }
        this.store.setDerived(myCar, ahead);

        const meatball = detectMeatball(snapshot, ahead, myCar, state.activeMeatballAlerts);
        state.activeMeatballAlerts = meatball.nextActive;

        const longPit = detectLongPitstops(snapshot, ahead, myCar, state.activeLongPitAlerts, state.config.pitStopThresholdPct);
        state.activeLongPitAlerts = longPit.nextActive;

        for (const alert of [...meatball.raised, ...longPit.raised]) {
          this.store.pushAlert(alert);
          logger.info({ alert }, 'Alert raised');
          await this.discord.notify(alert, state.config.discord);
        }

        this.store.setStatus({ connectionHealth: 'ok' });
      } catch (error) {
        logger.error({ error }, 'Monitor tick failed');
        this.store.setStatus({ connectionHealth: 'down', message: (error as Error).message });
      }
      this.onEmit();
    };

    void tick();
    this.timer = setInterval(() => void tick(), this.store.getState().config.pollingIntervalMs);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
    this.store.setStatus({ running: false, message: 'Stopped' });
  }
}
