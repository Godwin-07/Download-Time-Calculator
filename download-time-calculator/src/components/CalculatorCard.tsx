import { useState, useEffect } from 'react';
import { InputGroup } from './InputGroup';
import { ResultDisplay } from './ResultDisplay';
import {
  calculateDownloadTime,
  formatSecondsToTime,
  FileSizeUnit,
  SpeedUnit,
} from '../utils/conversions';
import { validateCalculatorInputs } from '../utils/validation';
import styles from './CalculatorCard.module.css';

const FILE_SIZE_UNITS: FileSizeUnit[] = ['KB', 'MB', 'GB', 'TB'];
const SPEED_UNITS: SpeedUnit[] = ['Kbps', 'Mbps', 'Gbps'];

export function CalculatorCard() {
  // State for inputs
  const [fileSize, setFileSize] = useState('');
  const [fileSizeUnit, setFileSizeUnit] = useState<FileSizeUnit>('MB');
  const [downloadSpeed, setDownloadSpeed] = useState('');
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('Mbps');

  // State for validation errors
  const [fileSizeError, setFileSizeError] = useState<string | undefined>();
  const [speedError, setSpeedError] = useState<string | undefined>();

  // State for result
  const [result, setResult] = useState('');
  const [resultError, setResultError] = useState<string | undefined>();

  // Real-time calculation effect
  useEffect(() => {
    // Validate inputs
    const validation = validateCalculatorInputs(fileSize, downloadSpeed);

    // Update error states
    setFileSizeError(validation.fileSize.error);
    setSpeedError(validation.downloadSpeed.error);

    // If all inputs are valid, calculate
    if (validation.allValid) {
      try {
        const timeInSeconds = calculateDownloadTime(
          parseFloat(fileSize),
          fileSizeUnit,
          parseFloat(downloadSpeed),
          speedUnit
        );

        // Check for invalid results
        if (!isFinite(timeInSeconds)) {
          setResultError('Unable to calculate. Please check your inputs');
          setResult('');
        } else if (timeInSeconds === 0) {
          setResultError('Download speed cannot be zero');
          setResult('');
        } else {
          const formatted = formatSecondsToTime(timeInSeconds);
          setResult(formatted);
          setResultError(undefined);
        }
      } catch (error) {
        setResultError('An error occurred during calculation');
        setResult('');
      }
    } else {
      // Clear result if inputs are invalid
      if (fileSize || downloadSpeed) {
        setResult('');
        setResultError(undefined);
      }
    }
  }, [fileSize, fileSizeUnit, downloadSpeed, speedUnit]);

  // Reset function
  const handleReset = () => {
    setFileSize('');
    setFileSizeUnit('MB');
    setDownloadSpeed('');
    setSpeedUnit('Mbps');
    setFileSizeError(undefined);
    setSpeedError(undefined);
    setResult('');
    setResultError(undefined);
  };

  return (
    <div className={`brutalist-card ${styles.calculatorCard}`}>
      <h1 className={styles.title}>Download Time Calculator</h1>

      <InputGroup
        label="File Size"
        value={fileSize}
        unit={fileSizeUnit}
        units={FILE_SIZE_UNITS}
        onValueChange={setFileSize}
        onUnitChange={(unit) => setFileSizeUnit(unit as FileSizeUnit)}
        error={fileSizeError}
        id="file-size"
      />

      <InputGroup
        label="Download Speed"
        value={downloadSpeed}
        unit={speedUnit}
        units={SPEED_UNITS}
        onValueChange={setDownloadSpeed}
        onUnitChange={(unit) => setSpeedUnit(unit as SpeedUnit)}
        error={speedError}
        id="download-speed"
      />

      <ResultDisplay timeString={result} error={resultError} />

      <button
        onClick={handleReset}
        className={`brutalist-button ${styles.resetButton}`}
        aria-label="Reset calculator"
      >
        Reset
      </button>
    </div>
  );
}
