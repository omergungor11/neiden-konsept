import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { springEase, useMotion } from '../../motion';
import { TextSwap } from '../ui/TextSwap';
import { FramerCredit, Hamburger, ShellBrand, ShellLegal, ShellNavigation, ShellSocials } from './ShellParts';
import './shell.css';

const headerLinks = [
  { text: 'WHO WE ARE', to: '/about-us' },
  { text: 'PROJECTS', to: '/projects', count: '35' },
  { text: 'ARTICLES', to: '/blog' },
  { text: 'JOIN US', to: '/career' },
  { text: 'START A PROJECT', to: '/contacts' },
];

function NavOverlay({ open, onClose, triggerRef, scrolled }: { open: boolean; onClose: () => void; triggerRef: RefObject<HTMLButtonElement | null>; scrolled: boolean }) {
  const { lockScroll, reducedMotion } = useMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(open);

  useLayoutEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useLayoutEffect(() => {
    if (!mounted || !cardRef.current || !layerRef.current) return;
    const card = cardRef.current;
    const layer = layerRef.current;
    // Source dr/rr: duration .6, bounce 0, delay .3.
    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(card, { opacity: open ? 1 : 0, scale: open ? 1 : 0, rotation: open ? 0 : -45 });
        gsap.set(layer, { opacity: open ? 1 : 0 });
        if (!open) setMounted(false);
        return;
      }
      if (open) {
        gsap.fromTo(card, { opacity: 0, scale: 0, rotation: -45 }, { opacity: 1, scale: 1, rotation: 0, duration: .6, delay: .3, ease: springEase(.6) });
        gsap.fromTo(layer, { opacity: 0 }, { opacity: 1, duration: .6, ease: springEase(.6) });
      } else {
        gsap.to(card, { opacity: 0, scale: 0, rotation: -45, duration: .6, ease: springEase(.6) });
        gsap.to(layer, { opacity: 0, duration: .6, ease: springEase(.6), onComplete: () => setMounted(false) });
      }
    }, layer);
    return () => context.revert();
  }, [mounted, open, reducedMotion]);

  useEffect(() => {
    if (!mounted) return;
    const release = lockScroll('site-menu');
    const card = cardRef.current;
    const trigger = triggerRef.current;
    const main = document.querySelector('main');
    const previousInert = main instanceof HTMLElement ? main.inert : false;
    if (main instanceof HTMLElement) main.inert = true;
    if (open) card?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab' || !card) return;
      const controls = [...card.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]')];
      if (trigger) controls.push(trigger);
      if (!controls.length) { event.preventDefault(); return; }
      const index = controls.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey ? (index <= 0 ? controls.length - 1 : index - 1) : (index + 1) % controls.length;
      event.preventDefault();
      controls[next]?.focus({ preventScroll: true });
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (main instanceof HTMLElement) main.inert = previousInert;
      release();
      trigger?.focus({ preventScroll: true });
    };
  }, [mounted, lockScroll, onClose, triggerRef]);

  if (!mounted) return null;
  return createPortal(<div ref={layerRef} className={`shell-menu-layer ${scrolled ? 'shell-menu-layer-scrolled' : ''}`} data-open={open}>
    <div className="shell-menu-backdrop" onClick={onClose} aria-hidden="true" />
    <div ref={cardRef} className="shell-menu-card" role="dialog" aria-modal="true" aria-label="Navigation menu" tabIndex={-1} data-lenis-prevent>
      <div className="shell-menu-content">
        <div className="shell-menu-top"><ShellBrand menu onNavigate={onClose} /><div className="shell-menu-columns">
          <ShellNavigation onNavigate={onClose} />
          <div className="shell-menu-contact-column"><div className="shell-menu-contact"><p className="shell-eyebrow">CONTACTS</p><div className="shell-menu-address"><div><a className="shell-menu-phone" href="tel:+13125552468">+1 (312) 555-2468</a><a className="shell-menu-email" href="mailto:hello@neiden.project"><TextSwap>hello@neiden.project</TextSwap></a></div><p>Dronningens Gate 15, 0152 Oslo, Norway</p></div></div><ShellSocials /></div>
        </div></div>
        <div className="shell-menu-bottom"><Link to="/contacts" onClick={onClose} className="shell-action"><TextSwap>START A PROJECT</TextSwap><span className="shell-plus" aria-hidden="true" /></Link><div className="shell-menu-credits"><ShellLegal /><div className="shell-menu-copyright"><div><span>2019-26©</span><strong>Forde Lab™</strong><span>All rights reserved</span></div><FramerCredit /></div></div></div>
      </div>
    </div>
  </div>, document.body);
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const stickyTriggerRef = useRef<HTMLButtonElement>(null);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);
  const location = useLocation();
  const close = useCallback(() => setOpen(false), []);
  const toggle = (trigger: HTMLButtonElement) => { activeTriggerRef.current = trigger; setOpen(value => !value); };
  useEffect(() => { close(); }, [location.key, close]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <>
    <header className={`site-header ${open && !scrolled ? 'site-header-menu-open' : ''}`} data-section-id="S00-header">
      <div className="shell-header-lines" aria-hidden="true" />
      <nav className="shell-header-nav" aria-label="Main navigation"><ShellBrand /><ul className="shell-header-links">{headerLinks.map(({ text, to, count }) => <li key={to}><Link to={to}><TextSwap>{text}</TextSwap>{count && <sup>{count}</sup>}</Link></li>)}</ul><button ref={triggerRef} className={`shell-header-toggle ${open ? 'shell-toggle-open' : ''}`} type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={event => toggle(event.currentTarget)}><Hamburger open={open} /></button></nav>
    </header>
    <button ref={stickyTriggerRef} className={`shell-sticky-toggle ${scrolled ? 'shell-control-visible' : ''}`} type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} tabIndex={scrolled ? 0 : -1} onClick={event => toggle(event.currentTarget)}><Hamburger open={open} /></button>
    <NavOverlay open={open} onClose={close} triggerRef={activeTriggerRef} scrolled={scrolled} />
  </>;
}
