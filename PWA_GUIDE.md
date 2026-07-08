# Pawn IDE - Progressive Web App Guide

Pawn IDE is a fully-featured Progressive Web App (PWA) that works offline and can be installed on any device.

## What is a PWA?

A Progressive Web App is a web application that uses modern web capabilities to deliver an app-like experience. It works offline, loads instantly, and can be installed on your device's home screen.

## Features

### Offline Support

- **Service Worker**: Caches all assets on first load
- **Offline-First Strategy**: Works seamlessly when offline
- **Automatic Updates**: Service Worker checks for updates periodically
- **Cache Management**: Intelligent cache invalidation and cleanup

### Installation

#### Desktop (Chrome, Edge, Firefox)

1. Open Pawn IDE in your browser
2. Look for the "Install" button in the address bar
3. Click and confirm installation
4. The app will appear on your desktop

#### Android (Chrome, Edge)

1. Open Pawn IDE in Chrome or Edge
2. Tap the menu (three dots)
3. Select "Install app" or "Add to Home screen"
4. The app will appear on your home screen

#### iOS (Safari)

1. Open Pawn IDE in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will appear on your home screen

## Offline Functionality

### What Works Offline

- ✅ All editor features (syntax highlighting, autocomplete, etc.)
- ✅ File editing and management
- ✅ Settings and preferences
- ✅ All cached files and projects

### What Requires Internet

- ❌ Downloading new libraries or dependencies
- ❌ Cloud sync (not implemented)
- ❌ External API calls

## Storage

### Local Storage

All data is stored locally on your device:

- **Editor Content**: Stored in browser's IndexedDB
- **Preferences**: Stored in localStorage
- **Files**: Stored in browser's file system (with File System Access API)
- **Cache**: Managed by Service Worker

### Storage Limits

- **Desktop**: Typically 50GB+ available
- **Android**: Depends on device, usually 100MB-1GB per app
- **iOS**: Typically 50MB limit

## Performance

### Load Time

- **First Load**: ~2-3 seconds (downloads and caches assets)
- **Subsequent Loads**: ~500ms (loads from cache)
- **Offline**: ~500ms (instant from cache)

### Memory Usage

- **Initial**: ~50-100MB
- **With Large Files**: ~100-200MB
- **Optimized**: Minimal memory footprint

## Browser Compatibility

### Desktop

- ✅ Chrome 40+
- ✅ Edge 79+
- ✅ Firefox 44+
- ✅ Safari 11.1+
- ✅ Opera 27+

### Mobile

- ✅ Chrome Android 40+
- ✅ Edge Android 79+
- ✅ Firefox Android 68+
- ✅ Samsung Internet 4+

### Minimum Requirements

- Android 8.0 (API 26) or higher
- iOS 11.3 or higher
- 50MB free storage

## File System Access

### File System Access API

When available (Chrome 86+, Edge 86+), Pawn IDE uses the File System Access API for:

- Direct folder access
- Real-time file synchronization
- Better performance

### Fallback Mode

On devices without File System Access API support:

- Use file picker to select files
- Files are stored in browser's local storage
- Full functionality is maintained

## Updating the App

### Automatic Updates

The Service Worker checks for updates every time you load the app:

1. Checks for new version
2. Downloads updates in background
3. Notifies you when ready
4. Updates on next page reload

### Manual Update

To force an update:

1. Open Settings
2. Look for "Clear Cache" or "Update" option
3. Reload the page

## Troubleshooting

### App Won't Load Offline

1. Check if Service Worker is registered:
   - Open DevTools (F12)
   - Go to Application tab
   - Check Service Workers section

2. Clear cache and reinstall:
   - Settings → Clear Cache
   - Reload the page
   - Reinstall the app

### Files Not Syncing

1. Check internet connection
2. Verify file permissions
3. Try using fallback file picker

### Storage Full

1. Clear old projects
2. Delete unused files
3. Clear browser cache

### Performance Issues

1. Close other tabs
2. Restart the app
3. Clear cache and reload

## Advanced Features

### Persistent Storage

Request persistent storage to prevent automatic cache clearing:

```javascript
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(persistent => {
    console.log('Persistent storage:', persistent);
  });
}
```

### Cache Management

Clear all caches programmatically:

```javascript
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

### Service Worker Updates

Force Service Worker update:

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(reg => {
    reg.update();
  });
}
```

## Best Practices

### For Users

1. **Install the App**: Better experience and faster loading
2. **Keep Updated**: Allow automatic updates
3. **Manage Storage**: Clear old projects periodically
4. **Use Offline**: Work offline when needed

### For Developers

1. **Test Offline**: Always test offline functionality
2. **Monitor Cache**: Check cache size and performance
3. **Update Manifest**: Keep manifest.json up to date
4. **Test on Devices**: Test on real Android/iOS devices

## Security

### Data Protection

- All data is stored locally on your device
- No data is sent to external servers
- HTTPS is required for PWA features
- Service Worker only works on HTTPS

### Permissions

Pawn IDE requests:

- **File System Access**: To read/write files (optional)
- **Storage**: To cache assets and data
- **Network**: To check for updates

## Limitations

### Browser Limitations

- File System Access API not available on all browsers
- Storage limits vary by browser and device
- Some features may not work on older devices

### Platform Limitations

- iOS PWAs have limited offline support
- Android PWAs work best on Chrome/Edge
- Some system features may not be accessible

## Future Enhancements

Planned features:

- Cloud sync with GitHub
- Collaborative editing
- Plugin system
- Advanced debugging tools
- Performance profiling

## Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## Support

For issues or questions:

1. Check this guide first
2. Open an issue on GitHub
3. Check browser console for errors (F12)
4. Provide error messages and device info
