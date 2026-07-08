# GitHub Setup Guide for Pawn IDE

This guide explains how to setup GitHub Actions for automated APK builds and configure necessary secrets.

## Step 1: Enable Workflows

1. Go to your repository settings: https://github.com/MLArenza/PawnIDE/settings
2. Navigate to **Actions** → **General**
3. Under "Actions permissions", select **Allow all actions and reusable workflows**
4. Save changes

## Step 2: Create Build Workflow

1. Create `.github/workflows/build-apk.yml` with the following content:

```yaml
name: Build APK

on:
  push:
    branches: [main, develop]
    tags: ['v*']
  pull_request:
    branches: [main, develop]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build web app
        run: pnpm run build
      
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      
      - name: Setup Android SDK
        uses: android-actions/setup-android@v3
        with:
          api-level: 26
          build-tools-version: '35.0.0'
      
      - name: Create Android project
        run: |
          mkdir -p android/app/src/main/assets/www
          cp -r dist/public/* android/app/src/main/assets/www/
      
      - name: Build APK
        run: |
          cd android
          ./gradlew assembleRelease
      
      - name: Upload APK as artifact
        uses: actions/upload-artifact@v4
        with:
          name: pawn-ide-apk
          path: android/app/build/outputs/apk/release/*.apk
          retention-days: 30
```

2. Commit and push the workflow file

## Step 3: Setup Secrets for APK Signing (Optional)

For automatic APK signing on releases, add these secrets to your repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

### ANDROID_SIGNING_KEY

Generate a keystore file:

```bash
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias pawnide
```

Encode to base64:

```bash
base64 -i release.keystore -o release.keystore.b64
cat release.keystore.b64
```

Add the output as `ANDROID_SIGNING_KEY` secret.

### ANDROID_KEY_ALIAS

Value: `pawnide` (or whatever alias you used)

### ANDROID_KEYSTORE_PASSWORD

The password you set for the keystore

### ANDROID_KEY_PASSWORD

The password you set for the key

## Step 4: First Build

1. Push a commit to `main` or `develop` branch
2. Go to **Actions** tab
3. The workflow should start automatically
4. Wait for the build to complete
5. Download the APK from artifacts

## Step 5: Create Release (Optional)

To create a release with signed APK:

1. Create a git tag:
```bash
git tag v1.0.0
git push origin v1.0.0
```

2. Go to **Releases** and create a new release
3. The workflow will automatically build and sign the APK
4. Download from the release page

## Troubleshooting

### Workflow not running

- Check if Actions are enabled in repository settings
- Verify the workflow file is in `.github/workflows/` directory
- Check the workflow syntax is valid YAML

### Build fails with "SDK not found"

- This is normal on first run - Android SDK is being downloaded
- Subsequent builds will be faster

### APK not generated

- Check the workflow logs for errors
- Verify `android/` directory structure exists
- Ensure `pnpm run build` completes successfully

### Signing fails

- Verify all secrets are set correctly
- Check keystore password is correct
- Ensure base64 encoding is correct

## Manual Build (Local)

If you prefer to build locally:

```bash
# Install dependencies
pnpm install

# Build web app
pnpm run build

# Build APK
cd android
./gradlew assembleRelease

# Sign APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore release.keystore \
  app/build/outputs/apk/release/app-release-unsigned.apk \
  pawnide

# Align APK
zipalign -v 4 \
  app/build/outputs/apk/release/app-release-unsigned.apk \
  pawn-ide-release.apk
```

## Distribution

### GitHub Releases

1. Create a release tag
2. Upload APK to the release
3. Users can download directly

### Google Play Store

1. Create Google Play Developer account
2. Create app entry
3. Upload signed APK
4. Fill in store listing
5. Submit for review

### Direct Download

Host the APK on your website and users can install directly.

## Security Notes

- Never commit keystore files to git
- Use `.gitignore` to exclude keystore files
- Rotate signing keys periodically
- Use strong passwords for keystores
- Keep secrets secure and rotate them

## Support

For issues with GitHub Actions:
- Check [GitHub Actions documentation](https://docs.github.com/en/actions)
- Review workflow logs for detailed error messages
- Check [Android build documentation](https://developer.android.com/studio/build)
