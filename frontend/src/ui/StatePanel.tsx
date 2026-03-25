'use client';
import { AppState } from '../lib/types';

export function StatePanel({ state }: { state: AppState | null }) {
  if (!state) return <div>Loading...</div>;
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <section><b>Session status:</b> {state.status.running ? 'Running' : 'Stopped'} ({state.status.connectionHealth}) - {state.status.message}</section>
      <section><b>My detected car:</b> {state.myCar ? `#${state.myCar.carNumber} ${state.myCar.driverName}` : 'Not found'}</section>
      <section><b>My class:</b> {state.myCar?.className ?? '-'}</section>
      <section><b>Same-class cars ahead:</b> {state.sameClassAhead.map((c) => `#${c.carNumber} P${c.position}`).join(', ') || 'None'}</section>
      <section><b>Current watch targets:</b> {state.watchTargets.map((c) => c.id).join(', ') || 'None'}</section>
      <section><b>Recent alerts:</b>
        <ul>{state.alerts.slice(0, 10).map((a) => <li key={a.id}>{a.ts} | {a.type} | #{a.competitor.carNumber} | {a.confidence}</li>)}</ul>
      </section>
      <section><b>Integration health:</b> {state.status.connectionHealth}</section>
    </div>
  );
}
