#!/usr/bin/env bash
set -euo pipefail

# Optional: ins Projektverzeichnis wechseln (Ordner anpassen/entfernen)
# cd "$(dirname "$0")/.."

# Supabase lokal starten
supabase start

# Docker Compose (dev) hochfahren + build
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
