import { useLayoutEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cubicEase, springEase, useMotion } from '../../../motion';

/** Independent appear/parallax layers preserve source transform composition. */
export function useHeroMotion(root: RefObject<HTMLElement | null>) {
  const { reducedMotion, refresh } = useMotion();
  const mountedAt = useRef<number | null>(null);
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    mountedAt.current ??= performance.now();
    let stopHover = () => {};
    let startHover = () => {};
    let animateButton = (_background: string, _angle: number) => {};
    const context = gsap.context(() => {
      if (reducedMotion) return;
      const timeline = gsap.timeline();
      const appear = (target: string, delay: number, y: number, opacity = .001) => timeline.fromTo(target, { opacity, y }, { opacity: 1, y: 0, duration: .8, ease: springEase(.8) }, delay);
      timeline.fromTo('[data-hero-primary]', { scale: 1.4 }, { scale: 1, duration: 1.5, ease: springEase(1.5) }, 3.7);
      [4.3, 4.4, 4.5].forEach((delay, index) => appear(`[data-hero-service="${index}"]`, delay, 20));
      timeline.fromTo('[data-hero-logo-appear]', { opacity: .001 }, { opacity: 1, duration: 1, ease: cubicEase([.74, .03, .44, .95]) }, 3.9);
      timeline.fromTo('[data-hero-characters="tagline"] > span', { opacity: .001, scale: 2, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .8, stagger: .07, ease: springEase(.8) }, 3.9);
      appear('[data-hero-description]', 4, 60);
      appear('[data-hero-cta]', 4.1, 60, 1);
      appear('[data-hero-reviews]', 4.2, 60, 1);
      timeline.fromTo('[data-hero-review-presence]', { opacity: .001, scale: 1.3 }, { opacity: 1, scale: 1, duration: 1, ease: cubicEase([.74, .03, .44, .95]) }, .3);
      timeline.fromTo('[data-hero-ticker]', { opacity: .001, x: 150 }, { opacity: 1, x: 0, duration: 1.5, ease: springEase(1.5) }, 4.3);
      // A preference change resumes this mount's clock rather than replaying it.
      timeline.time((performance.now() - mountedAt.current!) / 1000);
      gsap.to('[data-hero-grain]', { keyframes: [{ xPercent: -10, yPercent: 10 }, { xPercent: 10, yPercent: -10 }, { xPercent: 0, yPercent: 0 }], duration: .12, repeat: -1, yoyo: true, ease: 'none' });
      gsap.to('[data-hero-slot-blink]', { backgroundColor: '#f02b42', duration: .6, delay: 1, repeat: -1, repeatDelay: .4, yoyo: true, ease: springEase(.6) });
      const parallax = [...element.querySelectorAll<HTMLElement>('[data-hero-parallax]')];
      const videoLayer = element.querySelector('[data-hero-video-parallax]');
      const wrapper = element.querySelector('[data-hero-wrapper]');
      let maximum = ScrollTrigger.maxScroll(window);
      const updateScroll = () => {
        const y = window.scrollY;
        parallax.forEach(layer => gsap.set(layer, { y: y * Number(layer.dataset.heroParallax) }));
        gsap.set(videoLayer, { y: y * .2 });
        gsap.set(wrapper, { y: maximum > 0 ? -150 * y / maximum : 0 });
      };
      ScrollTrigger.create({ trigger: element, start: 0, end: () => ScrollTrigger.maxScroll(window), onUpdate: updateScroll, onRefresh: () => { maximum = ScrollTrigger.maxScroll(window); updateScroll(); } });
      updateScroll();
      const base = element.querySelector('[data-glitch-base]');
      const slices = [...element.querySelectorAll('[data-glitch-slice]')];
      // The original precomputes 6 shake / 26 slice frames, active in 0–25%.
      // GSAP schedules those discrete frames on the shared ticker.
      const hover = gsap.timeline({ paused: true, repeat: -1 });
      const button = element.querySelector('[data-hero-cta] a');
      gsap.set(button, { backgroundColor: '#000', '--h01-plus-angle': '0deg' });
      animateButton = (background, angle) => {
        context.add(() => gsap.to(button, { backgroundColor: background, '--h01-plus-angle': `${angle}deg`, duration: .6, ease: springEase(.6), overwrite: true }));
      };
      const strength = (progress: number) => progress > .25 ? 0 : progress < .125 ? progress / .125 : (.25 - progress) / .125;
      const random = (progress: number) => 2 * (Math.random() - .5) * strength(progress);
      for (let frame = 0; frame < 6; frame++) hover.set(base, { xPercent: random(frame / 6) * 10, yPercent: random(frame / 6) * 10 }, frame / 6);
      for (let frame = 0; frame < 26; frame++) {
        const progress = frame / 26;
        slices.forEach(slice => {
          const height = Math.floor(Math.random() * 16) + 20;
          const top = Math.floor(Math.random() * (100 - height));
          hover.set(slice, strength(progress) === 0 ? { opacity: 0, xPercent: 0, clipPath: 'none' } : { opacity: 1, xPercent: 30 * random(progress), clipPath: `polygon(100% ${top}%,100% ${top + height}%,0% ${top + height}%,0% ${top}%)`, filter: `hue-rotate(${Math.floor(360 * random(progress))}deg)` }, progress);
        });
      }
      hover.set(base, { xPercent: 0, yPercent: 0 }, 1);
      startHover = () => hover.restart();
      stopHover = () => { hover.pause(0); gsap.set(base, { xPercent: 0, yPercent: 0 }); gsap.set(slices, { opacity: 0 }); };
    }, element);
    const glitch = element.querySelector<HTMLElement>('[data-hero-glitch]');
    const onEnter = (event: PointerEvent) => { if (event.pointerType !== 'touch') startHover(); };
    glitch?.addEventListener('pointerenter', onEnter);
    glitch?.addEventListener('pointerleave', stopHover);
    const button = element.querySelector<HTMLAnchorElement>('[data-hero-cta] a');
    const enterButton = () => animateButton('#f02b42', -180);
    const leaveButton = () => animateButton('#000', 0);
    const pressButton = () => animateButton('#8c232f', 0);
    button?.addEventListener('pointerenter', enterButton);
    button?.addEventListener('pointerleave', leaveButton);
    button?.addEventListener('focus', enterButton);
    button?.addEventListener('blur', leaveButton);
    button?.addEventListener('pointerdown', pressButton);
    button?.addEventListener('pointerup', enterButton);
    let cancelled = false;
    void document.fonts.ready.then(() => { if (!cancelled) refresh(); });
    return () => {
      cancelled = true;
      glitch?.removeEventListener('pointerenter', onEnter);
      glitch?.removeEventListener('pointerleave', stopHover);
      button?.removeEventListener('pointerenter', enterButton);
      button?.removeEventListener('pointerleave', leaveButton);
      button?.removeEventListener('focus', enterButton);
      button?.removeEventListener('blur', leaveButton);
      button?.removeEventListener('pointerdown', pressButton);
      button?.removeEventListener('pointerup', enterButton);
      context.revert();
    };
  }, [root, reducedMotion, refresh]);
}
