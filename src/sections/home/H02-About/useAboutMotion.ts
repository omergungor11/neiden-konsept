import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { springEase, useMotion } from '../../../motion';

export function useAboutMotion(root: RefObject<HTMLElement | null>, variant: string) {
  const { reducedMotion, refresh } = useMotion();
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const context = gsap.context(() => {
      if (reducedMotion) return;
      const characters = [...element.querySelectorAll<HTMLElement>('[data-about-character]')];
      const reveal = element.querySelector('[data-about-reveal]');
      const timeline = gsap.timeline({ scrollTrigger: { trigger: reveal, start: 'top 80%', end: 'bottom 50%', scrub: true, invalidateOnRefresh: true } });
      // Source zp passes two CSS var() strings to Motion. The browser switches
      // them at each character's start (verified at scrollY594/595), rather than
      // resolving the fallbacks into a continuously interpolated alpha value.
      characters.forEach(character => timeline.fromTo(character, { color: 'rgba(255,255,255,.1)' }, { color: 'rgba(255,255,255,1)', duration: 1, ease: progress => progress > 0 ? 1 : 0 }, Number(character.dataset.aboutCharacter)));
      element.querySelectorAll<HTMLElement>('[data-about-appear]').forEach(target => {
        const y = target.dataset.aboutAppear === 'label' ? 10 : 40;
        gsap.fromTo(target, { opacity: 0, y }, { opacity: 1, y: 0, delay: .2, duration: 1, ease: springEase(1), scrollTrigger: { trigger: target, start: () => `top ${window.innerHeight - Math.min(target.offsetHeight, window.innerHeight) * .5}px`, once: true } });
      });
      const images = [...element.querySelectorAll<HTMLElement>('[data-about-parallax]')];
      const updateParallax = () => images.forEach(image => gsap.set(image, { y: window.scrollY * Number(image.dataset.aboutParallax) }));
      ScrollTrigger.create({ trigger: element, start: 0, end: () => ScrollTrigger.maxScroll(window), onUpdate: updateParallax, onRefresh: updateParallax });
      updateParallax();
    }, element);
    let cancelled = false;
    void document.fonts.ready.then(() => { if (!cancelled) refresh(); });
    return () => { cancelled = true; context.revert(); };
  }, [root, variant, reducedMotion, refresh]);
}
