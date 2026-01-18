#!/usr/bin/env pwsh
$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $RootDir

# Optional: ins Projektverzeichnis wechseln (Ordner anpassen/entfernen)
# Set-Location (Join-Path $RootDir "..")

# Supabase lokal starten
supabase start

# Docker Compose (dev) hochfahren + build
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
git switch
