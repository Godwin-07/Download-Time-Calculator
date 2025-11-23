// Conversion constants for file sizes to bits
export const FILE_SIZE_TO_BITS = {
  KB: 8 * 1024,
  MB: 8 * 1024 * 1024,
  GB: 8 * 1024 * 1024 * 1024,
  TB: 8 * 1024 * 1024 * 1024 * 1024,
} as const;

// Conversion constants for speeds to bits per second
export const SPEED_TO_BPS = {
  Kbps: 1000,
  Mbps: 1000 * 1000,
  Gbps: 1000 * 1000 * 1000,
} as const;

export type FileSizeUnit = keyof typeof FILE_SIZE_TO_BITS;
export type SpeedUnit = keyof typeof SPEED_TO_BPS;

/**
 * Converts file size to bits
 * @param size - The file size value
 * @param unit - The unit of the file size (KB, MB, GB, TB)
 * @returns The file size in bits
 */
export function convertFileSizeToBits(size: number, unit: FileSizeUnit): number {
  return size * FILE_SIZE_TO_BITS[unit];
}

/**
 * Converts download speed to bits per second
 * @param speed - The download speed value
 * @param unit - The unit of the speed (Kbps, Mbps, Gbps)
 * @returns The speed in bits per second
 */
export function convertSpeedToBps(speed: number, unit: SpeedUnit): number {
  return speed * SPEED_TO_BPS[unit];
}

/**
 * Formats seconds to HH:MM:SS format with zero-padding
 * @param seconds - The time in seconds
 * @returns Formatted time string in HH:MM:SS format
 */
export function formatSecondsToTime(seconds: number): string {
  // Handle edge cases
  if (!isFinite(seconds) || seconds < 0) {
    return '00:00:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  // Zero-pad each component
  const pad = (num: number): string => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

/**
 * Calculates download time in seconds
 * @param fileSize - The file size value
 * @param fileSizeUnit - The unit of the file size
 * @param downloadSpeed - The download speed value
 * @param speedUnit - The unit of the speed
 * @returns The download time in seconds
 */
export function calculateDownloadTime(
  fileSize: number,
  fileSizeUnit: FileSizeUnit,
  downloadSpeed: number,
  speedUnit: SpeedUnit
): number {
  const fileSizeInBits = convertFileSizeToBits(fileSize, fileSizeUnit);
  const speedInBps = convertSpeedToBps(downloadSpeed, speedUnit);
  
  return fileSizeInBits / speedInBps;
}
