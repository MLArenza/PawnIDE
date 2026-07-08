import { useState } from "react";
import "./ContextMenu.css";

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

interface ContextMenuItem {
  label?: string;
  icon?: string;
  onClick: () => void;
  disabled?: boolean;
  separator?: boolean;
}

export default function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const [visible, setVisible] = useState(true);

  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled && !item.separator) {
      item.onClick();
      setVisible(false);
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <>
      <div className="context-menu-overlay" onClick={() => setVisible(false)} />
      <div className="context-menu" style={{ top: `${y}px`, left: `${x}px` }}>
        {items.map((item, index) => (
          <div key={index}>
            {item.separator ? (
              <div className="context-menu-separator" />
            ) : (
              <button
                className={`context-menu-item ${item.disabled ? "disabled" : ""}`}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
              >
                {item.icon && <span className="context-menu-icon">{item.icon}</span>}
                <span className="context-menu-label">{item.label}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
