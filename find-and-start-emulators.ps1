# Check available Java installations
Write-Host "Checking for Java installations..."

# Common Java installation paths
$javaPaths = @(
    "C:\Program Files\Microsoft\jdk-21.0.10.7-hotspot",
    "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot",
    "C:\Program Files\Java\jdk-21*",
    "C:\Program Files\Java\jdk-17*"
)

$foundJava = $null
foreach ($path in $javaPaths) {
    if (Test-Path $path) {
        $javaExe = Join-Path $path "bin\java.exe"
        if (Test-Path $javaExe) {
            Write-Host "Found Java at: $path"
            $version = & $javaExe -version 2>&1
            Write-Host "Version: $version"
            
            # Check if version is 21 or higher
            if ($version -match "version \"21\." -or $version -match "version \"2[2-9]\.") {
                Write-Host "✅ Java 21+ found!"
                $foundJava = $path
                break
            }
        }
    }
}

if ($foundJava) {
    Write-Host "`nUsing Java at: $foundJava"
    $env:JAVA_HOME = $foundJava
    $env:PATH = $env:PATH + ";$foundJava\bin"
    
    Write-Host "Testing Java version:"
    java -version
    
    Write-Host "`nStarting Firebase emulators..."
    firebase emulators:start
} else {
    Write-Host "❌ No Java 21+ installation found. Please install Java 21 or higher."
    Write-Host "You can install it with: winget install Microsoft.OpenJDK.21"
}