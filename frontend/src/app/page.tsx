'use client';
import { useEffect, useState } from 'react';
import { SettingsForm } from '../ui/SettingsForm';
import { StatePanel } from '../ui/StatePanel';

export default function Home() {
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    fetch('/api/state').then((r) => r.json()).then(setState);
    const ev = new EventSource('/api/events');
    ev.onmessage = (m) => setState(JSON.parse(m.data));
    return () => ev.close();
  }, []);

  const action = async (path: string) => { await fetch(path, { method: 'POST' }); };

  return <main style={{ padding: 20, fontFamily: 'sans-serif', display: 'grid', gap: 20 }}>
    <h1>Racebot Dashboard</h1>
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={() => action('/api/watch/start')}>Start Watch</button>
      <button onClick={() => action('/api/watch/stop')}>Stop Watch</button>
    </div>
    <StatePanel state={state} />
    {state && <SettingsForm current={state.config} />}
  </main>;
}
