#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "Resetting local Supabase DB (without seed)..."
supabase db reset --no-seed

echo "Applying Prisma migrations to local Supabase DB..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml run --rm backend npx prisma migrate deploy

echo "Loading DB trigger..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml run --rm \
  -v "$ROOT_DIR/supabase:/supabase" \
  backend npx prisma db execute --file /supabase/seed.sql --schema prisma/schema.prisma

echo "Starting backend for API seeding..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d backend

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "Waiting for backend..."
ready=false
for _ in {1..30}; do
  if curl -s "$BASE_URL/" >/dev/null 2>&1; then
    ready=true
    break
  fi
  sleep 2
done

if [ "$ready" = false ]; then
  echo "Backend not ready at $BASE_URL"
  exit 1
fi

register_user() {
  local email="$1"
  local password="$2"

  curl -s -X POST "$BASE_URL/api/auth/register" \
    -H 'Content-Type: application/json' \
    -d "{\"email\":\"$email\",\"password\":\"$password\"}"
}

login_user() {
  local email="$1"
  local password="$2"

  curl -s -X POST "$BASE_URL/api/auth/login" \
    -H 'Content-Type: application/json' \
    -d "{\"email\":\"$email\",\"password\":\"$password\"}"
}

set_animal() {
  local token="$1"
  local animal_type="$2"
  local animal_mood="$3"

  curl -s -X PUT "$BASE_URL/api/users/animal" \
    -H "Authorization: Bearer $token" \
    -H 'Content-Type: application/json' \
    -d "{\"animal_type\":\"$animal_type\",\"animal_mood\":\"$animal_mood\"}" >/dev/null
}

create_habit() {
  local token="$1"
  local name="$2"
  local desc="$3"

  curl -s -X POST "$BASE_URL/api/habits" \
    -H "Authorization: Bearer $token" \
    -H 'Content-Type: application/json' \
    -d "{\"name\":\"$name\",\"desc\":\"$desc\"}" >/dev/null
}

get_access_token() {
  node -e "const fs=require('fs');const data=JSON.parse(fs.readFileSync(0,'utf8'));console.log(data.session?.accessToken||data.accessToken||'');"
}

register_and_get_token() {
  local email="$1"
  local password="$2"

  local register_payload
  register_payload="$(register_user "$email" "$password" || true)"
  local token
  token="$(printf '%s' "$register_payload" | get_access_token)"
  if [ -n "$token" ]; then
    printf '%s' "$token"
    return
  fi

  local login_payload
  login_payload="$(login_user "$email" "$password" || true)"
  token="$(printf '%s' "$login_payload" | get_access_token)"
  printf '%s' "$token"
}

echo "Seeding data via backend API..."

token_one="$(register_and_get_token "test@gewohnheitstier.de" "testtest")"
if [ -z "$token_one" ]; then
  echo "Failed to login user test@gewohnheitstier.de"
  exit 1
fi
set_animal "$token_one" "hund" "gluecklich"
create_habit "$token_one" "Trinken" "2 Liter Wasser"
create_habit "$token_one" "Lesen" "10 Seiten lesen"
create_habit "$token_one" "Meditation" "10 Minuten gefuehrte Atemmeditation, Fokus auf ruhiges Ein- und Ausatmen"
create_habit "$token_one" "Stretching" "15 Minuten Dehnen fuer Ruecken, Beine und Schultern nach dem Aufstehen"

token_two="$(register_and_get_token "user@example.com" "string")"
if [ -z "$token_two" ]; then
  echo "Failed to login user user@example.com"
  exit 1
fi
set_animal "$token_two" "katze" "traurig"
create_habit "$token_two" "Spazieren" "20 Minuten"
create_habit "$token_two" "Lernen" "30 Minuten konzentriertes Lernen, z.B. Kursvideo + kurze Notizen"
create_habit "$token_two" "Kochen" "Mindestens ein gesundes Rezept kochen, z.B. mit frischem Gemuese"

echo "Done."
