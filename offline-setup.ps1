# Offline Setup Script for Air-Gapped Windows Machine
# This script sets up the complete development environment without internet access
# Usage: .\offline-setup.ps1

param(
    [string]$InstallerPath = "C:\Installers",
    [string]$InstallPath = "C:\DevTools"
)

Write-Host "=== Offline Development Environment Setup ===" -ForegroundColor Cyan
Write-Host "Installer Path: $InstallerPath" -ForegroundColor Yellow
Write-Host "Install Path: $InstallPath" -ForegroundColor Yellow

# Create install directory
if (-not (Test-Path $InstallPath)) {
    New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
    Write-Host "✓ Created install directory: $InstallPath" -ForegroundColor Green
}

# 1. Install Java 17
Write-Host "`n[1/3] Installing Java 17..." -ForegroundColor Cyan
$javaInstaller = Get-ChildItem -Path $InstallerPath -Filter "*jdk*.msi" -ErrorAction SilentlyContinue
if ($javaInstaller) {
    $msiArgs = @("/i", $javaInstaller.FullName, "/quiet", "INSTALLDIR=$InstallPath\Java17")
    Start-Process msiexec.exe -ArgumentList $msiArgs -Wait -NoNewWindow
    Write-Host "✓ Java 17 installed" -ForegroundColor Green
    [System.Environment]::SetEnvironmentVariable("JAVA_HOME", "$InstallPath\Java17", "Machine")
} else {
    Write-Host "✗ Java 17 installer not found in $InstallerPath" -ForegroundColor Red
}

# 2. Install Node.js 20
Write-Host "`n[2/3] Installing Node.js 20..." -ForegroundColor Cyan
$nodeInstaller = Get-ChildItem -Path $InstallerPath -Filter "*node*.msi" -ErrorAction SilentlyContinue
if ($nodeInstaller) {
    $msiArgs = @("/i", $nodeInstaller.FullName, "/quiet", "INSTALLDIR=$InstallPath\nodejs")
    Start-Process msiexec.exe -ArgumentList $msiArgs -Wait -NoNewWindow
    Write-Host "✓ Node.js 20 installed" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js 20 installer not found in $InstallerPath" -ForegroundColor Red
}

# 3. Setup Playwright binaries
Write-Host "`n[3/3] Setting up Playwright binaries..." -ForegroundColor Cyan
$playwrightCache = Get-ChildItem -Path $InstallerPath -Filter "playwright-cache.zip" -ErrorAction SilentlyContinue
if ($playwrightCache) {
    $playwrightCacheDir = "$env:USERPROFILE\.cache\ms-playwright"
    New-Item -ItemType Directory -Path $playwrightCacheDir -Force | Out-Null
    Expand-Archive -Path $playwrightCache.FullName -DestinationPath $playwrightCacheDir -Force
    Write-Host "✓ Playwright binaries extracted" -ForegroundColor Green
} else {
    Write-Host "✗ Playwright cache not found in $InstallerPath" -ForegroundColor Red
}

# Update PATH for current session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verify installations
Write-Host "`n=== Verification ===" -ForegroundColor Cyan
java -version 2>&1 | Select-Object -First 1
node --version
npm --version

Write-Host "`n✓ Setup Complete! Restart your terminal to apply all changes." -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Navigate to your project folder"
Write-Host "  2. Run: npm install (includes Allure via npm)"
Write-Host "  3. Copy your project's .env file"
Write-Host "  4. Run: npm test"
