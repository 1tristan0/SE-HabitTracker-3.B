# syntax=docker/dockerfile:1.7
FROM node:20-bullseye

RUN apt-get update \
    && apt-get install -y --no-install-recommends tini \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json  package-lock.json ./
RUN npm ci

COPY . .

RUN useradd -m appuser \
    && chown -R appuser:appuser /app
USER appuser

ENTRYPOINT ["/usr/bin/tini","--"]
# Standard ist 'npm run start' (für production), für compose-dev wird 'npm run dev' ausgeführt (dev,nodemon)
# prisma generate wird immer ausgeführt (production und development)
CMD ["sh", "-c", "npx prisma generate && npm run ${NPM_SCRIPT:-start}"]
