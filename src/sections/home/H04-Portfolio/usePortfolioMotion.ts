import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cubicEase, springEase, useMotion } from '../../../motion';
import type { PortfolioVariant } from '../../../content/H04';

// Framer Nl/Ml sums integer offsetTop values, subtracts one CSS pixel, then
// applies the viewport threshold. Rects include appear/hover transforms.
function layoutTop(element: HTMLElement) {
  let top = 0;
  let current: HTMLElement | null = element;
  while (current && current !== document.documentElement) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return top;
}

export function usePortfolioMotion(root: RefObject<HTMLElement | null>, variant: PortfolioVariant) {
  const { reducedMotion, refresh } = useMotion();
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const cleanups: Array<() => void> = [];
    const context = gsap.context(() => {
      const markers = [...element.querySelectorAll<HTMLElement>('[data-portfolio-marker]')];
      const layers = [...element.querySelectorAll<HTMLElement>('[data-portfolio-layer]')];
      const background = element.querySelector<HTMLElement>('[data-portfolio-background]');
      const grainFrames = [...element.querySelectorAll<HTMLElement>('[data-portfolio-grain-frame]')];
      let active = -1;
      const selectBackground = (immediate = false) => {
        let index = 0;
        markers.forEach((marker, i) => { if (window.scrollY >= layoutTop(marker) - 1 - innerHeight * .5) index = i; });
        if (active === index) return;
        active = index;
        if (background) background.dataset.activeProject = String(index);
        // Source mounts layer 4's grain for both variants 3 and 4, allowing it
        // to fade out with layer 4 when scrolling back into the third marker.
        grainFrames.forEach(frame => {
          const layerIndex = Number(frame.dataset.portfolioGrainFrame);
          frame.style.visibility = (layerIndex === index || layerIndex === 3 && index === 2) ? 'visible' : 'hidden';
        });
        layers.forEach((layer, i) => {
          if (immediate || reducedMotion) gsap.set(layer, { opacity: i === index ? 1 : 0 });
          else gsap.to(layer, { opacity: i === index ? 1 : 0, duration: 1, ease: springEase(1), overwrite: true });
        });
      };
      ScrollTrigger.create({ trigger: element, start: 0, end: () => ScrollTrigger.maxScroll(window), onUpdate: () => selectBackground(), onRefresh: () => selectBackground(true) });
      selectBackground(true);
      if (reducedMotion) return;

      const subheading = element.querySelector<HTMLElement>('[data-portfolio-subheading]');
      if (subheading && variant !== 'phone') {
        gsap.fromTo(subheading, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 2, delay: .2, ease: springEase(2), scrollTrigger: { trigger: subheading, start: () => `top ${innerHeight - Math.min(subheading.offsetHeight, innerHeight) * .5}px`, once: true } });
      }
      element.querySelectorAll<HTMLElement>('[data-portfolio-grain]').forEach(grain => gsap.to(grain, { keyframes: [{ xPercent: -10, yPercent: 10, duration: .04 }, { xPercent: 10, yPercent: -10, duration: .04 }, { xPercent: 0, yPercent: 0, duration: .04 }], repeat: -1, yoyo: true, ease: 'none' }));

      const wordOptions = { opacity: 1, y: 0, duration: .4, stagger: .085, ease: springEase(.4), overwrite: true };
      element.querySelectorAll<HTMLElement>('[data-portfolio-text]').forEach(text => {
        gsap.fromTo(text.querySelectorAll('[data-portfolio-word]'), { opacity: .001, y: Number(text.dataset.wordDistance) }, { ...wordOptions, delay: Number(text.dataset.wordDelay), scrollTrigger: { trigger: text, start: () => layoutTop(text) - innerHeight, once: true } });
      });
      element.querySelectorAll<HTMLElement>('[data-portfolio-card]').forEach(card => {
        const slot = card.querySelector<HTMLElement>('[data-portfolio-slot]');
        const appear = card.querySelector<HTMLElement>('[data-portfolio-image-appear]');
        const photo = card.querySelector<HTMLImageElement>('[data-portfolio-photo]');
        if (!slot || !appear || !photo) return;
        const appearTransition = { duration: 1.5, ease: cubicEase([0, .51, .38, 1.02]), scrollTrigger: { trigger: slot, start: () => layoutTop(slot) - innerHeight, once: true } };
        gsap.fromTo(slot, { y: 150 }, { y: 0, ...appearTransition });
        gsap.fromTo(appear, { scale: 1.7 }, { scale: 1, ...appearTransition });
        ScrollTrigger.create({ trigger: slot, start: () => layoutTop(slot) - innerHeight, end: () => layoutTop(slot) + slot.offsetHeight, onUpdate: self => gsap.set(photo, { y: -150 + self.progress * 300 }), onRefresh: self => gsap.set(photo, { y: -150 + self.progress * 300 }) });

        if (variant === 'phone' || variant === 'tablet') return;
        const scale = card.querySelector('[data-portfolio-hover-scale]');
        const logo = card.querySelector('[data-portfolio-logo]');
        const overlay = card.querySelector('[data-portfolio-hover-overlay]');
        const titleWords = card.querySelectorAll('[data-portfolio-title] [data-portfolio-word]');
        let pointerInside = false;
        let focused = false;
        let hovered = false;
        const updateHover = () => {
          const next = pointerInside || focused;
          if (next === hovered) return;
          hovered = next;
          context.add(() => {
            const transition = { duration: .8, ease: cubicEase([.71, -.01, .21, 1.01]), overwrite: true };
            if (scale) gsap.to(scale, { scale: next ? 1 : 1.1, ...transition });
            if (logo) gsap.to(logo, { opacity: next ? 1 : 0, scale: next ? 1 : 1.3, ...transition });
            if (overlay && variant === 'xxl') gsap.to(overlay, { opacity: next ? .2 : 0, ...transition });
            gsap.fromTo(titleWords, { opacity: .001, y: 50 }, { ...wordOptions, delay: .3 });
          });
        };
        const enter = (event: PointerEvent) => { if (event.pointerType !== 'mouse') return; pointerInside = true; updateHover(); };
        const leave = () => { pointerInside = false; updateHover(); };
        const focus = () => { focused = true; updateHover(); };
        const blur = () => { focused = false; updateHover(); };
        card.addEventListener('pointerenter', enter);
        card.addEventListener('pointerleave', leave);
        card.addEventListener('focus', focus);
        card.addEventListener('blur', blur);
        cleanups.push(() => { card.removeEventListener('pointerenter', enter); card.removeEventListener('pointerleave', leave); card.removeEventListener('focus', focus); card.removeEventListener('blur', blur); });
      });
    }, element);
    let cancelled = false;
    void document.fonts.ready.then(() => { if (!cancelled) refresh(); });
    return () => { cancelled = true; cleanups.forEach(cleanup => cleanup()); context.revert(); };
  }, [root, variant, reducedMotion, refresh]);
}
