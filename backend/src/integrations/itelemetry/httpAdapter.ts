import type { SessionSnapshot } from '../../core/state/types.js';
import type { ITelemetryAdapter } from './types.js';

export class HttpITelemetryAdapter implements ITelemetryAdapter {
  kind: 'http' = 'http';
  constructor(private readonly baseUrl: string) {}

  async getSnapshot(sessionIdOrUrl: string): Promise<SessionSnapshot> {
    const sessionId = sessionIdOrUrl.split('/').pop();
    const response = await fetch(`${this.baseUrl}/api/public/session/${sessionId}`, { headers: { accept: 'application/json' } });
    if (!response.ok) {
      throw new Error(`HTTP adapter failed: ${response.status}`);
    }
    return (await response.json()) as SessionSnapshot;
  }
}
