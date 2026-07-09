# GitHub Setup Guide for Pawn IDE

This guide explains how to setup GitHub Actions for automated APK builds and configure necessary secrets.

## Step 1: Enable Workflows Permission

⚠️ **IMPORTANT**: GitHub Apps need special permission to create/update workflows.

1. Go to your repository settings: https://github.com/MLArenza/PawnIDE/settings
2. Navigate to **Actions** → **General**
3. Under "Actions permissions", select **Allow all actions and reusable workflows**
4. Scroll down to **Workflow permissions**
5. Select **Read and write permissions**
6. Check **Allow GitHub Actions to create and approve pull requests**
7. Save changes

## Step 2: Create Build Workflow File

Since GitHub Apps have restrictions, create the workflow file manually:

1. Go to your repository: https://github.com/MLArenza/PawnIDE
2. Click **Add file** → **Create new file**
3. Enter filename: `.github/workflows/build-apk.yml`
4. Copy and paste the following content:

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
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: latest
      
      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
      
      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
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
      
      - name: Create Android assets directory
        run: |
          mkdir -p android/app/src/main/assets/www
          cp -r dist/public/* android/app/src/main/assets/www/
      
      - name: Make gradlew executable
        run: chmod +x android/gradlew
      
      - name: Build APK
        run: |
          cd android
          ./gradlew assembleRelease --stacktrace
      
      - name: Upload APK as artifact
        if: success()
        uses: actions/upload-artifact@v4
        with:
          name: pawn-ide-apk
          path: android/app/build/outputs/apk/release/*.apk
          retention-days: 30
      
      - name: Create Release (on tag)
        if: startsWith(github.ref, 'refs/tags/')
        uses: softprops/action-gh-release@v1
        with:
          files: android/app/build/outputs/apk/release/*.apk
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

5. Click **Commit changes**
6. Select **Commit directly to the main branch**
7. Click **Commit changes**

## Step 3: Verify Workflow Setup

1. Go to **Actions** tab in your repository
2. You should see "Build APK" workflow listed
3. Click on it to see workflow details

## Step 4: Trigger First Build

Choose one of these methods:

### Option A: Push to main branch
```bash
git commit --allow-empty -m "trigger: First workflow build"
git push origin main
```

### Option B: Create a release tag
```bash
git tag v1.0.0
git push origin v1.0.0
```

### Option C: Manual trigger
1. Go to **Actions** tab
2. Click **Build APK** workflow
3. Click **Run workflow** button
4. Select branch and click **Run workflow**

## Step 5: Monitor Build

1. Go to **Actions** tab
2. Click the running workflow
3. Watch the build progress in real-time
4. Check logs if there are errors

## Step 6: Download APK

After successful build:

1. Go to **Actions** → **Build APK** → Latest run
2. Scroll down to **Artifacts** section
3. Click **pawn-ide-apk** to download
4. Extract the ZIP file to get the APK

## Troubleshooting

### Workflow not appearing

- Verify workflow permissions are set to "Read and write"
- Check if `.github/workflows/build-apk.yml` file exists
- Wait 1-2 minutes for GitHub to recognize the workflow

### Build fails with "pnpm not found"

✅ **This is now fixed!** The workflow includes:
```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v2
  with:
    version: latest
```

This automatically installs pnpm before running `pnpm install`.

### Build fails with "Android SDK not found"

This is normal on first run. The workflow:
1. Downloads Android SDK (takes ~5-10 minutes)
2. Caches it for faster subsequent builds
3. Subsequent builds will be much faster

### gradlew permission denied

The workflow includes:
```yaml
- name: Make gradlew executable
  run: chmod +x android/gradlew
```

This automatically fixes permission issues.

### Build succeeds but no APK generated

Check the workflow logs for errors in:
1. Web app build (`pnpm run build`)
2. Android asset copying
3. Gradle build step

## Setup Secrets for APK Signing (Optional)

For automatic APK signing on releases:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

### ANDROID_SIGNING_KEY

Generate a keystore file locally:

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

## Manual Build (Local)

If you prefer to build locally instead of using GitHub Actions:

```bash
# Install dependencies
pnpm install

# Build web app
pnpm run build

# Build APK
cd android
./gradlew assembleRelease

# Sign APK (optional)
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

1. Create a release tag: `git tag v1.0.0 && git push origin v1.0.0`
2. Workflow automatically builds and uploads APK
3. Users can download from Releases page

### Google Play Store

1. Create Google Play Developer account
2. Create app entry
3. Upload signed APK
4. Fill in store listing
5. Submit for review

### Direct Download

Host the APK on your website for direct download.

## Support

For issues:
- Check [GitHub Actions documentation](https://docs.github.com/en/actions)
- Review workflow logs for detailed error messages
- Check [Android build documentation](https://developer.android.com/studio/build)
- Check [pnpm documentation](https://pnpm.io/)
