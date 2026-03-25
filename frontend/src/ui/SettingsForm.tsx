'use client';
import { useState } from 'react';

export function SettingsForm({ current }: { current: any }) {
  const [form, setForm] = useState<any>(current);
  const [msg, setMsg] = useState('');

  const save = async () => {
    const r = await fetch('/api/settings', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) });
    setMsg(r.ok ? 'Saved' : 'Save failed');
  };

  return <div style={{ display: 'grid', gap: 8, maxWidth: 700 }}>
    <h3>Settings</h3>
    <label>Session URL/ID <input value={form.sessionIdOrUrl ?? ''} onChange={(e) => setForm({ ...form, sessionIdOrUrl: e.target.value })} /></label>
    <label>Driver Name <input value={form.identity?.driverName ?? ''} onChange={(e) => setForm({ ...form, identity: { ...form.identity, driverName: e.target.value } })} /></label>
    <label>Car Number <input value={form.identity?.carNumber ?? ''} onChange={(e) => setForm({ ...form, identity: { ...form.identity, carNumber: e.target.value } })} /></label>
    <label>Polling ms <input type='number' value={form.pollingIntervalMs ?? 5000} onChange={(e) => setForm({ ...form, pollingIntervalMs: Number(e.target.value) })} /></label>
    <label>Long pitstop threshold % <input type='number' value={form.pitStopThresholdPct ?? 15} onChange={(e) => setForm({ ...form, pitStopThresholdPct: Number(e.target.value) })} /></label>
    <label>Discord mode
      <select value={form.discord?.mode ?? 'none'} onChange={(e) => setForm({ ...form, discord: { ...form.discord, mode: e.target.value } })}>
        <option value='none'>none</option><option value='webhook'>webhook</option><option value='bot'>bot</option>
      </select>
    </label>
    <label>Discord webhook URL <input value={form.discord?.webhookUrl ?? ''} onChange={(e) => setForm({ ...form, discord: { ...form.discord, webhookUrl: e.target.value } })} /></label>
    <label>Discord bot token <input value={form.discord?.botToken ?? ''} onChange={(e) => setForm({ ...form, discord: { ...form.discord, botToken: e.target.value } })} /></label>
    <label>Discord channel ID <input value={form.discord?.channelId ?? ''} onChange={(e) => setForm({ ...form, discord: { ...form.discord, channelId: e.target.value } })} /></label>
    <label>Team role ID <input value={form.discord?.teamRoleId ?? ''} onChange={(e) => setForm({ ...form, discord: { ...form.discord, teamRoleId: e.target.value } })} /></label>
    <button onClick={save}>Save settings</button>
    <div>{msg}</div>
  </div>;
}
