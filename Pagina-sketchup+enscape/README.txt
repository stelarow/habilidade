# React Component Export

This ZIP file contains the exported React component from your Hatch canvas.

## Files:
- component.jsx: The main React component source code
- component.js: The compiled/executable JavaScript version
- index.html: Ready-to-run HTML file with fallback inline code and data
- storedState.json: Initial state data

- assets/: Directory containing 22 image asset(s)
  - assets/_AM4K71sI76P_48oTfwuh.webp
  - assets/2jNvD0A0IySCMxVqHKKLN.jpeg
  - assets/Dto_HF1D0esz2RgHkyluP.png
  - assets/l5v_ub2GBPsN8c9qczmU6.jpeg
  - assets/x3eNjRKuni5TKlKHbFZug.webp
  - assets/AJ0M1WPOZVRqEu3y-N4j_.avif
  - assets/ukKT5CnXfAVP3AS9G4jXs.jpeg
  - assets/xYBvu3zwJyVFvvlKHPcz0.jpeg
  - assets/dU-RkMhy9INgLG_2WQrOs.png
  - assets/sXBkejmP3TgFhiLFB-2NM.jpeg
  - assets/p4GIB7Eemw3frRpbKG2zR.jpeg
  - assets/PLOSn09XPv1Fkg_lJVsAG.jpeg
  - assets/kI8JxlGaNQo0Ecg5B1uEP.jpeg
  - assets/architectural-render-bg.jpeg
  - assets/render-1.jpeg
  - assets/render-2.jpeg
  - assets/render-3.jpeg
  - assets/render-4.jpeg
  - assets/project-1.jpeg
  - assets/project-2.jpeg
  - assets/project-3.jpeg
  - assets/cta-background.jpeg

## Quick Start:
1. **Immediate Preview**:
   - **File mode**: Double-click `index.html` - works locally with file:// URLs!
   - **Server mode**: Serve from a local web server for cleaner file separation:
     - `python -m http.server 8000`
     - `npx serve .`
     - `php -S localhost:8000`

2. **Development Setup**:

## Usage:
```jsx
import Component from './component';

function App() {
  return <Component />;
}
```

## Hatch Runtime Features:
The exported component includes support for Hatch's `useStoredState` hook:
- `useStoredState(key, defaultValue)` - Persistent state storage using localStorage
- Loads external files when served from a web server
- Falls back to inline data for file:// URLs
- State persists across browser sessions

The `index.html` file provides a complete Hatch-compatible runtime environment that works both when served from a web server (using external files) and when opened directly as file:// URLs (using inline fallbacks).

Generated on: 07/08/2025, 08:48:45
