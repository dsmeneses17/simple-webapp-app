# Offline Setup with Git Bash - Step by Step

This guide is for Windows machines with **only Git Bash** available (no PowerShell).

## 📋 What You Need

**On the offline machine:**
- Git Bash installed (comes with Git for Windows)
- All 3 asset files downloaded:
  - `jdk-17.0.12_windows-x64_bin.msi`
  - `node-v20.20.2-x64.msi`
  - `playwright-cache.tar.gz`
- Setup scripts:
  - `offline-setup.sh` (bash script)
  - `offline-setup.bat` (batch script - alternative)
- Project source code

---

## 🚀 Step-by-Step Installation

### Step 1: Organize Your Files

Open Git Bash and create the directory structure:

```bash
# Create installation directory
mkdir -p /c/Installers/installers
cd /c/Installers/installers

# You should have these files here:
# jdk-17.0.12_windows-x64_bin.msi
# node-v20.20.2-x64.msi
# playwright-cache.tar.gz
# offline-setup.sh

ls -lh
```

### Step 2: Extract Playwright Cache (CRITICAL)

**⚠️ This is required before running the setup script!**

```bash
# Make sure you're in the installers directory
cd /c/Installers/installers

# Extract the tar.gz file
tar -xzf playwright-cache.tar.gz

# Verify extraction - should see browser folders
ls -la

# Expected output:
# chromium-1208/
# firefox-1509/
# webkit-2248/
# ffmpeg-1011/
# ...
```

The tar command will create a `PlaywrightBrowsers/` folder with all the browser binaries.

### Step 3: Make Setup Script Executable

```bash
# Make the script executable
chmod +x offline-setup.sh

# Verify it's executable
ls -la offline-setup.sh
# Should show: -rwxr-xr-x (with 'x' permissions)
```

### Step 4: Run the Setup Script

**Option A: Using Git Bash (Recommended)**

```bash
# Run from Git Bash
bash ./offline-setup.sh /c/Installers/installers

# The script will:
# 1. Find and install Java 17 JDK
# 2. Find and install Node.js 20
# 3. Setup Playwright browser cache
```

**Option B: Using Batch Script (Alternative)**

```bash
# Or run the batch file instead (may require admin)
cmd /c offline-setup.bat C:\Installers\installers
```

### Step 5: Verify Installations

After the script completes, verify everything works:

```bash
# Check Java version
java -version

# Check Node.js version
node --version

# Check npm version
npm --version

# Check Playwright (should be installed by npm later)
npx playwright --version
```

All three commands should return version numbers without errors.

### Step 6: Setup Your Project

```bash
# Navigate to your project directory
cd /d/your-project-path
# or wherever you stored the project

# Install npm dependencies
# This will install: Allure, Playwright, and all project dependencies
npm install

# Verify Allure was installed
npm list allure
```

### Step 7: Configure Environment Variables

```bash
# Create .env file from template
cp .env.example .env

# Edit .env with your settings (use your editor)
# For example: nano .env or vim .env
# 
# Required settings:
# DB_HOST=your-db-server
# DB_PORT=1521
# DB_USER=your-username
# DB_PASS=your-password
```

### Step 8: Run Tests

```bash
# Run all tests
npm test

# Or run specific test file
npm test tests/unit/env-config.spec.ts

# Or run E2E tests only
npm run test:e2e

# Or run unit tests only
npm run test:unit
```

---

## 🔧 Troubleshooting with Git Bash

| Problem | Solution |
|---------|----------|
| `tar: command not found` | Git Bash includes tar. If missing, use Windows 11's built-in tar |
| `java not found` | Restart Git Bash after setup. Or add manually: `export PATH="/c/DevTools/Java17/bin:$PATH"` |
| `npm not found` | Restart Git Bash. Or add: `export PATH="/c/DevTools/nodejs:$PATH"` |
| `Permission denied: offline-setup.sh` | Run: `chmod +x offline-setup.sh` first |
| `Playwright browsers not recognized` | Verify extraction: `ls ~/.cache/ms-playwright/` should show browser folders |
| `msiexec.exe not found` | msiexec is Windows-only. Try running: `cmd /c msiexec.exe ... ` |

---

## 📝 Multi-Line Git Bash Tips

### Installing from Git Bash

If you need to manually install without the script:

```bash
# Install Java (using Git Bash to call Windows installer)
cmd /c "msiexec.exe /i C:\Installers\installers\jdk-17.0.12_windows-x64_bin.msi /quiet"

# Install Node.js
cmd /c "msiexec.exe /i C:\Installers\installers\node-v20.20.2-x64.msi /quiet"

# Set Java environment variable
export JAVA_HOME="/c/Program Files/Java/jdk-17.0.12"
export PATH="$JAVA_HOME/bin:$PATH"
```

### Manual Playwright Setup

If needed:

```bash
# Create cache directory
mkdir -p ~/.cache/ms-playwright

# Copy PlaywrightBrowsers to cache
cp -r /c/Installers/installers/PlaywrightBrowsers/* ~/.cache/ms-playwright/

# Verify
ls ~/.cache/ms-playwright/
```

---

## ✅ Verification Checklist

After all steps, run this to confirm everything:

```bash
#!/bin/bash
echo "=== System Verification ==="
echo "Java: $(java -version 2>&1 | head -1)"
echo "Node: $(node --version)"
echo "npm: $(npm --version)"
echo "Playwright: $(npx playwright --version)"
echo ""
echo "Playwright cache:"
ls ~/.cache/ms-playwright/ | head -3
echo ""
echo "Your installation is ready! ✓"
```

---

## 🎯 Expected Final Result

After completing all steps:

- ✅ Java 17 JDK installed and accessible via `java` command
- ✅ Node.js 20 installed and accessible via `node` command
- ✅ npm working and can install packages
- ✅ Playwright browsers cached locally at `~/.cache/ms-playwright/`
- ✅ Project dependencies installed (including Allure)
- ✅ `.env` file configured
- ✅ Tests running successfully
- ✅ **NO INTERNET REQUIRED** - completely offline

---

## 🚨 If Something Goes Wrong

### Check Git Bash Path

```bash
# See current PATH
echo $PATH

# Add to PATH if needed
export PATH="/c/Program Files/nodejs:/c/Program Files/Java/jdk-17.0.12/bin:$PATH"
```

### Check File Permissions

```bash
# Make sure all scripts are executable
chmod +x *.sh

# List all scripts
ls -la *.sh
```

### Verify Playwright Cache Location

```bash
# Correct location on Windows with Git Bash
ls ~/.cache/ms-playwright/

# Should show these directories:
# chromium-1208/
# firefox-1509/
# webkit-2248/
```

### Run Setup Script with Verbose Output

```bash
# Run with debug output
bash -x offline-setup.sh /c/Installers/installers

# This shows each command being executed
```

---

## 📞 Final Command Reference

```bash
# Quick reference for common commands

# Extract Playwright
tar -xzf playwright-cache.tar.gz

# Run setup
bash offline-setup.sh /c/Installers/installers

# Verify installation
java -version && node --version && npm --version

# Install project
npm install

# Run tests
npm test

# View Allure reports
npm run allure:serve
```

---

**You're all set! Your offline environment is now ready to use.** 🎉
