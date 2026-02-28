# Set Java environment for current session
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.10.7-hotspot"
$env:PATH = $env:PATH + ";C:\Program Files\Microsoft\jdk-21.0.10.7-hotspot\bin"

Write-Host "Java version:"
java -version

Write-Host "`nStarting Firebase emulators..."
firebase emulators:start