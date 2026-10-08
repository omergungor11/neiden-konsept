import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion, type MotionApi } from '../motion';

declare global {
  interface Window {
    __neidenMotion?: MotionApi & { triggerCount: () => number };
  }
}

/** Development-only inspection API; no diagnostics are rendered in the page. */
export function MotionDiagnostics() {
  const motion = useMotion();
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const api = { ...motion, triggerCount: () => ScrollTrigger.getAll().length };
    window.__neidenMotion = api;
    return () => { if (window.__neidenMotion === api) delete window.__neidenMotion; };
  }, [motion]);
  return null;
}
