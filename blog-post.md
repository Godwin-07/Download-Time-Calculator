# Building a Download Time Calculator with Kiro

## The Problem
Ever wondered how long that 4GB game will take to download? Manual calculations are tedious and error-prone. Users need a quick, accessible tool that works across devices and handles various file sizes and internet speeds—from kilobits to gigabits.

## The Solution
I built a responsive React web app with real-time download time calculations. Enter your file size and internet speed, and instantly see results in HH:MM:SS format. The app features a bold neo-brutalist design with light/dark themes, full keyboard navigation, and screen reader support. It handles edge cases gracefully—from tiny files to terabyte downloads.

## How Kiro Accelerated Development
Kiro transformed this from a multi-day project into hours. Using Kiro's spec-driven workflow, I defined requirements and design properties upfront. Kiro then generated modular TypeScript utilities, React components with CSS Modules, and property-based tests using fast-check. The AI caught edge cases I'd have missed—like floating-point precision errors and accessibility attributes. Real-time feedback and parallel file generation meant zero context switching. What typically takes careful planning and iteration happened seamlessly.

**Result**: A production-ready calculator with 10 validated properties, full accessibility, and comprehensive test coverage—built in record time.
