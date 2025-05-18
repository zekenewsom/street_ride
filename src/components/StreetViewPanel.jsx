import React, { useEffect, useRef } from "react";

export default function StreetViewPanel({ position, pov, onPovChange, onPositionChange }) {
  const panoRef = useRef(null);
  const panorama = useRef(null);

  useEffect(() => {
    if (window.google && panoRef.current) {
      if (!panorama.current) {
        panorama.current = new window.google.maps.StreetViewPanorama(panoRef.current, {
          position: position || { lat: 37.7749, lng: -122.4194 },
          pov: pov || { heading: 0, pitch: 0 },
          visible: true,
          motionTracking: false,
          addressControl: false,
          showRoadLabels: true,
        });

        panorama.current.addListener("pov_changed", () => {
          if (onPovChange) onPovChange(panorama.current.getPov());
        });

        panorama.current.addListener("position_changed", () => {
          if (onPositionChange) onPositionChange(panorama.current.getPosition().toJSON());
        });
      } else {
        panorama.current.setPosition(position);
        if (pov) panorama.current.setPov(pov);
      }
    }
  }, [position, pov, onPovChange, onPositionChange]);

  return (
    <div
      ref={panoRef}
      className="w-full h-full min-h-[400px] rounded-2xl shadow-xl font-sans font-medium transition-all bg-gray-50 overflow-hidden"
    />
  );
}
