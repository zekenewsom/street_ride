import { useEffect } from "react";

export default function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-200"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 relative w-[90vw] max-w-3xl h-[80vh] flex flex-col transition-all duration-200 z-60">
        <button
          className="absolute top-2 right-2 text-xl font-bold bg-gray-100 hover:bg-blue-500 hover:text-white rounded-full w-10 h-10 flex items-center justify-center shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}