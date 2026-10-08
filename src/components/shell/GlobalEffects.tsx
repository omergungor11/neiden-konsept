import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { springEase, useMotion } from '../../motion';
import './shell.css';

function PointerCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotion();

  useEffect(() => {
    const ring = ringRef.current;
    const core = coreRef.current;
    if (!ring || !core) return;
    const previousCursor = document.documentElement.getAttribute('data-shell-cursor');
    let visible = false;
    let targetX = 0;
    let targetY = 0;
    let ringX = 0;
    let ringY = 0;
    let coreX = 0;
    let coreY = 0;
    const setVisible = (next: boolean) => {
      visible = next;
      ring.style.visibility = next ? 'visible' : 'hidden';
      core.style.visibility = next ? 'visible' : 'hidden';
      if (next) document.documentElement.setAttribute('data-shell-cursor', 'active');
      else document.documentElement.removeAttribute('data-shell-cursor');
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') { setVisible(false); return; }
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        ringX = coreX = targetX;
        ringY = coreY = targetY;
        setVisible(true);
      }
    };
    const onLeave = (event: MouseEvent) => {
      if (!event.relatedTarget) setVisible(false);
    };
    const onBlur = () => setVisible(false);
    const tick = () => {
      if (!visible) return;
      const element = document.elementFromPoint(targetX, targetY);
      let highlight = element?.closest<HTMLElement>('.cursor-highlight-element') ?? null;
      while (highlight?.parentElement?.classList.contains('cursor-highlight-element')) highlight = highlight.parentElement;
      let width = 40;
      let height = 40;
      if (highlight) {
        const bounds = highlight.getBoundingClientRect();
        ringX = bounds.left + bounds.width / 2;
        ringY = bounds.top + bounds.height / 2;
        width = bounds.width + 5;
        height = bounds.height + 5;
      } else {
        ringX = reducedMotion ? targetX : ringX + (targetX - ringX) * 1.1;
        ringY = reducedMotion ? targetY : ringY + (targetY - ringY) * 1.1;
      }
      coreX = reducedMotion ? targetX : coreX + (targetX - coreX) * .3;
      coreY = reducedMotion ? targetY : coreY + (targetY - coreY) * .3;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      ring.style.width = `${width}px`;
      ring.style.height = `${height}px`;
      core.style.left = `${coreX}px`;
      core.style.top = `${coreY}px`;
      const coreSize = element?.closest('a') && !highlight ? 32 : 12;
      core.style.width = core.style.height = `${coreSize}px`;
    };
    // Shares GSAP's existing ticker; no second animation frame source.
    gsap.ticker.add(tick);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseout', onLeave);
    window.addEventListener('blur', onBlur);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseout', onLeave);
      window.removeEventListener('blur', onBlur);
      if (previousCursor === null) document.documentElement.removeAttribute('data-shell-cursor');
      else document.documentElement.setAttribute('data-shell-cursor', previousCursor);
    };
  }, [reducedMotion]);

  return <><div ref={ringRef} className="shell-cursor-ring" aria-hidden="true" /><div ref={coreRef} className="shell-cursor-core" aria-hidden="true" /></>;
}

export function GlobalEffects() {
  const [backVisible, setBackVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const backRef = useRef<HTMLButtonElement>(null);
  const { scrollTo } = useMotion();
  useEffect(() => {
    let previousY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setBackVisible(y > 200 && y < previousY);
      previousY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const button = backRef.current;
    if (!button) return;
    const icons = [...button.querySelectorAll('svg')];
    const context = gsap.context(() => {}, button);
    const position = (hovered: boolean) => {
      const distance = (button.clientHeight + (icons[0]?.clientHeight ?? 18)) / 2;
      context.add(() => {
        gsap.to(icons[0], { y: hovered ? -distance : 0, duration: .4, ease: springEase(.4), overwrite: true });
        gsap.to(icons[1], { y: hovered ? 0 : distance, duration: .4, ease: springEase(.4), overwrite: true });
      });
    };
    const onEnter = () => position(true);
    const onLeave = () => position(false);
    button.addEventListener('mouseenter', onEnter);
    button.addEventListener('mouseleave', onLeave);
    return () => {
      button.removeEventListener('mouseenter', onEnter);
      button.removeEventListener('mouseleave', onLeave);
      context.revert();
    };
  }, []);
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return <>
    <PointerCursor />
    <div className="shell-bottom-blur" aria-hidden="true" hidden={footerVisible}>{Array.from({ length: 8 }, (_, index) => {
      const i = index + 1;
      const gradient = `linear-gradient(to bottom, transparent 0%, transparent ${((i - 1) / 8) * 70}%, black ${(i / 8) * 70}%, black 100%)`;
      return <div key={i} style={{ backdropFilter: `blur(${(i / 8) ** 2 * 20}px) saturate(120%)`, WebkitBackdropFilter: `blur(${(i / 8) ** 2 * 20}px) saturate(120%)`, maskImage: gradient, WebkitMaskImage: gradient } as CSSProperties} />;
    })}</div>
    <button ref={backRef} className={`shell-back-top ${backVisible ? 'shell-control-visible' : ''}`} type="button" aria-label="Back to top" tabIndex={backVisible ? 0 : -1} onClick={() => scrollTo(0)}>{[0, 1].map(index => <span key={index} className={`shell-back-arrow shell-back-arrow-${index}`}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M 7 0 L 7 14 M 14 7 L 7 0 L 0 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(5 5)" /></svg></span>)}</button>
  </>;
}
