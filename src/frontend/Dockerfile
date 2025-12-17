# syntax=docker/dockerfile:1.7
FROM node:20-bullseye

WORKDIR /app

COPY package.json  package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm","start"]
