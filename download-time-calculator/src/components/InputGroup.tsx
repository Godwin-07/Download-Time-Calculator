import styles from './InputGroup.module.css';

interface InputGroupProps {
  label: string;
  value: string;
  unit: string;
  units: string[];
  onValueChange: (value: string) => void;
  onUnitChange: (unit: string) => void;
  error?: string;
  id: string;
}

export function InputGroup({
  label,
  value,
  unit,
  units,
  onValueChange,
  onUnitChange,
  error,
  id,
}: InputGroupProps) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id} className="brutalist-label">
        {label}
      </label>
      <div className={styles.inputRow}>
        <input
          type="text"
          id={id}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={`brutalist-input ${error ? 'error' : ''} ${styles.numberInput}`}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder="Enter value"
        />
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          className={`brutalist-select ${styles.unitSelect}`}
          aria-label={`${label} unit`}
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <div
          id={`${id}-error`}
          className="error-message"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
}
