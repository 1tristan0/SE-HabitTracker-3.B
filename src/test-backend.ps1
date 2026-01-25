#requires -version 5.1
$ErrorActionPreference = 'Stop'

# Set working directory to script location
$scriptDir = Split-Path -Parent $PSCommandPath
Set-Location $scriptDir

# Env vars for tests
$env:SUPABASE_URL = 'http://supabase.local'
$env:SUPABASE_ANON_KEY = 'anon-key'

$tests = @(
    'backend/__tests__/smoke.test.js'
    'backend/__tests__/prismaUsers.unit.test.js'
    'backend/__tests__/prismaHabits.unit.test.js'
    'backend/__tests__/supabaseAuth.test.js'
    'backend/__tests__/routesAuth.test.js'
    'backend/__tests__/routesHabits.test.js'
    'backend/__tests__/routesUsers.test.js'
)

Write-Host '== Backend Unit Tests =='
Write-Host ("Total: {0}" -f $tests.Count)
Write-Host ''

$passed = 0
$failed = 0
$results = @()

foreach ($test in $tests) {
    Write-Host ("==> {0}" -f $test)
    try {
        node $test
        Write-Host 'Result: PASS'
        $passed++
        $results += "PASS  $test"
    }
    catch {
        Write-Host 'Result: FAIL'
        $failed++
        $results += "FAIL  $test"
    }
    Write-Host ''
}

Write-Host '== Backend Summary =='
$results | ForEach-Object { Write-Host $_ }
Write-Host ''
Write-Host ("Passed: {0}" -f $passed)
Write-Host ("Failed: {0}" -f $failed)
Write-Host ("Total: {0}" -f $tests.Count)

if ($failed -ne 0) {
    exit 1
}
