<#
  Travelora - booking API smoke test (Windows PowerShell 5.1 or PowerShell 7).

  Usage (from the project root, with the Java service running):
    powershell -ExecutionPolicy Bypass -File .\scripts\test-booking-api.ps1
    powershell -ExecutionPolicy Bypass -File .\scripts\test-booking-api.ps1 -BaseUrl http://localhost:5000   # through the Node server

  It creates one real booking (it is saved in MongoDB) and then reads it back.
  Exit code 0 = every check passed.
#>
param(
    [string]$BaseUrl = "http://localhost:8081"
)

$ErrorActionPreference = "Stop"
$script:passed = 0
$script:failed = 0

function Invoke-Api {
    param([string]$Method, [string]$Path, $Body = $null)
    $uri = "$BaseUrl$Path"
    try {
        if ($null -ne $Body) {
            $json = if ($Body -is [string]) { $Body } else { $Body | ConvertTo-Json -Depth 6 }
            $resp = Invoke-WebRequest -Uri $uri -Method $Method -ContentType "application/json" -Body $json -UseBasicParsing
        } else {
            $resp = Invoke-WebRequest -Uri $uri -Method $Method -UseBasicParsing
        }
        return @{ Status = [int]$resp.StatusCode; Body = $resp.Content }
    } catch {
        $status = 0
        if ($_.Exception.Response) { $status = [int]$_.Exception.Response.StatusCode }
        $text = ""
        if ($_.ErrorDetails -and $_.ErrorDetails.Message) { $text = $_.ErrorDetails.Message }
        return @{ Status = $status; Body = $text }
    }
}

function Check {
    param([string]$Name, [bool]$Ok, [string]$Detail = "")
    if ($Ok) { $script:passed++; Write-Host "PASS  $Name" -ForegroundColor Green }
    else { $script:failed++; Write-Host "FAIL  $Name  $Detail" -ForegroundColor Red }
}

Write-Host "Testing booking API at $BaseUrl`n"

$travelDate = (Get-Date).AddDays(14).ToString("yyyy-MM-dd")
$validBooking = @{
    userId          = "test-user-ps"
    packageId       = "goa-escape"
    packageName     = "Goa Escape"
    destination     = "Goa"
    duration        = "4 Days / 3 Nights"
    travelDate      = $travelDate
    travellersCount = 2
    travellersList  = @(
        @{ name = "Lokesh";    age = "18"; gender = "Male" },
        @{ name = "Test User"; age = "20"; gender = "Female" }
    )
    roomTierName    = "Standard Deluxe Room"
    contact         = @{ name = "Lokesh"; email = "test@example.com"; phone = "9999999999"; specialRequests = "" }
    pricing         = @{ basePrice = 14999; travellerCount = 2; baseSubtotal = 29998; roomCost = 0; insuranceCost = 0
                         subtotal = 29998; taxes = 0; serviceFee = 0; discount = 0; total = 29998 }
    paymentMethod   = "upi"
}

# 1. Service is up
$r = Invoke-Api GET "/api/java/health"
Check "GET /api/java/health returns 200" ($r.Status -eq 200) "(status $($r.Status))"

# 2. Database reachable
$r = Invoke-Api GET "/api/java/health/db"
Check "GET /api/java/health/db returns 200 (MongoDB reachable)" ($r.Status -eq 200) "(status $($r.Status) - check MONGODB_URI)"
$dbUp = ($r.Status -eq 200)

# 3. Valid booking
$bookingId = $null
if ($dbUp) {
    $r = Invoke-Api POST "/api/java/bookings" $validBooking
    Check "POST valid booking returns 201" ($r.Status -eq 201) "(status $($r.Status): $($r.Body))"
    if ($r.Status -eq 201) {
        $saved = $r.Body | ConvertFrom-Json
        $bookingId = $saved.bookingId
        Check "Response has bookingId like TRV-yyyy-nnnnn" ($bookingId -match '^TRV-\d{4}-\d{5}$') "($bookingId)"
        Check "Response status is CONFIRMED" ($saved.status -eq "CONFIRMED")
        Write-Host "      saved bookingId = $bookingId"
    }
} else {
    Write-Host "SKIP  Tests that need MongoDB (create/get) - database is not reachable" -ForegroundColor Yellow
}

# 4. Invalid bookings (these never reach the database)
$bad = $validBooking.Clone(); $bad.destination = ""
$r = Invoke-Api POST "/api/java/bookings" $bad
Check "POST with empty destination returns 400" ($r.Status -eq 400) "(status $($r.Status))"

$bad = $validBooking.Clone(); $bad.contact = @{ name = "X"; email = "not-an-email"; phone = "1" }
$r = Invoke-Api POST "/api/java/bookings" $bad
Check "POST with invalid contact email returns 400" ($r.Status -eq 400) "(status $($r.Status))"

$bad = $validBooking.Clone(); $bad.travelDate = "2020-01-01"
$r = Invoke-Api POST "/api/java/bookings" $bad
Check "POST with a past travel date returns 400" ($r.Status -eq 400) "(status $($r.Status))"

$r = Invoke-Api POST "/api/java/bookings" "{ this is not json"
Check "POST with malformed JSON returns 400" ($r.Status -eq 400) "(status $($r.Status))"

# 5. Read back
if ($bookingId) {
    $r = Invoke-Api GET "/api/java/bookings/$bookingId"
    Check "GET /api/java/bookings/{bookingId} returns 200" ($r.Status -eq 200) "(status $($r.Status))"

    $r = Invoke-Api GET "/api/java/bookings/user/test-user-ps"
    $found = $false
    if ($r.Status -eq 200) { $found = (@($r.Body | ConvertFrom-Json | Where-Object { $_.bookingId -eq $bookingId }).Count -ge 1) }
    Check "GET /api/java/bookings/user/{userId} contains the new booking" $found "(status $($r.Status))"
}

if ($dbUp) {
    $r = Invoke-Api GET "/api/java/bookings/TRV-1999-00000"
    Check "GET unknown bookingId returns 404" ($r.Status -eq 404) "(status $($r.Status))"
}

Write-Host "`nResult: $script:passed passed, $script:failed failed"
if ($script:failed -gt 0) { exit 1 } else { exit 0 }
