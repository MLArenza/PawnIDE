// Comprehensive function documentation database for hover tooltips

export interface FunctionDoc {
  name: string;
  params: string;
  description: string;
  example?: string;
  returns?: string;
}

export const FUNCTION_DOCS: Record<string, FunctionDoc> = {
  // SA-MP Core Functions
  SendClientMessage: {
    name: "SendClientMessage",
    params: "(playerid, color, const message[])",
    description: "Send a message to a specific player",
    example: 'SendClientMessage(playerid, 0xFF0000FF, "Hello!");',
    returns: "1 if successful, 0 otherwise",
  },
  SendClientMessageToAll: {
    name: "SendClientMessageToAll",
    params: "(color, const message[])",
    description: "Send a message to all players",
    example: 'SendClientMessageToAll(0xFF0000FF, "Server message");',
    returns: "1 if successful, 0 otherwise",
  },
  GetPlayerName: {
    name: "GetPlayerName",
    params: "(playerid, name[], len = sizeof(name))",
    description: "Get the name of a player",
    example: "GetPlayerName(playerid, name, sizeof(name));",
    returns: "Length of the name",
  },
  GetPlayerPos: {
    name: "GetPlayerPos",
    params: "(playerid, &Float:x, &Float:y, &Float:z)",
    description: "Get the position of a player",
    example: "GetPlayerPos(playerid, x, y, z);",
    returns: "1 if successful, 0 otherwise",
  },
  SetPlayerPos: {
    name: "SetPlayerPos",
    params: "(playerid, Float:x, Float:y, Float:z)",
    description: "Set the position of a player",
    example: "SetPlayerPos(playerid, 0.0, 0.0, 5.0);",
    returns: "1 if successful, 0 otherwise",
  },
  GetPlayerHealth: {
    name: "GetPlayerHealth",
    params: "(playerid, &Float:health)",
    description: "Get the health of a player",
    example: "GetPlayerHealth(playerid, health);",
    returns: "1 if successful, 0 otherwise",
  },
  SetPlayerHealth: {
    name: "SetPlayerHealth",
    params: "(playerid, Float:health)",
    description: "Set the health of a player",
    example: "SetPlayerHealth(playerid, 100.0);",
    returns: "1 if successful, 0 otherwise",
  },
  CreateVehicle: {
    name: "CreateVehicle",
    params: "(modelid, Float:x, Float:y, Float:z, Float:angle, color1, color2, respawn_delay)",
    description: "Create a vehicle",
    example: "CreateVehicle(411, 0.0, 0.0, 5.0, 0.0, -1, -1, 300);",
    returns: "Vehicle ID, or INVALID_VEHICLE_ID if failed",
  },
  DestroyVehicle: {
    name: "DestroyVehicle",
    params: "(vehicleid)",
    description: "Destroy a vehicle",
    example: "DestroyVehicle(vehicleid);",
    returns: "1 if successful, 0 otherwise",
  },
  IsPlayerConnected: {
    name: "IsPlayerConnected",
    params: "(playerid)",
    description: "Check if a player is connected",
    example: "if (IsPlayerConnected(playerid)) { /* ... */ }",
    returns: "1 if connected, 0 otherwise",
  },
  GetMaxPlayers: {
    name: "GetMaxPlayers",
    params: "()",
    description: "Get the maximum number of players",
    example: "new max = GetMaxPlayers();",
    returns: "Maximum number of players",
  },

  // ZCMD Functions
  "CMD": {
    name: "CMD",
    params: ":commandname(playerid, params[])",
    description: "Define a ZCMD command",
    example: "CMD:help(playerid, params[]) { /* ... */ return 1; }",
    returns: "1 to process, 0 to reject",
  },
  OnPlayerCommandReceived: {
    name: "OnPlayerCommandReceived",
    params: "(playerid, cmdtext[])",
    description: "Called when a player enters a command",
    example: "public OnPlayerCommandReceived(playerid, cmdtext[]) { /* ... */ }",
    returns: "1 to continue, 0 to block",
  },
  OnPlayerCommandPerformed: {
    name: "OnPlayerCommandPerformed",
    params: "(playerid, cmdtext[], success)",
    description: "Called after a command is processed",
    example: "public OnPlayerCommandPerformed(playerid, cmdtext[], success) { /* ... */ }",
    returns: "1 to continue, 0 to block",
  },

  // sscanf Functions
  sscanf: {
    name: "sscanf",
    params: "(const string[], const format[], {Float,_}:...)",
    description: "Parse a string according to a format",
    example: 'sscanf(params, "ii", id, amount)',
    returns: "0 if successful, error code otherwise",
  },
  unformat: {
    name: "unformat",
    params: "(const string[], const format[], {Float,_}:...)",
    description: "Reverse parsing - format variables into a string",
    example: 'unformat(string, "ii", id, amount)',
    returns: "0 if successful, error code otherwise",
  },
  strtok: {
    name: "strtok",
    params: "(string[], separator = \\' \\')",
    description: "Tokenize a string by separator",
    example: 'strtok(params, " ")',
    returns: "Next token",
  },
  strval: {
    name: "strval",
    params: "(const string[])",
    description: "Convert a string to an integer",
    example: "new value = strval(string);",
    returns: "Integer value",
  },
  floatstr: {
    name: "floatstr",
    params: "(const string[])",
    description: "Convert a string to a float",
    example: "new value = floatstr(string);",
    returns: "Float value",
  },

  // YSI y_commands
  Command_Add: {
    name: "Command_Add",
    params: "(const command[], const callback[], help[] = \"\")",
    description: "Add a command dynamically",
    example: 'Command_Add("help", "HelpCommand", "Show help");',
    returns: "1 if successful, 0 otherwise",
  },
  Command_Remove: {
    name: "Command_Remove",
    params: "(const command[])",
    description: "Remove a command",
    example: 'Command_Remove("help");',
    returns: "1 if successful, 0 otherwise",
  },
  Command_Process: {
    name: "Command_Process",
    params: "(playerid, const command[])",
    description: "Process a command manually",
    example: 'Command_Process(playerid, "/help");',
    returns: "1 if successful, 0 otherwise",
  },
  Command_IsValid: {
    name: "Command_IsValid",
    params: "(const command[])",
    description: "Check if a command exists",
    example: 'if (Command_IsValid("help")) { /* ... */ }',
    returns: "1 if valid, 0 otherwise",
  },

  // YSI y_dialog
  Dialog_Show: {
    name: "Dialog_Show",
    params: "(playerid, dialogid, style, const title[], const body[], const button1[], const button2[])",
    description: "Show a dialog to a player",
    example: 'Dialog_Show(playerid, DIALOG_ID, DIALOG_STYLE_LIST, "Menu", "Option 1\\nOption 2", "Select", "Cancel");',
    returns: "1 if successful, 0 otherwise",
  },
  Dialog_Close: {
    name: "Dialog_Close",
    params: "(playerid)",
    description: "Close the dialog for a player",
    example: "Dialog_Close(playerid);",
    returns: "1 if successful, 0 otherwise",
  },
  Dialog_IsOpen: {
    name: "Dialog_IsOpen",
    params: "(playerid)",
    description: "Check if a dialog is open for a player",
    example: "if (Dialog_IsOpen(playerid)) { /* ... */ }",
    returns: "1 if open, 0 otherwise",
  },
  Dialog_GetResponse: {
    name: "Dialog_GetResponse",
    params: "(playerid)",
    description: "Get the response from a dialog",
    example: "new response = Dialog_GetResponse(playerid);",
    returns: "Response value",
  },

  // YSI y_timers
  SetTimerEx: {
    name: "SetTimerEx",
    params: "(const callback[], interval, bool:repeat, const format[], {Float,_}:...)",
    description: "Set a timer with extra parameters",
    example: 'SetTimerEx("MyTimer", 1000, true, "i", playerid);',
    returns: "Timer ID",
  },
  KillTimer: {
    name: "KillTimer",
    params: "(timerid)",
    description: "Kill a timer",
    example: "KillTimer(timerid);",
    returns: "1 if successful, 0 otherwise",
  },
  IsValidTimer: {
    name: "IsValidTimer",
    params: "(timerid)",
    description: "Check if a timer is valid",
    example: "if (IsValidTimer(timerid)) { /* ... */ }",
    returns: "1 if valid, 0 otherwise",
  },

  // YSI y_players
  Player_IsSpawned: {
    name: "Player_IsSpawned",
    params: "(playerid)",
    description: "Check if a player is spawned",
    example: "if (Player_IsSpawned(playerid)) { /* ... */ }",
    returns: "1 if spawned, 0 otherwise",
  },
  Player_IsConnected: {
    name: "Player_IsConnected",
    params: "(playerid)",
    description: "Check if a player is connected",
    example: "if (Player_IsConnected(playerid)) { /* ... */ }",
    returns: "1 if connected, 0 otherwise",
  },
  Player_GetName: {
    name: "Player_GetName",
    params: "(playerid, name[], len = sizeof(name))",
    description: "Get a player's name",
    example: "Player_GetName(playerid, name, sizeof(name));",
    returns: "Length of the name",
  },
  Player_GetID: {
    name: "Player_GetID",
    params: "(const name[])",
    description: "Get a player's ID by name",
    example: "new id = Player_GetID(\"PlayerName\");",
    returns: "Player ID or INVALID_PLAYER_ID",
  },

  // YSI y_groups
  Group_Create: {
    name: "Group_Create",
    params: "(const name[])",
    description: "Create a new group",
    example: 'new groupid = Group_Create("Admins");',
    returns: "Group ID",
  },
  Group_Destroy: {
    name: "Group_Destroy",
    params: "(groupid)",
    description: "Destroy a group",
    example: "Group_Destroy(groupid);",
    returns: "1 if successful, 0 otherwise",
  },
  Group_Add: {
    name: "Group_Add",
    params: "(groupid, playerid)",
    description: "Add a player to a group",
    example: "Group_Add(groupid, playerid);",
    returns: "1 if successful, 0 otherwise",
  },
  Group_Remove: {
    name: "Group_Remove",
    params: "(groupid, playerid)",
    description: "Remove a player from a group",
    example: "Group_Remove(groupid, playerid);",
    returns: "1 if successful, 0 otherwise",
  },

  // YSI y_data
  Data_Set: {
    name: "Data_Set",
    params: "(const key[], value)",
    description: "Set a data value",
    example: 'Data_Set("playercount", GetPlayerPoolSize());',
    returns: "1 if successful, 0 otherwise",
  },
  Data_Get: {
    name: "Data_Get",
    params: "(const key[])",
    description: "Get a data value",
    example: 'new count = Data_Get("playercount");',
    returns: "Data value",
  },
  Data_Delete: {
    name: "Data_Delete",
    params: "(const key[])",
    description: "Delete a data value",
    example: 'Data_Delete("playercount");',
    returns: "1 if successful, 0 otherwise",
  },

  // YSI y_bit
  Bit_Set: {
    name: "Bit_Set",
    params: "(bits[], bit)",
    description: "Set a bit",
    example: "Bit_Set(flags, 5);",
    returns: "1 if successful, 0 otherwise",
  },
  Bit_Get: {
    name: "Bit_Get",
    params: "(const bits[], bit)",
    description: "Get a bit value",
    example: "new value = Bit_Get(flags, 5);",
    returns: "Bit value (0 or 1)",
  },
  Bit_Clear: {
    name: "Bit_Clear",
    params: "(bits[], bit)",
    description: "Clear a bit",
    example: "Bit_Clear(flags, 5);",
    returns: "1 if successful, 0 otherwise",
  },
  Bit_Toggle: {
    name: "Bit_Toggle",
    params: "(bits[], bit)",
    description: "Toggle a bit",
    example: "Bit_Toggle(flags, 5);",
    returns: "1 if successful, 0 otherwise",
  },

  // YSI y_iterate
  Iter_Create: {
    name: "Iter_Create",
    params: "(const name[])",
    description: "Create an iterator",
    example: 'Iter_Create("players");',
    returns: "Iterator ID",
  },
  Iter_Add: {
    name: "Iter_Add",
    params: "(const name[], item)",
    description: "Add an item to an iterator",
    example: 'Iter_Add("players", playerid);',
    returns: "1 if successful, 0 otherwise",
  },
  Iter_Remove: {
    name: "Iter_Remove",
    params: "(const name[], item)",
    description: "Remove an item from an iterator",
    example: 'Iter_Remove("players", playerid);',
    returns: "1 if successful, 0 otherwise",
  },
  Iter_Count: {
    name: "Iter_Count",
    params: "(const name[])",
    description: "Count items in an iterator",
    example: 'new count = Iter_Count("players");',
    returns: "Number of items",
  },

  // YSI y_stringhash
  Hash: {
    name: "Hash",
    params: "(const string[])",
    description: "Hash a string",
    example: 'new hash = Hash("mystring");',
    returns: "Hash value",
  },
  UnHash: {
    name: "UnHash",
    params: "(hash)",
    description: "Reverse hash lookup",
    example: "new string = UnHash(hash);",
    returns: "Original string or empty",
  },

  // YSI y_malloc
  malloc: {
    name: "malloc",
    params: "(size)",
    description: "Allocate memory",
    example: "new addr = malloc(100);",
    returns: "Memory address",
  },
  free: {
    name: "free",
    params: "(addr)",
    description: "Free allocated memory",
    example: "free(addr);",
    returns: "1 if successful, 0 otherwise",
  },
  Malloc_Get: {
    name: "Malloc_Get",
    params: "(addr, offset = 0)",
    description: "Get value from allocated memory",
    example: "new value = Malloc_Get(addr, 0);",
    returns: "Value at address",
  },

  // Additional common functions
  printf: {
    name: "printf",
    params: "(const format[], {Float,_}:...)",
    description: "Print formatted text to server console",
    example: 'printf("Player %d connected", playerid);',
    returns: "Number of characters printed",
  },
  GameTextForPlayer: {
    name: "GameTextForPlayer",
    params: "(playerid, const string[], time, style)",
    description: "Show game text to a player",
    example: 'GameTextForPlayer(playerid, "~r~Hello!", 5000, 1);',
    returns: "1 if successful, 0 otherwise",
  },
  GameTextForAll: {
    name: "GameTextForAll",
    params: "(const string[], time, style)",
    description: "Show game text to all players",
    example: 'GameTextForAll("~g~Welcome!", 5000, 1);',
    returns: "1 if successful, 0 otherwise",
  },
  CreateObject: {
    name: "CreateObject",
    params: "(modelid, Float:x, Float:y, Float:z, Float:rx, Float:ry, Float:rz, Float:drawdistance = 0.0)",
    description: "Create an object",
    example: "CreateObject(1337, 0.0, 0.0, 5.0, 0.0, 0.0, 0.0);",
    returns: "Object ID",
  },
  DestroyObject: {
    name: "DestroyObject",
    params: "(objectid)",
    description: "Destroy an object",
    example: "DestroyObject(objectid);",
    returns: "1 if successful, 0 otherwise",
  },
  MoveObject: {
    name: "MoveObject",
    params: "(objectid, Float:targetx, Float:targety, Float:targetz, Float:speed, Float:rotx = -1000.0, Float:roty = -1000.0, Float:rotz = -1000.0)",
    description: "Move an object to a target position",
    example: "MoveObject(objectid, 10.0, 10.0, 5.0, 5.0);",
    returns: "1 if successful, 0 otherwise",
  },
  StopObject: {
    name: "StopObject",
    params: "(objectid)",
    description: "Stop moving an object",
    example: "StopObject(objectid);",
    returns: "1 if successful, 0 otherwise",
  },
  SpawnPlayer: {
    name: "SpawnPlayer",
    params: "(playerid)",
    description: "Spawn a player",
    example: "SpawnPlayer(playerid);",
    returns: "1 if successful, 0 otherwise",
  },
  GetPlayerState: {
    name: "GetPlayerState",
    params: "(playerid)",
    description: "Get the state of a player",
    example: "new state = GetPlayerState(playerid);",
    returns: "Player state",
  },
  GetPlayerScore: {
    name: "GetPlayerScore",
    params: "(playerid)",
    description: "Get a player's score",
    example: "new score = GetPlayerScore(playerid);",
    returns: "Player score",
  },
  SetPlayerScore: {
    name: "SetPlayerScore",
    params: "(playerid, score)",
    description: "Set a player's score",
    example: "SetPlayerScore(playerid, 100);",
    returns: "1 if successful, 0 otherwise",
  },
  GetPlayerArmour: {
    name: "GetPlayerArmour",
    params: "(playerid, &Float:armour)",
    description: "Get a player's armour",
    example: "GetPlayerArmour(playerid, armour);",
    returns: "1 if successful, 0 otherwise",
  },
  SetPlayerArmour: {
    name: "SetPlayerArmour",
    params: "(playerid, Float:armour)",
    description: "Set a player's armour",
    example: "SetPlayerArmour(playerid, 100.0);",
    returns: "1 if successful, 0 otherwise",
  },
};

// Get documentation for a function
export function getFunctionDoc(functionName: string): FunctionDoc | undefined {
  return FUNCTION_DOCS[functionName];
}

// Format documentation for hover display
export function formatDocumentation(doc: FunctionDoc): string {
  let markdown = `**${doc.name}**\n\n`;
  markdown += `\`\`\`pawn\n${doc.name}${doc.params}\n\`\`\`\n\n`;
  markdown += `${doc.description}\n`;

  if (doc.returns) {
    markdown += `\n**Returns:** ${doc.returns}`;
  }

  if (doc.example) {
    markdown += `\n\n**Example:**\n\`\`\`pawn\n${doc.example}\n\`\`\``;
  }

  return markdown;
}
