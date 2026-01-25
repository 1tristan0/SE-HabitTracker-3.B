#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

export SUPABASE_URL="http://supabase.local"
export SUPABASE_ANON_KEY="anon-key"

tests=(
  "backend/tests/smoke.test.js"
  "backend/tests/prismaUsers.unit.test.js"
  "backend/tests/prismaHabits.unit.test.js"
  "backend/tests/supabaseAuth.test.js"
  "backend/tests/routesAuth.test.js"
  "backend/tests/routesHabits.test.js"
  "backend/tests/routesUsers.test.js"
)

echo "== Backend Unit Tests =="
printf "Total: %d\n" "${#tests[@]}"
echo ""
passed=0
failed=0
results=()
for test_file in "${tests[@]}"; do
  printf "==> %s\n" "$test_file"
  if node "$test_file"; then
    echo "Result: PASS"
    passed=$((passed + 1))
    results+=("PASS  $test_file")
  else
    echo "Result: FAIL"
    failed=$((failed + 1))
    results+=("FAIL  $test_file")
  fi
  echo ""
done

echo "== Backend Summary =="
printf "%s\n" "${results[@]}"
echo ""
printf "Passed: %d\n" "$passed"
printf "Failed: %d\n" "$failed"
printf "Total: %d\n" "${#tests[@]}"

if [ "$failed" -ne 0 ]; then
  exit 1
fi
