export type Confidence = 'explicit' | 'inferred';

export interface CarState {
  id: string;
  driverName: string;
  carNumber: string;
  className: string;
  position?: number;
  pitStopDurationSec?: number;
  flags: {
    meatball: boolean;
  };
}

export interface SessionEvent {
  id: string;
  ts: string;
  type: 'race_control' | 'system';
  carId?: string;
  message: string;
  tag?: 'meatball';
}

export interface SessionSnapshot {
  sessionId: string;
  sessionName: string;
  sessionType: 'race' | 'practice' | 'qualifying';
  updatedAt: string;
  cars: CarState[];
  events: SessionEvent[];
}

export interface IdentityConfig {
  driverName?: string;
  carNumber?: string;
  preferredCarId?: string;
}

export interface DiscordConfig {
  mode: 'none' | 'webhook' | 'bot';
  webhookUrl?: string;
  botToken?: string;
  channelId?: string;
  teamRoleId?: string;
}

export interface WatchConfig {
  sessionIdOrUrl: string;
  identity: IdentityConfig;
  pollingIntervalMs: number;
  duplicateCooldownMs: number;
  pitStopThresholdPct: number;
  ambiguousMap: Record<string, string>;
  demoMode: boolean;
  discord: DiscordConfig;
}

export interface AlertRecord {
  id: string;
  ts: string;
  type: 'meatball' | 'long_pit';
  competitor: CarState;
  myCar: CarState;
  sessionName: string;
  confidence: Confidence;
  reason: string;
}

export interface MonitorStatus {
  running: boolean;
  connectionHealth: 'ok' | 'degraded' | 'down';
  message: string;
}

export interface AppState {
  config: WatchConfig;
  status: MonitorStatus;
  session?: SessionSnapshot;
  myCar?: CarState;
  sameClassAhead: CarState[];
  watchTargets: CarState[];
  activeMeatballAlerts: Set<string>;
  activeLongPitAlerts: Set<string>;
  alerts: AlertRecord[];
}
