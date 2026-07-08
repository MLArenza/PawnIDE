# Pawn IDE for SA-MP

A lightweight, distraction-free code editor specifically designed for SA-MP gamemode development in Pawn language. Built with Monaco Editor, File System Access API, and a clean black-green minimalist theme.

## Features

### Editor Capabilities

**Syntax Highlighting & Language Support**
- Full Pawn language syntax highlighting with keyword recognition
- Support for `.pwn` and `.inc` file extensions
- Preprocessor directive highlighting (#include, #define, etc.)
- String, comment, and number highlighting

**Code Editing**
- Line numbers with customizable display
- Code folding for better code organization
- Auto-indent for consistent formatting
- Auto-closing brackets and quotes
- Bracket pair colorization and matching
- Multi-cursor support
- Undo/Redo functionality
- Word wrap for better readability

**Navigation & Search**
- Find (Ctrl+F) - Search within current file
- Find & Replace (Ctrl+H) - Search and replace functionality
- Go to Line (Ctrl+G) - Jump to specific line numbers
- File search in sidebar with real-time filtering

**Autocomplete & Intellisense**
- Pawn keywords autocomplete
- SA-MP functions and callbacks suggestions
- Common constants (INVALID_PLAYER_ID, MAX_PLAYERS, etc.)
- Code snippets for common patterns:
  - if/else statements
  - for/while loops
  - switch statements
  - public/stock functions
  - Callback templates

### File Management

**File System Access**
- Open local folder using File System Access API (Chrome/Edge)
- Browse folder structure in sidebar
- Multi-tab file editing
- File tree with directory expansion/collapse

**File Operations**
- Create new files and folders (right-click context menu)
- Delete files and folders
- Auto-save every 2 seconds of inactivity
- Manual save with Ctrl+S
- Dirty file indicator (●) on unsaved changes

**Search & Filter**
- Real-time file search in sidebar
- Recursive directory filtering
- Quick file navigation

### User Interface

**Layout**
- Fixed header with project name and Open Folder button
- Collapsible sidebar with file tree (280px width)
- Main editor area with tab bar
- Status bar showing file info and cursor position

**Status Bar Information**
- Current filename
- Cursor position (Line, Column)
- Character count
- File encoding (UTF-8)
- File type (.pwn, .inc, or Text)

**Theme**
- Dark theme optimized for eye comfort
- Green accent color (#10b981) for SA-MP branding
- High contrast for readability
- Responsive design for mobile devices

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+S / Cmd+S | Save current file |
| Ctrl+F / Cmd+F | Find in file |
| Ctrl+H / Cmd+H | Find and replace |
| Ctrl+G / Cmd+G | Go to line |
| Ctrl+Z / Cmd+Z | Undo |
| Ctrl+Y / Cmd+Y | Redo |

## Browser Support

- **Chrome 86+** - Full support with File System Access API
- **Edge 86+** - Full support with File System Access API
- **Firefox** - Limited support (File System Access API not available)
- **Safari** - Limited support (File System Access API not available)

## Getting Started

1. **Open a Folder**: Click the "Open Folder" button in the header
2. **Select Project**: Choose your SA-MP gamemode folder
3. **Browse Files**: Navigate the file tree in the sidebar
4. **Edit Code**: Click any file to open it in the editor
5. **Save Changes**: Use Ctrl+S or wait for auto-save

## Pawn Language Reference

### Keywords
public, static, stock, native, forward, const, new, delete, if, else, switch, case, default, for, while, do, break, continue, return, enum, struct, operator

### Common SA-MP Functions
SendClientMessage, GetPlayerName, GetPlayerPos, SetPlayerPos, CreateVehicle, GetVehiclePos, SetVehiclePos, SpawnPlayer, IsPlayerConnected, GetMaxPlayers

### Common Callbacks
OnGameModeInit, OnGameModeExit, OnPlayerConnect, OnPlayerDisconnect, OnPlayerSpawn, OnPlayerDeath, OnPlayerCommandText, OnPlayerText, OnVehicleSpawn, OnVehicleDeath

### Common Constants
INVALID_PLAYER_ID, INVALID_VEHICLE_ID, MAX_PLAYERS, MAX_VEHICLES, PLAYER_STATE_ONFOOT, PLAYER_STATE_DRIVER, VEHICLE_STATE_DRIVER

## Tips & Best Practices

- **Auto-save**: Changes are automatically saved after 2 seconds of inactivity. Use Ctrl+S for immediate save.
- **File Organization**: Use folders to organize your code (gamemodes, filterscripts, includes, etc.)
- **Search**: Use the sidebar search to quickly find files in large projects
- **Tabs**: Keep multiple files open in tabs for easy navigation
- **Syntax**: Pawn syntax highlighting helps identify errors before compilation

## Limitations

- File System Access API requires user permission to access folders
- Cannot compile or execute code directly (use SA-MP compiler separately)
- No Git integration or version control
- No terminal or command execution
- Limited to local file editing (no cloud sync)

## Technical Details

**Built With**
- React 19 with TypeScript
- Monaco Editor 0.55+
- File System Access API
- Tailwind CSS 4 for styling
- Vite for build tooling

**Architecture**
- Single-page application (SPA)
- Client-side only (no backend required)
- Responsive design with mobile support
- Minimal dependencies for fast loading

## Troubleshooting

**"Open Folder" button not working**
- Ensure you're using Chrome, Edge, or another browser supporting File System Access API
- Check browser permissions for file system access

**Files not saving**
- Check browser console for errors
- Ensure the folder has write permissions
- Try manual save with Ctrl+S

**Autocomplete not showing**
- Autocomplete appears when typing keywords or function names
- Start typing to trigger suggestions
- Press Escape to close suggestions

## Future Enhancements

Potential features for future versions:
- Rename file functionality
- Code formatting and linting
- Bracket matching and highlighting
- Code minimap
- Theme customization
- Split editor view
- Integrated documentation

## License

This project is provided as-is for SA-MP gamemode development.

## Support

For issues or feature requests, please provide:
- Browser version and OS
- Steps to reproduce the issue
- Error messages from browser console
- Screenshots if applicable
