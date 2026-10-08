$toolsDir = "C:\Users\abc\Desktop\BharatSponge\.tools"
if (-not (Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Path $toolsDir -Force | Out-Null
}
$zipPath = Join-Path $toolsDir "maven.zip"
$mavenHome = Join-Path $toolsDir "apache-maven-3.9.9"

if (-not (Test-Path $mavenHome)) {
    Write-Host "Downloading Apache Maven 3.9.9..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/apache-maven-3.9.9-bin.zip" -OutFile $zipPath
    Write-Host "Extracting Maven..."
    Expand-Archive -Path $zipPath -DestinationPath $toolsDir -Force
    Remove-Item $zipPath -Force
}

$mvnCmd = Join-Path $mavenHome "bin\mvn.cmd"
Write-Host "Maven ready at: $mvnCmd"
& $mvnCmd -v
