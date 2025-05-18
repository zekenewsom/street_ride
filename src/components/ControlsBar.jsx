import { useEffect, useRef } from "react";

// Mapping between display (UI) speed and actual playback speed
const DISPLAY_TO_ACTUAL = (display) => Number(display) * 0.25;
const ACTUAL_TO_DISPLAY = (actual) => actual / 0.25;

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
  },
  stats = null,
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

  const displaySpeed = Number(ACTUAL_TO_DISPLAY(playback.playSpeed)).toFixed(2);
  const percent = playback.length > 1 ? (playback.index / (playback.length - 1)) * 100 : 0;

  const progressLabel =
    stats && stats.distance
      ? `${(stats.distance / 1609.34).toFixed(1)} of ${stats.total ? (stats.total / 1609.34).toFixed(1) : (stats.distance / 1609.34).toFixed(1)} mi`
      : `Step ${playback.index + 1} / ${playback.length}`;

  let speedValue = Number(playback.playSpeed / 0.25);
  let speedLabel = speedValue % 1 === 0 ? `${speedValue.toFixed(0)}x` : `${speedValue.toFixed(1)}x`;

  return (
    <div className="w-full flex justify-center pointer-events-none mb-3">
      <div
        ref={barRef}
        className="pointer-events-auto w-full max-w-4xl rounded-2xl bg-white shadow-2xl flex flex-col items-center px-7 py-3 font-sans border border-gray-200"
        style={{
          boxSizing: "border-box",
          fontFamily: "Inter, sans-serif",
          marginBottom: "10px",
        }}
      >
        <div className="flex items-center w-full gap-7">
          {/* Left: Step buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={playback.stepBackward}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:bg-blue-100 hover:border-blue-500 shadow-md transition-all text-blue-500 text-3xl outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Step backward"
              tabIndex={0}
            >
              <svg width={32} height={32} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <polyline points="16 20 8 12 16 4" />
              </svg>
            </button>
            <button
              onClick={() => playback.setIsPlaying((v) => !v)}
              className={`w-16 h-16 flex items-center justify-center rounded-full ${
                playback.isPlaying
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } shadow-xl border-4 border-blue-200 transition-all text-white text-5xl outline-none focus:ring-2 focus:ring-blue-400`}
              aria-label={playback.isPlaying ? "Pause playback" : "Play playback"}
              tabIndex={0}
              style={{ margin: "0 1rem" }}
            >
              {playback.isPlaying ? (
                <svg width={40} height={40} fill="none" viewBox="0 0 40 40">
                  <rect x={10} y={8} width={6} height={24} rx={3} fill="white" />
                  <rect x={24} y={8} width={6} height={24} rx={3} fill="white" />
                </svg>
              ) : (
                <svg width={40} height={40} fill="white" viewBox="0 0 40 40">
                  <polygon points="14,8 32,20 14,32" />
                </svg>
              )}
            </button>
            <button
              onClick={playback.stepForward}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:bg-blue-100 hover:border-blue-500 shadow-md transition-all text-blue-500 text-3xl outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Step forward"
              tabIndex={0}
            >
              <svg width={32} height={32} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <polyline points="8 20 16 12 8 4" />
              </svg>
            </button>
          </div>

          {/* Middle: Progress */}
          <div className="flex flex-col flex-1 min-w-0 items-center">
            <div className="relative w-full max-w-[340px] h-7 flex items-center" style={{ zIndex: 2 }}>
              {/* Progress bar bg */}
              <div className="w-full h-3 rounded-full bg-gray-300" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", zIndex: 1 }} />
              {/* Progress bar fill */}
              <div
                className="h-3 rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${percent}%`,
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  minWidth: percent > 0 ? "10px" : "0px", // always show at least a little blue when > 0
                }}
              />
              {/* Thumb */}
              <div
                className="absolute"
                style={{
                  left: `calc(${percent}% - 10px)`,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 3,
                  pointerEvents: "none",
                }}
              >
                <div className="w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow" />
              </div>
              {/* Range input OVER the bar (so it's always clickable/draggable) */}
              <input
                type="range"
                min={0}
                max={playback.length - 1}
                value={playback.index}
                onChange={(e) => playback.setIndex(Number(e.target.value))}
                className="w-full h-7 absolute top-0 left-0 opacity-0 z-10 cursor-pointer"
                aria-label="Playback position"
                style={{ accentColor: "#2563eb" }}
              />
            </div>
            <div className="flex justify-between w-full text-xs mt-2 text-gray-800">
              <span>{progressLabel}</span>
              <span className="text-gray-500 font-semibold">{speedLabel}</span>
            </div>
          </div>

          {/* Right: Speed control */}
          <div className="flex flex-col items-center ml-5">
            <input
              type="range"
              min={minDisplaySpeed}
              max={maxDisplaySpeed}
              step={stepDisplaySpeed}
              value={Number(displaySpeed)}
              onChange={(e) =>
                playback.setPlaySpeed(Number(e.target.value) * 0.25)
              }
              className="w-32 accent-blue-600"
              aria-label="Playback speed"
            />
            <span className="mt-1 text-xs text-gray-600 rounded-lg bg-gray-100 px-2 py-1 font-semibold">
              {speedLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
