# Pawn IDE - Android Build Guide

This guide explains how to build and deploy Pawn IDE as an Android application.

## Prerequisites

- Node.js 18+ and pnpm
- Java Development Kit (JDK) 11+
- Android SDK (API 26+)
- Android Build Tools 35.0.0+
- Gradle 8.0+

## Build Process

### 1. Build Web App

```bash
pnpm install
pnpm run build
```

This creates the optimized web app in `dist/public/`.

### 2. Copy Web Assets to Android

```bash
mkdir -p android/app/src/main/assets/www
cp -r dist/public/* android/app/src/main/assets/www/
```

### 3. Build APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be generated in `android/app/build/outputs/apk/release/`.

### 4. Sign APK (for release)

Create a keystore file:

```bash
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias pawnide
```

Sign the APK:

```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore release.keystore \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  pawnide
```

Align the APK:

```bash
zipalign -v 4 \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  pawn-ide-release.apk
```

## GitHub Actions Automated Build

The project includes a GitHub Actions workflow (`.github/workflows/build-apk.yml`) that automatically builds the APK when you:

1. Push to `main` or `develop` branch
2. Create a release tag (e.g., `v1.0.0`)
3. Manually trigger via workflow_dispatch

### Setup for Automated Signing

To enable automatic APK signing in GitHub Actions, add these secrets to your repository:

- `ANDROID_SIGNING_KEY`: Base64-encoded keystore file
- `ANDROID_KEY_ALIAS`: Key alias
- `ANDROID_KEYSTORE_PASSWORD`: Keystore password
- `ANDROID_KEY_PASSWORD`: Key password

Create base64-encoded keystore:

```bash
base64 -i release.keystore -o release.keystore.b64
```

Copy the content and add as `ANDROID_SIGNING_KEY` secret.

## Project Structure

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/pawnide/app/
│   │       │   └── MainActivity.java
│   │       ├── res/
│   │       │   ├── layout/
│   │       │   │   └── activity_main.xml
│   │       │   └── values/
│   │       │       └── strings.xml
│   │       ├── assets/
│   │       │   └── www/
│   │       │       └── (web app files)
│   │       └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
└── settings.gradle
```

## Features

- **PWA Support**: Full Progressive Web App functionality
- **Offline First**: Service Worker caches all assets for offline use
- **File System Access**: Uses File System Access API when available, falls back to file picker
- **Responsive Design**: Supports both portrait and landscape orientations
- **Performance**: Optimized for Android 8.0+ (API 26+)
- **Lightweight**: Minimal dependencies, fast startup

## Troubleshooting

### Build fails with "SDK not found"

Set `ANDROID_HOME` environment variable:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### WebView not loading files

Ensure `android/app/src/main/assets/www/` directory exists and contains the built web app files.

### Gradle sync fails

Update Gradle wrapper:

```bash
cd android
./gradlew wrapper --gradle-version 8.0
```

## Distribution

### Google Play Store

1. Create a Google Play Developer account
2. Create a new app entry
3. Generate a release APK with proper signing
4. Upload to Google Play Console
5. Fill in app details, screenshots, and description
6. Submit for review

### Direct Distribution

1. Build and sign the APK
2. Host on GitHub Releases
3. Users can download and install directly

## Performance Tips

- The web app is cached by Service Worker for instant loading
- All assets are minified and optimized
- WebView uses hardware acceleration
- Cache is managed automatically

## Support

For issues or questions, refer to:

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Android WebView Guide](https://developer.android.com/guide/webapps/webview)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
