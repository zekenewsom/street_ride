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

  // Fine control: displaySpeed goes from 1.00 to 4.00 (UI), underlying is .25 to 1.0
  const minDisplaySpeed = 1;
  const maxDisplaySpeed = 4;
  const stepDisplaySpeed = 0.01;

  const displaySpeed = ACTUAL_TO_DISPLAY(playback.playSpeed).toFixed(2);
  const percent = playback.length > 1 ? (playback.index / (playback.length - 1)) * 100 : 0;

  // Progress Bar Labels
  const progressLabel =
    stats && stats.distance
      ? `${(stats.distance / 1609.34).toFixed(1)} of ${stats.total ? (stats.total / 1609.34).toFixed(1) : (stats.distance / 1609.34).toFixed(1)} mi`
      : `Step ${playback.index + 1} / ${playback.length}`;

  // UI Label: always shows "1x" when 0.25, "1.50x" for 0.375, etc.
  const speedLabel = Number(playback.playSpeed / 0.25).toFixed(2).replace(/\.00$/, "") + "x";

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
        {/* Controls and progress */}
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
            {/* Play button */}
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
                // Pause icon
                <svg width={40} height={40} fill="none" viewBox="0 0 40 40">
                  <rect x={10} y={8} width={6} height={24} rx={3} fill="white" />
                  <rect x={24} y={8} width={6} height={24} rx={3} fill="white" />
                </svg>
              ) : (
                // Play icon
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
            {/* Progress bar */}
            <div className="relative w-full max-w-[320px]">
              <div className="h-2 rounded-full bg-gray-200 w-full" />
              <div
                className="absolute left-0 top-0 h-2 rounded-full bg-blue-500 transition-all"
                style={{ width: `${percent}%` }}
              />
              <input
                type="range"
                min={0}
                max={playback.length - 1}
                value={playback.index}
                onChange={(e) => playback.setIndex(Number(e.target.value))}
                className="w-full h-2 opacity-0 absolute top-0 left-0 cursor-pointer"
                aria-label="Playback position"
                style={{ accentColor: "#2563eb" }}
              />
            </div>
            {/* Distance & step label */}
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
                playback.setPlaySpeed(DISPLAY_TO_ACTUAL(Number(e.target.value)))
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
    </div>
  );
}
