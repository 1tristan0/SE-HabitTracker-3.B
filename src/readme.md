# Gewohnheitstier – Dev/Prod per Docker

## Architektur-Überblick-Simplifizert

Browser
  ↓ App: http://localhost:3000
Frontend (React / CRA)
  ↓ REST API
Backend (Node / Express + Prisma)
  ↓ SQL
Supabase Postgres (local oder cloud)

## Voraussetzungen
- Docker Desktop (Mac/Win) oder Docker Engine (Linux)
- Git
- Node.js >= 20
- Supabase CLI global installiert (https://github.com/supabase/cli?utm_source=chatgpt.com)
    - MacOS via brew, Linux via Package (siehe official Repo)

## Start (Erstlauf)
Repo klonen und ins Verzeichnis wechseln
```bash
git clone https://github.com/1tristan0/SE-HabitTracker-3.B.git
cd src
```

### Lokale Entwicklung (Dev)

Supabase lokal starten (Notwendig!), bei der ersten Ausführung werden alle Abhaengigkeiten installiert, das dauert etwas laenger.
```bash
supabase start
```
bei Erfolg wird im Terminal alles Wichtige zur lokalen Instanz angezeigt (URLs, Keys etc.)

oder manuell abfragen via
```bash
supabase status
```
danach ist die Supabase GUI erreichbar unter: http://localhost:54323 


