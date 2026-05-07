# Basecoat Portal — Frontend

React 18 + Vite + TypeScript + Tailwind CSS frontend for the Basecoat Portal.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Starts the dev server at <http://localhost:5173>. API calls proxy to the backend at `http://localhost:3000`.

## Build

```bash
npm run build
```

Output is written to `dist/`.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | Backend API base URL |

Create a `.env.local` file to override:

```
VITE_API_URL=http://localhost:3000
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
