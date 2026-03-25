import seed from '../../data/mock-session.json' with { type: 'json' };
import type { SessionSnapshot } from '../../core/state/types.js';
import type { ITelemetryAdapter } from './types.js';

export class MockITelemetryAdapter implements ITelemetryAdapter {
  kind: 'mock' = 'mock';
  private tick = 0;

  async getSnapshot(): Promise<SessionSnapshot> {
    this.tick += 1;
    const data = structuredClone(seed) as SessionSnapshot;
    data.updatedAt = new Date().toISOString();
    if (this.tick % 3 === 0) {
      const c = data.cars.find((x) => x.id === 'car-18');
      if (c) c.flags.meatball = true;
      data.events.push({
        id: `evt-${this.tick}`,
        ts: new Date().toISOString(),
        type: 'race_control',
        carId: 'car-18',
        message: 'Car #18 shown black/orange flag',
        tag: 'meatball'
      });
    }
    if (this.tick % 4 === 0) {
      const c = data.cars.find((x) => x.id === 'car-27');
      if (c) c.pitStopDurationSec = 45;
    }
    return data;
  }
}
