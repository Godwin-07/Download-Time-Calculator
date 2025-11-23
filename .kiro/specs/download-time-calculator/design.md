# Design Document

## Overview

The Download Time Calculator is a single-page React application that performs real-time calculations of download times based on user-provided file sizes and internet speeds. The application emphasizes immediate feedback, accessibility, and a distinctive neo-brutalist visual design with theme switching capabilities.

The core calculation is straightforward: convert file size to bits, convert speed to bits per second, divide to get time in seconds, then format for human readability. The application runs entirely client-side with no backend dependencies.

## Architecture

### Component Hierarchy

```
App
├── ThemeProvider (Context)
├── Header
│   └── ThemeToggle
├── CalculatorCard
│   ├── InputGroup (File Size)
│   │   ├── NumberInput
│   │   └── UnitSelector
│   ├── InputGroup (Download Speed)
│   │   ├── NumberInput
│   │   └── UnitSelector
│   ├── ResultDisplay
│   └── ResetButton
└── Footer
```

### Technology Stack

- **Framework**: React 18+ with functional components and hooks
- **Styling**: CSS Modules for component-scoped styles
- **Build Tool**: Vite (for fast development and optimized builds)
- **Development Server**: Port 8000
- **State Management**: React hooks (useState, useEffect, useContext)
- **Property-Based Testing**: fast-check library for JavaScript/TypeScript

## Components and Interfaces

### App Component
The root component that provides theme context and orchestrates the layout.

```typescript
interface AppProps {}

function App(): JSX.Element
```

### ThemeProvider
Context provider for managing light/dark theme state across the application.

```typescript
interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element
function useTheme(): ThemeContextValue
```

### CalculatorCard
Main calculator component managing input state and calculation logic.

```typescript
interface CalculatorState {
  fileSize: string;
  fileSizeUnit: 'KB' | 'MB' | 'GB' | 'TB';
  downloadSpeed: string;
  speedUnit: 'Kbps' | 'Mbps' | 'Gbps';
}

interface CalculatorCardProps {}

function CalculatorCard(): JSX.Element
```

### InputGroup
Reusable component for labeled input with unit selector.

```typescript
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

function InputGroup(props: InputGroupProps): JSX.Element
```

### ResultDisplay
Component displaying the calculated download time or error messages.

```typescript
interface ResultDisplayProps {
  timeString: string;
  error?: string;
}

function ResultDisplay(props: ResultDisplayProps): JSX.Element
```

## Data Models

### Input Validation

```typescript
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

function validateNumericInput(value: string): ValidationResult
```

### Calculation Result

```typescript
interface CalculationResult {
  success: boolean;
  timeInSeconds?: number;
  formattedTime?: string;
  error?: string;
}
```

### Unit Conversion Constants

```typescript
const FILE_SIZE_TO_BITS = {
  KB: 8 * 1024,
  MB: 8 * 1024 * 1024,
  GB: 8 * 1024 * 1024 * 1024,
  TB: 8 * 1024 * 1024 * 1024 * 1024,
} as const;

const SPEED_TO_BPS = {
  Kbps: 1000,
  Mbps: 1000 * 1000,
  Gbps: 1000 * 1000 * 1000,
} as const;
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Input validation accepts valid numbers and rejects invalid inputs
*For any* input field (file size or download speed), when a user enters a positive numeric value, the application should accept it; when a user enters a non-numeric, negative, or zero value, the application should reject it and display a validation message.
**Validates: Requirements 1.1, 1.3, 1.4, 2.1, 2.3, 2.4**

### Property 2: Unit conversion correctness
*For any* valid file size and download speed with their respective units, the calculated download time should equal (file size converted to bits) divided by (speed converted to bits per second), regardless of which units were selected.
**Validates: Requirements 1.2, 2.2**

### Property 3: Time formatting consistency
*For any* time value in seconds, the formatted output should follow HH:MM:SS format with zero-padded components, correctly handle values under 60 seconds (00:00:SS), and correctly display hours exceeding 24.
**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 4: Real-time calculation reactivity
*For any* change to input fields, when all inputs are valid, the application should immediately recalculate and display the updated download time without requiring a button click.
**Validates: Requirements 3.1, 3.2**

### Property 5: Error handling prevents invalid displays
*For any* calculation that would produce NaN, Infinity, or undefined results, the application should display an appropriate error message instead of the invalid value.
**Validates: Requirements 3.4**

### Property 6: Reset restores initial state
*For any* application state with user inputs, clicking reset should clear all input fields, clear the result display, reset unit selectors to defaults, while preserving the current theme selection.
**Validates: Requirements 5.1, 5.2, 5.3, 5.4**

### Property 7: Theme toggle switches appearance
*For any* current theme state, clicking the theme toggle should switch to the opposite theme, update all CSS variables, and maintain the selection during the session.
**Validates: Requirements 7.1, 7.2, 7.4**

### Property 8: Responsive layout maintains functionality
*For any* viewport size change across mobile, tablet, and desktop breakpoints, all calculator functionality should remain operational and inputs should remain accessible.
**Validates: Requirements 6.4**

### Property 9: Accessibility attributes are present
*For any* interactive element (inputs, buttons, selectors), the element should have appropriate ARIA labels, keyboard focus indicators, and error announcements for assistive technologies.
**Validates: Requirements 9.1, 9.2, 9.3, 9.4**

### Property 10: Floating-point precision is maintained
*For any* calculation involving file sizes and speeds, the result should maintain precision within acceptable bounds (±1 second for times under 1 hour, ±0.1% for longer times) to minimize floating-point errors.
**Validates: Requirements 10.4**

## Error Handling

### Input Validation Errors
- Empty inputs: Display "Please enter a value"
- Non-numeric inputs: Display "Please enter a valid number"
- Negative or zero values: Display "Value must be greater than zero"

### Calculation Errors
- Division by zero: Display "Download speed cannot be zero"
- NaN results: Display "Unable to calculate. Please check your inputs"
- Infinity results: Display "File size too large for calculation"

### Error Display Strategy
- Errors appear inline below the relevant input field
- Errors are announced to screen readers via aria-live regions
- Errors prevent calculation but don't clear valid inputs
- Errors clear automatically when the input becomes valid

## Testing Strategy

### Unit Testing
The application will use Vitest as the testing framework for unit tests. Unit tests will cover:

- **Conversion utilities**: Test specific examples of file size to bits, speed to bps, and seconds to HH:MM:SS conversions
- **Validation functions**: Test edge cases like empty strings, special characters, boundary values
- **Component rendering**: Test that components render with correct props and structure
- **Error states**: Test that appropriate error messages appear for specific invalid inputs

### Property-Based Testing
The application will use fast-check library for property-based testing. Property tests will verify:

- **Property 1**: Generate random valid and invalid inputs to verify validation logic
- **Property 2**: Generate random file sizes and speeds with random units to verify conversion accuracy
- **Property 3**: Generate random time values to verify formatting consistency
- **Property 4**: Simulate input changes to verify real-time calculation
- **Property 5**: Generate edge case inputs that could produce NaN/Infinity
- **Property 6**: Test reset functionality with random initial states
- **Property 7**: Test theme toggling from random initial themes
- **Property 8**: Test functionality across different viewport sizes
- **Property 9**: Verify accessibility attributes exist on all interactive elements
- **Property 10**: Test calculations with values prone to floating-point errors

Each property-based test will run a minimum of 100 iterations to ensure comprehensive coverage across the input space.

### Test Configuration
- Each property-based test will include a comment tag: `**Feature: download-time-calculator, Property {number}: {property_text}**`
- Tests will be co-located with source files using `.test.ts` or `.test.tsx` extensions
- Test coverage should focus on utility functions and calculation logic
- UI component tests will verify rendering and user interactions

## Implementation Details

### Calculation Formula

```typescript
// Convert file size to bits
const fileSizeInBits = fileSize * FILE_SIZE_TO_BITS[fileSizeUnit];

// Convert speed to bits per second
const speedInBps = downloadSpeed * SPEED_TO_BPS[speedUnit];

// Calculate time in seconds
const timeInSeconds = fileSizeInBits / speedInBps;

// Format to HH:MM:SS
const hours = Math.floor(timeInSeconds / 3600);
const minutes = Math.floor((timeInSeconds % 3600) / 60);
const seconds = Math.floor(timeInSeconds % 60);
const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
```

### CSS Architecture

#### CSS Variables for Theming
```css
:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #000000;
  --text-secondary: #666666;
  --border-color: #000000;
  --shadow-color: #000000;
  --accent-color: #ff6b6b;
}

:root[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --border-color: #ffffff;
  --shadow-color: #ffffff;
  --accent-color: #ff6b6b;
}
```

#### Neo-Brutalism Styles
- Bold borders: 3-4px solid black/white
- Stark shadows: 6-8px offset, no blur
- High contrast color combinations
- Geometric, boxy shapes
- No rounded corners or gradients

#### Responsive Breakpoints
```css
/* Mobile: < 640px */
@media (max-width: 639px) {
  /* Stack inputs vertically, full width */
}

/* Tablet: 640px - 1024px */
@media (min-width: 640px) and (max-width: 1024px) {
  /* Two-column layout for inputs */
}

/* Desktop: > 1024px */
@media (min-width: 1025px) {
  /* Centered card with max-width, side-by-side inputs */
}
```

### State Management

The application uses React hooks for state management:

- `useState` for component-level state (inputs, results, errors)
- `useEffect` for reactive calculations when inputs change
- `useContext` for theme state shared across components
- No external state management library needed due to simple state requirements

### File Structure

```
download-time-calculator/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── App.tsx
│   │   ├── App.module.css
│   │   ├── CalculatorCard.tsx
│   │   ├── CalculatorCard.module.css
│   │   ├── InputGroup.tsx
│   │   ├── InputGroup.module.css
│   │   ├── ResultDisplay.tsx
│   │   ├── ResultDisplay.module.css
│   │   ├── ThemeToggle.tsx
│   │   └── ThemeToggle.module.css
│   ├── utils/
│   │   ├── conversions.ts
│   │   ├── conversions.test.ts
│   │   ├── validation.ts
│   │   ├── validation.test.ts
│   │   ├── formatting.ts
│   │   └── formatting.test.ts
│   ├── context/
│   │   └── ThemeContext.tsx
│   ├── styles/
│   │   └── global.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Performance Considerations

- Calculations are lightweight and perform in < 1ms
- No debouncing needed for real-time calculation due to simple math
- CSS Modules ensure no style conflicts and optimal loading
- Vite provides optimized production builds with code splitting
- No external dependencies beyond React and testing libraries

## Browser Compatibility

- Target: Modern browsers (Chrome, Firefox, Safari, Edge) with ES6+ support
- CSS Grid and Flexbox for layouts
- CSS Custom Properties for theming
- No polyfills needed for target audience

## Accessibility Features

- Semantic HTML elements (form, label, button)
- ARIA labels for all inputs and controls
- ARIA live regions for dynamic result updates
- Keyboard navigation support (Tab, Enter, Space)
- Focus visible indicators with high contrast
- Color contrast ratios meeting WCAG AA standards
- Screen reader announcements for errors and results
