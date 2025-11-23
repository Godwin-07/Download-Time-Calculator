# Implementation Plan

- [x] 1. Initialize React project with Vite and configure development environment


  - Create new Vite + React + TypeScript project
  - Configure Vite to run on port 8000
  - Set up CSS Modules support
  - Install fast-check for property-based testing
  - Install Vitest for unit testing
  - Create basic project structure (components, utils, context, styles folders)
  - _Requirements: All_

- [ ] 2. Implement utility functions for conversions and validation
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 10.4_

- [x] 2.1 Create conversion utility functions


  - Implement `convertFileSizeToBits(size: number, unit: FileSizeUnit): number`
  - Implement `convertSpeedToBps(speed: number, unit: SpeedUnit): number`
  - Implement `formatSecondsToTime(seconds: number): string` with HH:MM:SS format and zero-padding
  - Add constants for FILE_SIZE_TO_BITS and SPEED_TO_BPS
  - _Requirements: 1.2, 2.2, 4.1, 4.2, 4.3, 4.4_

- [ ]* 2.2 Write property test for unit conversion correctness
  - **Property 2: Unit conversion correctness**
  - **Validates: Requirements 1.2, 2.2**

- [x] 2.3 Create validation utility functions


  - Implement `validateNumericInput(value: string): ValidationResult`
  - Check for non-numeric, negative, zero, and empty values
  - Return validation result with error messages
  - _Requirements: 1.3, 1.4, 2.3, 2.4_

- [ ]* 2.4 Write property test for input validation
  - **Property 1: Input validation accepts valid numbers and rejects invalid inputs**
  - **Validates: Requirements 1.1, 1.3, 1.4, 2.1, 2.3, 2.4**

- [ ]* 2.5 Write property test for time formatting
  - **Property 3: Time formatting consistency**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

- [ ]* 2.6 Write property test for floating-point precision
  - **Property 10: Floating-point precision is maintained**
  - **Validates: Requirements 10.4**

- [ ] 3. Create theme context and provider
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 3.1 Implement ThemeContext with light/dark theme state


  - Create ThemeContext with theme state and toggleTheme function
  - Implement ThemeProvider component that manages theme state
  - Create useTheme custom hook for consuming theme context
  - Set light theme as default
  - Apply theme to document root via data-theme attribute
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ]* 3.2 Write property test for theme toggling
  - **Property 7: Theme toggle switches appearance**
  - **Validates: Requirements 7.1, 7.2, 7.4**

- [ ] 4. Set up global styles and CSS variables
  - _Requirements: 7.2, 8.1, 8.2, 8.3, 8.4_

- [x] 4.1 Create global CSS with theme variables


  - Define CSS custom properties for light and dark themes
  - Include colors for backgrounds, text, borders, shadows, accents
  - Set up base styles and CSS reset
  - _Requirements: 7.2_

- [x] 4.2 Create neo-brutalism design system styles


  - Define bold border styles (3-4px solid)
  - Define stark shadow styles (6-8px offset, no blur)
  - Create utility classes for brutalist buttons, cards, inputs
  - Ensure high contrast and geometric shapes
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 5. Build reusable UI components
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 4.1, 5.1, 7.1, 9.1, 9.2_

- [x] 5.1 Create InputGroup component


  - Build component with label, number input, unit selector dropdown
  - Accept props: label, value, unit, units array, onChange handlers, error, id
  - Apply CSS Modules styling with neo-brutalism
  - Add ARIA labels and accessibility attributes
  - Display inline error messages when present
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 9.1, 9.2_

- [x] 5.2 Create ResultDisplay component


  - Build component to display calculated time or error messages
  - Accept props: timeString, error
  - Style as prominent card with neo-brutalism
  - Add ARIA live region for screen reader announcements
  - _Requirements: 4.1, 9.4_

- [x] 5.3 Create ThemeToggle component


  - Build toggle button for switching themes
  - Use theme context to get current theme and toggle function
  - Style with neo-brutalism (bold border, stark shadow)
  - Add ARIA label for accessibility
  - Show icon or text indicating current theme
  - _Requirements: 7.1, 9.1, 9.2_

- [ ] 6. Implement main CalculatorCard component
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 5.1, 5.2, 5.3, 5.4_

- [x] 6.1 Set up component state and structure


  - Create state for fileSize, fileSizeUnit, downloadSpeed, speedUnit
  - Create state for validation errors
  - Create state for calculated result
  - Set default units (MB for file size, Mbps for speed)
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [x] 6.2 Implement real-time calculation logic

  - Create useEffect hook that runs when any input changes
  - Validate all inputs before calculating
  - Calculate download time using conversion utilities
  - Handle NaN and Infinity cases with error messages
  - Format result using formatSecondsToTime utility
  - Update result state
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]* 6.3 Write property test for real-time calculation
  - **Property 4: Real-time calculation reactivity**
  - **Validates: Requirements 3.1, 3.2**

- [ ]* 6.4 Write property test for error handling
  - **Property 5: Error handling prevents invalid displays**
  - **Validates: Requirements 3.4**

- [x] 6.3 Implement reset functionality

  - Create handleReset function that clears all inputs
  - Reset file size and speed to empty strings
  - Reset units to defaults (MB, Mbps)
  - Clear result and error states
  - Do not reset theme
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ]* 6.5 Write property test for reset functionality
  - **Property 6: Reset restores initial state**
  - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

- [x] 6.4 Render CalculatorCard with all child components

  - Render two InputGroup components (file size and download speed)
  - Render ResultDisplay component with calculated time or errors
  - Render Reset button with neo-brutalism styling
  - Apply card styling with CSS Modules
  - Ensure proper spacing and layout
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 4.1, 5.1_

- [ ] 7. Create App component and layout
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 7.3_

- [x] 7.1 Build App component structure


  - Wrap app with ThemeProvider
  - Create header with app title and ThemeToggle
  - Render CalculatorCard in main content area
  - Create footer with attribution or info
  - Apply global layout styles
  - _Requirements: 7.3_

- [x] 7.2 Implement responsive layout with CSS

  - Add mobile styles (< 640px): vertical stack, full width
  - Add tablet styles (640px - 1024px): two-column input layout
  - Add desktop styles (> 1024px): centered card with max-width
  - Ensure all breakpoints maintain functionality
  - Test layout at different viewport sizes
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ]* 7.3 Write property test for responsive functionality
  - **Property 8: Responsive layout maintains functionality**
  - **Validates: Requirements 6.4**

- [ ] 8. Implement accessibility features
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 8.1 Add keyboard navigation support

  - Ensure all inputs and buttons are keyboard accessible
  - Add visible focus indicators with high contrast
  - Test Tab navigation order
  - Support Enter key for form submission
  - _Requirements: 9.1_

- [x] 8.2 Add ARIA attributes throughout

  - Add aria-label to all inputs, buttons, and selectors
  - Add aria-describedby for error messages
  - Add aria-live="polite" to result display
  - Add aria-invalid to inputs with errors
  - _Requirements: 9.2, 9.3, 9.4_

- [ ]* 8.3 Write property test for accessibility attributes
  - **Property 9: Accessibility attributes are present**
  - **Validates: Requirements 9.1, 9.2, 9.3, 9.4**

- [ ] 9. Final polish and testing
  - _Requirements: All_

- [x] 9.1 Review and refine neo-brutalism styling

  - Ensure consistent bold borders across all elements
  - Verify stark shadows on buttons, cards, inputs
  - Check high contrast in both light and dark themes
  - Ensure no rounded corners or gradients
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 9.2 Test edge cases manually






  - Test with very large file sizes (TB range)
  - Test with very slow speeds (Kbps range)
  - Test with very fast speeds (Gbps range)
  - Test download times exceeding 24 hours
  - Test download times under 1 second
  - Verify no NaN or Infinity displays
  - _Requirements: 3.4, 4.2, 4.3_

- [ ] 9.3 Verify all requirements are met
  - Go through requirements document and verify each acceptance criteria
  - Test on different browsers (Chrome, Firefox, Safari, Edge)
  - Test on different devices (mobile, tablet, desktop)
  - Verify theme switching works correctly
  - Verify reset functionality works correctly
  - _Requirements: All_

- [ ] 10. Checkpoint - Ensure all tests pass, ask the user if questions arise
