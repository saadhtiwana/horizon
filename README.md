# Horizon

![Horizon demo](./src/assets/saad.png)

Horizon is a clean, professional personal-finance dashboard starter built with React + TypeScript, Vite, and a component-first design system. It provides a well-structured foundation to build data-driven dashboards, budgeting apps, and analytics tools.

## Why Horizon
- Classic, focused UI designed for clarity and data density
- Batteries-included starter: routing, charts, CSV import, and auth helpers
- Built to scale: modular components, TanStack Router, and React Query

## Highlights
- Responsive layout with accessible Radix primitives and Tailwind utilities
- Charts (Recharts) and visual components for quick data storytelling
- CSV import and formatting utilities for fast data onboarding
- Modern dev experience with Vite and TypeScript

## Tech Stack
- React 19 + TypeScript
- Vite for fast dev & optimized builds
- @tanstack/react-router and React Query for routing & data
- Radix UI primitives + Tailwind CSS for styling
- Recharts for visualizations

## Quick Start
Prerequisites: Node (v18+), bun, npm, or pnpm.

From the project root:

```bash
cd horizon
# install
bun install   # or npm install / pnpm install

# start dev server
bun run dev   # or npm run dev / pnpm run dev
```

Build for production:

```bash
bun run build   # or npm run build
bun run preview # or npm run preview
```

## Project Layout (short)
- `src/components/` — UI components & design system
- `src/routes/` — top-level route modules (pages)
- `src/lib/` — utilities: auth, csv, formatters, storage
- `src/assets/` — images and static assets

## Contributing
- Fork, branch from `main`, implement changes, and open a PR.
- Keep commits focused and add a short description for each change.

## License
This project is provided under the MIT License. See LICENSE for details.

---
If you want, I can open a PR with this README and include a small contributor guide or CI badge.
