import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { registerPawnLanguage, createPawnAutocompleteProvider } from "@/lib/pawnLanguage";
import { EditorPreferences } from "@/lib/preferences";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
  readOnly?: boolean;
  onCursorChange?: (line: number, column: number) => void;
  preferences?: EditorPreferences;
}

export default function MonacoEditorComponent({
  value,
  onChange,
  language = "pawn",
  theme = "pawn-dark",
  readOnly = false,
  onCursorChange,
  preferences,
}: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const modelRef = useRef<monaco.editor.ITextModel | null>(null);

  useEffect(() => {
    // Register Pawn language on first mount
    registerPawnLanguage();

    if (!containerRef.current) return;

    // Create editor with preferences
    const editorTheme = preferences?.theme || theme;
    const fontSize = preferences?.fontSize || 13;
    const minimapEnabled = preferences?.minimapEnabled ?? true;

    const editor = monaco.editor.create(containerRef.current, {
      value: value,
      language: language,
      theme: editorTheme,
      readOnly: readOnly,
      automaticLayout: true,
      minimap: { enabled: minimapEnabled },
      lineNumbers: "on",
      scrollBeyondLastLine: false,
      wordWrap: "on",
      tabSize: 4,
      insertSpaces: true,
      formatOnPaste: true,
      formatOnType: true,
      autoClosingBrackets: "always",
      autoClosingQuotes: "always",
      autoSurround: "languageDefined",
      bracketPairColorization: {
        enabled: true,
      },
      guides: {
        bracketPairs: true,
        bracketPairsHorizontal: true,
        highlightActiveBracketPair: true,
        indentation: true,
      },
      fontSize: fontSize,
      fontFamily: "Monaco, Courier New, monospace",
      fontLigatures: false,
      lineHeight: 1.6 * fontSize,
      padding: { top: 12, bottom: 12 },
      renderWhitespace: "selection",
      renderControlCharacters: true,
      scrollbar: {
        vertical: "auto",
        horizontal: "auto",
        useShadows: false,
        verticalSliderSize: 10,
        horizontalSliderSize: 10,
      },
    });

    editorRef.current = editor;
    modelRef.current = editor.getModel();

    // Register autocomplete provider
    const provider = createPawnAutocompleteProvider();
    const disposable = monaco.languages.registerCompletionItemProvider(language, provider);

    // Handle content changes
    const changeDisposable = editor.onDidChangeModelContent(() => {
      const content = editor.getValue();
      onChange(content);
    });

    // Handle cursor changes
    const cursorDisposable = editor.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        onCursorChange(e.position.lineNumber, e.position.column);
      }
    });

    // Keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      const action = editor.getAction("actions.find");
      if (action) action.run();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
      const action = editor.getAction("editor.action.startFindReplaceAction");
      if (action) action.run();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG, () => {
      const action = editor.getAction("editor.action.gotoLine");
      if (action) action.run();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, () => {
      editor.trigger("", "undo", null);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, () => {
      editor.trigger("", "redo", null);
    });

    return () => {
      changeDisposable.dispose();
      cursorDisposable.dispose();
      disposable.dispose();
      editor.dispose();
    };
  }, []);

  // Update content when value prop changes (but not from onChange)
  useEffect(() => {
    if (editorRef.current && modelRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== value) {
        editorRef.current.setValue(value);
      }
    }
  }, [value]);

  // Update editor preferences when they change
  useEffect(() => {
    if (!editorRef.current || !preferences) return;

    editorRef.current.updateOptions({
      fontSize: preferences.fontSize,
      lineHeight: 1.6 * preferences.fontSize,
      minimap: { enabled: preferences.minimapEnabled },
    });

    // Update theme if it changed
    if (preferences.theme) {
      monaco.editor.setTheme(preferences.theme);
    }
  }, [preferences]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
