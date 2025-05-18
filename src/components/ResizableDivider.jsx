import React from "react";
import { useRef } from "react";

export default function ResizableDivider({ onDrag }) {
  const isDragging = useRef(false);

  function handleMouseDown(e) {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
  }

  function handleMouseMove(e) {
    if (!isDragging.current) return;
    onDrag(e.clientX);
  }

  function handleMouseUp() {
    isDragging.current = false;
    document.body.style.cursor = "default";
  }

  // Attach mouse events to window on mount
  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className="w-2 bg-gray-300 hover:bg-blue-400 transition-all cursor-col-resize z-10"
      style={{ minWidth: 8, maxWidth: 16 }}
      onMouseDown={handleMouseDown}
      role="separator"
      aria-orientation="vertical"
      tabIndex={0}
    />
  );
}
