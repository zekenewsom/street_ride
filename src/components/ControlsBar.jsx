import { useEffect, useRef } from "react";

export default function ControlsBar({ playback = {
  setIsPlaying: () => {},
  isPlaying: false,
  stepBackward: () => {},
  stepForward: () => {},
  setIndex: () => {},
  index: 0,
  length: 1,
  playSpeed: 1,
  setPlaySpeed: () => {}
}, stats = null }) {
  const barRef = useRef(null);
  useEffect(() => {
    if (barRef.current) {
      barRef.current.classList.add("animate-fadein-slideup");
    }
  }, []);
  // Fix speed slider so 1x is the leftmost value
  // Speed slider now allows 0.05x to 4x, default is 1x
  const minSpeed = 0.05;
  const maxSpeed = 4;
  const stepSpeed = 0.01;

  return (
    <div className="w-full flex justify-center items-end pointer-events-none">
      <div ref={barRef} className="pointer-events-auto w-full max-w-3xl rounded-[2.5rem] bg-black/80 backdrop-blur-2xl shadow-[0_12px_48px_rgba(0,0,0,0.45)] border-2 border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-10 px-12 py-7 font-sans font-bold text-lg animate-fadein-slideup transition-all duration-500" style={{boxSizing:'border-box', fontFamily: 'Inter, sans-serif'}}>
        {/* Playback Controls */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => playback.setIsPlaying((v) => !v)}
            className="w-20 h-20 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 active:bg-gray-300 shadow-2xl border-2 border-black transition-all text-black text-5xl outline-none focus:ring-4 focus:ring-black/30"
            aria-label={playback.isPlaying ? 'Pause playback' : 'Play playback'}
            tabIndex={0}
          >
            {playback.isPlaying ? (
              <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="6" className="w-12 h-12"><rect x="14" y="12" width="10" height="36" rx="5" fill="black"/><rect x="36" y="12" width="10" height="36" rx="5" fill="black"/></svg>
            ) : (
              <svg viewBox="0 0 60 60" fill="black" className="w-12 h-12"><polygon points="16,12 48,30 16,48" /></svg>
            )}
          </button>
          <button
            onClick={playback.stepBackward}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 active:bg-gray-300 shadow-xl border-2 border-black transition-all text-black text-4xl outline-none focus:ring-4 focus:ring-black/30"
            aria-label="Step backward"
            tabIndex={0}
          >
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4" className="w-10 h-10"><polyline points="32 40 16 24 32 8" /></svg>
          </button>
          <button
            onClick={playback.stepForward}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 active:bg-gray-300 shadow-xl border-2 border-black transition-all text-black text-4xl outline-none focus:ring-4 focus:ring-black/30"
            aria-label="Step forward"
            tabIndex={0}
          >
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4" className="w-10 h-10"><polyline points="16 40 32 24 16 8" /></svg>
          </button>
        </div>
        {/* Progress Bar and Step Label */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="flex justify-between w-full mb-2 text-base text-gray-200 font-semibold">
            <span>Step {playback.index + 1} / {playback.length}</span>
            {stats && <span>{(stats.distance / 1609.34).toFixed(1)} mi</span>}
          </div>
          <input
            type="range"
            min={0}
            max={playback.length - 1}
            value={playback.index}
            onChange={(e) => playback.setIndex(Number(e.target.value))}
            className="w-full h-4 rounded-full accent-black bg-gray-700 focus:outline-none focus:ring-4 focus:ring-white transition-all"
            aria-label="Playback position"
            style={{ accentColor: '#111' }}
          />
        </div>
        {/* Speed Control and Stats */}
        <div className="flex flex-col items-end gap-3 min-w-[140px]">
          <div className="flex items-center gap-3">
            <span className="text-base text-gray-200 font-semibold">Speed</span>
            <span className="text-xs text-gray-400 font-bold mr-1">0.05x</span>
            <input
              type="range"
              min={minSpeed}
              max={maxSpeed}
              step={stepSpeed}
              value={playback.playSpeed}
              onChange={(e) => playback.setPlaySpeed(Number(e.target.value))}
              className="w-32 accent-black focus:outline-none focus:ring-4 focus:ring-white transition-all"
              aria-label="Playback speed"
              style={{ accentColor: '#111' }}
            />
            <span className="text-xs text-gray-400 font-bold ml-1">4x</span>
            <span className="ml-2 px-3 py-1 rounded-full bg-white text-black font-bold text-base shadow border border-black">
              {playback.playSpeed.toFixed(2)}x
            </span>
          </div>
          {stats && (
            <span className="text-base text-gray-200 font-semibold">
              ETA: <span className="font-bold text-white">{Math.round(stats.duration / 60)}</span> min
            </span>
          )}
        </div>
      </div>
    </div>
  );
}