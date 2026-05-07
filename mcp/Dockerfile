FROM node:22-alpine

WORKDIR /app

COPY mcp/package.json ./mcp/package.json
RUN cd mcp && npm install --omit=dev

COPY README.md CHANGELOG.md INVENTORY.md version.json ./
COPY instructions ./instructions
COPY skills ./skills
COPY prompts ./prompts
COPY agents ./agents
COPY docs ./docs
COPY examples ./examples
COPY scripts ./scripts
COPY .github ./.github
COPY mcp ./mcp

ENTRYPOINT ["node", "/app/mcp/index.js"]
