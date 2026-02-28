# Check what's running on Firebase emulator ports
$ports = @(9099, 8080, 9399, 5001, 5000, 9199, 8085)

Write-Host "Checking Firebase emulator ports..."
foreach ($port in $ports) {
    try {
        $result = netstat -ano | Select-String ":$port"
        if ($result) {
            Write-Host "Port $port is in use:"
            $result | ForEach-Object { Write-Host "  $_" }
        } else {
            Write-Host "Port $port is free"
        }
    } catch {
        Write-Host "Error checking port $port: $_"
    }
}