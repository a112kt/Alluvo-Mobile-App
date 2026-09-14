import { useEffect, useRef, useCallback } from "react";
import { trackReelView } from "../services/index";

export const useReelViewTracker = () => {
  const viewStartTimeRef = useRef<number>(0);
  const trackedReelIdRef = useRef<number | null>(null);
  const accumulatedMsRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const reelDurationsRef = useRef<Record<number, number>>({});

  const registerDuration = useCallback((reelId: number, duration: number) => {
    reelDurationsRef.current[reelId] = duration;
  }, []);

  const sendTracking = useCallback(() => {
    const reelId = trackedReelIdRef.current;
    if (reelId == null) return;

    if (!isPausedRef.current) {
      accumulatedMsRef.current += Date.now() - viewStartTimeRef.current;
      viewStartTimeRef.current = Date.now();
    }

    const watchedSeconds = Math.floor(accumulatedMsRef.current / 1000);
    if (watchedSeconds > 0) {
      const duration = reelDurationsRef.current[reelId] || watchedSeconds;
      trackReelView(reelId, watchedSeconds, duration).catch(() => {});
    }
  }, []);

  const startTracking = useCallback((reelId: number) => {
    sendTracking();
    trackedReelIdRef.current = reelId;
    viewStartTimeRef.current = Date.now();
    accumulatedMsRef.current = 0;
    isPausedRef.current = false;
  }, [sendTracking]);

  const pauseTracking = useCallback(() => {
    if (trackedReelIdRef.current == null || isPausedRef.current) return;
    accumulatedMsRef.current += Date.now() - viewStartTimeRef.current;
    isPausedRef.current = true;
    sendTracking();
  }, [sendTracking]);

  const resumeTracking = useCallback(() => {
    if (trackedReelIdRef.current == null || !isPausedRef.current) return;
    viewStartTimeRef.current = Date.now();
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      if (trackedReelIdRef.current != null) {
        sendTracking();
      }
    };
  }, [sendTracking]);

  return { startTracking, pauseTracking, resumeTracking, registerDuration };
};
