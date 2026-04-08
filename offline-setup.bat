@echo off
REM Offline Environment Setup Script for Windows Batch
REM This script sets up the complete development environment without internet access
REM Usage: offline-setup.bat C:\Installers\installers

setlocal enabledelayedexpansion

set INSTALLER_PATH=%1
set INSTALL_PATH=%2

if "%INSTALLER_PATH%"=="" (
    set INSTALLER_PATH=.
)

if "%INSTALL_PATH%"=="" (
    set INSTALL_PATH=C:\DevTools
)

color 0B
echo.
echo ==== Offline Development Environment Setup ====
echo Installer Path: %INSTALLER_PATH%
echo Install Path: %INSTALL_PATH%
echo.

REM Create install directory
if not exist "%INSTALL_PATH%" mkdir "%INSTALL_PATH%"
echo + Install directory created: %INSTALL_PATH%

REM 1. Install Java 17
echo.
echo [1/3] Installing Java 17...
for %%f in ("%INSTALLER_PATH%\*jdk*.msi") do (
    if exist "%%f" (
        echo Found Java installer: %%f
        msiexec.exe /i "%%f" /quiet INSTALLDIR="%INSTALL_PATH%\Java17"
        setx JAVA_HOME "%INSTALL_PATH%\Java17" /M
        echo + Java 17 installed
        goto java_done
    )
)
echo - Java 17 installer not found in %INSTALLER_PATH%
:java_done

REM 2. Install Node.js 20
echo.
echo [2/3] Installing Node.js 20...
for %%f in ("%INSTALLER_PATH%\*node*.msi") do (
    if exist "%%f" (
        echo Found Node.js installer: %%f
        msiexec.exe /i "%%f" /quiet INSTALLDIR="%INSTALL_PATH%\nodejs"
        echo + Node.js 20 installed
        goto node_done
    )
)
echo - Node.js 20 installer not found in %INSTALLER_PATH%
:node_done

REM 3. Setup Playwright binaries
echo.
echo [3/3] Setting up Playwright binaries...
if exist "%INSTALLER_PATH%\PlaywrightBrowsers" (
    echo Found extracted Playwright browsers
    
    set PLAYWRIGHT_CACHE_DIR=%USERPROFILE%\.cache\ms-playwright
    if not exist "!PLAYWRIGHT_CACHE_DIR!" mkdir "!PLAYWRIGHT_CACHE_DIR!"
    
    REM Copy browser files (they should already be extracted from tar.gz)
    xcopy "%INSTALLER_PATH%\PlaywrightBrowsers\*" "!PLAYWRIGHT_CACHE_DIR!\" /E /I /Y
    echo + Playwright binaries copied
) else (
    echo Note: Please extract playwright-cache.tar.gz first
    echo Run in Git Bash: tar -xzf playwright-cache.tar.gz
)

REM Verify installations
echo.
echo ==== Verification ====
java -version
node --version
npm --version

echo.
echo + Setup Complete!
echo.
echo Next steps:
echo   1. Navigate to your project folder
echo   2. Run: npm install (includes Allure via npm)
echo   3. Copy your project's .env file
echo   4. Run: npm test
echo.
echo Note: You may need to restart your terminal for PATH changes to take effect.
pause
