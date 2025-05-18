import { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";

export default function HeaderBar({ onSearchAddress }) {
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  const handlePlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    if (autocomplete && autocomplete.getPlace) {
      const place = autocomplete.getPlace();
      if (place && place.geometry && place.formatted_address) {
        if (onSearchAddress) onSearchAddress(place.formatted_address);
        if (inputRef.current) {
          inputRef.current.value = place.formatted_address;
        }
      }
    }
  };

  return (
    <header className="w-full h-16 bg-blue-600 text-white flex items-center px-6 shadow-lg relative">
      <h1 className="text-[10px] font-bold tracking-wide">Street Ride by Zeke & Daniella</h1>
      {/* Right side search bar */}
      <div
        className="absolute top-0 right-0 h-full flex items-center pr-4"
        style={{ minWidth: 0 }}
      >
        <Autocomplete
          onLoad={autocomplete => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            ref={inputRef}
            type="text"
            className="text-xs px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all w-40 sm:w-56 truncate"
            placeholder="Search address or place..."
            aria-label="Search address"
          />
        </Autocomplete>
        <button
          type="button"
          className="ml-2 px-2 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 text-xs font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          aria-label="Search address"
          onClick={() => {
            if (inputRef.current && onSearchAddress) {
              onSearchAddress(inputRef.current.value);
            }
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </div>
    </header>
  );
}
