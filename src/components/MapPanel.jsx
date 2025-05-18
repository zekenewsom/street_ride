import React, { useEffect, useRef, useCallback, useState } from "react";
import { GoogleMap, useLoadScript, Polyline, Marker } from "@react-google-maps/api";
import { fetchRouteJS } from "../utils/routeUtils";
import MapSearch from "./MapSearch";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1.25rem",
  boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
};
const center = { lat: 37.7749, lng: -122.4194 };

export default function MapPanel({
  waypoints,
  setWaypoints,
  polyline,
  setPolyline,
  setStats,
  animatedMarker,
  mapCenter,
  onSearchAddress
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const mapRef = useRef(null);

  // Draw/edit handlers
  const handleMapClick = useCallback(
    (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setWaypoints((prev) => [...prev, { lat, lng }]);
    },
    [setWaypoints]
  );

  const handleMarkerDragEnd = useCallback(
    (idx, event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setWaypoints((prev) => prev.map((wp, i) => (i === idx ? { lat, lng } : wp)));
    },
    [setWaypoints]
  );

  const handleMarkerRightClick = useCallback(
    (idx) => {
      setWaypoints((prev) => prev.filter((_, i) => i !== idx));
    },
    [setWaypoints]
  );

  // Auto-fetch route on waypoints change
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    if (waypoints.length < 2) {
      setPolyline([]);
      if (setStats) setStats(null);
      return;
    }
    fetchRouteJS(waypoints, mapRef.current).then((route) => {
      if (route) {
        setPolyline(route.polyline);
        if (setStats)
          setStats({
            distance: route.distance,
            duration: route.duration,
          });
      }
    });
  }, [waypoints, isLoaded, setPolyline, setStats]);

  // Dropdown state
  const [showDropdown, setShowDropdown] = useState(false);

  // Pan map when mapCenter changes
  useEffect(() => {
    if (mapCenter && mapRef.current) {
      mapRef.current.panTo(mapCenter);
    }
  }, [mapCenter]);

  if (!isLoaded)
    return (
      <div className="w-full h-full flex items-center justify-center font-sans font-medium text-lg">
        Loading Map...
      </div>
    );

  return (
    <div className="relative w-full h-full flex">
      {/* Stack search bar and waypoints dropdown vertically, top-right */}
      <div className="absolute top-6 right-8 z-40 flex flex-col gap-4 items-end">
        {/* Search Bar (top) */}
        <MapSearch onSearchAddress={onSearchAddress} />
        {/* Waypoints Dropdown Button and Card */}
        <div className="relative z-30">
          <button
            onClick={() => setShowDropdown((s) => !s)}
            className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-2xl border-4 border-white transition-all focus:outline-none focus:ring-8 focus:ring-blue-400 duration-150"
            aria-label={showDropdown ? "Hide waypoints list" : "Show waypoints list"}
          >
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.2 10.62 8.13 11.31a1.5 1.5 0 0 0 1.74 0C13.8 21.62 21 16.25 21 11c0-4.97-4.03-9-9-9Zm0 13.25a4.25 4.25 0 1 1 0-8.5 4.25 4.25 0 0 1 0 8.5Z" />
            </svg>
          </button>
          {/* Dropdown Card */}
          <div
            className={`origin-top-right mt-3 right-0 min-w-[320px] sm:min-w-[370px] bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 font-sans font-medium absolute transition-all duration-200 ${
              showDropdown
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
            style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
            tabIndex={-1}
            aria-label="Waypoints dropdown menu"
          >
            <div className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="inline-block bg-black text-white rounded-full px-3 py-1 text-base font-semibold tracking-wide">
                Waypoints
              </span>
            </div>
            {waypoints.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center text-gray-400">
                <svg
                  className="w-10 h-10 mb-2 text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 48 48"
                >
                  <circle cx="24" cy="24" r="22" strokeDasharray="4 4" />
                  <path d="M24 16v16M16 24h16" strokeLinecap="round" />
                </svg>
                <span className="font-semibold text-base">
                  Click on the map to start your route!
                </span>
              </div>
            ) : (
              <ol className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                {waypoints.map((wp, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-5 bg-gradient-to-r from-blue-100/70 to-white rounded-2xl px-5 py-4 shadow-lg border border-blue-200"
                  >
                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-extrabold text-xl shadow-lg border-2 border-white">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-gray-900 truncate text-lg font-semibold">
                      Lat {wp.lat.toFixed(4)}, Lng {wp.lng.toFixed(4)}
                    </span>
                    <button
                      onClick={() => handleMarkerRightClick(idx)}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-500 text-gray-600 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-red-400 text-2xl shadow border border-gray-300"
                      aria-label={`Remove waypoint ${idx + 1}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="w-7 h-7"
                      >
                        <line x1="6" y1="6" x2="18" y2="18" />
                        <line x1="6" y1="18" x2="18" y2="6" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
      {/* Map Area */}
      <div className="flex-1 rounded-2xl shadow-xl overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter || waypoints[0] || center}
          zoom={13}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          {/* Draw route polyline */}
          {polyline.length > 1 && (
            <Polyline
              path={polyline}
              options={{
                strokeColor: "#1D4ED8",
                strokeOpacity: 0.9,
                strokeWeight: 4,
                clickable: false,
              }}
            />
          )}
          {/* Animated marker */}
          {animatedMarker && (
            <Marker
              position={animatedMarker}
              animation={window.google.maps.Animation.BOUNCE}
            />
          )}
          {/* Markers for each waypoint */}
          {waypoints.map((wp, idx) => (
            <Marker
              key={idx}
              position={wp}
              draggable
              onDragEnd={(e) => handleMarkerDragEnd(idx, e)}
              onRightClick={() => handleMarkerRightClick(idx)}
              label={(idx + 1).toString()}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}
