#!/usr/bin/env pwsh
$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $RootDir

Write-Host "Resetting local Supabase DB (without seed)..."
supabase db reset --no-seed

Write-Host "Applying Prisma migrations to local Supabase DB..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml run --rm backend npx prisma migrate deploy

Write-Host "Loading DB trigger..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml run --rm `
  -v "$RootDir\supabase:/supabase" `
  backend npx prisma db execute --file /supabase/seed.sql --schema prisma/schema.prisma

Write-Host "Starting backend for API seeding..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d backend

$BaseUrl = if ($env:BASE_URL) { $env:BASE_URL } else { "http://localhost:3001" }

Write-Host "Waiting for backend..."
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
  try {
    Invoke-WebRequest -Uri "$BaseUrl/" -Method Get -TimeoutSec 2 -UseBasicParsing | Out-Null
    $ready = $true
    break
  } catch {
    Start-Sleep -Seconds 2
  }
}

if (-not $ready) {
  Write-Host "Backend not ready at $BaseUrl"
  exit 1
}

function Register-User {
  param(
    [string]$Email,
    [string]$Password
  )

  $body = @{ email = $Email; password = $Password } | ConvertTo-Json -Compress
  try {
    Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/auth/register" -ContentType "application/json" -Body $body
  } catch {
    $null
  }
}

function Login-User {
  param(
    [string]$Email,
    [string]$Password
  )

  $body = @{ email = $Email; password = $Password } | ConvertTo-Json -Compress
  try {
    Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/auth/login" -ContentType "application/json" -Body $body
  } catch {
    $null
  }
}

function Set-Animal {
  param(
    [string]$Token,
    [string]$AnimalType,
    [string]$AnimalMood
  )

  $body = @{ animal_type = $AnimalType; animal_mood = $AnimalMood } | ConvertTo-Json -Compress
  try {
    Invoke-RestMethod -Method Put -Uri "$BaseUrl/api/users/animal" `
      -Headers @{ Authorization = "Bearer $Token" } `
      -ContentType "application/json" `
      -Body $body | Out-Null
  } catch {
    $null
  }
}

function Create-Habit {
  param(
    [string]$Token,
    [string]$Name,
    [string]$Desc
  )

  $body = @{ name = $Name; desc = $Desc } | ConvertTo-Json -Compress
  try {
    Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/habits" `
      -Headers @{ Authorization = "Bearer $Token" } `
      -ContentType "application/json" `
      -Body $body | Out-Null
  } catch {
    $null
  }
}

function Get-AccessToken {
  param([object]$Payload)

  if (-not $Payload) {
    return ""
  }

  $obj = $Payload
  if ($Payload -is [string]) {
    try {
      $obj = $Payload | ConvertFrom-Json
    } catch {
      return ""
    }
  }

  if ($obj.PSObject.Properties.Name -contains "session" -and $obj.session) {
    if ($obj.session.PSObject.Properties.Name -contains "accessToken") {
      return [string]$obj.session.accessToken
    }
  }

  if ($obj.PSObject.Properties.Name -contains "accessToken") {
    return [string]$obj.accessToken
  }

  return ""
}

function Register-And-Get-Token {
  param(
    [string]$Email,
    [string]$Password
  )

  $registerPayload = Register-User -Email $Email -Password $Password
  $token = Get-AccessToken -Payload $registerPayload
  if ($token) {
    return $token
  }

  $loginPayload = Login-User -Email $Email -Password $Password
  Get-AccessToken -Payload $loginPayload
}

Write-Host "Seeding data via backend API..."

$tokenOne = Register-And-Get-Token -Email "test@gewohnheitstier.de" -Password "testtest"
if (-not $tokenOne) {
  Write-Host "Failed to login user test@gewohnheitstier.de"
  exit 1
}
Set-Animal -Token $tokenOne -AnimalType "hund" -AnimalMood "gluecklich"
Create-Habit -Token $tokenOne -Name "Trinken" -Desc "2 Liter Wasser"
Create-Habit -Token $tokenOne -Name "Lesen" -Desc "10 Seiten lesen"
Create-Habit -Token $tokenOne -Name "Meditation" -Desc "10 Minuten gefuehrte Atemmeditation, Fokus auf ruhiges Ein- und Ausatmen"
Create-Habit -Token $tokenOne -Name "Stretching" -Desc "15 Minuten Dehnen fuer Ruecken, Beine und Schultern nach dem Aufstehen"

$tokenTwo = Register-And-Get-Token -Email "user@example.com" -Password "string"
if (-not $tokenTwo) {
  Write-Host "Failed to login user user@example.com"
  exit 1
}
Set-Animal -Token $tokenTwo -AnimalType "katze" -AnimalMood "traurig"
Create-Habit -Token $tokenTwo -Name "Spazieren" -Desc "20 Minuten"
Create-Habit -Token $tokenTwo -Name "Lernen" -Desc "30 Minuten konzentriertes Lernen, z.B. Kursvideo + kurze Notizen"
Create-Habit -Token $tokenTwo -Name "Kochen" -Desc "Mindestens ein gesundes Rezept kochen, z.B. mit frischem Gemuese"

Write-Host "Done."
