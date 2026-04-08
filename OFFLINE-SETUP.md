# 🔒 Offline Setup Guide for Air-Gapped Windows Machine

This guide explains how to set up the development environment on an isolated (air-gapped) Windows machine using offline installers and cached dependencies.

## 📋 Prerequisites

Before starting, ensure you have these files/installers ready:

| Component | Version | Notes |
|-----------|---------|-------|
| Java | 17+ | JDK installer (.exe) |
| Node.js | 20+ | MSI installer (.msi) |
| Allure | 3.4.5+ | Installer (.exe) |
| Playwright Cache | 1.58+ | Browser binaries (.zip) |
| Project files | Latest | Source code from GitHub release |

## 🚀 Installation Steps

### Step 1: Prepare Shared Folder Structure

On the **source machine** (with internet), create this structure in your shared folder:

```
\\shared-folder\
├── installers\
│   ├── java-17-installer.exe
│   ├── node-20-installer.msi
│   ├── allure-installer.exe
│   └── playwright-cache.zip
├── project\
│   └── (project source files)
└── README.md
```

### Step 2: Gather Installers on Source Machine

#### Playwright Binaries
```powershell
# On source machine with internet:
npm install @playwright/test@1.58.2
npx playwright install chromium firefox webkit

# Archive the cache
$playwrightCache = "$env:USERPROFILE\.cache\ms-playwright"
Compress-Archive -Path $playwrightCache -DestinationPath "\\shared-folder\installers\playwright-cache.zip" -Force
```

#### Project Files
```powershell
# Copy entire project to shared folder
Copy-Item -Path "d:\GitHub repos\simple-webapp-app\*" -Destination "\\shared-folder\project\" -Recurse -Exclude node_modules,dist,.git
```

### Step 3: Transfer to Air-Gapped Machine

1. Use USB drive, external HDD, or network share to transfer the `\\shared-folder` contents
2. Copy everything to a local path on the target machine (e.g., `C:\Installers`)

### Step 4: Run Setup Script

On the **air-gapped machine**:

```powershell
# Run as Administrator
cd C:\Installers
.\offline-setup.ps1 -InstallerPath "C:\Installers\installers" -InstallPath "C:\DevTools"
```

**Or manual installation** if you prefer:

#### Install Java 17
```powershell
& "C:\Installers\installers\java-17-installer.exe" /s INSTALLDIR="C:\DevTools\Java17"
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\DevTools\Java17", "Machine")
```

#### Install Node.js 20
```powershell
$msiArgs = @(
    "/i"
    "C:\Installers\installers\node-20-installer.msi"
    "/quiet"
    "INSTALLDIR=C:\DevTools\nodejs"
)
Start-Process msiexec.exe -ArgumentList $msiArgs -Wait -NoNewWindow
```

#### Install Allure
```powershell
& "C:\Installers\installers\allure-installer.exe" /S /D="C:\DevTools\Allure"
```

#### Setup Playwright Cache
```powershell
$playwrightCacheDir = "$env:USERPROFILE\.cache\ms-playwright"
New-Item -ItemType Directory -Path $playwrightCacheDir -Force | Out-Null
Expand-Archive -Path "C:\Installers\installers\playwright-cache.zip" -DestinationPath $playwrightCacheDir -Force
```

### Step 5: Verify Installation

Restart PowerShell and run:

```powershell
java -version
node --version
npm --version
allure --version
```

All should display their respective versions without errors.

### Step 6: Setup Project

```powershell
# Navigate to project folder
cd "C:\path\to\project"

# Install npm dependencies (uses npm cache)
npm install

# Copy and configure environment variables
Copy-Item -Path ".env.example" -Destination ".env"
# Edit .env with your database credentials and settings

# Verify tests run
npm test
```

## 📦 Environment Setup for Reusability

To use this setup across multiple repositories:

### Option A: Shared Installation Directory (Recommended)

1. Keep all tools in `C:\DevTools\`
2. Add to system PATH:
   - `C:\DevTools\nodejs\bin`
   - `C:\DevTools\Java17\bin`
   - `C:\DevTools\Allure\bin`

### Option B: Environment Variables

Create a `setup-env.ps1` in each project that loads the system environment:

```powershell
# This is sourced by each project's setup
$env:JAVA_HOME = "C:\DevTools\Java17"
$env:Path = "C:\DevTools\nodejs\bin;C:\DevTools\Allure\bin;$env:Path"
```

## ⚙️ NPM Cache for Offline Dependency Installation

To install npm packages offline on the air-gapped machine:

### On Source Machine (with internet)

```powershell
# Install all dependencies from your projects
npm install

# Archive the npm cache
tar -czf npm-cache.tar.gz $env:APPDATA\npm-cache
```

### On Air-Gapped Machine

```powershell
# Extract cache
tar -xzf npm-cache.tar.gz -C $env:APPDATA

# When installing, npm will use cached packages
npm install --offline
```

Or use **npm ci with locked dependencies**:

```powershell
# Ensure package-lock.json is included
npm ci --offline
```

## 🔄 Updating Environment

To update versions:

1. Update `package.json` with new versions
2. On source machine, regenerate:
   - Playwright cache (if Playwright version changes)
   - NPM cache (if dependencies change)
3. Transfer updated archives to air-gapped machine
4. Repeat installation steps

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm not found` | Add Node.js bin folder to PATH |
| `Playwright browsers not found` | Ensure `ms-playwright` cache is extracted to `%USERPROFILE%\.cache\` |
| `Java not found` | Verify `JAVA_HOME` environment variable is set |
| `npm install fails` | Copy pre-cached `node_modules` or use `npm ci` with `package-lock.json` |

## 📝 Notes

- All paths are examples; adjust to your environment
- PowerShell execution policy may need adjustment: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Test thoroughly before deploying to production environments
- Keep offline bundles organized with version numbers for multiple environment versions
