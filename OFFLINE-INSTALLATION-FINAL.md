# Offline Installation - Final Setup Checklist

## ✅ You Already Have

- [x] `jdk-17.0.12_windows-x64_bin.msi`
- [x] `node-v20.20.2-x64.msi`
- [x] `playwright-cache.tar.gz`
- [x] `offline-setup.ps1` (setup script)
- [x] `OFFLINE-SETUP.md` (documentation)
- [x] Project source code

## ⏳ What You Still Need to Do

### Step 1: Prepare Directories

```powershell
# Create installation directory
mkdir "C:\Installers" -Force
mkdir "C:\Installers\installers" -Force

# Move all downloaded files to C:\Installers\installers\
# Result should be:
#   C:\Installers\installers\jdk-17.0.12_windows-x64_bin.msi
#   C:\Installers\installers\node-v20.20.2-x64.msi
#   C:\Installers\installers\playwright-cache.tar.gz
#   C:\Installers\installers\offline-setup.ps1
```

### Step 2: Extract Playwright Cache (CRITICAL)

**⚠️ IMPORTANT:** The playwright-cache.tar.gz must be extracted BEFORE running the setup script.

```powershell
# Navigate to installers folder
cd "C:\Installers\installers"

# Extract the tar.gz file
tar -xzf playwright-cache.tar.gz

# This creates: C:\Installers\installers\PlaywrightBrowsers\
# Result should contain:
#   - chromium-1208/
#   - firefox-1509/
#   - webkit-2248/
#   - ffmpeg-1011/
#   - winldd-1007/
```

### Step 3: Run Setup Script (Run as Administrator)

```powershell
# Open PowerShell as Administrator

# Navigate to installers
cd "C:\Installers\installers"

# Run the setup script
.\offline-setup.ps1 -InstallerPath "C:\Installers\installers"

# This will:
# ✓ Install Java 17
# ✓ Install Node.js 20
# ✓ Copy Playwright browsers to correct cache location
```

### Step 4: Verify Installations

```powershell
# Check Java
java -version

# Check Node & npm
node --version
npm --version

# Output should show:
# java version "17.x.x"
# v20.20.2
# 9.x.x (or your npm version)
```

### Step 5: Setup Project

```powershell
# Navigate to your project folder
cd "D:\your-project-path"  # or wherever you copied the project

# Install npm dependencies (this installs Allure + all packages)
npm install

# This will download packages from npm cache if available, or use what's in package-lock.json
```

### Step 6: Configure Environment

```powershell
# Copy environment template
Copy-Item ".env.example" ".env"

# Edit .env with your values
notepad .env

# Required minimal values:
# DB_HOST=your-db-host
# DB_PORT=1521
# DB_USER=your-user
# DB_PASS=your-password
```

### Step 7: Test Installation

```powershell
# Run a single test to verify everything works
npm test -- tests/unit/env-config.spec.ts

# Or run all tests
npm test
```

---

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| `java not found` | Restart PowerShell after running setup script |
| `npm install fails` | Ensure `npm ci` is used instead if package-lock.json exists |
| `Playwright browsers not found` | Verify `C:\Users\[username]\.cache\ms-playwright\` contains browser folders |
| `Setup script permission denied` | Run PowerShell as Administrator |
| `.env file not found` | Copy `.env.example` to `.env` first |

---

## 📋 Quick Checklist for Offline Machine

- [ ] All 3 asset files downloaded to isolated machine
- [ ] Files copied to `C:\Installers\installers\`
- [ ] Extracted `playwright-cache.tar.gz` to same directory
- [ ] Ran `offline-setup.ps1` as Administrator
- [ ] Verified `java --version` works
- [ ] Verified `node --version` works
- [ ] Verified `npm --version` works
- [ ] Project source code copied to machine
- [ ] Ran `npm install` in project folder
- [ ] Created `.env` file from `.env.example`
- [ ] Ran `npm test` successfully

---

## 🎯 Expected Results

After completing all steps, you should have:

✅ Java 17 JDK installed  
✅ Node.js 20.20.2 installed  
✅ Playwright browsers cached locally  
✅ npm dependencies installed (Allure 3.4.5+)  
✅ All E2E tests working  
✅ Allure reporting functional  
✅ No internet required (completely offline)

---

## 💾 Final Verification Command

Run this in your project folder to confirm everything:

```powershell
Write-Host "=== System Verification ===" -ForegroundColor Cyan
Write-Host "Java:" $(java -version 2>&1 | Select-Object -First 1)
Write-Host "Node:" $(node --version)
Write-Host "npm:" $(npm --version)
Write-Host "Playwright:" $(npx playwright --version)
Write-Host ""
Write-Host "Running a test..."
npm test -- tests/unit/env-config.spec.ts
```

If all commands succeed without errors, your offline environment is ready! ✅
