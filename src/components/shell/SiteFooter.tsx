import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { assetUrl } from '../../assets';
import { brand } from '../../content/brand';
import { springEase, useMotion } from '../../motion';
import { FramerCredit, ShellLegal, ShellNavigation } from './ShellParts';
import './shell.css';

export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotion();
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion) return;
    const context = gsap.context(() => {
      const mark = root.querySelector('.shell-footer-wordmark');
      const chars = root.querySelectorAll('.shell-footer-tagline [data-char]');
      // Source Fs/Es and Ds: duration-based, bounce-zero spring curves.
      if (mark) gsap.fromTo(mark, { opacity: 0 }, { opacity: 1, delay: .3, duration: 2, ease: springEase(2), scrollTrigger: { trigger: mark, start: 'top bottom', once: true } });
      if (chars.length) gsap.fromTo(chars, { opacity: .001, filter: 'blur(10px)', scale: 3 }, { opacity: 1, filter: 'blur(0px)', scale: 1, delay: .6, duration: .8, stagger: .07, ease: springEase(.8), scrollTrigger: { trigger: root.querySelector('.shell-footer-tagline'), start: 'top bottom', once: true } });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);

  return <footer ref={ref} className="site-footer" data-section-id="S00-footer">
    <div className="shell-footer-inner">
      <div className="shell-footer-top"><div className="shell-footer-navigation"><ShellNavigation /></div><div className="shell-footer-brand">
        <svg className="shell-footer-wordmark" viewBox="0 0 999.5094551057571 280" role="img" aria-label={brand.name}><foreignObject width="100%" height="100%"><p>{brand.name}</p></foreignObject></svg>
        <p className="shell-footer-tagline" aria-label="built around clarity">{'built around clarity'.split(' ').map((word, wordIndex) => <span className="shell-footer-word" key={word}>{wordIndex > 0 && '\u00a0'}{Array.from(word).map((char, index) => <span data-char key={index} aria-hidden="true">{char}</span>)}</span>)}</p>
        <p className="shell-footer-established">EST. <span>2019</span>&nbsp; LAST UPDATE: <span>Q2 2026</span></p>
      </div></div>
      <div className="shell-footer-bottom">
        <div className="shell-footer-creator"><img src={assetUrl('0a854e51eeba6c7c')} alt="Forde" /><div><p>Сreated</p><span>With passion at <strong>Forde®</strong></span></div></div>
        <div className="shell-footer-copyright"><div className="shell-footer-copyright-desktop"><span>2016-26</span><strong>Førde lab™.</strong><span>@ All rights reserved</span></div><div className="shell-footer-copyright-mobile"><span>2026</span><strong>Førde lab™</strong><span>Rights reserved</span></div><FramerCredit /></div>
        <ShellLegal />
      </div>
      <div className="shell-footer-lines" aria-hidden="true" />
    </div>
  </footer>;
}
