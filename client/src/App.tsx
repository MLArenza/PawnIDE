import { useEffect, useRef, useState } from "react";
import MonacoEditorComponent from "@/components/MonacoEditor";
import ContextMenu from "@/components/ContextMenu";
import InputDialog from "@/components/InputDialog";
import SettingsModal from "@/components/SettingsModal";
import { loadPreferences, savePreferences, EditorPreferences } from "@/lib/preferences";
import "./App.css";

interface FileNode {
  name: string;
  path: string;
  kind: "file" | "directory";
  children?: FileNode[];
  handle?: FileSystemDirectoryHandle | FileSystemFileHandle;
}

interface OpenFile {
  path: string;
  name: string;
  content: string;
  isDirty: boolean;
  handle?: FileSystemFileHandle;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  targetPath?: string;
  targetKind?: "file" | "directory";
}

interface DialogState {
  visible: boolean;
  type: "rename" | "create-file" | "create-folder" | null;
  targetPath?: string;
}

export default function App() {
  const [projectRoot, setProjectRoot] = useState<FileSystemDirectoryHandle | null>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
  });
  const [dialog, setDialog] = useState<DialogState>({
    visible: false,
    type: null,
  });
  const [preferences, setPreferences] = useState<EditorPreferences>(loadPreferences());
  const [showSettings, setShowSettings] = useState(false);

  // Open folder using File System Access API
  const handleOpenFolder = async () => {
    try {
      const dirHandle = await (window as any).showDirectoryPicker();
      setProjectRoot(dirHandle);
      const tree = await buildFileTree(dirHandle);
      setFileTree(tree);
    } catch (err) {
      console.error("Failed to open folder:", err);
    }
  };

  // Build file tree recursively
  const buildFileTree = async (
    dirHandle: FileSystemDirectoryHandle,
    basePath = ""
  ): Promise<FileNode[]> => {
    const nodes: FileNode[] = [];
    try {
      for await (const entry of (dirHandle as any).entries()) {
        const [name, handle] = entry;
        const path = basePath ? `${basePath}/${name}` : name;

        // Skip hidden files and common non-essential directories
        if (name.startsWith(".")) continue;

        if (handle.kind === "directory") {
          const children = await buildFileTree(
            handle as FileSystemDirectoryHandle,
            path
          );
          nodes.push({
            name,
            path,
            kind: "directory",
            children,
            handle,
          });
        } else {
          nodes.push({
            name,
            path,
            kind: "file",
            handle: handle as FileSystemFileHandle,
          });
        }
      }
    } catch (err) {
      console.error("Error reading directory:", err);
    }
    return nodes.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "directory" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  };

  // Open file in editor
  const handleOpenFile = async (node: FileNode) => {
    if (node.kind !== "file") return;

    const existing = openFiles.find((f) => f.path === node.path);
    if (existing) {
      setActiveFilePath(node.path);
      setEditorContent(existing.content);
      return;
    }

    try {
      const handle = node.handle as FileSystemFileHandle;
      const file = await handle.getFile();
      const content = await file.text();

      const newFile: OpenFile = {
        path: node.path,
        name: node.name,
        content,
        isDirty: false,
        handle,
      };

      setOpenFiles([...openFiles, newFile]);
      setActiveFilePath(node.path);
      setEditorContent(content);
    } catch (err) {
      console.error("Failed to open file:", err);
    }
  };

  // Update editor content
  const handleEditorChange = (content: string) => {
    setEditorContent(content);

    const fileIndex = openFiles.findIndex((f) => f.path === activeFilePath);
    if (fileIndex !== -1) {
      const updated = [...openFiles];
      updated[fileIndex].isDirty = true;
      updated[fileIndex].content = content;
      setOpenFiles(updated);
    }
  };

  // Save current active file
  const handleSaveCurrentFile = () => {
    if (activeFilePath) {
      handleSaveFile(activeFilePath);
    }
  };

  // Handle keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveCurrentFile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFilePath, openFiles]);

  // Handle cursor position changes
  const handleCursorChange = (line: number, column: number) => {
    setCursorPos({ line, column });
  };

  // Save file
  const handleSaveFile = async (filePath: string) => {
    const fileIndex = openFiles.findIndex((f) => f.path === filePath);
    if (fileIndex === -1) return;

    const file = openFiles[fileIndex];
    try {
      const writable = await (file.handle as FileSystemFileHandle).createWritable();
      await writable.write(file.content);
      await writable.close();

      const updated = [...openFiles];
      updated[fileIndex].isDirty = false;
      setOpenFiles(updated);
    } catch (err) {
      console.error("Failed to save file:", err);
    }
  };

  // Close file tab
  const handleCloseTab = (filePath: string) => {
    const updated = openFiles.filter((f) => f.path !== filePath);
    setOpenFiles(updated);

    if (activeFilePath === filePath) {
      if (updated.length > 0) {
        setActiveFilePath(updated[0].path);
        setEditorContent(updated[0].content);
      } else {
        setActiveFilePath("");
        setEditorContent("");
      }
    }
  };

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent, path: string, kind: "file" | "directory") => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetPath: path,
      targetKind: kind,
    });
  };

  // Create new file
  const handleCreateFile = async (name: string) => {
    if (!projectRoot || !contextMenu.targetPath) return;

    try {
      const pathParts = contextMenu.targetPath.split("/");
      let dirHandle = projectRoot;

      for (const part of pathParts) {
        dirHandle = await (dirHandle as any).getDirectoryHandle(part, { create: false });
      }

      const fileHandle = await (dirHandle as any).getFileHandle(name, { create: true });
      await (fileHandle as any).createWritable().then((w: any) => w.close());

      // Refresh file tree
      const tree = await buildFileTree(projectRoot);
      setFileTree(tree);
    } catch (err) {
      console.error("Failed to create file:", err);
    }
  };

  // Delete file
  const handleDeleteFile = async (path: string) => {
    if (!projectRoot) return;

    try {
      const pathParts = path.split("/");
      const fileName = pathParts.pop();
      let dirHandle = projectRoot;

      for (const part of pathParts) {
        dirHandle = await (dirHandle as any).getDirectoryHandle(part, { create: false });
      }

      await (dirHandle as any).removeEntry(fileName);

      // Close file if it's open
      const fileIndex = openFiles.findIndex((f) => f.path === path);
      if (fileIndex !== -1) {
        handleCloseTab(path);
      }

      // Refresh file tree
      const tree = await buildFileTree(projectRoot);
      setFileTree(tree);
    } catch (err) {
      console.error("Failed to delete file:", err);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "s") {
          e.preventDefault();
          if (activeFilePath) handleSaveFile(activeFilePath);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeFilePath, openFiles]);

  // Filter file tree based on search
  const filteredFileTree = searchQuery
    ? filterFileTree(fileTree, searchQuery)
    : fileTree;

  const activeFile = openFiles.find((f) => f.path === activeFilePath);
  const charCount = editorContent.length;

  return (
    <div className="pawn-ide">
      {/* Header */}
      <header className="ide-header">
        <div className="header-left">
          <h1 className="logo">Pawn IDE</h1>
          {projectRoot && (
            <span className="project-name">
              {(projectRoot as any).name || "Project"}
            </span>
          )}
        </div>
        <div className="header-right">
          {activeFilePath && (
            <button
              className="btn-header btn-save"
              onClick={handleSaveCurrentFile}
              title="Save (Ctrl+S)"
            >
              💾 Save
            </button>
          )}
          <button className="btn-header" onClick={() => setShowSettings(true)}>
            ⚙️ Settings
          </button>
          <button className="btn-header" onClick={handleOpenFolder}>
            Open Folder
          </button>
        </div>
      </header>

      <div className="ide-container">
        {/* Sidebar */}
        <aside className="ide-sidebar">
          <div className="sidebar-header">
            <h2>Files</h2>
          </div>

          <input
            type="text"
            className="search-input"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="file-tree">
            {filteredFileTree.length === 0 ? (
              <p className="empty-state">No files. Open a folder to start.</p>
            ) : (
              filteredFileTree.map((node) => (
                <FileTreeNode
                  key={node.path}
                  node={node}
                  onFileClick={handleOpenFile}
                  onContextMenu={handleContextMenu}
                  activeFilePath={activeFilePath}
                />
              ))
            )}
          </div>
        </aside>

        {/* Main Editor Area */}
        <main className="ide-main">
          {openFiles.length === 0 ? (
            <div className="editor-empty">
              <p>No file open</p>
              <p className="hint">Open a folder and select a file to edit</p>
            </div>
          ) : (
            <>
              {/* Tab Bar */}
              <div className="tab-bar">
                {openFiles.map((file) => (
                  <div
                    key={file.path}
                    className={`tab ${
                      activeFilePath === file.path ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveFilePath(file.path);
                      setEditorContent(file.content);
                    }}
                  >
                    <span className="tab-name">{file.name}</span>
                    {file.isDirty && <span className="tab-dirty" title="Unsaved changes">●</span>}
                    <button
                      className="tab-close"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseTab(file.path);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Mobile Save Button */}
              {activeFilePath && (
                <div className="mobile-save-bar">
                  <button
                    className="btn-mobile-save"
                    onClick={handleSaveCurrentFile}
                  >
                    💾 Save
                  </button>
                </div>
              )}

              {/* Monaco Editor */}
              <MonacoEditorComponent
                value={editorContent}
                onChange={handleEditorChange}
                language="pawn"
                theme="pawn-dark"
                onCursorChange={handleCursorChange}
                preferences={preferences}
              />
            </>
          )}
        </main>
      </div>

      {/* Status Bar */}
      <footer className="ide-status-bar">
        <div className="status-item">
          {activeFile ? activeFile.name : "No file"}
        </div>
        <div className="status-item">
          Ln {cursorPos.line}, Col {cursorPos.column}
        </div>
        <div className="status-item">{charCount} characters</div>
        <div className="status-item">UTF-8</div>
        <div className="status-item">
          {activeFile
            ? activeFile.name.endsWith(".pwn")
              ? ".pwn"
              : activeFile.name.endsWith(".inc")
                ? ".inc"
                : "Text"
            : ""}
        </div>
      </footer>

      {/* Context Menu */}
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={[
            {
              label: "New File",
              icon: "📄",
              onClick: () => {
                setDialog({ visible: true, type: "create-file", targetPath: contextMenu.targetPath });
                setContextMenu({ visible: false, x: 0, y: 0 });
              },
            },
            {
              label: "New Folder",
              icon: "📁",
              onClick: () => {
                setDialog({ visible: true, type: "create-folder", targetPath: contextMenu.targetPath });
                setContextMenu({ visible: false, x: 0, y: 0 });
              },
            },
            { label: "", separator: true, onClick: () => {} },
            {
              label: "Delete",
              icon: "🗑️",
              onClick: () => {
                if (contextMenu.targetPath) {
                  handleDeleteFile(contextMenu.targetPath);
                }
                setContextMenu({ visible: false, x: 0, y: 0 });
              },
            },
          ]}
          onClose={() => setContextMenu({ visible: false, x: 0, y: 0 })}
        />
      )}

      {/* Input Dialog */}
      {dialog.visible && dialog.type && (
        <InputDialog
          title={
            dialog.type === "create-file"
              ? "Create New File"
              : dialog.type === "create-folder"
                ? "Create New Folder"
                : "Rename"
          }
          placeholder={
            dialog.type === "create-file"
              ? "filename.pwn"
              : dialog.type === "create-folder"
                ? "folder name"
                : "new name"
          }
          onConfirm={(value) => {
            if (dialog.type === "create-file") {
              handleCreateFile(value);
            }
            setDialog({ visible: false, type: null });
          }}
          onCancel={() => setDialog({ visible: false, type: null })}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          preferences={preferences}
          onPreferencesChange={(newPrefs) => {
            setPreferences(newPrefs);
            savePreferences(newPrefs);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

interface FileTreeNodeProps {
  node: FileNode;
  onFileClick: (node: FileNode) => void;
  onContextMenu: (e: React.MouseEvent, path: string, kind: "file" | "directory") => void;
  activeFilePath: string;
  level?: number;
}

function FileTreeNode({
  node,
  onFileClick,
  onContextMenu,
  activeFilePath,
  level = 0,
}: FileTreeNodeProps) {
  const [expanded, setExpanded] = useState(false);

  const isActive = node.kind === "file" && node.path === activeFilePath;

  return (
    <div key={node.path}>
      <div
        className={`tree-item ${isActive ? "active" : ""}`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => {
          if (node.kind === "directory") {
            setExpanded(!expanded);
          } else {
            onFileClick(node);
          }
        }}
        onContextMenu={(e) => onContextMenu(e, node.path, node.kind)}
      >
        {node.kind === "directory" && (
          <span className="tree-icon">{expanded ? "▼" : "▶"}</span>
        )}
        {node.kind === "file" && <span className="tree-icon">•</span>}
        <span className="tree-name">{node.name}</span>
      </div>

      {node.kind === "directory" && expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              onFileClick={onFileClick}
              onContextMenu={onContextMenu}
              activeFilePath={activeFilePath}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Filter file tree based on search query
function filterFileTree(nodes: FileNode[], query: string): FileNode[] {
  const lowercaseQuery = query.toLowerCase();

  return nodes
    .filter((node) => {
      if (node.name.toLowerCase().includes(lowercaseQuery)) {
        return true;
      }
      if (node.kind === "directory" && node.children) {
        return filterFileTree(node.children, query).length > 0;
      }
      return false;
    })
    .map((node) => {
      if (node.kind === "directory" && node.children) {
        return {
          ...node,
          children: filterFileTree(node.children, query),
        };
      }
      return node;
    });
}
