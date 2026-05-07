# Basecoat Portal

## Quick Start with Docker

```bash
cp .env.example .env
# Edit .env with your GitHub OAuth app credentials
docker-compose up -d
```

Then open <http://localhost:8080>.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| POSTGRES_PASSWORD | PostgreSQL password | devpassword |
| JWT_SECRET | JWT signing secret | change-me-in-production |
| GITHUB_CLIENT_ID | GitHub OAuth App client ID | required |
| GITHUB_CLIENT_SECRET | GitHub OAuth App secret | required |

## Development

See [backend README](./backend/README.md) and [frontend README](./frontend/README.md).
