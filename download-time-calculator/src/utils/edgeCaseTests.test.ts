import { describe, it, expect } from 'vitest';
import {
  calculateDownloadTime,
  formatSecondsToTime,
  convertFileSizeToBits,
  convertSpeedToBps,
} from './conversions';

describe('Edge Case Testing - Requirements 3.4, 4.2, 4.3', () => {
  describe('Very large file sizes (TB range)', () => {
    it('should handle 1 TB file with 100 Mbps speed', () => {
      const timeInSeconds = calculateDownloadTime(1, 'TB', 100, 'Mbps');
      expect(isFinite(timeInSeconds)).toBe(true);
      expect(timeInSeconds).toBeGreaterThan(0);
      
      const formatted = formatSecondsToTime(timeInSeconds);
      expect(formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      
      // 1 TB = 8,796,093,952,000 bits
      // 100 Mbps = 100,000,000 bps
      // Time = 87,960.94 seconds ≈ 24.43 hours
      expect(timeInSeconds).toBeCloseTo(87960.94, 1);
    });

    it('should handle 10 TB file with 1 Gbps speed', () => {
      const timeInSeconds = calculateDownloadTime(10, 'TB', 1, 'Gbps');
      expect(isFinite(timeInSeconds)).toBe(true);
      expect(timeInSeconds).toBeGreaterThan(0);
      
      const formatted = formatSecondsToTime(timeInSeconds);
      expect(formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      
      // 10 TB with 1 Gbps = 87,960.94 seconds ≈ 24.43 hours
      expect(timeInSeconds).toBeCloseTo(87960.94, 1);
    });

    it('should handle 100 TB file', () => {
      const timeInSeconds = calculateDownloadTime(100, 'TB', 1, 'Gbps');
      expect(isFinite(timeInSeconds)).toBe(true);
      expect(timeInSeconds).toBeGreaterThan(0);
      
      const formatted = formatSecondsToTime(timeInSeconds);
      expect(formatted).toMatch(/^\d{2,}:\d{2}:\d{2}$/); // Allow 2+ digits for hours
    });
  });

  describe('Very slow speeds (Kbps range)', () => {
    it('should handle 1 MB file with 56 Kbps (dial-up speed)', () => {
      const timeInSeconds = calculateDownloadTime(1, 'MB', 56, 'Kbps');
      expect(isFinite(timeInSeconds)).toBe(true);
      expect(timeInSeconds).toBeGreaterThan(0);
      
      const formatted = formatSecondsToTime(timeInSeconds);
      expect(formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      
      // 1 MB = 8,388,608 bits
      // 56 Kbps = 56,000 bps
      // Time ≈ 149.8 seconds ≈ 2.5 minutes
      expect(timeInSeconds).toBeCloseTo(149.8, 0);
    });

    it('should handle 100 MB file with 128 Kbps', () => {
      const timeInSeconds = calculateDownloadTime(100, 'MB', 128, 'Kbps');
      expect(isFinite(timeInSeconds)).toBe(true);
      expect(timeInSeconds).toBeGreaterThan(0);
      
      const formatted = formatSecondsToTime(timeInSeconds);
      expect(formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      
      // Should be around 1.8 hours
      expect(timeInSeconds).toBeGreaterThan(6000);
    });

    it('should handle 1 GB file with 1 Kbps (extremely slow)', () => {
      const timeInSeconds = calculateDownloadTime(1, 'GB', 1, 'Kbps');
      expect(isFinite(timeInSeconds)).toBe(true);
      expect(timeInSeconds).toBeGreaterThan(0);
      
      const formatted = formatSecondsToTime(timeInSeconds);
      expect(formatted).toMatch(/^\d{2,}:\d{2}:\d{2}$/); // Allow 2+ digits for hours
      
      // This would take days
      expect(timeInSeconds).toBeGreaterThan(86400); // More than 24 hours
    });
  });

  describe('Very fast speeds (Gbps range)', () => {
    it('should handle 1 GB file with 10 Gbps', () => {
      const timeInSeconds = calculateDownloadTime(1, 'GB', 10, 'Gbps');
      expect(isFinite(timeInSeconds)).toBe(true);
      expect(timeInSeconds).toBeGreaterThan(0);
      
      const formatted = formatSecondsToTime(timeInSeconds);
      expect(formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      
      // 1 GB = 8,589,934,592 bits
      // 10 Gbps = 10,000,000,000 bps
      // Time ≈ 0.86 seconds
      expect(timeInSeconds).toBeLessThan(1);
    });

    it('should handle 10 TB file with 100 Gbps', () => {
      const timeInSeconds = calculateDownloadTime(10, 'TB', 100, 'Gbps');
      expect(isFinite(timeInSeconds)).toBe(true);
      expect(timeInSeconds).toBeGreaterThan(0);
      
      const formatted = formatSecondsToTime(timeInSeconds);
      expect(formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      
      // Should be under 15 minutes
      expect(timeInSeconds).toBeLessThan(900);
    });
  });

  describe('Download times exceeding 24 hours - Requirement 4.3', () => {
    it('should correctly format times over 24 hours', () => {
      // 100 hours = 360,000 seconds
      const formatted = formatSecondsToTime(360000);
      expect(formatted).toBe('100:00:00');
    });

    it('should handle 1 TB file with 10 Mbps (takes ~244 hours)', () => {
      const timeInSeconds = calculateDownloadTime(1, 'TB', 10, 'Mbps');
      expect(isFinite(timeInSeconds)).toBe(true);
      
      const formatted = formatSecondsToTime(timeInSeconds);
      expect(formatted).toMatch(/^\d{2,}:\d{2}:\d{2}$/);
      
      // Should be over 24 hours (86400 seconds)
      expect(timeInSeconds).toBeGreaterThan(86400);
      
      // Verify hours component is > 24
      const hours = Math.floor(timeInSeconds / 3600);
      expect(hours).toBeGreaterThan(24);
    });

    it('should handle 500 GB file with 1 Mbps (takes ~1165 hours)', () => {
      const timeInSeconds = calculateDownloadTime(500, 'GB', 1, 'Mbps');
      expect(isFinite(timeInSeconds)).toBe(true);
      
      const formatted = formatSecondsToTime(timeInSeconds);
      expect(formatted).toMatch(/^\d{2,}:\d{2}:\d{2}$/);
      
      // Should be way over 24 hours
      expect(timeInSeconds).toBeGreaterThan(86400 * 10);
    });

    it('should format 48 hours correctly', () => {
      const formatted = formatSecondsToTime(172800); // 48 hours
      expect(formatted).toBe('48:00:00');
    });

    it('should format 999 hours correctly', () => {
      const formatted = formatSecondsToTime(3596400); // 999 hours
      expect(formatted).toBe('999:00:00');
    });
  });

  describe('Download times under 1 second - Requirement 4.2', () => {
    it('should handle 1 KB file with 1 Gbps (very fast)', () => {
      const timeInSeconds = calculateDownloadTime(1, 'KB', 1, 'Gbps');
      expect(isFinite(timeInSeconds)).toBe(true);
      expect(timeInSeconds).toBeGreaterThan(0);
      expect(timeInSeconds).toBeLessThan(1);
      
      const formatted = formatSecondsToTime(timeInSeconds);
      expect(formatted).toBe('00:00:00');
    });

    it('should format 0.5 seconds as 00:00:00', () => {
      const formatted = formatSecondsToTime(0.5);
      expect(formatted).toBe('00:00:00');
    });

    it('should format 0.1 seconds as 00:00:00', () => {
      const formatted = formatSecondsToTime(0.1);
      expect(formatted).toBe('00:00:00');
    });

    it('should handle 100 KB file with 10 Gbps', () => {
      const timeInSeconds = calculateDownloadTime(100, 'KB', 10, 'Gbps');
      expect(isFinite(timeInSeconds)).toBe(true);
      expect(timeInSeconds).toBeLessThan(1);
      
      const formatted = formatSecondsToTime(timeInSeconds);
      expect(formatted).toBe('00:00:00');
    });
  });

  describe('Verify no NaN or Infinity displays - Requirement 3.4', () => {
    it('should not produce NaN for valid inputs', () => {
      const testCases = [
        { fileSize: 1, fileSizeUnit: 'MB' as const, speed: 1, speedUnit: 'Mbps' as const },
        { fileSize: 100, fileSizeUnit: 'GB' as const, speed: 10, speedUnit: 'Kbps' as const },
        { fileSize: 0.5, fileSizeUnit: 'KB' as const, speed: 1000, speedUnit: 'Gbps' as const },
        { fileSize: 1000, fileSizeUnit: 'TB' as const, speed: 1, speedUnit: 'Kbps' as const },
      ];

      testCases.forEach(({ fileSize, fileSizeUnit, speed, speedUnit }) => {
        const result = calculateDownloadTime(fileSize, fileSizeUnit, speed, speedUnit);
        expect(isNaN(result)).toBe(false);
        expect(isFinite(result)).toBe(true);
      });
    });

    it('should handle division by very small numbers without producing Infinity', () => {
      const timeInSeconds = calculateDownloadTime(1, 'MB', 0.001, 'Kbps');
      // This is a very slow speed, but should still produce a finite number
      expect(isFinite(timeInSeconds)).toBe(true);
      expect(timeInSeconds).toBeGreaterThan(0);
    });

    it('should handle very large results without producing Infinity', () => {
      const timeInSeconds = calculateDownloadTime(1000, 'TB', 1, 'Kbps');
      // This would take years, but should still be finite
      expect(isFinite(timeInSeconds)).toBe(true);
      expect(timeInSeconds).toBeGreaterThan(0);
    });

    it('formatSecondsToTime should handle Infinity gracefully', () => {
      const formatted = formatSecondsToTime(Infinity);
      expect(formatted).toBe('00:00:00');
    });

    it('formatSecondsToTime should handle NaN gracefully', () => {
      const formatted = formatSecondsToTime(NaN);
      expect(formatted).toBe('00:00:00');
    });

    it('formatSecondsToTime should handle negative values gracefully', () => {
      const formatted = formatSecondsToTime(-100);
      expect(formatted).toBe('00:00:00');
    });
  });

  describe('Extreme edge cases', () => {
    it('should handle maximum safe integer file size', () => {
      const timeInSeconds = calculateDownloadTime(
        Number.MAX_SAFE_INTEGER / (8 * 1024 * 1024 * 1024 * 1024),
        'TB',
        1,
        'Gbps'
      );
      expect(isFinite(timeInSeconds)).toBe(true);
    });

    it('should handle very precise decimal inputs', () => {
      const timeInSeconds = calculateDownloadTime(1.23456789, 'MB', 9.87654321, 'Mbps');
      expect(isFinite(timeInSeconds)).toBe(true);
      expect(timeInSeconds).toBeGreaterThan(0);
      
      const formatted = formatSecondsToTime(timeInSeconds);
      expect(formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    it('should handle minimum positive values', () => {
      const timeInSeconds = calculateDownloadTime(0.001, 'KB', 1000, 'Gbps');
      expect(isFinite(timeInSeconds)).toBe(true);
      expect(timeInSeconds).toBeGreaterThan(0);
    });
  });

  describe('Zero-padding verification - Requirement 4.4', () => {
    it('should pad single digit hours', () => {
      const formatted = formatSecondsToTime(3661); // 1:01:01
      expect(formatted).toBe('01:01:01');
    });

    it('should pad single digit minutes', () => {
      const formatted = formatSecondsToTime(305); // 0:05:05
      expect(formatted).toBe('00:05:05');
    });

    it('should pad single digit seconds', () => {
      const formatted = formatSecondsToTime(5); // 0:00:05
      expect(formatted).toBe('00:00:05');
    });

    it('should handle all single digits', () => {
      const formatted = formatSecondsToTime(3665); // 1:01:05
      expect(formatted).toBe('01:01:05');
    });
  });
});
