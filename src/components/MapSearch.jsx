import { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";

export default function MapSearch({ onSearchAddress }) {
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  const handlePlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    if (autocomplete && autocomplete.getPlace) {
      const place = autocomplete.getPlace();
      if (place && place.geometry && place.formatted_address) {
        if (onSearchAddress) {
          onSearchAddress(
            place.formatted_address,
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );
        }
        if (inputRef.current) {
          inputRef.current.value = place.formatted_address;
        }
      }
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const val = inputRef.current ? inputRef.current.value : "";
    if (!val.trim()) return;
    const autocomplete = autocompleteRef.current;
    if (
      autocomplete &&
      autocomplete.getPlace &&
      autocomplete.getPlace() &&
      autocomplete.getPlace().geometry
    ) {
      handlePlaceChanged();
    } else if (onSearchAddress) {
      onSearchAddress(val.trim());
    }
  };

  return (
    <form
      className="flex items-center gap-2 bg-white bg-opacity-90 rounded-xl shadow-xl px-2 py-1 border border-gray-200"
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
          className="text-xs px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all w-44 sm:w-56 truncate"
          placeholder="Search address or place..."
          aria-label="Search address"
          onKeyDown={e => {
            if (e.key === "Enter") handleSubmit(e);
          }}
        />
      </Autocomplete>
      <button
        type="submit"
        className="px-2 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 text-xs font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        aria-label="Search address"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
    </form>
  );
}
