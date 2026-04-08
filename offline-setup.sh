#!/bin/bash

# Offline Environment Setup Script for Git Bash (Windows)
# This script sets up the complete development environment without internet access
# Usage: bash ./offline-setup.sh /c/Installers/installers

INSTALLER_PATH="${1:-.}"
INSTALL_PATH="${2:-C:\\DevTools}"

echo "=== Offline Development Environment Setup ==="
echo "Installer Path: $INSTALLER_PATH"
echo "Install Path: $INSTALL_PATH"
echo ""

# Create install directory
mkdir -p "$INSTALL_PATH"
echo "✓ Install directory created: $INSTALL_PATH"

# 1. Install Java 17
echo ""
echo "[1/3] Installing Java 17..."
JAVA_INSTALLER=$(find "$INSTALLER_PATH" -name "*jdk*.msi" 2>/dev/null | head -1)
if [ -n "$JAVA_INSTALLER" ]; then
    echo "Found Java installer: $JAVA_INSTALLER"
    # Convert to Windows path for msiexec
    JAVA_INSTALLER_WIN=$(echo "$JAVA_INSTALLER" | sed 's|/|\\|g' | sed 's|C:\\|C:\\|')
    INSTALL_PATH_WIN=$(echo "$INSTALL_PATH" | sed 's|/|\\|g')
    
    # Note: msiexec requires Windows path format
    cmd /c "msiexec.exe /i \"$JAVA_INSTALLER_WIN\" /quiet INSTALLDIR=\"${INSTALL_PATH_WIN}\\Java17\""
    echo "✓ Java 17 installed"
else
    echo "✗ Java 17 installer not found in $INSTALLER_PATH"
fi

# 2. Install Node.js 20
echo ""
echo "[2/3] Installing Node.js 20..."
NODE_INSTALLER=$(find "$INSTALLER_PATH" -name "*node*.msi" 2>/dev/null | head -1)
if [ -n "$NODE_INSTALLER" ]; then
    echo "Found Node.js installer: $NODE_INSTALLER"
    NODE_INSTALLER_WIN=$(echo "$NODE_INSTALLER" | sed 's|/|\\|g')
    INSTALL_PATH_WIN=$(echo "$INSTALL_PATH" | sed 's|/|\\|g')
    
    cmd /c "msiexec.exe /i \"$NODE_INSTALLER_WIN\" /quiet INSTALLDIR=\"${INSTALL_PATH_WIN}\\nodejs\""
    echo "✓ Node.js 20 installed"
else
    echo "✗ Node.js 20 installer not found in $INSTALLER_PATH"
fi

# 3. Setup Playwright binaries
echo ""
echo "[3/3] Setting up Playwright binaries..."
PLAYWRIGHT_CACHE=$(find "$INSTALLER_PATH" -name "playwright-cache.tar.gz" 2>/dev/null | head -1)
if [ -n "$PLAYWRIGHT_CACHE" ]; then
    echo "Found Playwright cache: $PLAYWRIGHT_CACHE"
    
    # Create cache directory
    PLAYWRIGHT_CACHE_DIR="$HOME/.cache/ms-playwright"
    mkdir -p "$PLAYWRIGHT_CACHE_DIR"
    
    # Extract tar.gz
    echo "Extracting Playwright browsers (this may take a minute)..."
    tar -xzf "$PLAYWRIGHT_CACHE" -C "$PLAYWRIGHT_CACHE_DIR" --strip-components=1
    
    echo "✓ Playwright binaries extracted to $PLAYWRIGHT_CACHE_DIR"
else
    echo "✗ Playwright cache not found in $INSTALLER_PATH"
fi

# Update PATH
export PATH="$INSTALL_PATH/nodejs:$PATH"

# Verify installations
echo ""
echo "=== Verification ==="
java -version 2>&1 | head -1
node --version
npm --version

echo ""
echo "✓ Setup Complete!"
echo ""
echo "Next steps:"
echo "  1. Navigate to your project folder"
echo "  2. Run: npm install (includes Allure via npm)"
echo "  3. Copy your project's .env file"
echo "  4. Run: npm test"
echo ""
echo "Note: You may need to restart Git Bash for PATH changes to take effect."
