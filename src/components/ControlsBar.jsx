import { useEffect, useRef } from "react";
import { cumulativeDistance } from '../utils/interpolateRoute';

export default function ControlsBar({
  playback = {
    setIsPlaying: () => {},
    isPlaying: false,
    stepBackward: () => {},
    stepForward: () => {},
    setIndex: () => {},
    index: 0,
    length: 1,
    playSpeed: 0.25,
    setPlaySpeed: () => {},
    interpolatedRoute: [],
  },
  stats = null,
  interpolatedRoute = [],
}) {
  const barRef = useRef(null);
  useEffect(() => {
    if (barRef.current) {
      barRef.current.classList.add("animate-fadein-slideup");
    }
  }, []);

  const minDisplaySpeed = 0.1;
  const maxDisplaySpeed = 5.0;
  const stepDisplaySpeed = 0.1;

  // Calculate live progress in miles along the route
  const milesSoFar =
    interpolatedRoute && interpolatedRoute.length > 1
      ? cumulativeDistance(interpolatedRoute, playback.index) / 1609.34
      : 0;
  const totalMiles =
    interpolatedRoute && interpolatedRoute.length > 1
      ? cumulativeDistance(interpolatedRoute, interpolatedRoute.length - 1) / 1609.34
      : 0;

  // Progress label for below the step bar
  const progressLabel =
    interpolatedRoute.length > 1
      ? `${milesSoFar.toFixed(2)} of ${totalMiles.toFixed(2)} mi`
      : `Step ${playback.index + 1} / ${playback.length}`;

  let speedValue = Number(playback.playSpeed / 0.25);
  let speedLabel = speedValue % 1 === 0 ? `${speedValue.toFixed(0)}x` : `${speedValue.toFixed(1)}x`;

  return (
    <div className="w-full flex justify-center pointer-events-none mb-3 relative">
      <div
        ref={barRef}
        className="pointer-events-auto w-full max-w-4xl rounded-2xl bg-white shadow-2xl flex flex-row items-center px-7 py-3 font-sans border border-gray-200 relative"
        style={{
          boxSizing: "border-box",
          fontFamily: "Inter, sans-serif",
          marginBottom: "10px",
        }}
      >
        {/* LEFT: Step Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0 z-10">
          <button
            onClick={playback.stepBackward}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:bg-blue-100 hover:border-blue-500 shadow-md transition-all text-blue-500 text-2xl outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Step backward"
            tabIndex={0}
          >
            <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <polyline points="16 20 8 12 16 4" />
            </svg>
          </button>
          <button
            onClick={() => playback.setIsPlaying((v) => !v)}
            className={`w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl border-4 border-blue-200 transition-all text-white text-3xl outline-none focus:ring-2 focus:ring-blue-400`}
            aria-label={playback.isPlaying ? "Pause playback" : "Play playback"}
            tabIndex={0}
            style={{ margin: "0 0.75rem" }}
          >
            {playback.isPlaying ? (
              <svg width={28} height={28} fill="none" viewBox="0 0 40 40">
                <rect x={10} y={8} width={6} height={24} rx={3} fill="white" />
                <rect x={24} y={8} width={6} height={24} rx={3} fill="white" />
              </svg>
            ) : (
              <svg width={28} height={28} fill="white" viewBox="0 0 40 40">
                <polygon points="14,8 32,20 14,32" />
              </svg>
            )}
          </button>
          <button
            onClick={playback.stepForward}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:bg-blue-100 hover:border-blue-500 shadow-md transition-all text-blue-500 text-2xl outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Step forward"
            tabIndex={0}
          >
            <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <polyline points="8 20 16 12 8 4" />
            </svg>
          </button>
        </div>

        {/* CENTER: Absolute, perfectly centered progression slider and stats */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full"
          style={{ pointerEvents: "auto" }}
        >
          <div className="flex w-full justify-center">
            <div className="w-full max-w-2xl flex items-center gap-2">
              <span className="text-xs text-gray-700 font-medium w-14 text-right truncate select-none">
                {playback.length > 1 ? `Step ${playback.index + 1}` : ""}
              </span>
              <input
                type="range"
                min={0}
                max={playback.length - 1}
                value={playback.index}
                onChange={(e) => playback.setIndex(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 rounded-lg bg-gray-200"
                aria-label="Playback position"
                style={{
                  height: 8,
                  minWidth: 180,
                  maxWidth: 560, // wider!
                }}
              />
              <span className="text-xs text-gray-700 font-medium w-14 text-left truncate select-none">
                {playback.length > 1 ? `/${playback.length}` : ""}
              </span>
            </div>
          </div>
          {/* Centered mileage label under bar */}
          <div className="flex justify-center w-full text-xs mt-2 text-gray-800">
            <span className="mx-auto">{progressLabel}</span>
          </div>
        </div>

        {/* RIGHT: Speed control */}
        <div className="flex flex-col items-center ml-auto flex-shrink-0 z-10">
          <input
            type="range"
            min={minDisplaySpeed}
            max={maxDisplaySpeed}
            step={stepDisplaySpeed}
            value={Number((playback.playSpeed / 0.25).toFixed(2))}
            onChange={(e) =>
              playback.setPlaySpeed(Number(e.target.value) * 0.25)
            }
            className="w-24 accent-blue-600"
            aria-label="Playback speed"
          />
          <span className="mt-1 text-xs text-gray-600 rounded-lg bg-gray-100 px-2 py-1 font-semibold">
            {speedLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
