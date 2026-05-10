param(
  [string]$BaseUrl = $(if ($env:BASE_URL) { $env:BASE_URL } else { 'http://localhost:3000' }),
  [ValidateSet('signin', 'signup')]
  [string]$AuthMode = $(if ($env:AUTH_MODE) { $env:AUTH_MODE } else { 'signin' }),
  [string]$AuthEmail = $(if ($env:AUTH_EMAIL) { $env:AUTH_EMAIL } else { '' }),
  [string]$AuthPassword = $(if ($env:AUTH_PASSWORD) { $env:AUTH_PASSWORD } else { '' }),
  [string]$Name = $(if ($env:NAME) { $env:NAME } else { 'Smoke Test Org' }),
  [int]$PointsRatio = $(if ($env:POINTS_RATIO) { [int]$env:POINTS_RATIO } else { 10 }),
  [string]$CustomerId = $(if ($env:CUSTOMER_ID) { $env:CUSTOMER_ID } else { 'customer-123' }),
  [decimal]$AmountEur = $(if ($env:AMOUNT_EUR) { [decimal]$env:AMOUNT_EUR } else { 59.9 }),
  [int]$RedeemPoints = $(if ($env:REDEEM_POINTS) { [int]$env:REDEEM_POINTS } else { 100 })
)

$ErrorActionPreference = 'Stop'

function Load-EnvFile {
  param([string]$FilePath)

  if (-not (Test-Path $FilePath)) {
    return
  }

  $content = Get-Content -Path $FilePath -Raw
  foreach ($line in $content -split "`n") {
    $trimmed = $line.Trim()

    if (-not $trimmed -or $trimmed.StartsWith('#') -or -not $trimmed.Contains('=')) {
      continue
    }

    # Handle both KEY=value and $env:KEY=value formats
    $trimmed = $trimmed -replace '^\$env:', ''

    $parts = $trimmed -split '=', 2
    if ($parts.Count -ne 2) {
      continue
    }

    $key = $parts[0].Trim()
    $value = $parts[1].Trim()

    # Remove quotes if present
    if (($value.StartsWith('"') -and $value.EndsWith('"')) -or
        ($value.StartsWith("'") -and $value.EndsWith("'"))) {
      $value = $value.Substring(1, $value.Length - 2)
    }

    # Set as environment variable if not already set
    if (-not [Environment]::GetEnvironmentVariable($key)) {
      [Environment]::SetEnvironmentVariable($key, $value)
    }
  }
}

Load-EnvFile -FilePath '.env.local'

function Assert-Command {
  param([string]$CommandName)

  if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $CommandName"
  }
}

function Convert-ToJsonBody {
  param([Parameter(Mandatory)]$Value)

  return ($Value | ConvertTo-Json -Depth 10 -Compress)
}

function Invoke-ApiPost {
  param(
    [Parameter(Mandatory)][string]$Path,
    [Parameter(Mandatory)]$Body,
    [hashtable]$Headers = @{},
    [Microsoft.PowerShell.Commands.WebRequestSession]$WebSession
  )

  $uri = "$BaseUrl$Path"
  $jsonBody = Convert-ToJsonBody -Value $Body

  $invokeParams = @{
    Method = 'Post'
    Uri = $uri
    ContentType = 'application/json'
    Headers = $Headers
    Body = $jsonBody
    ErrorAction = 'Continue'
  }

  if ($WebSession) {
    $invokeParams.WebSession = $WebSession
  }

  $response = Invoke-RestMethod @invokeParams

  return $response
}

function Invoke-ApiGet {
  param(
    [Parameter(Mandatory)][string]$Path,
    [hashtable]$Headers = @{},
    [Microsoft.PowerShell.Commands.WebRequestSession]$WebSession
  )

  $uri = "$BaseUrl$Path"
  $invokeParams = @{
    Method = 'Get'
    Uri = $uri
    Headers = $Headers
  }

  if ($WebSession) {
    $invokeParams.WebSession = $WebSession
  }

  return Invoke-RestMethod @invokeParams
}

Assert-Command -CommandName 'Invoke-RestMethod'

if (-not (Test-Path '.env.local')) {
  Write-Warning '.env.local not found. The API may fail if the server depends on env vars.'
}

Write-Host "Checking if dev server is reachable at $BaseUrl ..."
try {
  Invoke-WebRequest -UseBasicParsing -Uri $BaseUrl -Method Get | Out-Null
}
catch {
  Write-Error "Dev server not reachable at $BaseUrl. Start it first with: npm run dev"
  exit 1
}

if (-not $AuthEmail -or -not $AuthPassword) {
  Write-Host 'Auth credentials are required to create a signed-in session before calling register.'
  Write-Host ''
  
  if (-not $AuthEmail) {
    $AuthEmail = Read-Host 'Please enter your email'
  }
  
  if (-not $AuthPassword) {
    $securePassword = Read-Host 'Please enter your password' -AsSecureString
    $AuthPassword = [System.Net.NetworkCredential]::new('', $securePassword).Password
  }
}

$webSession = New-Object Microsoft.PowerShell.Commands.WebRequestSession

Write-Host "0) auth ($AuthMode)"
$authPath = if ($AuthMode -eq 'signup') { '/api/auth/signup' } else { '/api/auth/signin' }
$authResponse = Invoke-ApiPost -Path $authPath -WebSession $webSession -Body @{
  email = $AuthEmail
  password = $AuthPassword
}

if (-not $authResponse) {
  throw 'Authentication did not return a response.'
}

try {
  $sessionCheck = Invoke-ApiGet -Path '/api/auth/session' -WebSession $webSession
  if (-not $sessionCheck.authenticated) {
    throw 'Session could not be confirmed after authentication.'
  }
}
catch {
  throw "Session check failed after authentication: $($_.Exception.Message)"
}

Write-Host '1) register or get existing organization'
try {
  $registerResponse = Invoke-ApiPost -Path '/api/v1/organizations/register' -WebSession $webSession -Body @{
    name = $Name
    pointsRatio = $PointsRatio
  }
}
catch {
  $errorResponse = $_.Exception.Response
  $stream = $errorResponse.GetResponseStream()
  $reader = New-Object System.IO.StreamReader($stream)
  $responseBody = $reader.ReadToEnd()
  $reader.Close()
  
  if ($responseBody -like '*already has an organization*') {
    Write-Host '   User already has an organization, will use API_KEY from .env.local'
    
    # Load API_KEY from environment (already loaded from .env.local)
    $apiKey = [Environment]::GetEnvironmentVariable('API_KEY')
    if (-not $apiKey) {
      Write-Error 'API_KEY not found in .env.local and organization registration failed'
      exit 1
    }
    
    # We'll still need organizationId. For now, use a placeholder that will be handled later
    # The collect/redeem/analytics calls need organizationId, but if we use the API_KEY it should work 
    $registerResponse = @{
      organizationId = 'existing'
      apiKey = $apiKey
    }
  }
  else {
    Write-Error "Register failed with status $($errorResponse.StatusCode): $responseBody"
    exit 1
  }
}

$organizationId = $registerResponse.organizationId
if (-not $organizationId -and $registerResponse.organization) {
  $organizationId = $registerResponse.organization.id
}
if (-not $organizationId) {
  $organizationId = $registerResponse.id
}

$apiKey = $registerResponse.apiKey
if (-not $apiKey -and $registerResponse.api_key) {
  $apiKey = $registerResponse.api_key
}
if (-not $apiKey -and $registerResponse.key) {
  $apiKey = $registerResponse.key
}

if (-not $organizationId) {
  throw 'Could not read organization id from register response.'
}

if (-not $apiKey) {
  throw 'Could not read apiKey from register response.'
}

Write-Host '2) collect'
$collectResponse = Invoke-ApiPost -Path '/api/v1/collect' -Headers @{ 'x-api-key' = $apiKey } -WebSession $webSession -Body @{
  externalCustomerId = $CustomerId
  amountEur = $AmountEur
  metadata = @{
    source = 'smoke-test'
    orderId = 'order-smoke-001'
  }
}

Write-Output $collectResponse

Write-Host '3) redeem'
$redeemResponse = Invoke-ApiPost -Path '/api/v1/redeem' -Headers @{ 'x-api-key' = $apiKey } -WebSession $webSession -Body @{
  externalCustomerId = $CustomerId
  points = $RedeemPoints
  metadata = @{
    source = 'smoke-test'
    rewardCode = 'SMOKE-REWARD'
  }
}

Write-Output $redeemResponse

Write-Host '4) analytics/overview'
if ($organizationId -eq 'existing') {
  Write-Host '   (Skipped for existing organizations - organizationId not available from API_KEY alone)'
}
else {
  $analyticsResponse = Invoke-ApiGet -Path "/api/v1/analytics/overview?organizationId=$organizationId" -Headers @{ 'x-api-key' = $apiKey } -WebSession $webSession

  Write-Output $analyticsResponse
}

Write-Host ''
Write-Host 'Smoke test finished successfully.'
if ($organizationId -ne 'existing') {
  Write-Host "organizationId: $organizationId"
}
else {
  Write-Host 'Used existing organization from API_KEY'
}
Write-Host "apiKey: $apiKey"