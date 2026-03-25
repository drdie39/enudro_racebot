import { describe, expect, it } from 'vitest';
import { detectLongPitstops, detectMeatball } from '../src/core/alerts/detector.js';
import { formatDiscordMessage } from '../src/integrations/discord/format.js';

const baseSnapshot = {
  sessionId: 's',
  sessionName: 'Demo',
  sessionType: 'race' as const,
  updatedAt: new Date().toISOString(),
  cars: [
    { id: 'a', driverName: 'A', carNumber: '1', className: 'GT3', position: 1, pitStopDurationSec: 40, flags: { meatball: true } },
    { id: 'me', driverName: 'Me', carNumber: '45', className: 'GT3', position: 3, pitStopDurationSec: 20, flags: { meatball: false } },
    { id: 'b', driverName: 'B', carNumber: '2', className: 'GT3', position: 2, pitStopDurationSec: 20, flags: { meatball: false } }
  ],
  events: [{ id: 'e', ts: new Date().toISOString(), type: 'race_control' as const, carId: 'a', message: 'flag', tag: 'meatball' as const }]
};

describe('alerts', () => {
  it('suppresses duplicate meatball alerts', () => {
    const first = detectMeatball(baseSnapshot, [baseSnapshot.cars[0]], baseSnapshot.cars[1], new Set());
    expect(first.raised).toHaveLength(1);
    const second = detectMeatball(baseSnapshot, [baseSnapshot.cars[0]], baseSnapshot.cars[1], first.nextActive);
    expect(second.raised).toHaveLength(0);
  });

  it('detects long pitstop', () => {
    const lp = detectLongPitstops(baseSnapshot, [baseSnapshot.cars[0]], baseSnapshot.cars[1], new Set(), 15);
    expect(lp.raised).toHaveLength(1);
  });

  it('formats discord message', () => {
    const alert = detectMeatball(baseSnapshot, [baseSnapshot.cars[0]], baseSnapshot.cars[1], new Set()).raised[0];
    const msg = formatDiscordMessage(alert, { mode: 'webhook', teamRoleId: '123' });
    expect(msg).toContain('<@&123>');
    expect(msg).toContain('meatball');
  });
});
