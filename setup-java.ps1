# Set Java environment variables for Firebase emulators
$javaPath = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
$javaBinPath = "$javaPath\bin"

# Set JAVA_HOME
[Environment]::SetEnvironmentVariable("JAVA_HOME", $javaPath, "User")

# Add to PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($currentPath -notlike "*$javaBinPath*") {
    [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$javaBinPath", "User")
    Write-Host "Java PATH added successfully"
} else {
    Write-Host "Java PATH already exists"
}

Write-Host "JAVA_HOME: $([Environment]::GetEnvironmentVariable("JAVA_HOME", "User"))"
Write-Host "Java version:"
& "$javaBinPath\java.exe" -version