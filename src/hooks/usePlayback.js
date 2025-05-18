import { useRef, useState, useEffect } from "react";

export function usePlayback(interpolatedRoute, speed = 1) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(speed);
  const intervalRef = useRef(null);

  // Play/pause handler
  useEffect(() => {
    if (isPlaying && interpolatedRoute.length > 1) {
      intervalRef.current = setInterval(() => {
        setIndex((prev) => {
          if (prev < interpolatedRoute.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 500 / playSpeed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, interpolatedRoute.length, playSpeed]);

  // Reset index if route changes
  useEffect(() => {
    setIndex(0);
    setIsPlaying(false);
  }, [interpolatedRoute]);

  // Seek handler
  const seek = (newIndex) => {
    if (newIndex >= 0 && newIndex < interpolatedRoute.length) setIndex(newIndex);
  };

  // Speed handler
  const setSpeed = (s) => setPlaySpeed(s);

  // Step
  const stepForward = () => seek(Math.min(index + 1, interpolatedRoute.length - 1));
  const stepBackward = () => seek(Math.max(index - 1, 0));

  return {
    index,
    setIndex: seek,
    isPlaying,
    setIsPlaying,
    stepForward,
    stepBackward,
    playSpeed,
    setPlaySpeed: setSpeed,
    length: interpolatedRoute.length,
    position: interpolatedRoute[index] || null,
  };
}
