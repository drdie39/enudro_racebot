import { defaultConfig } from '../../config/defaults.js';
import type { AlertRecord, AppState, MonitorStatus, SessionSnapshot, WatchConfig } from './types.js';

const defaultStatus: MonitorStatus = {
  running: false,
  connectionHealth: 'down',
  message: 'Idle'
};

export class InMemoryStateStore {
  private state: AppState = {
    config: defaultConfig,
    status: defaultStatus,
    sameClassAhead: [],
    watchTargets: [],
    activeMeatballAlerts: new Set(),
    activeLongPitAlerts: new Set(),
    alerts: []
  };

  getState(): AppState {
    return this.state;
  }

  updateConfig(config: WatchConfig): void {
    this.state.config = config;
  }

  updateSession(snapshot: SessionSnapshot): void {
    this.state.session = snapshot;
  }

  setDerived(myCar: AppState['myCar'], sameClassAhead: AppState['sameClassAhead']): void {
    this.state.myCar = myCar;
    this.state.sameClassAhead = sameClassAhead;
    this.state.watchTargets = sameClassAhead;
  }

  setStatus(status: Partial<MonitorStatus>): void {
    this.state.status = { ...this.state.status, ...status };
  }

  pushAlert(alert: AlertRecord): void {
    this.state.alerts.unshift(alert);
    this.state.alerts = this.state.alerts.slice(0, 100);
  }
}
