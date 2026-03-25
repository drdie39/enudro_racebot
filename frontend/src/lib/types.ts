export interface AppState {
  status: { running: boolean; connectionHealth: string; message: string };
  config: any;
  myCar?: any;
  session?: any;
  sameClassAhead: any[];
  watchTargets: any[];
  alerts: any[];
}
