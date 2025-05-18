import React, { useState, useEffect, useMemo } from "react";
import ResizableDivider from "./ResizableDivider";
import MapPanel from "./MapPanel";
import StreetViewPanel from "./StreetViewPanel";
import Modal from "./Modal";
import SharePanel from "./SharePanel";
import ControlsBar from "./ControlsBar";
import { interpolateRoute } from "../utils/interpolateRoute";
import { usePlayback } from "../hooks/usePlayback";
import { useSessionStorage } from "../hooks/useSessionStorage";
import { decodeWaypoints } from "../utils/shareUtils";

export default function SplitScreen() {
  function getInitialWaypoints() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("route")) {
      return decodeWaypoints(params.get("route"));
    }
    return null;
  }

  const [waypoints, setWaypoints] = useSessionStorage(
    "waypoints",
    getInitialWaypoints() || []
  );
  const [leftWidth, setLeftWidth] = useSessionStorage(
    "splitWidth",
    window.innerWidth / 2
  );
  const [polyline, setPolyline] = useState([]);
  const [stats, setStats] = useState(null);
  const [popoutOpen, setPopoutOpen] = useState(false);

  const interpolatedRoute = useMemo(
    () => interpolateRoute(polyline, 15),
    [polyline]
  );

  // Set default playback speed to 1x
  const playback = usePlayback(interpolatedRoute, 1);

  function calculateHeading(a, b) {
    if (!a || !b) return 0;
    const dLng = b.lng - a.lng;
    const y = Math.sin(dLng * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180);
    const x =
      Math.cos(a.lat * Math.PI / 180) * Math.sin(b.lat * Math.PI / 180) -
      Math.sin(a.lat * Math.PI / 180) *
        Math.cos(b.lat * Math.PI / 180) *
        Math.cos(dLng * Math.PI / 180);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  }

  const currentPosition = playback.position || waypoints[0];
  const nextPosition =
    interpolatedRoute[playback.index + 1] || interpolatedRoute[playback.index];
  const streetViewHeading = calculateHeading(currentPosition, nextPosition);

  function handleDrag(clientX) {
    const min = window.innerWidth * 0.2;
    const max = window.innerWidth * 0.8;
    if (clientX < min) setLeftWidth(min);
    else if (clientX > max) setLeftWidth(max);
    else setLeftWidth(clientX);
  }

  useEffect(() => {
    function onResize() {
      setLeftWidth(window.innerWidth / 2);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-1 h-[calc(100vh-96px)] bg-gray-100">
        {/* Street View panel (with popout button and modal) */}
        <div className="flex items-stretch transition-all" style={{ width: leftWidth }}>
          <div className="relative w-full h-full">
            <button
              className="absolute top-2 right-2 bg-white bg-opacity-70 hover:bg-blue-500 hover:text-white px-3 py-1 rounded shadow"
              onClick={() => setPopoutOpen(true)}
              title="Pop out"
            >⤢</button>
            <StreetViewPanel
              position={currentPosition}
              pov={{ heading: streetViewHeading, pitch: 0 }}
            />
          </div>
        </div>
        <Modal open={popoutOpen} onClose={() => setPopoutOpen(false)}>
          <div className="w-full h-full">
            <StreetViewPanel
              position={currentPosition}
              pov={{ heading: streetViewHeading, pitch: 0 }}
            />
          </div>
        </Modal>
        <ResizableDivider onDrag={handleDrag} />
        <div className="flex-1 flex items-stretch" style={{ minWidth: 0 }}>
          <MapPanel
            waypoints={waypoints}
            setWaypoints={setWaypoints}
            polyline={polyline}
            setPolyline={setPolyline}
            setStats={setStats}
            animatedMarker={currentPosition}
          />
        </div>
        {/* Share Panel trigger */}
        <div className="absolute top-2 left-2 z-30">
          <SharePanel waypoints={waypoints} />
        </div>
      </div>

    </div>
  );
}
