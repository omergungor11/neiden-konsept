import { useCallback, useLayoutEffect, useRef, type ReactNode, type CSSProperties } from 'react';
import { useMotion } from '../../motion';
import './ui.css';

export function Marquee({ children, speed = 50, gap = 100, reverse = false, hoverSpeed = 1, className = '' }: { children: ReactNode; speed?: number; gap?: number; reverse?: boolean; hoverSpeed?: number; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);
  const { reducedMotion } = useMotion();
  const updatePlaybackRate = useCallback(() => {
    // Changing playback rate preserves the ticker phase; changing duration jumps.
    track.current?.getAnimations().forEach(animation => animation.updatePlaybackRate(hovered.current ? hoverSpeed : 1));
  }, [hoverSpeed]);
  useLayoutEffect(updatePlaybackRate, [updatePlaybackRate, reducedMotion]);
  useLayoutEffect(() => {
    if (!group.current || !root.current) return;
    const update = () => {
      if (!root.current || !group.current) return;
      const distance = group.current.getBoundingClientRect().width + gap;
      root.current.style.setProperty('--ticker-distance', `${distance}px`);
      root.current.style.setProperty('--ticker-duration', `${distance / speed}s`);
    };
    const observer = new ResizeObserver(update);
    observer.observe(group.current);
    update();
    return () => observer.disconnect();
  }, [gap, speed]);
  return <div ref={root} className={`marquee ${reverse ? 'marquee-reverse' : ''} ${reducedMotion ? 'marquee-still' : ''} ${className}`} style={{ '--ticker-gap': `${gap}px` } as CSSProperties}
    onPointerEnter={event => { if (event.pointerType === 'mouse') { hovered.current = true; updatePlaybackRate(); } }}
    onPointerLeave={() => { hovered.current = false; updatePlaybackRate(); }}>
    <div ref={track} className="marquee-track"><div ref={group} className="marquee-group">{children}</div><div className="marquee-group" aria-hidden="true">{children}</div></div>
  </div>;
}
