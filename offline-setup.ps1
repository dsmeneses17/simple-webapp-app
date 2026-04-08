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
Write-Host "`n[1/4] Installing Java 17..." -ForegroundColor Cyan
$javaInstaller = Get-ChildItem -Path $InstallerPath -Filter "*java*17*.exe" -ErrorAction SilentlyContinue
if ($javaInstaller) {
    & $javaInstaller.FullName /s INSTALLDIR="$InstallPath\Java17"
    Write-Host "✓ Java 17 installed" -ForegroundColor Green
    [System.Environment]::SetEnvironmentVariable("JAVA_HOME", "$InstallPath\Java17", "Machine")
} else {
    Write-Host "✗ Java 17 installer not found in $InstallerPath" -ForegroundColor Red
}

# 2. Install Node.js 20
Write-Host "`n[2/4] Installing Node.js 20..." -ForegroundColor Cyan
$nodeInstaller = Get-ChildItem -Path $InstallerPath -Filter "*node*20*.msi" -ErrorAction SilentlyContinue
if ($nodeInstaller) {
    $msiArgs = @(
        "/i"
        $nodeInstaller.FullName
        "/quiet"
        "INSTALLDIR=$InstallPath\nodejs"
        "ADDLOCAL=NodeProgramFiles,NodeVS2015Natives,NodeEtwReg,npm"
    )
    Start-Process msiexec.exe -ArgumentList $msiArgs -Wait -NoNewWindow
    Write-Host "✓ Node.js 20 installed" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js 20 installer not found in $InstallerPath" -ForegroundColor Red
}

# 3. Install Allure
Write-Host "`n[3/4] Installing Allure..." -ForegroundColor Cyan
$allureInstaller = Get-ChildItem -Path $InstallerPath -Filter "*allure*.exe" -ErrorAction SilentlyContinue
if ($allureInstaller) {
    & $allureInstaller.FullName /S /D="$InstallPath\Allure"
    Write-Host "✓ Allure installed" -ForegroundColor Green
} else {
    Write-Host "✗ Allure installer not found in $InstallerPath" -ForegroundColor Red
}

# 4. Setup Playwright cache
Write-Host "`n[4/4] Setting up Playwright binaries..." -ForegroundColor Cyan
$playwrightCache = Get-ChildItem -Path $InstallerPath -Filter "playwright-cache.zip" -ErrorAction SilentlyContinue
if ($playwrightCache) {
    $playwrightCacheDir = "$env:USERPROFILE\.cache\ms-playwright"
    New-Item -ItemType Directory -Path $playwrightCacheDir -Force | Out-Null
    Expand-Archive -Path $playwrightCache.FullName -DestinationPath $playwrightCacheDir -Force
    Write-Host "✓ Playwright binaries extracted to $playwrightCacheDir" -ForegroundColor Green
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
allure --version

Write-Host "`n✓ Setup Complete! Restart your terminal to apply all changes." -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Restart PowerShell as Administrator"
Write-Host "  2. Navigate to your project folder"
Write-Host "  3. Run: npm install"
Write-Host "  4. Copy your project's .env file"
Write-Host "  5. Run: npm test"
