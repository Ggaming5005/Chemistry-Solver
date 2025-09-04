# Chemistry Solver (Next.js 15)

Desktop web app to solve and explain chemistry problems. Supports equation balancing (general balancer), templates for common reactions, stoichiometry basics, periodic table lookup, and OCR input.

## Features

- Equation balancing with step-by-step explanation
- Templates: Metal + Water, Acid + Base, Metal + Halogen
- Periodic Table sidebar with filters and search
- OCR camera/upload via Tesseract.js
- English and Georgian language toggle

## Tech Stack

- Next.js 15, React 18/19-compatible
- Tailwind CSS v4
- Tesseract.js for OCR

## Getting Started

1. Install dependencies

```bash
npm i
```

2. Run dev server

```bash
npm run dev
```

3. Open `http://localhost:3000`

## Project Structure

```
app/
  page.js          # main UI
  api/solve/route.js
components/
  Calculator.jsx   # input + keypad + templates + OCR
  ResultCard.jsx
  StepsList.jsx
  PeriodicTable.jsx
  OCRCapture.jsx
lib/
  solver.js        # balancing + stoichiometry + helpers
public/
  periodic-table.json
```

## Solver

- Detects problem type and runs a general chemical equation balancer.
- Steps include: parsing, elements considered, matrix solve, normalization, final balanced equation.
- Extra helpers: simple prediction for common patterns (alkali metal + water, HCl + NaOH, Na + Cl2) and minimal stoichiometry example.

## OCR

- Start camera, capture, or upload an image; optional high-accuracy preprocessing.

## Internationalization

- Header selector switches between English and Georgian. Steps and key labels are localized.

## Credits

By: Gio Adu
