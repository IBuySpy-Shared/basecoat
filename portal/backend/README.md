# Basecoat Portal Backend

Express/TypeScript/Sequelize API server for the Basecoat Portal.

## Prerequisites

- Node.js 20+
- PostgreSQL 15+

## Setup

```bash
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run db:migrate
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server |
| `npm run dev` | Run with ts-node (development) |
| `npm test` | Run Jest test suite |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run db:migrate` | Run Sequelize migrations |
| `npm run db:seed` | Seed the database |
| `npm run lint` | Lint source files |

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |

## Environment Variables

See `.env.example` for all required variables.

## Architecture

- **Framework**: Express 4
- **Language**: TypeScript 5
- **ORM**: Sequelize 6 (PostgreSQL)
- **Logging**: Winston
- **Testing**: Jest + supertest

## Related Issues

- #485 — Backend scaffold
- #486 — Data models and migrations
