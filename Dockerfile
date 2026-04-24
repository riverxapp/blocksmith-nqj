FROM node:22-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.26.2 --activate

COPY package.json pnpm-lock.yaml ./
RUN rm -rf node_modules && pnpm install --prefer-offline --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["node", "scripts/dev-supervisor.js"]
