/** Source configuration: docs/reference/motion-audit.md §2 (K, not frame calibration). */
export const XXL_MIN_WIDTH = 1620;

export const scrollEasing = (progress: number) =>
  Math.min(1, 1.001 - 2 ** (-10 * progress));

export function scrollDuration(pathname: string, width: number): number {
  if (width < XXL_MIN_WIDTH) return 4;
  return pathname === '/' ? 3 : 3.5;
}

export const SCROLL_OPTIONS = {
  autoRaf: false,
  autoResize: true,
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  wheelMultiplier: 1.1,
  touchMultiplier: 1,
  smoothWheel: true,
  syncTouch: false,
  infinite: false,
  easing: scrollEasing,
} as const;
