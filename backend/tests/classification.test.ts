import { describe, expect, it } from 'vitest';
import { identifyMyCar, sameClassAhead } from '../src/core/classification/identify.js';

const cars = [
  { id: 'a', driverName: 'A', carNumber: '1', className: 'GT3', position: 1, flags: { meatball: false } },
  { id: 'b', driverName: 'Me', carNumber: '45', className: 'GT3', position: 3, flags: { meatball: false } },
  { id: 'c', driverName: 'C', carNumber: '22', className: 'GT3', position: 2, flags: { meatball: false } },
  { id: 'd', driverName: 'D', carNumber: '3', className: 'LMP2', position: 1, flags: { meatball: false } }
];

describe('classification', () => {
  it('identifies my car by car number', () => {
    const my = identifyMyCar(cars, { carNumber: '45' }, {});
    expect(my?.id).toBe('b');
  });

  it('filters same class ahead', () => {
    const ahead = sameClassAhead(cars, cars[1]);
    expect(ahead.map((x) => x.id)).toEqual(['a', 'c']);
  });
});
