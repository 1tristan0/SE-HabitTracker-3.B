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
### Umgebungsvariablen einrichten

Alle Variablen sind über die internen asynchronen Kommunikationskanäle zu finden. Im Weiteren wird erklärt woraus sie bestehen. 

Um zwischen dev und prod unterscheiden zu können existieren zwei Umgebungsvariablen (`.env-Dateien`) für das Backend, für das Frontend weiterhin nur eine (da API-Port für dev/prod gleich).
Beide `.env-Dateien` liegen direkt im `/backend` Verzeichnis.Beide Dateiene enthalten alle wichtigen Infos die vom backend benötigt werden, um die DB sowie alle weiteren Dienste von Supabase erreichen zu können.

#### .env.production
```
# Umgebung innerhalb von Node bekannt geben
NODE_ENV=production

# URL zur Datenbank (Cloud)
DATABASE_URL="postgresql://<user>.<projectreference>:<password>@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# URL zum Supabase Projekt (Supabase Services wie Authentification)
SUPABASE_URL=https://<projectreference>.supabase.co/

# Supabase KEY zur eigenen Authentifizierung 
SUPABASE_ANON_KEY=********

# Port auf welchem das backend erreichbar ist
PORT=3001
```
#### .env.local
```
# Umgebung innerhalb von Node bekannt geben
NODE_ENV=development

# URL zur Datenbank (lokal)
DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:54322/postgres"
oder
DATABASE_URL="postgresql://postgres:postgres@<lokale ip>:54322/postgres"

# URL zum lokalen Supabase Projekt (Supabase Services wie Authentification)
SUPABASE_URL= http://host.docker.internal:54321
oder
SUPABASE_URL= http://<lokale ip>:54321

# Supabase KEY zur eigenen Authentifizierung 
SUPABASE_ANON_KEY= ********

# Port auf welchem das backend erreichbar ist
PORT=3001
```
Je nach Betriebssystem müssen in der `.env.local` beide URLs angepasst werden, damit der container `localhost` erreichen kann: `host.docker.internal` für MacOS/Windows oder eure lokale `IP-Adresse` für Linux.

### Alte Container entfernen

Um sicherzustellen, dass es zu keinen Komplikationen kommt sollten voerst alte Container und deren Volumes bereinigt/entfernt werden.
```bash
docker compose down --volumes --remove-orphans
```

### Workflow - DEV - Lokal 
#### DEV - App starten - Keine Arbeit an der DB
Supabase lokal starten (notwendig!), bei der ersten Ausführung werden alle Abhängigkeiten installiert, das dauert etwas länger.
```bash
supabase start
```
bei Erfolg wird im Terminal alles Wichtige zur lokalen Instanz angezeigt (URLs, Keys wie oben beschrieben)
oder manuell abfragen via:
```bash
supabase status
```
danach ist die Supabase GUI erreichbar unter: http://localhost:54323 oder der URL im Terminal.

Als nächstes die Container starten. Beim ersten Mal ggf. mit der --build flag, falls es zu Fehlermeldungen kommen sollte.

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up (--build)
```
Die App sollte jetzt laufen:
	Frontend → http://localhost:3000
	Backend → http://localhost:3001
	Supabase Studio → http://localhost:54323

Nach Beendigung der Arbeit alle Container stoppen:

```bash
docker compose down
supabase stop
```

#### DEV - Arbeiten an DB & Prisma
Folgende Befehle *NUR* mit *docker-compose.dev.yml* ausführen!

##### 0) lokale DB leer/veraltet - Migrations aber vorhanden
```bash
docker compose \
-f docker-compose.yml \
-f docker-compose.dev.yml \
run --rm backend npx prisma migrate deploy
```

-> `migrate deploy`, nicht `dev`
- bestehende Migrations werden angewandt, nicht neu erzeugt
- Anwendung auf lokale Supabase DB, Tabellen werden aktualisiert

##### 1) lokale DB leer/veraltet und Migrations erzeugen
```bash
docker compose \
-f docker-compose.yml \
-f docker-compose.dev.yml \
run --rm --user root backend npx prisma migrate dev --name `name`
```
-> `migrate dev` erzeugt:
- Migration in backend/prisma/migrations/ benannt nach `name`
- Anwendung auf lokale Supabase DB, Tabellen aktualisiert
    

##### 2) Migrations erzeugen & Schema-Änderungen anwenden
- schema.prisma ändern, dann gleicher Befehl wie 1):

##### 3) DB leeren und Schema anwenden (nur DEV!)
```bash
docker compose \
-f docker-compose.yml \
-f docker-compose.dev.yml \
run --rm --user root backend npx prisma migrate reset
```
  - löscht alle Daten/Tabellen der DB, wendet Migrations an

##### 5) Supabase lokal hard-Reset
 `supabase db reset`
 - setzt die lokale Supabase DB zurück
 - danach Migrations anwenden

##### 6) Container stoppen
```bash
docker compose down
supabase stop
```
### Workflow Production

##### 1) Prod starten
```bash
docker compose \
-f docker-compose.yml \
-f docker-compose.prod.yml \
up (--build)
```
##### 2) Prod stoppen
```bash
docker compose down
```
#### DANGER ZONE:
##### 3) Migrationen in PROD ausführen - Aktuell nicht notwendig
- folgender Befehl betrifft die Cloud DB und alle dort liegenden Daten/Tabellen
- nur ausführen, wenn Risiken/Auswirkungen bewusst sind!

```bash
docker compose \
-f docker-compose.yml \
-f docker-compose.prod.yml \
run --rm backend npx prisma migrate deploy
```
KEIN migrate dev in Prod ausführen!

### Aufräumen / Reset (bei Problemen)
Alle Docker Container stoppen und Volumes entfernen
```bash
docker compose down --volumes --remove-orphans
```
Alle Supabase Container schließen, falls nötig sonst immer `supabase stop`:
```bash
docker stop $(docker ps -aq --filter "name=supabase") \
&& docker rm $(docker ps -aq --filter "name=supabase")
```
Optionale Befehle zum Bereinigen:
```bash
docker image prune -f
docker builder prune -f
docker container prune -f
```
### Git-Workflow (Prisma)

```bash
git add backend/prisma/migrations
git commit -m "add prisma migration"
```
- nur auf lokale und feature Branches committen, damit Migrations nicht versehentlich auf PROD deployed werden
- Ergo: Zusammenarbeit auf Remote Branches setzt vorraus, dass mit DEV-Umgebung gearbeitet wird
- Verhindert: "Ich wusste nicht, dass xyz etwas am DB-Schema verändert hat..."

### Wichtige Regeln:
- Supabase immer zuerst starten
- Migrationen manuell ausführen, nicht in Dockerfile oder Compose.yml einbinden
- `npx prisma migrate deploy` auf PROD, NUR wenn Migrations offiziell sind (auf dev- oder main-Branch gepusht)
- kein `npx prisma migrate dev` auf PROD
- NUR `npx prisma migrate` und "one-time"-shell commands mit Root-Rechten ausführen
- Keine Root-Rechte im Runtime-Container vergeben