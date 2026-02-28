# Force use Java 21
$java21Path = "C:\Program Files\Microsoft\jdk-21.0.10.7-hotspot"
$java21Bin = "$java21Path\bin"

Write-Host "Setting Java 21 environment..."
$env:JAVA_HOME = $java21Path
$env:PATH = $env:PATH.Replace("C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot\bin", "")
$env:PATH = $java21Bin + ";" + $env:PATH

Write-Host "JAVA_HOME: $env:JAVA_HOME"
Write-Host "Testing Java version:"
& "$java21Bin\java.exe" -version

Write-Host "`nStarting Firebase emulators with Java 21..."
firebase emulators:start