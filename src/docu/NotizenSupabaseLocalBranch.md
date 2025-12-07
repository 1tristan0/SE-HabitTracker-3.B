#Notizen Supabase Local - Branch

## Supabase CLI
### Installation
- mit homebrew (macOS)
- über packages auf github und jeweiliger manager (linux)

### Setup im Project (nur beim ersten mal)
- supabase init -> erzeugt /supabase mit /.temp und config.toml

### Verwendung im Project / Worklow lokal vs. production
- supabase start -> starte lokale environment (PostrgreDB, Auth service, storage service)
-> gibt alle URLs und KEYs im Terminal an

╭──────────────────────────────────────╮
│ 🛠️  Development Tools                │
├─────────┬────────────────────────────┤
│ Studio  │ http://127.0.0.1:54323     │
│ Mailpit │ http://127.0.0.1:54324     │
│ MCP     │ http://127.0.0.1:54321/mcp │
╰─────────┴────────────────────────────╯

╭──────────────────────────────────────────────────────╮
│ 🌐 APIs                                              │
├────────────────┬─────────────────────────────────────┤
│ Project URL    │ http://127.0.0.1:54321              │
│ REST           │ http://127.0.0.1:54321/rest/v1      │
│ GraphQL        │ http://127.0.0.1:54321/graphql/v1   │
│ Edge Functions │ http://127.0.0.1:54321/functions/v1 │
╰────────────────┴─────────────────────────────────────╯

╭───────────────────────────────────────────────────────────────╮
│ 🗄️  Database                                                  │
├─────┬─────────────────────────────────────────────────────────┤
│ URL │ postgresql://postgres:postgres@127.0.0.1:54322/postgres │
╰─────┴─────────────────────────────────────────────────────────╯

╭──────────────────────────────────────────────────────────────╮
│ 🔑 Authentication Keys                                       │
├─────────────┬────────────────────────────────────────────────┤
│ Publishable │ sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH │
│ Secret      │ ***                                            │
╰─────────────┴────────────────────────────────────────────────╯

- in der lokalen .env steht dann:
DATABASE_URL="postgresql://postgres:postgres@172.17.0.1:54322/postgres"

Damit die DB aus dem container heraus erreichbar ist muss die Supabase URL angepasst werden:
Mac: SUPABASE_URL=http://host.docker.internal:54321
Linux: SUPABASE_URL=http://<ip-adresse>:54321

SUPABASE_ANON_KEY= <prisma studio abrufen -> connect -> app frameworks -> dort steht der anonkey
PORT=3001

- die alte .env wird zur .env.production und bleibt sonst unverändert

### Alle Supabase Container schliessen
docker stop $(docker ps -aq --filter "name=supabase") && docker rm $(docker ps -aq --filter "name=supabase")