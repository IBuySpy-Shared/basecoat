# Basecoat Portal

Full-stack web application for BaseCoat governance, audit, and compliance workflows.

## Structure

| Directory | Description |
|---|---|
| `frontend/` | React 18 + Vite SPA — pages, routing, auth, charts |
| `backend/` | Express API — GitHub OAuth, JWT, PostgreSQL/Sequelize |
| `ui/` | `@basecoat/portal-ui` — shared component library + Storybook |
| `prompts/` | Portal-specific Copilot prompt files (not synced to consumers) |

## Quick Start

```bash
cp .env.example .env
# Edit .env with your GitHub OAuth app credentials
docker-compose up -d
```

Then open <http://localhost:8080>.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `POSTGRES_PASSWORD` | PostgreSQL password | devpassword |
| `JWT_SECRET` | JWT signing secret | change-me-in-production |
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID | required |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App secret | required |

## Development

- **Frontend**: `cd frontend && npm install && npm run dev` (port 5173)
- **Backend**: `cd backend && npm install && npm run dev` (port 3001)
- **Component library**: `cd ui && npm install && npm run storybook` (port 6006)

See [frontend README](./frontend/README.md), [backend README](./backend/README.md), and [ui README](./ui/README.md).
