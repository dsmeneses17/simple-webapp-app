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
Write-Host "`n[1/2] Creating Playwright binaries cache..." -ForegroundColor Cyan
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
Write-Host "`n[2/2] Copying setup files..." -ForegroundColor Cyan
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

# Create inventory checklist
Write-Host "`nCreating inventory checklist..." -ForegroundColor Cyan
$inventory = @"
# Offline Environment Bundle - Inventory Checklist

## Required Installers (Must place in installers/ folder)
- [ ] `jdk-17.0.12_windows-x64_bin.msi` (Java Development Kit 17)
- [ ] `node-v20.20.2-x64.msi` (Node.js 20)

## Included in Bundle
@"

Get-ChildItem "$BundlePath\installers\*.zip" | ForEach-Object {
    $size = $_.Length / 1MB
    $inventory += "`n- [x] $($_.Name) ($([math]::Round($size, 2)) MB)"
}

$inventory += "`n`n## Notes`n- Allure is installed via npm (included in project dependencies)`n- Playwright browser binaries are included in this bundle`n`n## Setup Guide`nSee: scripts/OFFLINE-SETUP.md`n"

$inventory | Out-File -FilePath "$BundlePath\BUNDLE-INVENTORY.md" -Encoding UTF8
Write-Host "✓ Created inventory: $BundlePath\BUNDLE-INVENTORY.md" -ForegroundColor Green

# Create GitHub release instructions
$ghInstructions = @"
# GitHub Release Upload Instructions

## 1. Prepare Installers
Before uploading, ensure these files are in $BundlePath\installers\:
- jdk-17.0.12_windows-x64_bin.msi
- node-v20.20.2-x64.msi

(These installers are not included in the bundle due to size/licensing)

## 2. Create Release Tag
\`\`\`powershell
git tag -a offline-env-setup-v1.0 -m "Offline environment setup bundle v1.0"
git push origin offline-env-setup-v1.0
\`\`\`

## 3. Create GitHub Release
- Go to: https://github.com/your-repo/releases/new
- Select tag: offline-env-setup-v1.0
- Title: "Offline Environment Setup Bundle v1.0"
- Description: See RELEASE-NOTES.md
- Upload files from: $BundlePath\installers\*.zip
- Upload files from: $BundlePath\installers\*.msi
- Upload files from: $BundlePath\scripts\*

## 4. Assets to Upload
From $BundlePath\installers\:
- playwright-cache.zip (Playwright browsers - ~300MB)
- jdk-17.0.12_windows-x64_bin.msi (Java - ~160MB)
- node-v20.20.2-x64.msi (Node.js - ~80MB)

From $BundlePath\scripts\:
- offline-setup.ps1 (Setup automation script)
- OFFLINE-SETUP.md (Setup instructions)

## 5. Download & Extract on Air-Gapped Machine
\`\`\`powershell
# Download all release assets to: C:\Installers

# Run setup
.\offline-setup.ps1 -InstallerPath "C:\Installers"
\`\`\`

## Total Bundle Size Estimate
- Playwright cache: ~300MB
- Java 17 JDK: ~160MB
- Node.js 20: ~80MB
- Total: ~540MB

## Notes
- Allure is installed via npm (3.4.5+)
- This bundle is for project: simple-webapp-app
- For other projects with same versions: reuse this bundle
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
