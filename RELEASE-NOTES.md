# Release Checklist: offline-env-setup-v1.0

## ✅ Pre-Release Checklist

### Current Status
- [x] Created `OFFLINE-SETUP.md` - Setup documentation
- [x] Created `offline-setup.ps1` - Automated installer script
- [x] Created `prepare-offline-bundle.ps1` - Bundle preparation script
- [x] Git repository is clean
- [x] All files are up to date with main branch

### TODO Before Release
- [ ] **STEP 1**: Commit new files to git
- [ ] **STEP 2**: Prepare offline bundle (Playwright cache, npm cache)
- [ ] **STEP 3**: Gather all installers
- [ ] **STEP 4**: Create git tag and push to GitHub
- [ ] **STEP 5**: Create GitHub release with assets
- [ ] **STEP 6**: Verify release is downloadable

## 📝 Release Notes

### What's Included in v1.0

**Automated Setup Scripts:**
- Complete PowerShell automation for Java and Node.js installation
- Playwright browser binary cache setup
- Environment path configuration
- Allure installed automatically via npm during `npm install`

**Documentation:**
- Step-by-step offline setup guide
- Troubleshooting section
- Reusability for multiple repositories

**Cached Assets:**
- Playwright browser binaries (Chromium, Firefox, WebKit)

**Supported Versions:**
- Java 17 (jdk-17.0.12_windows-x64_bin.msi)
- Node.js 20.20.2 (node-v20.20.2-x64.msi)
- Allure 3.4.5+ (installed via npm)
- Playwright 1.58.2+ (browser binaries included)

### Use Case
Deploy consistent development environment on air-gapped Windows machines without internet access.
