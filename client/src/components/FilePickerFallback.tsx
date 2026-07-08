import { useState } from "react";
import "./FilePickerFallback.css";

interface FilePickerFallbackProps {
  onFilesSelected: (files: File[]) => void;
  onCancel: () => void;
}

export default function FilePickerFallback({
  onFilesSelected,
  onCancel,
}: FilePickerFallbackProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pawnFiles = files.filter((file) =>
      file.name.endsWith(".pwn") || file.name.endsWith(".inc")
    );

    if (pawnFiles.length > 0) {
      onFilesSelected(pawnFiles);
    } else {
      alert("Please drop .pwn or .inc files");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  return (
    <>
      <div className="file-picker-overlay" onClick={onCancel} />
      <div className="file-picker-modal">
        <div className="file-picker-header">
          <h2>Open Files</h2>
          <button className="file-picker-close" onClick={onCancel}>
            X
          </button>
        </div>

        <div className="file-picker-body">
          <div
            className={`file-picker-dropzone ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="dropzone-content">
              <div className="dropzone-icon">📁</div>
              <h3>Drag and drop files here</h3>
              <p>or</p>
              <label className="file-picker-button">
                <input
                  type="file"
                  multiple
                  accept=".pwn,.inc,text/plain"
                  onChange={handleFileInput}
                  style={{ display: "none" }}
                />
                Browse Files
              </label>
              <p className="dropzone-hint">.pwn and .inc files</p>
            </div>
          </div>

          <div className="file-picker-info">
            <h4>About this fallback</h4>
            <p>
              This device does not support the File System Access API. You can still open and edit
              Pawn files by:
            </p>
            <ul>
              <li>Dragging and dropping files here</li>
              <li>Clicking Browse Files to select files</li>
              <li>Files are stored locally in the browser</li>
            </ul>
          </div>
        </div>

        <div className="file-picker-footer">
          <button className="file-picker-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
