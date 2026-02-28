# Install Java 21 for Firebase emulators
Write-Host "Installing Java 21 for Firebase emulators..."

# Try to install Java 21 silently
try {
    winget install Microsoft.OpenJDK.21 --silent
    Write-Host "Java 21 installation completed"
} catch {
    Write-Host "Java 21 installation may require manual approval, but let's try to use existing Java 17 for now"
}

# Set Java environment variables for current session
$javaPath = "C:\Program Files\Microsoft\jdk-21.0.10.7-hotspot"
$javaBinPath = "$javaPath\bin"

# Check if Java 21 exists, if not fall back to Java 17
if (!(Test-Path $javaBinPath)) {
    $javaPath = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
    $javaBinPath = "$javaPath\bin"
    Write-Host "Using Java 17 as fallback"
}

# Set environment variables for current session
$env:JAVA_HOME = $javaPath
$env:PATH = $env:PATH + ";$javaBinPath"

Write-Host "JAVA_HOME set to: $env:JAVA_HOME"
Write-Host "Testing Java version:"
& "$javaBinPath\java.exe" -version

Write-Host "Environment setup complete. You can now run: firebase emulators:start"