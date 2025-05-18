import { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";

export default function HeaderBar({ onSearchAddress }) {
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  // Called when user picks a suggestion from dropdown
  const handlePlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    if (autocomplete && autocomplete.getPlace) {
      const place = autocomplete.getPlace();
      // Prefer geometry/location for recentering the map
      if (place && place.geometry && place.formatted_address) {
        if (onSearchAddress) {
          // Use lat/lng instead of just the string
          onSearchAddress(place.formatted_address, place.geometry.location.lat(), place.geometry.location.lng());
        }
        if (inputRef.current) {
          inputRef.current.value = place.formatted_address;
        }
      }
    }
  };

  // Handles enter or button: uses autocomplete if loaded, falls back to geocode string
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const val = inputRef.current ? inputRef.current.value : "";
    if (!val.trim()) return;
    // If Autocomplete is loaded and a place is selected, use that, else fall back to string
    const autocomplete = autocompleteRef.current;
    if (
      autocomplete &&
      autocomplete.getPlace &&
      autocomplete.getPlace() &&
      autocomplete.getPlace().geometry
    ) {
      // Just trigger handlePlaceChanged
      handlePlaceChanged();
    } else if (onSearchAddress) {
      // Fall back to searching by address string
      onSearchAddress(val.trim());
    }
  };

  return (
    <header className="w-full h-16 bg-blue-600 text-white flex items-center px-6 shadow-lg relative">
      <h1 className="text-[10px] font-bold tracking-wide">Street Ride by Zeke & Daniella</h1>
      {/* Absolutely position search on far right, always */}
      <form
        className="absolute right-0 top-0 h-full flex items-center pr-4 z-10"
        style={{ minWidth: 0 }}
        onSubmit={handleSubmit}
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
            onKeyDown={e => {
              if (e.key === "Enter") handleSubmit(e);
            }}
          />
        </Autocomplete>
        <button
          type="submit"
          className="ml-2 px-2 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 text-xs font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          aria-label="Search address"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </form>
    </header>
  );
}
