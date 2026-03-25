import type { SessionSnapshot } from '../../core/state/types.js';

export interface ITelemetryAdapter {
  getSnapshot(sessionIdOrUrl: string): Promise<SessionSnapshot>;
  kind: 'mock' | 'http' | 'playwright';
}
