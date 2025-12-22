/**
 * Tests for date formatting utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDate, formatDateISO, formatDateRFC822, getToday } from '../lib/dates';

describe('dates', () => {
  describe('formatDate', () => {
    it('formats date with 1st suffix', () => {
      expect(formatDate('2023-01-01')).toBe('1st January 2023');
      expect(formatDate('2023-02-21')).toBe('21st February 2023');
      expect(formatDate('2023-03-31')).toBe('31st March 2023');
    });

    it('formats date with 2nd suffix', () => {
      expect(formatDate('2023-01-02')).toBe('2nd January 2023');
      expect(formatDate('2023-04-22')).toBe('22nd April 2023');
    });

    it('formats date with 3rd suffix', () => {
      expect(formatDate('2023-01-03')).toBe('3rd January 2023');
      expect(formatDate('2023-05-23')).toBe('23rd May 2023');
    });

    it('formats date with th suffix for 4-20', () => {
      expect(formatDate('2023-01-04')).toBe('4th January 2023');
      expect(formatDate('2023-06-11')).toBe('11th June 2023');
      expect(formatDate('2023-07-12')).toBe('12th July 2023');
      expect(formatDate('2023-08-13')).toBe('13th August 2023');
      expect(formatDate('2023-09-14')).toBe('14th September 2023');
      expect(formatDate('2023-10-15')).toBe('15th October 2023');
      expect(formatDate('2023-11-16')).toBe('16th November 2023');
      expect(formatDate('2023-12-20')).toBe('20th December 2023');
    });

    it('formats date with th suffix for 24-30', () => {
      expect(formatDate('2023-01-24')).toBe('24th January 2023');
      expect(formatDate('2023-01-25')).toBe('25th January 2023');
      expect(formatDate('2023-01-30')).toBe('30th January 2023');
    });

    it('handles all months correctly', () => {
      expect(formatDate('2023-01-15')).toContain('January');
      expect(formatDate('2023-02-15')).toContain('February');
      expect(formatDate('2023-03-15')).toContain('March');
      expect(formatDate('2023-04-15')).toContain('April');
      expect(formatDate('2023-05-15')).toContain('May');
      expect(formatDate('2023-06-15')).toContain('June');
      expect(formatDate('2023-07-15')).toContain('July');
      expect(formatDate('2023-08-15')).toContain('August');
      expect(formatDate('2023-09-15')).toContain('September');
      expect(formatDate('2023-10-15')).toContain('October');
      expect(formatDate('2023-11-15')).toContain('November');
      expect(formatDate('2023-12-15')).toContain('December');
    });
  });

  describe('formatDateISO', () => {
    it('formats date as ISO 8601 with timezone', () => {
      const result = formatDateISO('2023-01-15');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00$/);
    });

    it('includes correct date components', () => {
      const result = formatDateISO('2023-06-20');
      expect(result).toContain('2023-06-20');
    });
  });

  describe('formatDateRFC822', () => {
    it('formats date as RFC 822', () => {
      const result = formatDateRFC822('2023-01-15');
      expect(result).toMatch(/\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT/);
    });

    it('includes correct date', () => {
      const result = formatDateRFC822('2023-06-20');
      expect(result).toContain('2023');
      expect(result).toContain('Jun');
    });
  });

  describe('getToday', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns today date in YYYY-MM-DD format', () => {
      vi.setSystemTime(new Date('2023-06-15T12:00:00Z'));
      expect(getToday()).toBe('2023-06-15');
    });

    it('returns correct format for single digit months and days', () => {
      vi.setSystemTime(new Date('2023-01-05T12:00:00Z'));
      expect(getToday()).toBe('2023-01-05');
    });
  });
});
