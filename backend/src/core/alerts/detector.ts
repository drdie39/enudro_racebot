import type { AlertRecord, CarState, Confidence, SessionSnapshot } from '../state/types.js';

function explicitMeatballEventForCar(snapshot: SessionSnapshot, carId: string): boolean {
  return snapshot.events.some((e) => e.carId === carId && e.tag === 'meatball');
}

export function detectMeatball(
  snapshot: SessionSnapshot,
  aheadCars: CarState[],
  myCar: CarState,
  active: Set<string>
): { raised: AlertRecord[]; nextActive: Set<string> } {
  const next = new Set<string>();
  const raised: AlertRecord[] = [];
  for (const competitor of aheadCars) {
    const explicit = explicitMeatballEventForCar(snapshot, competitor.id);
    const inferred = competitor.flags.meatball;
    const hasFlag = explicit || inferred;
    if (hasFlag) {
      next.add(competitor.id);
      if (!active.has(competitor.id)) {
        const confidence: Confidence = explicit ? 'explicit' : 'inferred';
        raised.push({
          id: `${Date.now()}-${competitor.id}-meatball`,
          ts: new Date().toISOString(),
          type: 'meatball',
          competitor,
          myCar,
          sessionName: snapshot.sessionName,
          confidence,
          reason: explicit ? 'Race control event detected' : 'Penalty/flag state indicates meatball'
        });
      }
    }
  }
  return { raised, nextActive: next };
}

export function detectLongPitstops(
  snapshot: SessionSnapshot,
  aheadCars: CarState[],
  myCar: CarState,
  active: Set<string>,
  thresholdPct: number
): { raised: AlertRecord[]; nextActive: Set<string> } {
  const classCars = snapshot.cars.filter((c) => c.className === myCar.className && typeof c.pitStopDurationSec === 'number');
  const avg = classCars.length ? classCars.reduce((a, b) => a + (b.pitStopDurationSec ?? 0), 0) / classCars.length : undefined;
  const threshold = avg ? avg * (1 + thresholdPct / 100) : undefined;

  const raised: AlertRecord[] = [];
  const next = new Set<string>();
  if (!threshold) return { raised, nextActive: next };

  for (const competitor of aheadCars) {
    const dur = competitor.pitStopDurationSec;
    if (!dur) continue;
    if (dur > threshold) {
      next.add(competitor.id);
      if (!active.has(competitor.id)) {
        raised.push({
          id: `${Date.now()}-${competitor.id}-longpit`,
          ts: new Date().toISOString(),
          type: 'long_pit',
          competitor,
          myCar,
          sessionName: snapshot.sessionName,
          confidence: 'inferred',
          reason: `Pit stop ${dur.toFixed(1)}s exceeded class average ${(avg ?? 0).toFixed(1)}s by >${thresholdPct}%`
        });
      }
    }
  }
  return { raised, nextActive: next };
}
