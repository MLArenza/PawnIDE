import * as monaco from "monaco-editor";
import { getFunctionDoc, formatDocumentation } from "./functionDocs";

// Pawn keywords
const PAWN_KEYWORDS = [
  "public",
  "static",
  "stock",
  "native",
  "forward",
  "const",
  "new",
  "delete",
  "if",
  "else",
  "switch",
  "case",
  "default",
  "for",
  "while",
  "do",
  "break",
  "continue",
  "return",
  "goto",
  "asm",
  "assert",
  "sizeof",
  "tagof",
  "state",
  "exit",
  "enum",
  "struct",
  "operator",
  "void",
  "bool",
  "char",
  "int",
  "float",
  "string",
  "cell",
  "any",
];

// SA-MP common functions
const SAMP_FUNCTIONS = [
  "printf",
  "SendClientMessage",
  "SendClientMessageToAll",
  "SendPlayerMessageToPlayer",
  "SendPlayerMessageToAll",
  "GameTextForPlayer",
  "GameTextForAll",
  "GetMaxPlayers",
  "GetPlayerName",
  "GetPlayerScore",
  "GetPlayerState",
  "GetPlayerHealth",
  "GetPlayerArmour",
  "GetPlayerPos",
  "GetPlayerFacingAngle",
  "GetPlayerInterior",
  "GetPlayerVirtualWorld",
  "GetPlayerWeapon",
  "GetPlayerAmmo",
  "SetPlayerPos",
  "SetPlayerFacingAngle",
  "SetPlayerInterior",
  "SetPlayerVirtualWorld",
  "SetPlayerHealth",
  "SetPlayerArmour",
  "SetPlayerSkin",
  "SetPlayerColor",
  "SetPlayerWeapon",
  "GivePlayerWeapon",
  "RemovePlayerWeapon",
  "RemoveAllPlayerWeapons",
  "SpawnPlayer",
  "IsPlayerConnected",
  "IsPlayerInVehicle",
  "IsPlayerInRangeOfPoint",
  "GetPlayerPoolSize",
  "GetVehiclePoolSize",
  "CreateVehicle",
  "DestroyVehicle",
  "GetVehiclePos",
  "SetVehiclePos",
  "GetVehicleZAngle",
  "SetVehicleZAngle",
  "GetVehicleHealth",
  "SetVehicleHealth",
  "GetVehicleModel",
  "GetVehicleDriver",
  "GetVehiclePassenger",
  "PutPlayerInVehicle",
  "RemovePlayerFromVehicle",
  "GetPlayerVehicleID",
  "GetPlayerVehicleSeat",
  "IsVehicleStreamedIn",
  "GetVehicleVirtualWorld",
  "SetVehicleVirtualWorld",
  "GetVehicleParamsEx",
  "SetVehicleParamsEx",
  "GetVehicleParamsCarDoors",
  "SetVehicleParamsCarDoors",
  "GetVehicleParamsCarWindows",
  "SetVehicleParamsCarWindows",
  "GetVehicleComponentInSlot",
  "GetVehicleComponentType",
  "AddVehicleComponent",
  "RemoveVehicleComponent",
  "ChangeVehicleColor",
  "ChangeVehiclePaintjob",
  "SetVehicleNumberPlate",
  "AttachTrailerToVehicle",
  "DetachTrailerFromVehicle",
  "IsTrailerAttachedToVehicle",
  "GetVehicleTrailer",
  "SetVehicleToRespawn",
  "LinkVehicleToInterior",
  "AddStaticVehicle",
  "AddStaticVehicleEx",
  "CreateObject",
  "DestroyObject",
  "IsValidObject",
  "MoveObject",
  "StopObject",
  "GetObjectPos",
  "SetObjectPos",
  "GetObjectRot",
  "SetObjectRot",
  "GetObjectModel",
  "SetObjectMaterial",
  "SetObjectMaterialText",
  "IsObjectMoving",
  "GetObjectMovingTargetPos",
  "GetObjectAttachedData",
  "GetObjectAttachedOffset",
  "AttachObjectToVehicle",
  "AttachObjectToObject",
  "AttachObjectToPlayer",
  "DetachObject",
  "IsObjectAttachedToVehicle",
  "IsObjectAttachedToObject",
  "IsObjectAttachedToPlayer",
  "GetObjectSyncRotation",
  "SetObjectSyncRotation",
  "CreatePickup",
  "DestroyPickup",
  "IsValidPickup",
  "GetPickupPos",
  "SetPickupPos",
  "GetPickupModel",
  "GetPickupType",
  "IsPickupStreamedIn",
  "IsPickupHiddenForPlayer",
  "ShowPickupForPlayer",
  "HidePickupForPlayer",
  "CreatePlayerPickup",
  "DestroyPlayerPickup",
  "IsValidPlayerPickup",
  "GetPlayerPickupPos",
  "SetPlayerPickupPos",
  "GetPlayerPickupModel",
  "GetPlayerPickupType",
  "IsPlayerPickupStreamedIn",
  "OnGameModeInit",
  "OnGameModeExit",
  "OnPlayerConnect",
  "OnPlayerDisconnect",
  "OnPlayerSpawn",
  "OnPlayerDeath",
  "OnVehicleSpawn",
  "OnVehicleDeath",
  "OnPlayerText",
  "OnPlayerCommandText",
  "OnPlayerRequestClass",
  "OnPlayerEnterVehicle",
  "OnPlayerExitVehicle",
  "OnPlayerStateChange",
  "OnPlayerEnterCheckpoint",
  "OnPlayerLeaveCheckpoint",
  "OnPlayerEnterRaceCheckpoint",
  "OnPlayerLeaveRaceCheckpoint",
  "OnRconCommand",
  "OnPlayerUpdate",
  "OnPlayerStreamIn",
  "OnPlayerStreamOut",
  "OnVehicleStreamIn",
  "OnVehicleStreamOut",
  "OnObjectMoved",
  "OnPickupPickedUp",
  "OnVehicleMod",
  "OnEnterExitModShop",
  "OnVehiclePaintjob",
  "OnVehicleRespray",
  "OnVehicleDamageStatusUpdate",
  "OnUnoccupiedVehicleUpdate",
  "OnPlayerSelectedMenuRow",
  "OnPlayerExitedMenu",
  "OnPlayerInteriorChange",
  "OnPlayerKeyStateChange",
  "OnRconLoginAttempt",
  "OnPlayerTakeDamage",
  "OnPlayerGiveDamage",
  "OnPlayerClickMap",
  "OnPlayerClickTextDraw",
  "OnPlayerClickPlayerTextDraw",
  "OnIncomingConnection",
  "OnTrailerUpdate",
  "OnVehicleSirenStateChange",
  "OnPlayerFinishedDownloading",
  "OnPlayerRequestDownload",
  "OnPlayerPreloadMap",
  "OnPlayerWeaponShot",
];

// SA-MP callbacks
const SAMP_CALLBACKS = [
  "OnGameModeInit",
  "OnGameModeExit",
  "OnPlayerConnect",
  "OnPlayerDisconnect",
  "OnPlayerSpawn",
  "OnPlayerDeath",
  "OnVehicleSpawn",
  "OnVehicleDeath",
  "OnPlayerText",
  "OnPlayerCommandText",
  "OnPlayerRequestClass",
  "OnPlayerEnterVehicle",
  "OnPlayerExitVehicle",
  "OnPlayerStateChange",
  "OnPlayerEnterCheckpoint",
  "OnPlayerLeaveCheckpoint",
  "OnPlayerEnterRaceCheckpoint",
  "OnPlayerLeaveRaceCheckpoint",
  "OnRconCommand",
  "OnPlayerUpdate",
  "OnPlayerStreamIn",
  "OnPlayerStreamOut",
  "OnVehicleStreamIn",
  "OnVehicleStreamOut",
  "OnObjectMoved",
  "OnPickupPickedUp",
  "OnVehicleMod",
  "OnEnterExitModShop",
  "OnVehiclePaintjob",
  "OnVehicleRespray",
  "OnVehicleDamageStatusUpdate",
  "OnUnoccupiedVehicleUpdate",
  "OnPlayerSelectedMenuRow",
  "OnPlayerExitedMenu",
  "OnPlayerInteriorChange",
  "OnPlayerKeyStateChange",
  "OnRconLoginAttempt",
  "OnPlayerTakeDamage",
  "OnPlayerGiveDamage",
  "OnPlayerClickMap",
  "OnPlayerClickTextDraw",
  "OnPlayerClickPlayerTextDraw",
  "OnIncomingConnection",
  "OnTrailerUpdate",
  "OnVehicleSirenStateChange",
  "OnPlayerFinishedDownloading",
  "OnPlayerRequestDownload",
  "OnPlayerPreloadMap",
  "OnPlayerWeaponShot",
];

// Common constants
const PAWN_CONSTANTS = [
  "INVALID_PLAYER_ID",
  "INVALID_VEHICLE_ID",
  "INVALID_OBJECT_ID",
  "INVALID_ACTOR_ID",
  "INVALID_GANG_ZONE_ID",
  "INVALID_TEXT_DRAW_ID",
  "INVALID_MENU_ID",
  "INVALID_LABEL_ID",
  "INVALID_3DTEXT_ID",
  "MAX_PLAYERS",
  "MAX_VEHICLES",
  "MAX_OBJECTS",
  "MAX_ACTORS",
  "MAX_GANG_ZONES",
  "MAX_TEXT_DRAWS",
  "MAX_MENUS",
  "MAX_LABELS",
  "MAX_3DTEXT_DRAWS",
  "PLAYER_STATE_NONE",
  "PLAYER_STATE_ONFOOT",
  "PLAYER_STATE_DRIVER",
  "PLAYER_STATE_PASSENGER",
  "PLAYER_STATE_WASTED",
  "PLAYER_STATE_SPAWNED",
  "PLAYER_STATE_SPECTATING",
  "VEHICLE_STATE_UNOCCUPIED",
  "VEHICLE_STATE_DRIVER",
  "VEHICLE_STATE_PASSENGER",
  "VEHICLE_STATE_UNDRIVEN",
  "VEHICLE_STATE_DAMAGED",
  "VEHICLE_STATE_WRECKED",
];

// ZCMD - Command framework
const ZCMD_FUNCTIONS = [
  "OnPlayerCommandReceived",
  "OnPlayerCommandPerformed",
  "OnPlayerCommandText",
  "ProcessCommand",
];

const ZCMD_CONSTANTS = [
  "COMMAND_NOT_FOUND",
  "COMMAND_DISABLED",
  "COMMAND_PROCESSING",
  "COMMAND_PROCESSED",
];

// sscanf - String parsing library
const SSCANF_FUNCTIONS = [
  "sscanf",
  "unformat",
  "strtok",
  "strval",
  "floatstr",
];

const SSCANF_CONSTANTS = [
  "sscanf_QUIET",
  "sscanf_STRICT",
  "sscanf_ARRAY",
  "sscanf_STRING",
];

// YSI - Comprehensive library
const YSI_FUNCTIONS = [
  // y_commands
  "Command_Add",
  "Command_Remove",
  "Command_Process",
  "Command_IsValid",
  // y_dialog
  "Dialog_Show",
  "Dialog_Close",
  "Dialog_IsOpen",
  "Dialog_GetResponse",
  // y_timers
  "SetTimerEx",
  "KillTimer",
  "IsValidTimer",
  // y_players
  "Player_IsSpawned",
  "Player_IsConnected",
  "Player_GetName",
  "Player_GetID",
  // y_groups
  "Group_Create",
  "Group_Destroy",
  "Group_Add",
  "Group_Remove",
  // y_data
  "Data_Set",
  "Data_Get",
  "Data_Delete",
  // y_bit
  "Bit_Set",
  "Bit_Get",
  "Bit_Clear",
  "Bit_Toggle",
  // y_iterate
  "Iter_Create",
  "Iter_Add",
  "Iter_Remove",
  "Iter_Count",
  // y_stringhash
  "HASH",
  "Hash",
  "UnHash",
  // y_malloc
  "malloc",
  "free",
  "Malloc_Get",
  // y_hooks
  "hook",
  "HOOK",
];

const YSI_CONSTANTS = [
  // Dialog types
  "DIALOG_STYLE_MSGBOX",
  "DIALOG_STYLE_INPUT",
  "DIALOG_STYLE_LIST",
  "DIALOG_STYLE_PASSWORD",
  // Timer constants
  "TIMER_REPEAT",
  "TIMER_ONCE",
  // Bit constants
  "BIT_SIZE",
  "BIT_BYTE",
  "BIT_WORD",
  "BIT_CELL",
];

// Register Pawn language
export function registerPawnLanguage() {
  monaco.languages.register({ id: "pawn" });

  // Define Pawn tokenizer
  monaco.languages.setMonarchTokensProvider("pawn", {
    tokenizer: {
      root: [
        // Comments
        [/\/\/.*$/, "comment"],
        [/\/\*/, "comment", "@comment"],

        // Strings
        [/"(?:\\.|[^"\\])*"/, "string"],
        [/'(?:\\.|[^'\\])*'/, "string"],

        // Preprocessor directives
        [/#\s*(?:include|define|ifdef|ifndef|endif|pragma|if|else|elif|undef)/, "preprocessor"],

        // Numbers
        [/\b\d+\b/, "number"],
        [/\b0x[0-9a-fA-F]+\b/, "number"],

        // Keywords
        [
          /\b(?:public|static|stock|native|forward|const|new|delete|if|else|switch|case|default|for|while|do|break|continue|return|goto|asm|assert|sizeof|tagof|state|exit|enum|struct|operator|void|bool|char|int|float|string|cell|any)\b/,
          "keyword",
        ],

        // Identifiers
        [/[a-zA-Z_][a-zA-Z0-9_]*/, "identifier"],

        // Operators
        [/[{}()\[\].,;:=<>!&|+\-*/%^~?]/, "operator"],

        // Whitespace
        [/\s+/, "white"],
      ],

      comment: [
        [/[^*/]+/, "comment"],
        [/\*\//, "comment", "@pop"],
        [/[*/]/, "comment"],
      ],
    },
  });

  // Register hover provider for documentation
  monaco.languages.registerHoverProvider("pawn", createPawnHoverProvider());

  // Define theme
  monaco.editor.defineTheme("pawn-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "#6b7280" },
      { token: "string", foreground: "#fbbf24" },
      { token: "number", foreground: "#60a5fa" },
      { token: "keyword", foreground: "#10b981", fontStyle: "bold" },
      { token: "preprocessor", foreground: "#a78bfa" },
      { token: "operator", foreground: "#e4e6eb" },
      { token: "identifier", foreground: "#e4e6eb" },
    ],
    colors: {
      "editor.background": "#0f1419",
      "editor.foreground": "#e4e6eb",
      "editor.lineNumbersBackground": "#1a1f27",
      "editor.lineNumbersForeground": "#6b7280",
      "editor.selectionBackground": "rgba(16, 185, 129, 0.2)",
      "editor.selectionForeground": "#e4e6eb",
      "editor.inactiveSelectionBackground": "rgba(16, 185, 129, 0.1)",
      "editorCursor.foreground": "#10b981",
      "editorWhitespace.foreground": "#2d3748",
      "editorBracketMatch.background": "rgba(16, 185, 129, 0.2)",
      "editorBracketMatch.border": "#10b981",
    },
  });
}

// Create hover provider for documentation
export function createPawnHoverProvider() {
  return {
    provideHover: (model: any, position: any) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const wordText = word.word;
      const doc = getFunctionDoc(wordText);

      if (!doc) return null;

      const range = new monaco.Range(
        position.lineNumber,
        word.startColumn,
        position.lineNumber,
        word.endColumn
      );

      return {
        range: range,
        contents: [
          {
            value: formatDocumentation(doc),
            isTrusted: true,
            supportHtml: true,
          },
        ],
      };
    },
  };
}

// Create autocomplete provider
export function createPawnAutocompleteProvider() {
  return {
    provideCompletionItems: (model: any, position: any) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions: any[] = [];

      // Add keywords
      PAWN_KEYWORDS.forEach((keyword) => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range: range,
          documentation: `Pawn keyword: ${keyword}`,
        });
      });

      // Add SA-MP functions
      SAMP_FUNCTIONS.forEach((func) => {
        suggestions.push({
          label: func,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: func + "()",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          documentation: `SA-MP function: ${func}`,
        });
      });

      // Add callbacks
      SAMP_CALLBACKS.forEach((callback) => {
        suggestions.push({
          label: callback,
          kind: monaco.languages.CompletionItemKind.Event,
          insertText: `public ${callback}()\n{\n\t\n}`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          documentation: `SA-MP callback: ${callback}`,
        });
      });

      // Add constants
      PAWN_CONSTANTS.forEach((constant) => {
        suggestions.push({
          label: constant,
          kind: monaco.languages.CompletionItemKind.Constant,
          insertText: constant,
          range: range,
          documentation: `SA-MP constant: ${constant}`,
        });
      });

      // Add ZCMD functions
      ZCMD_FUNCTIONS.forEach((func) => {
        suggestions.push({
          label: func,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: func + "()",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          documentation: `ZCMD function: ${func}`,
        });
      });

      // Add ZCMD constants
      ZCMD_CONSTANTS.forEach((constant) => {
        suggestions.push({
          label: constant,
          kind: monaco.languages.CompletionItemKind.Constant,
          insertText: constant,
          range: range,
          documentation: `ZCMD constant: ${constant}`,
        });
      });

      // Add sscanf functions
      SSCANF_FUNCTIONS.forEach((func) => {
        suggestions.push({
          label: func,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: func + "()",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          documentation: `sscanf function: ${func}`,
        });
      });

      // Add sscanf constants
      SSCANF_CONSTANTS.forEach((constant) => {
        suggestions.push({
          label: constant,
          kind: monaco.languages.CompletionItemKind.Constant,
          insertText: constant,
          range: range,
          documentation: `sscanf constant: ${constant}`,
        });
      });

      // Add YSI functions
      YSI_FUNCTIONS.forEach((func) => {
        suggestions.push({
          label: func,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: func + "()",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          documentation: `YSI function: ${func}`,
        });
      });

      // Add YSI constants
      YSI_CONSTANTS.forEach((constant) => {
        suggestions.push({
          label: constant,
          kind: monaco.languages.CompletionItemKind.Constant,
          insertText: constant,
          range: range,
          documentation: `YSI constant: ${constant}`,
        });
      });

      // Add snippets
      const snippets = [
        {
          label: "if",
          insertText: "if (${1:condition})\n{\n\t${2}\n}",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "if statement",
        },
        {
          label: "else",
          insertText: "else\n{\n\t${1}\n}",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "else statement",
        },
        {
          label: "for",
          insertText: "for (${1:i} = 0; ${1:i} < ${2:max}; ${1:i}++)\n{\n\t${3}\n}",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "for loop",
        },
        {
          label: "while",
          insertText: "while (${1:condition})\n{\n\t${2}\n}",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "while loop",
        },
        {
          label: "switch",
          insertText: "switch (${1:value})\n{\n\tcase ${2:1}:\n\t\t${3}\n\t\tbreak;\n\tdefault:\n\t\t${4}\n}",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "switch statement",
        },
        {
          label: "public",
          insertText: "public ${1:FunctionName}(${2})\n{\n\t${3}\n}",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "public function",
        },
        {
          label: "stock",
          insertText: "stock ${1:FunctionName}(${2})\n{\n\t${3}\n}",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "stock function",
        },
        // ZCMD command snippet
        {
          label: "cmd",
          insertText: "CMD:${1:commandname}(playerid, params[])\n{\n\tif (isnull(params)) return SendClientMessage(playerid, -1, \"Usage: /${1:commandname} [args]\");\n\t${2}\n\treturn 1;\n}",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "ZCMD command template",
        },
        // sscanf parsing snippet
        {
          label: "sscanf_parse",
          insertText: "if (sscanf(params, \"${1:format}\", ${2:variables})) return SendClientMessage(playerid, -1, \"Invalid arguments!\");",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "sscanf parsing template",
        },
        // Dialog snippet
        {
          label: "dialog",
          insertText: "ShowPlayerDialog(playerid, ${1:dialogid}, DIALOG_STYLE_${2:MSGBOX}, \"${3:Title}\", \"${4:Body}\", \"${5:Button1}\", \"${6:Button2}\");",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "Dialog template",
        },
        // Timer snippet
        {
          label: "timer",
          insertText: "SetTimerEx(\"${1:TimerName}\", ${2:interval}, ${3:repeat}, \"i\", playerid);",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "Timer template",
        },
        // Message snippet
        {
          label: "msg",
          insertText: "SendClientMessage(playerid, -1, \"${1:message}\");",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "Send client message",
        },
        // Message to all snippet
        {
          label: "msgall",
          insertText: "SendClientMessageToAll(-1, \"${1:message}\");",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "Send message to all players",
        },
        // Check player connected
        {
          label: "checkplayer",
          insertText: "if (!IsPlayerConnected(${1:playerid})) return SendClientMessage(playerid, -1, \"Player not connected!\");",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "Check if player is connected",
        },
        // Get player ID by name
        {
          label: "getplayerid",
          insertText: "stock GetPlayerIDByName(name[])\n{\n\tfor (new i = 0; i < MAX_PLAYERS; i++) {\n\t\tif (!IsPlayerConnected(i)) continue;\n\t\tif (!strcmp(GetPlayerNameEx(i), name, true)) return i;\n\t}\n\treturn INVALID_PLAYER_ID;\n}",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "Get player ID by name function",
        },
        // Array iteration
        {
          label: "foreach",
          insertText: "for (new i = 0; i < sizeof(${1:array}); i++) {\n\t${2}\n}",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "Array iteration",
        },
        // String format
        {
          label: "format",
          insertText: "new string[${1:128}];\nformat(string, sizeof(string), \"${2:format}\", ${3:args});",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "String formatting",
        },
      ];

      snippets.forEach((snippet) => {
        suggestions.push({
          label: snippet.label,
          kind: snippet.kind,
          insertText: snippet.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          documentation: snippet.documentation,
        });
      });

      return { suggestions };
    },
  };
}
