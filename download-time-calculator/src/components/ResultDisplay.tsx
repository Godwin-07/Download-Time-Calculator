import styles from './ResultDisplay.module.css';

interface ResultDisplayProps {
  timeString: string;
  error?: string;
}

export function ResultDisplay({ timeString, error }: ResultDisplayProps) {
  return (
    <div className={`brutalist-card ${styles.resultCard}`}>
      <h2 className={styles.resultLabel}>Estimated Download Time</h2>
      <div
        className={styles.resultValue}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {error ? (
          <span className={styles.errorText}>{error}</span>
        ) : (
          <span className={styles.timeText}>{timeString || '--:--:--'}</span>
        )}
      </div>
    </div>
  );
}
