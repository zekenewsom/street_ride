import HeaderBar from './components/HeaderBar';
import SplitScreen from './components/SplitScreen';
import Footer from './components/Footer';
import ControlsBar from './components/ControlsBar';
import { useState, useMemo } from 'react';
import { interpolateRoute } from './utils/interpolateRoute';
import { usePlayback } from './hooks/usePlayback';
import { useSessionStorage } from './hooks/useSessionStorage';
import { decodeWaypoints } from './utils/shareUtils';

export default function App() {
  function getInitialWaypoints() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('route')) {
      return decodeWaypoints(params.get('route'));
    }
    return null;
  }

  const [waypoints, setWaypoints] = useSessionStorage(
    'waypoints',
    getInitialWaypoints() || []
  );
  const [polyline, setPolyline] = useState([]);
  const [stats, setStats] = useState(null);

  const interpolatedRoute = useMemo(
    () => interpolateRoute(polyline, 15),
    [polyline]
  );

  // Set default playback speed to 1x
  const playback = usePlayback(interpolatedRoute, 1);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <HeaderBar />
      <div className="flex-1 flex flex-col relative">
        <SplitScreen
          waypoints={waypoints}
          setWaypoints={setWaypoints}
          polyline={polyline}
          setPolyline={setPolyline}
          stats={stats}
          setStats={setStats}
          playback={playback}
        />
      </div>
      <ControlsBar playback={playback} stats={stats} />
      <Footer />
    </div>
  );
}
