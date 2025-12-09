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
# Default is 'npm run start' (prod), for compose-dev it is 'npm run dev' (dev,nodemon)
# prisma generate is always executed
CMD ["sh", "-c", "npx prisma generate && npm run ${NPM_SCRIPT:-start}"]
