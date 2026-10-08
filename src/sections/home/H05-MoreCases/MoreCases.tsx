import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { assetUrl, responsiveAssetUrl } from '../../../assets';
import { ActionLink } from '../../../components/ui/ActionLink';
import { cubicEase, springEase, useMotion } from '../../../motion';
import { moreCasesContent as content, type MoreCasesVariant } from '../../../content/H05';
import styles from './MoreCases.module.css';

function currentVariant(): MoreCasesVariant {
  if (typeof window === 'undefined') return 'desktop';
  return window.innerWidth < 810 ? 'phone' : window.innerWidth < 1200 ? 'tablet' : window.innerWidth < 1620 ? 'desktop' : 'xxl';
}

function MoreCasesLabel() {
  return <h2 className={styles.label}>
    <span className={styles.wave} aria-hidden="true">{content.label.waveIds.map((id, index) => <span key={id} style={{ width: [12, 10, 8, 6, 4][index], maskImage: `url("${assetUrl(id)}")` } as CSSProperties} />)}</span>
    <span className={styles.labelText}><span>[</span><span>ND®</span><span>‒</span><span>{content.label.title}</span><span className={styles.translation}>{content.label.translation}</span><span>]</span></span>
  </h2>;
}

type Case = typeof content.rows[number];
type LayoutSnapshot = { height: number; positions: Array<{ target: HTMLElement; top: number }> };

function CaseRow({ row, index, variant }: { row: Case; index: number; variant: MoreCasesVariant }) {
  const root = useRef<HTMLAnchorElement>(null);
  const { reducedMotion, refresh } = useMotion();
  // The source CMS binding explicitly selects Variant 2 for its first row.
  const [expanded, setExpanded] = useState(index === 0);
  const previous = useRef<LayoutSnapshot | null>(null);
  const hovered = useRef(false);
  const focused = useRef(false);
  const phone = variant === 'phone';
  const setOpen = (open: boolean) => {
    const element = root.current;
    if (phone || open === expanded || !element) return;
    previous.current = { height: element.getBoundingClientRect().height, positions: [...element.querySelectorAll<HTMLElement>('[data-case-flip]')].map(target => ({ target, top: target.getBoundingClientRect().top })) };
    setExpanded(open);
  };
  useLayoutEffect(() => {
    const element = root.current;
    const before = previous.current;
    if (!element || !before) return;
    previous.current = null;
    const context = gsap.context(() => {
      gsap.set(element, { clearProps: 'height' });
      before.positions.forEach(({ target }) => gsap.set(target, { clearProps: 'transform' }));
      const height = element.getBoundingClientRect().height;
      if (reducedMotion || phone) { refresh(); return; }
      const ease = cubicEase([.44, 0, .56, 1]);
      const timeline = gsap.timeline({ onComplete: () => { gsap.set(element, { clearProps: 'height' }); refresh(); } });
      timeline.fromTo(element, { height: before.height }, { height, duration: .6, ease }, 0);
      before.positions.forEach(({ target, top }) => {
        const y = top - target.getBoundingClientRect().top;
        timeline.fromTo(target, { y }, { y: 0, duration: .6, ease, clearProps: 'transform' }, 0);
      });
      timeline.fromTo(element.querySelector('[data-case-description]'), { opacity: expanded ? 0 : 1 }, { opacity: expanded ? 1 : 0, duration: .6, ease, clearProps: 'opacity' }, 0);
      timeline.fromTo(element.querySelector('[data-case-logo]'), { opacity: expanded ? 0 : 1 }, { opacity: expanded ? 1 : 0, duration: .6, ease, clearProps: 'opacity' }, 0);
    }, element);
    return () => context.revert();
  }, [expanded, phone, reducedMotion, refresh]);
  return <Link ref={root} to={row.href} className={`${styles.row} ${expanded && !phone ? styles.expanded : ''}`} data-case-row={index} data-case-expanded={expanded && !phone} data-more-cases-appear="row"
    onPointerEnter={event => { if (event.pointerType === 'mouse') { hovered.current = true; setOpen(true); } }}
    onPointerLeave={event => { if (event.pointerType === 'mouse') { hovered.current = false; if (!focused.current) setOpen(false); } }}
    onFocus={() => { focused.current = true; setOpen(true); }} onBlur={() => { focused.current = false; if (!hovered.current) setOpen(false); }}>
    <div className={styles.metadata}><span className={styles.counter}>{[...row.number].map((character, characterIndex) => <span key={characterIndex}>{character}</span>)}</span><span>{row.year}</span></div>
    <div className={styles.rowContent}>
      <div className={styles.mediaSlot}><div className={styles.imageFrame} data-case-flip data-case-image><img src={responsiveAssetUrl(row.imageId, variant)} alt="" onLoad={refresh} /><img className={styles.logo} data-case-logo src={assetUrl(row.logoId)} alt="" /></div></div>
      <div className={styles.copy} data-case-flip><h3 className={styles.title}>{row.title}</h3><p className={styles.description} data-case-description>{row.description}</p></div>
    </div>
  </Link>;
}

export default function MoreCases() {
  const root = useRef<HTMLElement>(null);
  const [variant, setVariant] = useState<MoreCasesVariant>(currentVariant);
  const { reducedMotion, refresh } = useMotion();
  useEffect(() => {
    const onResize = () => setVariant(currentVariant());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const button = element.querySelector<HTMLAnchorElement>('[data-more-cases-cta] a');
    const handlers: Array<[keyof HTMLElementEventMap, EventListener]> = [];
    const context = gsap.context(() => {
      if (button) {
        const animate = (color: string, angle: number) => context.add(() => gsap.to(button, { '--more-cases-button-color': color, '--more-cases-plus-angle': `${angle}deg`, duration: reducedMotion ? 0 : .6, ease: springEase(.6), overwrite: true }));
        const enter = () => animate('#f02b42', -180);
        const leave = () => animate('#212121', 0);
        const press = () => animate('#8c232f', 0);
        handlers.push(['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave], ['pointerdown', press], ['pointerup', enter]);
        handlers.forEach(([event, handler]) => button.addEventListener(event, handler));
      }
      if (reducedMotion) return;
      element.querySelectorAll<HTMLElement>('[data-more-cases-appear]').forEach(target => {
        const row = target.dataset.moreCasesAppear === 'row';
        if (!row && variant === 'phone') return;
        gsap.fromTo(target, { opacity: 0, y: 40 }, { opacity: 1, y: 0, delay: row ? .3 : .2, duration: 2, ease: springEase(2), scrollTrigger: { trigger: target, start: () => `top ${window.innerHeight - Math.min(target.offsetHeight, window.innerHeight) * .5}px`, once: true } });
      });
    }, element);
    let cancelled = false;
    void document.fonts.ready.then(() => { if (!cancelled) refresh(); });
    return () => { cancelled = true; if (button) handlers.forEach(([event, handler]) => button.removeEventListener(event, handler)); context.revert(); };
  }, [variant, reducedMotion, refresh]);
  return <section ref={root} className={styles.moreCases} data-section="H05" data-more-cases-variant={variant} aria-label="More cases">
    <div className={styles.grid}>
      <div className={styles.heading}>
        <div className={styles.introduction} data-more-cases-appear="introduction"><MoreCasesLabel /><p className={styles.introCopy}>{content.introduction.map((line, index) => <Fragment key={line}>{index > 0 && <br />}{line}</Fragment>)}</p></div>
        <div className={styles.ctaSlot} data-more-cases-cta><ActionLink to="/projects" className={styles.cta}>{content.cta}</ActionLink></div>
      </div>
      <div className={styles.rows}>{content.rows.map((row, index) => <CaseRow key={`${row.number}-${variant}`} row={row} index={index} variant={variant} />)}</div>
    </div>
    <div className={styles.facts} aria-hidden="true"><p>{content.facts.label}<span className={styles.factsSpace}> </span><span>{content.facts.period}</span></p></div>
  </section>;
}
