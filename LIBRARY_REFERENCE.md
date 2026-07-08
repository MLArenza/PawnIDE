# SA-MP Library Reference

Pawn IDE mencakup autocomplete dan snippet untuk library SA-MP populer berikut:

## ZCMD - Command Framework

ZCMD adalah framework command yang ringan dan cepat untuk SA-MP. Autocomplete mencakup:

**Functions**
- `OnPlayerCommandReceived` - Called when player executes a command
- `OnPlayerCommandPerformed` - Called after command is processed
- `OnPlayerCommandText` - Legacy callback
- `ProcessCommand` - Process command manually

**Constants**
- `COMMAND_NOT_FOUND` - Command not found status
- `COMMAND_DISABLED` - Command is disabled
- `COMMAND_PROCESSING` - Command being processed
- `COMMAND_PROCESSED` - Command successfully processed

**Snippet: `cmd`**
```pawn
CMD:commandname(playerid, params[])
{
    if (isnull(params)) return SendClientMessage(playerid, -1, "Usage: /commandname [args]");
    // Command logic here
    return 1;
}
```

## sscanf - String Parsing Library

sscanf adalah library untuk parsing string dan command parameters dengan mudah.

**Functions**
- `sscanf(string, format, ...)` - Parse string dengan format tertentu
- `unformat(string, format, ...)` - Reverse parsing
- `strtok(string, separator)` - Tokenize string
- `strval(string)` - Convert string to integer
- `floatstr(string)` - Convert string to float

**Constants**
- `sscanf_QUIET` - Quiet mode (no error messages)
- `sscanf_STRICT` - Strict parsing mode
- `sscanf_ARRAY` - Array parsing flag
- `sscanf_STRING` - String parsing flag

**Format Specifiers**
- `i` - Integer
- `d` - Integer (same as i)
- `f` - Float
- `s` - String
- `c` - Character
- `x` - Hexadecimal
- `b` - Binary
- `a` - Array
- `u` - User (player ID)

**Snippet: `sscanf_parse`**
```pawn
if (sscanf(params, "format", variables)) 
    return SendClientMessage(playerid, -1, "Invalid arguments!");
```

**Example Usage**
```pawn
// Parse: /give 5 100
if (sscanf(params, "ii", targetid, amount)) 
    return SendClientMessage(playerid, -1, "Usage: /give [playerid] [amount]");
```

## YSI - Comprehensive Library

YSI adalah library besar yang menyediakan berbagai fungsi utility untuk SA-MP development.

### y_commands - Advanced Command System
- `Command_Add` - Add command dynamically
- `Command_Remove` - Remove command
- `Command_Process` - Process command
- `Command_IsValid` - Check if command valid

### y_dialog - Dialog Management
- `Dialog_Show` - Show dialog to player
- `Dialog_Close` - Close dialog
- `Dialog_IsOpen` - Check if dialog open
- `Dialog_GetResponse` - Get dialog response

### y_timers - Timer Management
- `SetTimerEx` - Set timer with extra parameters
- `KillTimer` - Kill timer
- `IsValidTimer` - Check if timer valid

### y_players - Player Utilities
- `Player_IsSpawned` - Check if player spawned
- `Player_IsConnected` - Check if player connected
- `Player_GetName` - Get player name
- `Player_GetID` - Get player ID

### y_groups - Group Management
- `Group_Create` - Create group
- `Group_Destroy` - Destroy group
- `Group_Add` - Add player to group
- `Group_Remove` - Remove player from group

### y_data - Data Storage
- `Data_Set` - Set data value
- `Data_Get` - Get data value
- `Data_Delete` - Delete data

### y_bit - Bit Operations
- `Bit_Set` - Set bit
- `Bit_Get` - Get bit value
- `Bit_Clear` - Clear bit
- `Bit_Toggle` - Toggle bit

### y_iterate - Array Iteration
- `Iter_Create` - Create iterator
- `Iter_Add` - Add to iterator
- `Iter_Remove` - Remove from iterator
- `Iter_Count` - Count items in iterator

### y_stringhash - String Hashing
- `HASH` - Hash macro
- `Hash` - Hash function
- `UnHash` - Reverse hash
- Useful for fast string comparison

### y_malloc - Memory Management
- `malloc` - Allocate memory
- `free` - Free memory
- `Malloc_Get` - Get allocated memory

### y_hooks - Hook System
- `hook` - Create hook
- `HOOK` - Hook macro
- Useful for extending existing functions

**YSI Constants**
- `DIALOG_STYLE_MSGBOX` - Message box dialog
- `DIALOG_STYLE_INPUT` - Input dialog
- `DIALOG_STYLE_LIST` - List dialog
- `DIALOG_STYLE_PASSWORD` - Password dialog
- `TIMER_REPEAT` - Repeat timer
- `TIMER_ONCE` - One-time timer

## Common Snippets

### Dialog Template
```pawn
ShowPlayerDialog(playerid, dialogid, DIALOG_STYLE_MSGBOX, "Title", "Body", "Button1", "Button2");
```

### Timer Template
```pawn
SetTimerEx("TimerName", interval, repeat, "i", playerid);
```

### Send Message
```pawn
SendClientMessage(playerid, -1, "message");
```

### Send Message to All
```pawn
SendClientMessageToAll(-1, "message");
```

### Check Player Connected
```pawn
if (!IsPlayerConnected(playerid)) 
    return SendClientMessage(playerid, -1, "Player not connected!");
```

### Get Player ID by Name
```pawn
stock GetPlayerIDByName(name[])
{
    for (new i = 0; i < MAX_PLAYERS; i++) {
        if (!IsPlayerConnected(i)) continue;
        if (!strcmp(GetPlayerNameEx(i), name, true)) return i;
    }
    return INVALID_PLAYER_ID;
}
```

### Array Iteration
```pawn
for (new i = 0; i < sizeof(array); i++) {
    // Process array[i]
}
```

### String Formatting
```pawn
new string[128];
format(string, sizeof(string), "format", args);
```

## Tips for Using Autocomplete

1. **Type library function name** - Start typing any function name and autocomplete will suggest it
2. **Press Ctrl+Space** - Force autocomplete suggestions
3. **Use snippets** - Type snippet name (e.g., `cmd`, `dialog`, `timer`) for quick templates
4. **Check documentation** - Hover over suggestions to see documentation
5. **Parameter hints** - Monaco Editor shows parameter hints as you type

## Common Patterns

### ZCMD Command with sscanf
```pawn
CMD:give(playerid, params[])
{
    new targetid, amount;
    if (sscanf(params, "ii", targetid, amount)) 
        return SendClientMessage(playerid, -1, "Usage: /give [playerid] [amount]");
    
    if (!IsPlayerConnected(targetid)) 
        return SendClientMessage(playerid, -1, "Player not connected!");
    
    // Give logic here
    return 1;
}
```

### Dialog with Response Handling
```pawn
public OnDialogResponse(playerid, dialogid, response, listitem, inputtext[])
{
    if (dialogid == DIALOG_ID) {
        if (!response) return 1;
        // Handle response
    }
    return 0;
}
```

### Timer with YSI
```pawn
SetTimerEx("PlayerTimer", 1000, true, "i", playerid);

forward PlayerTimer(playerid);
public PlayerTimer(playerid)
{
    if (!Player_IsConnected(playerid)) return;
    // Timer logic here
}
```

## Library Installation

To use these libraries in your project:

1. **ZCMD** - Download from SA-MP forums or GitHub
2. **sscanf** - Download sscanf2 plugin
3. **YSI** - Download YSI-Includes from GitHub

Include them in your gamemode:
```pawn
#include <zcmd>
#include <sscanf2>
#include <YSI_Core>
```

## Resources

- **SA-MP Wiki** - https://wiki.sa-mp.com/
- **SA-MP Forums** - https://www.sa-mp.com/forums/
- **GitHub SA-MP** - https://github.com/search?q=sa-mp
- **YSI GitHub** - https://github.com/Y-Less/YSI-Includes
- **ZCMD** - https://github.com/Southclaws/zcmd
- **sscanf** - https://github.com/Y-Less/sscanf

## Notes

- Autocomplete suggestions are case-sensitive
- Some functions may require specific includes
- Check library documentation for exact function signatures
- Use snippets as templates and modify as needed
