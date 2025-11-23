import { ThemeProvider } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { CalculatorCard } from './CalculatorCard';
import styles from './App.module.css';

function App() {
  return (
    <ThemeProvider>
      <div className={styles.app}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.logo}>⚡ DTC</h1>
            <ThemeToggle />
          </div>
        </header>

        <main className={styles.main}>
          <CalculatorCard />
        </main>

        <footer className={styles.footer}>
          <p>Built with React & Neo-Brutalism</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
