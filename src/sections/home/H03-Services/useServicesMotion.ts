import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { springEase, useMotion } from '../../../motion';
import type { ServicesVariant } from '../../../content/H03';

export function useServicesMotion(root: RefObject<HTMLElement | null>, variant: ServicesVariant) {
  const { reducedMotion, refresh } = useMotion();
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const buttons = [...element.querySelectorAll<HTMLAnchorElement>('[data-services-appear="project-cta"] a')];
    const buttonEvents: Array<{ button: HTMLAnchorElement; handlers: Array<[keyof HTMLElementEventMap, EventListener]> }> = [];
    const context = gsap.context(() => {
      if (reducedMotion) return;
      const start = (target: HTMLElement) => () => `top ${window.innerHeight - Math.min(target.offsetHeight, window.innerHeight) * .5}px`;
      element.querySelectorAll<HTMLElement>('[data-services-appear]').forEach(target => {
        const type = target.dataset.servicesAppear;
        // Source removes the label and introduction appear effect on phone.
        if (variant === 'phone' && (type === 'label' || type === 'introduction')) return;
        const y = type === 'label' ? 10 : type === 'introduction' ? 30 : 0;
        const delay = type === 'label' ? .2 : type === 'introduction' ? .5 : type === 'project-copy' ? .3 : .4;
        gsap.fromTo(target, { opacity: 0, y }, { opacity: 1, y: 0, delay, duration: 1, ease: springEase(1), scrollTrigger: { trigger: target, start: start(target), once: true } });
      });
      if (variant !== 'phone') {
        const title = element.querySelector<HTMLElement>('[data-services-title]');
        if (title) gsap.fromTo(title.querySelectorAll('[data-services-title-line]'), { opacity: .001, y: 20 }, { opacity: 1, y: 0, delay: .3, duration: .6, stagger: .2, ease: springEase(.6), scrollTrigger: { trigger: title, start: start(title), once: true } });
      }
      element.querySelectorAll<HTMLElement>('[data-services-card-title]').forEach(title => {
        gsap.fromTo(title.querySelectorAll('[data-services-word]'), { opacity: .001, y: 50 }, { opacity: 1, y: 0, delay: .3, duration: .4, stagger: .085, ease: springEase(.4), scrollTrigger: { trigger: title, start: start(title), once: true } });
      });
      element.querySelectorAll<HTMLElement>('[data-services-image]').forEach(target => {
        const second = target.dataset.servicesImage === '1';
        gsap.fromTo(target, { opacity: 0, y: 30 }, { opacity: 1, y: 0, delay: second && variant !== 'phone' ? .4 : .1, duration: 1, ease: springEase(1), scrollTrigger: { trigger: target, start: start(target), once: true } });
      });
      buttons.forEach(button => {
        gsap.set(button, { backgroundColor: '#000', '--services-plus-angle': '0deg' });
        const animate = (backgroundColor: string, angle: number) => context.add(() => gsap.to(button, { backgroundColor, '--services-plus-angle': `${angle}deg`, duration: .6, ease: springEase(.6), overwrite: true }));
        const enter = () => animate('#f02b42', -180);
        const leave = () => animate('#000', 0);
        const press = () => animate('#8c232f', 0);
        const handlers: Array<[keyof HTMLElementEventMap, EventListener]> = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave], ['pointerdown', press], ['pointerup', enter]];
        handlers.forEach(([event, handler]) => button.addEventListener(event, handler));
        buttonEvents.push({ button, handlers });
      });
    }, element);
    let cancelled = false;
    void document.fonts.ready.then(() => { if (!cancelled) refresh(); });
    return () => { cancelled = true; buttonEvents.forEach(({ button, handlers }) => handlers.forEach(([event, handler]) => button.removeEventListener(event, handler))); context.revert(); };
  }, [root, variant, reducedMotion, refresh]);
}
