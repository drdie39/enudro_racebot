import type { WatchConfig } from '../../core/state/types.js';
import { HttpITelemetryAdapter } from './httpAdapter.js';
import { MockITelemetryAdapter } from './mockAdapter.js';
import { PlaywrightITelemetryAdapter } from './playwrightAdapter.js';
import type { ITelemetryAdapter } from './types.js';

export function createAdapter(config: WatchConfig): ITelemetryAdapter {
  if (config.demoMode) return new MockITelemetryAdapter();
  if (process.env.ITELEMETRY_HTTP_BASE_URL) return new HttpITelemetryAdapter(process.env.ITELEMETRY_HTTP_BASE_URL);
  return new PlaywrightITelemetryAdapter();
}
