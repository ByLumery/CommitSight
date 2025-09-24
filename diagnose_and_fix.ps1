#requires -Version 5.1
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
Set-Location $root

function Run-Step {
  param([string]$Name,[scriptblock]$Cmd,[int]$TimeoutSec = 30)
  Write-Host "==> $Name (timeout ${TimeoutSec}s)"
  $job = Start-Job -ScriptBlock $Cmd -InitializationScript { $ErrorActionPreference='Stop' }
  if (-not (Wait-Job $job -Timeout $TimeoutSec)) {
    Stop-Job $job -Force | Out-Null
    Remove-Job $job -Force | Out-Null
    throw "Timeout: $Name"
  }
  $out = Receive-Job $job -ErrorAction Continue
  Remove-Job $job -Force | Out-Null
  if ($out) { $out | ForEach-Object { Write-Host $_ } }
}

function Wait-Health {
  param([string]$Url,[int]$TimeoutSec = 60)
  $stopAt = (Get-Date).AddSeconds($TimeoutSec)
  do {
    try {
      $resp = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 5
      if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500) { Write-Host "OK: $Url ($($resp.StatusCode))"; return $true }
    } catch { Start-Sleep -Milliseconds 700 }
  } while ((Get-Date) -lt $stopAt)
  return $false
}

Write-Host "🚀 Diagnose & Fix (PowerShell)"

# 1) Postgres via Docker
Run-Step -Name "docker compose up -d postgres" -TimeoutSec 60 -Cmd { docker compose up -d postgres | Out-String }

# 2) Prisma (no backend)
Set-Location "$root\backend"
Run-Step -Name "npx prisma generate" -TimeoutSec 45 -Cmd { npx prisma generate | Out-String }
Run-Step -Name "npx prisma migrate dev --name init" -TimeoutSec 60 -Cmd { npx prisma migrate dev --name init | Out-String }

if (Test-Path ".\prisma\seed.ts") {
  Run-Step -Name "npx ts-node prisma/seed.ts" -TimeoutSec 45 -Cmd { npx ts-node prisma/seed.ts | Out-String }
} else { Write-Warning "seed.ts não encontrado; pulando seed" }

# 3) Start backend em background
Write-Host "▶️  Iniciando backend em background (npm run dev)..."
$backend = Start-Process -FilePath "npm" -ArgumentList "run","dev" -WorkingDirectory "$root\backend" -PassThru -WindowStyle Hidden

# 4) Aguardar health
if (Wait-Health -Url "http://localhost:3001/api/health" -TimeoutSec 60) {
  Write-Host "✅ Backend saudável em http://localhost:3001"
} else {
  Write-Warning "❌ Backend não respondeu em 60s. Encerrando processo..."
  try { Stop-Process -Id $backend.Id -Force } catch {}
  throw "Backend não subiu a tempo"
}

# 5) Teste de login direto
try {
  $body = @{ email = "procontactmitsuki@gmail.com"; password = "Charllote2811" } | ConvertTo-Json
  $resp = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 15
  Write-Host "Login status: $($resp.StatusCode)"
  Write-Host "Body (trunc): $((ConvertFrom-Json $resp.Content) | ConvertTo-Json -Depth 10)"
} catch {
  Write-Warning "Falha no login direto: $($_.Exception.Message)"
}

Write-Host "🏁 Pronto. Deixe o backend rodando e, em outro terminal:  cd $root\frontend ; npm start"

