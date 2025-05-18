import HeaderBar from './components/HeaderBar';
import SplitScreen from './components/SplitScreen';
import Footer from './components/Footer';
import ControlsBar from './components/ControlsBar';
import { useState, useMemo } from 'react';
import { interpolateRoute } from './utils/interpolateRoute';
import { usePlayback } from './hooks/usePlayback';
import { useSessionStorage } from './hooks/useSessionStorage';
import { useLoadScript } from "@react-google-maps/api"; // ADD THIS

// Helper: Google Geocoding API
async function geocodeAddress(address) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status === "OK" && data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  }
  return null;
}

export default function App() {
  // Load Google Maps JS API with "places" library for autocomplete
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [mapCenter, setMapCenter] = useState(null);

  // App.jsx -- only the handleSearchAddress function needs to be changed:
  async function handleSearchAddress(address, lat = null, lng = null) {
    if (lat != null && lng != null) {
      setMapCenter({ lat, lng });
      return;
    }
    // Fallback: use geocode
    const result = await geocodeAddress(address);
    if (result) setMapCenter(result);
  }


  const [waypoints, setWaypoints] = useSessionStorage('waypoints', []);
  const [polyline, setPolyline] = useState([]);
  const [stats, setStats] = useState(null);

  const interpolatedRoute = useMemo(
    () => interpolateRoute(polyline, 15),
    [polyline]
  );

  // Set default playback speed to 1x
  const playback = usePlayback(interpolatedRoute, 0.25);

  if (loadError) return <div className="p-10">Error loading Google Maps API</div>;
  if (!isLoaded) return <div className="p-10">Loading Maps…</div>;

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <HeaderBar onSearchAddress={handleSearchAddress} />
      <div className="flex-1 flex flex-col relative">
        <SplitScreen
          waypoints={waypoints}
          setWaypoints={setWaypoints}
          polyline={polyline}
          setPolyline={setPolyline}
          stats={stats}
          setStats={setStats}
          playback={playback}
          mapCenter={mapCenter}
        />
      </div>
      <ControlsBar playback={playback} stats={stats} />
      <Footer />
    </div>
  );
}
