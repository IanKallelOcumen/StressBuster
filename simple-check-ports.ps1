# Check what's running on Firebase emulator ports
$ports = @(9099, 8080, 9399, 5001, 5000, 9199, 8085)

Write-Host "Checking Firebase emulator ports..."
foreach ($port in $ports) {
    Write-Host "Checking port $port..."
    netstat -ano | Select-String ":$port"
}