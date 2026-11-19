import { describe, it, expect } from 'vitest';
import {
  APPLICATION_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
} from '@/lib/types/application';

describe('Application types', () => {
  it('has 5 statuses', () => {
    expect(APPLICATION_STATUSES).toHaveLength(5);
  });

  it('every status has a label', () => {
    for (const status of APPLICATION_STATUSES) {
      expect(STATUS_LABELS[status]).toBeTruthy();
    }
  });

  it('every status has a color class', () => {
    for (const status of APPLICATION_STATUSES) {
      expect(STATUS_COLORS[status]).toContain('bg-');
    }
  });

  it('statuses are in the expected order', () => {
    expect(APPLICATION_STATUSES).toEqual([
      'saved',
      'applied',
      'interview',
      'offer',
      'rejected',
    ]);
  });
});
