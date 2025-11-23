export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates numeric input for file size or download speed
 * @param value - The input value as a string
 * @returns ValidationResult with isValid flag and optional error message
 */
export function validateNumericInput(value: string): ValidationResult {
  // Check if empty
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: 'Please enter a value',
    };
  }

  // Check if numeric
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return {
      isValid: false,
      error: 'Please enter a valid number',
    };
  }

  // Check if positive (greater than zero)
  if (numValue <= 0) {
    return {
      isValid: false,
      error: 'Value must be greater than zero',
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Validates all calculator inputs
 * @param fileSize - The file size input value
 * @param downloadSpeed - The download speed input value
 * @returns Object with validation results for each field
 */
export function validateCalculatorInputs(
  fileSize: string,
  downloadSpeed: string
): {
  fileSize: ValidationResult;
  downloadSpeed: ValidationResult;
  allValid: boolean;
} {
  const fileSizeValidation = validateNumericInput(fileSize);
  const downloadSpeedValidation = validateNumericInput(downloadSpeed);

  return {
    fileSize: fileSizeValidation,
    downloadSpeed: downloadSpeedValidation,
    allValid: fileSizeValidation.isValid && downloadSpeedValidation.isValid,
  };
}
