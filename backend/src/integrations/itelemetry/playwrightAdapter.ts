import type { SessionSnapshot } from '../../core/state/types.js';
import type { ITelemetryAdapter } from './types.js';

export class PlaywrightITelemetryAdapter implements ITelemetryAdapter {
  kind: 'playwright' = 'playwright';

  async getSnapshot(): Promise<SessionSnapshot> {
    throw new Error('Playwright adapter is scaffolded only. Add user-authenticated scraping flow before use.');
  }
}
