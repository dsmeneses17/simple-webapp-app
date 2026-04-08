# Prepare Offline Environment Bundle for GitHub Release
# This script collects all installers and dependencies into a release bundle

param(
    [string]$BundlePath = "C:\OfflineBundle",
    [string]$ProjectPath = "d:\GitHub repos\simple-webapp-app"
)

Write-Host "=== Offline Environment Bundle Preparation ===" -ForegroundColor Cyan
Write-Host "Bundle output path: $BundlePath" -ForegroundColor Yellow

# Create bundle structure
$bundleStructure = @(
    "$BundlePath\installers",
    "$BundlePath\documentation",
    "$BundlePath\scripts",
    "$BundlePath\node_modules_cache"
)

foreach ($dir in $bundleStructure) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path "$dir" -Force | Out-Null
        Write-Host "✓ Created: $dir" -ForegroundColor Green
    }
}

# 1. Create Playwright cache
Write-Host "`n[1/4] Creating Playwright binaries cache..." -ForegroundColor Cyan
$playwrightCache = "$env:USERPROFILE\.cache\ms-playwright"
if (Test-Path $playwrightCache) {
    $playwrightZip = "$BundlePath\installers\playwright-cache.zip"
    Compress-Archive -Path $playwrightCache -DestinationPath $playwrightZip -Force
    $size = (Get-Item $playwrightZip).Length / 1MB
    Write-Host "✓ Playwright cache archived ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
} else {
    Write-Host "✗ Playwright cache not found. Run: npx playwright install" -ForegroundColor Red
}

# 2. Copy setup script and documentation
Write-Host "`n[2/4] Copying setup files..." -ForegroundColor Cyan
@(
    "offline-setup.ps1",
    "OFFLINE-SETUP.md"
) | ForEach-Object {
    $source = Join-Path $ProjectPath $_
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination "$BundlePath\scripts\" -Force
        Write-Host "✓ Copied: $_" -ForegroundColor Green
    } else {
        Write-Host "✗ Not found: $_" -ForegroundColor Yellow
    }
}

# 3. Create npm cache archive (optional, for faster offline installs)
Write-Host "`n[3/4] Creating npm packages cache..." -ForegroundColor Cyan
$npmCachePath = "$env:APPDATA\npm-cache"
if (Test-Path $npmCachePath) {
    Write-Host "Compressing npm cache (this may take a minute)..." -ForegroundColor Yellow
    $npmCacheZip = "$BundlePath\installers\npm-cache.zip"
    Compress-Archive -Path $npmCachePath -DestinationPath $npmCacheZip -Force
    $size = (Get-Item $npmCacheZip).Length / 1MB
    Write-Host "✓ NPM cache archived ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
} else {
    Write-Host "⚠ NPM cache not found" -ForegroundColor Yellow
}

# 4. Create inventory checklist
Write-Host "`n[4/4] Creating inventory checklist..." -ForegroundColor Cyan
$inventory = @"
# Offline Environment Bundle - Inventory Checklist

## Required Installers (Missing - obtain these manually)
- [ ] `java-17-installer.exe` or newer
- [ ] `node-20-installer.msi` or newer  
- [ ] `allure-installer.exe` v3.4.5 or newer

## Included in Bundle
@"

Get-ChildItem "$BundlePath\installers\*.zip" | ForEach-Object {
    $size = $_.Length / 1MB
    $inventory += "`n- [x] $($_.Name) ($([math]::Round($size, 2)) MB)"
}

$inventory += "`n`n## Setup Instructions`nSee: scripts/OFFLINE-SETUP.md`n"

$inventory | Out-File -FilePath "$BundlePath\BUNDLE-INVENTORY.md" -Encoding UTF8
Write-Host "✓ Created inventory: $BundlePath\BUNDLE-INVENTORY.md" -ForegroundColor Green

# Create GitHub release instructions
$ghInstructions = @"
# GitHub Release Upload Instructions

## 1. Create Release Tag
\`\`\`powershell
git tag -a offline-env-setup-v1.0 -m "Offline environment setup bundle v1.0"
git push origin offline-env-setup-v1.0
\`\`\`

## 2. Create GitHub Release
- Go to: https://github.com/your-repo/releases/new
- Select tag: offline-env-setup-v1.0
- Title: "Offline Environment Setup Bundle v1.0"
- Description: See RELEASE-NOTES.md
- Upload files from: $BundlePath\installers\*.zip
- Upload files from: $BundlePath\scripts\*

## 3. Assets to Upload
From $BundlePath\installers\:
- playwright-cache.zip (Playwright browsers)
- npm-cache.zip (Optional: NPM packages cache)

From $BundlePath\scripts\:
- offline-setup.ps1 (Setup automation script)
- OFFLINE-SETUP.md (Setup instructions)

Plus these manual uploads:
- java-17-installer.exe
- node-20-installer.msi
- allure-installer.exe

## 4. Download & Extract on Air-Gapped Machine
\`\`\`powershell
# Download all release assets
# Extract to: C:\Installers

# Run setup
.\offline-setup.ps1 -InstallerPath "C:\Installers\installers"
\`\`\`

## Total Bundle Size Estimate
- Playwright cache: ~300MB
- NPM cache: ~500-800MB (depends on dependencies)
- Installers: Varies by version
- Total: ~1-1.5GB

## Notes
- Installers (Java, Node, Allure) must be added manually due to size/licensing
- This bundle is specific to project: simple-webapp-app
- For other projects: install compatible versions, then redistribute with updated cache files
"@

$ghInstructions | Out-File -FilePath "$BundlePath\GITHUB-RELEASE-INSTRUCTIONS.md" -Encoding UTF8
Write-Host "✓ Created release instructions: $BundlePath\GITHUB-RELEASE-INSTRUCTIONS.md" -ForegroundColor Green

# Summary
Write-Host "`n=== Bundle Summary ===" -ForegroundColor Cyan
Write-Host "Location: $BundlePath" -ForegroundColor Yellow
Get-ChildItem $BundlePath -Recurse -File | ForEach-Object {
    $size = $_.Length / 1MB
    Write-Host "  $(Resolve-Path -Relative $_) - $([math]::Round($size, 2)) MB"
}

Write-Host "`n✓ Bundle preparation complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Review: $BundlePath\GITHUB-RELEASE-INSTRUCTIONS.md"
Write-Host "  2. Add missing installers to: $BundlePath\installers\"
Write-Host "  3. Upload to GitHub release"
Write-Host "  4. Share release link with team"
