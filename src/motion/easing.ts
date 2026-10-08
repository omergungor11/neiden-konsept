import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { spring } from 'motion-dom';

gsap.registerPlugin(CustomEase);
const easings = new Map<string, (progress: number) => number>();

/** Sample Motion's duration/bounce spring through the existing GSAP clock. */
export function springEase(duration: number, bounce = 0): (progress: number) => number {
  const key = `spring-${duration}-${bounce}`;
  const cached = easings.get(key);
  if (cached) return cached;
  const durationMs = duration * 1000;
  const generator = spring({ keyframes: [0, 1], duration: durationMs, bounce });
  const ease = (progress: number) => progress >= 1 ? 1 : progress <= 0 ? 0 : generator.next(progress * durationMs).value;
  easings.set(key, ease);
  return ease;
}

export function cubicEase(points: readonly [number, number, number, number]): (progress: number) => number {
  const key = `cubic-${points.join('-')}`;
  const cached = easings.get(key);
  if (cached) return cached;
  const ease = CustomEase.create(key, points.join(','));
  easings.set(key, ease);
  return ease;
}
