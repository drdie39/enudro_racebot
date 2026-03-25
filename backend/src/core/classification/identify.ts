import type { CarState, IdentityConfig } from '../state/types.js';

export function identifyMyCar(cars: CarState[], identity: IdentityConfig, ambiguousMap: Record<string, string>): CarState | undefined {
  if (identity.preferredCarId) {
    const byId = cars.find((c) => c.id === identity.preferredCarId);
    if (byId) return byId;
  }

  const candidates = cars.filter((c) => {
    const numberMatch = identity.carNumber && c.carNumber === identity.carNumber;
    const nameMatch = identity.driverName && c.driverName.toLowerCase() === identity.driverName.toLowerCase();
    return Boolean(numberMatch || nameMatch);
  });

  if (candidates.length <= 1) return candidates[0];

  for (const c of candidates) {
    if (ambiguousMap[c.driverName] === c.id || ambiguousMap[c.carNumber] === c.id) {
      return c;
    }
  }

  return candidates[0];
}

export function sameClassAhead(cars: CarState[], myCar: CarState): CarState[] {
  if (!myCar.position) return [];
  return cars
    .filter((c) => c.id !== myCar.id && c.className === myCar.className && typeof c.position === 'number' && (c.position as number) < myCar.position!)
    .sort((a, b) => (a.position ?? 999) - (b.position ?? 999));
}
