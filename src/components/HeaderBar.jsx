import { useState } from "react";

export default function HeaderBar({ onSearchAddress }) {
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (address.trim() && onSearchAddress) {
      onSearchAddress(address.trim());
    }
  };

  return (
    <header className="w-full h-16 bg-blue-600 text-white flex items-center px-6 shadow-lg relative">
      <h1 className="text-[10px] font-bold tracking-wide">Street Ride by Zeke & Daniella</h1>
      <form
        onSubmit={handleSubmit}
        className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2"
        style={{ minWidth: 0 }}
      >
        <input
          type="text"
          className="text-xs px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all w-40 sm:w-56 truncate"
          placeholder="Search address..."
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <button
          type="submit"
          className="px-2 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 text-xs font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          aria-label="Search address"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </form>
    </header>
  );
}

  