import type { WatchConfig } from '../core/state/types.js';

export const defaultConfig: WatchConfig = {
  sessionIdOrUrl: '',
  identity: {},
  pollingIntervalMs: 5000,
  duplicateCooldownMs: 0,
  pitStopThresholdPct: 15,
  ambiguousMap: {},
  demoMode: true,
  discord: {
    mode: 'none'
  }
};
