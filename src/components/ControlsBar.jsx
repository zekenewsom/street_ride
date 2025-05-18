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
  const minSpeed = 0.05;
  const maxSpeed = 4;
  const stepSpeed = 0.01;

  return (
    <div className="w-full flex justify-center items-end pointer-events-none">
      <div
        ref={barRef}
        className="pointer-events-auto w-full max-w-4xl rounded-xl bg-white shadow-xl border border-gray-200 flex flex-col items-center gap-5 px-6 py-4 font-sans font-normal text-xs animate-fadein-slideup transition-all duration-500"
        style={{ boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
      >
        {/* Uber-style playback controls */}
        <div className="flex items-center justify-center gap-16 w-full mb-2">
  <button
    onClick={playback.stepBackward}
    className="w-28 h-28 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 shadow border border-gray-300 transition-all text-gray-700 text-5xl outline-none focus:ring-2 focus:ring-gray-400 duration-150"
    aria-label="Step backward"
    tabIndex={0}
  >
    <svg viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="10" className="w-20 h-20"><polyline points="60 78 36 48 60 18" /></svg>
  </button>
  <button
    onClick={() => playback.setIsPlaying((v) => !v)}
    className="w-36 h-36 flex items-center justify-center rounded-full bg-black hover:bg-gray-800 active:bg-gray-900 shadow border-2 border-gray-900 transition-all text-white text-7xl outline-none focus:ring-4 focus:ring-gray-400 duration-150"
    aria-label={playback.isPlaying ? "Pause playback" : "Play playback"}
    tabIndex={0}
    style={{ margin: "0 2.5rem" }}
  >
    {playback.isPlaying ? (
      <svg viewBox="0 0 90 90" fill="none" stroke="currentColor" strokeWidth="10" className="w-24 h-24"><rect x="22" y="18" width="16" height="54" rx="7" fill="white"/><rect x="52" y="18" width="16" height="54" rx="7" fill="white"/></svg>
    ) : (
      <svg viewBox="0 0 90 90" fill="white" className="w-24 h-24"><polygon points="28,18 72,45 28,72" /></svg>
    )}
  </button>
  <button
    onClick={playback.stepForward}
    className="w-28 h-28 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 shadow border border-gray-300 transition-all text-gray-700 text-5xl outline-none focus:ring-2 focus:ring-gray-400 duration-150"
    aria-label="Step forward"
    tabIndex={0}
  >
    <svg viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="10" className="w-20 h-20"><polyline points="36 78 60 48 36 18" /></svg>
  </button>
</div>
        <div className="w-full border-t border-gray-200 mb-3"></div>
        {/* Progress Bar and Step Label */}
        <div className="flex flex-col items-center flex-1 min-w-0 w-full">
  <div className="flex justify-between w-full mb-2 text-[9px] text-gray-700 font-semibold">
  <span className="bg-gray-100 px-1.5 py-[1px] rounded text-gray-900 shadow text-[9px]">Step {playback.index + 1} / {playback.length}</span>
  {stats && <span className="bg-gray-200 px-1.5 py-[1px] rounded text-gray-700 shadow text-[9px]">{(stats.distance / 1609.34).toFixed(1)} mi</span>}
</div>
  <input
    type="range"
    min={0}
    max={playback.length - 1}
    value={playback.index}
    onChange={(e) => playback.setIndex(Number(e.target.value))}
    className="w-full h-3 rounded-full accent-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all shadow"
    aria-label="Playback position"
    style={{ accentColor: '#111' }}
  />
</div>
        {/* Speed Control and Stats */}
        <div className="flex flex-col items-end gap-1 min-w-[100px] w-full mt-1">
  <div className="flex items-center gap-1 w-full justify-end">
    <span className="text-[11px] text-gray-700 font-semibold">Speed</span>
    <span className="text-[11px] text-gray-400 font-bold mr-1">0.05x</span>
    <input
      type="range"
      min={minSpeed}
      max={maxSpeed}
      step={stepSpeed}
      value={playback.playSpeed}
      onChange={(e) => playback.setPlaySpeed(Number(e.target.value))}
      className="w-24 accent-black focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all shadow"
      aria-label="Playback speed"
      style={{ accentColor: '#111' }}
    />
    <span className="text-[11px] text-gray-400 font-bold ml-1">4x</span>
    <span className="ml-2 px-2 py-[2px] rounded bg-gray-900 text-white font-bold text-[11px] shadow border border-gray-300">
      {playback.playSpeed.toFixed(2)}x
    </span>
  </div>
  {stats && (
    <span className="text-[11px] text-gray-600 font-semibold">
      ETA: <span className="font-bold text-gray-900">{Math.round(stats.duration / 60)}</span> min
    </span>
  )}
</div>
      </div>
    </div>
  );
}