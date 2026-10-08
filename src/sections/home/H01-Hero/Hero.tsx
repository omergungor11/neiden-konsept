import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { assetUrl } from '../../../assets';
import { ActionLink } from '../../../components/ui/ActionLink';
import { Marquee } from '../../../components/ui/Marquee';
import { MaskIcon } from '../../../components/ui/MaskIcon';
import { heroContent as content } from '../../../content/H01';
import { cubicEase, springEase, useMotion } from '../../../motion';
import { useHeroMotion } from './useHeroMotion';
import styles from './Hero.module.css';

function Wordmark({ duplicate = false }: { duplicate?: boolean }) {
  return <svg viewBox="0 0 854.9700598802395 240" className={styles.wordmark} aria-hidden={duplicate || undefined} role={duplicate ? undefined : 'img'} aria-label={duplicate ? undefined : content.wordmark}>
    <foreignObject width="100%" height="100%"><p className={styles.wordmarkText}>{content.wordmark}</p></foreignObject>
  </svg>;
}

function Characters({ text, intro = false }: { text: string; intro?: boolean }) {
  return <span aria-label={text} data-hero-characters={intro ? 'intro' : 'tagline'}>{[...text].map((character, index) => <span key={index} aria-hidden="true" className={styles.character}>{character === ' ' ? '\u00a0' : character}</span>)}</span>;
}

/** Exact four SVG paths from the source preloader, including its White20 base. */
function IntroEmblem() {
  return <span className={styles.introEmblem}><svg viewBox="0 0 45.981 21" aria-hidden="true">
    <path fill="#ffffff33" d="M 0 10.5 L 10.481 10.5 C 10.481 10.5 10.481 10.5 10.481 10.5 L 10.481 0 C 10.481 0 14.067 0.112 15.958 0.292 C 16.904 0.381 19.464 0.923 21.544 1.75 C 23.625 2.577 25.225 3.689 26.13 4.375 C 27.939 5.746 29.712 7.789 31.081 8.647 C 33.652 10.258 35.307 10.477 35.5 10.498 L 35.5 0 L 45.981 0 L 45.981 10.5 L 35.519 10.5 L 35.519 21 C 35.519 21 31.955 20.316 29.216 18.529 C 27.847 17.636 26.065 15.431 23 13.417 C 19.935 11.402 16.117 10.591 15.139 10.5 C 13.184 10.318 10.482 10.5 10.481 10.5 L 10.481 21 L 0 21 Z" />
    <path fill="#fff" transform="translate(0 11)" d="M 0 0 L 10.481 0 L 10.481 10.5 L 0 10.5 Z" />
    <path fill="#fff" transform="translate(36 0)" d="M 0 0 L 10.481 0 L 10.481 10.5 L 0 10.5 Z" />
    <path fill="#fff" transform="translate(11 0)" d="M 0 10.5 C 0 10.5 2.702 10.318 4.658 10.5 C 5.636 10.591 9.454 11.402 12.519 13.417 C 15.584 15.431 17.366 17.636 18.735 18.529 C 21.474 20.316 25.038 21 25.038 21 L 25.038 10.5 C 25.038 10.5 23.339 10.363 20.6 8.647 C 19.231 7.789 17.458 5.746 15.649 4.375 C 14.744 3.689 13.144 2.577 11.063 1.75 C 8.983 0.923 6.423 0.381 5.477 0.292 C 3.586 0.112 0 0 0 0 Z" />
  </svg></span>;
}

function Intro({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const mountedAt = useRef(0);
  const { lockScroll, reducedMotion } = useMotion();
  useLayoutEffect(() => {
    mountedAt.current = performance.now();
    const release = lockScroll('H01:mount-preloader');
    const timer = window.setTimeout(onComplete, 4000);
    return () => { window.clearTimeout(timer); release(); };
  }, [lockScroll, onComplete]);
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      if (reducedMotion) return;
      const ease = cubicEase([.77, 0, .54, .99]);
      const timeline = gsap.timeline();
      timeline.fromTo('[data-intro-brand]', { opacity: 0 }, { opacity: 1, duration: .6, ease }, .3);
      timeline.fromTo('[data-hero-characters="intro"] > span', { opacity: .001, scale: 3, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .8, stagger: .07, ease: springEase(.8) }, 1);
      timeline.to('[data-intro-message]', { opacity: 0, scale: 2, filter: 'blur(5px)', duration: .6, ease }, 3.3);
      timeline.to('[data-intro-brand]', { opacity: 0, duration: .6, ease }, 3.3);
      timeline.to('[data-intro-panel="left"]', { height: '1dvh', y: -50, duration: .6, ease }, 3.5);
      timeline.to('[data-intro-panel="right"]', { height: '1dvh', y: 50, duration: .6, ease }, 3.5);
      timeline.time((performance.now() - mountedAt.current) / 1000);
    }, root);
    return () => context.revert();
  }, [reducedMotion]);
  return <div ref={root} className={styles.intro} aria-hidden="true" data-hero-preloader>
    <div className={styles.introPanelLeft} data-intro-panel="left" />
    <div className={styles.introPanelRight} data-intro-panel="right" />
    <p className={styles.introMessage} data-intro-message><Characters text={content.tagline} intro /></p>
    <div className={styles.introBrand} data-intro-brand><IntroEmblem /><span>ñeiden<span className={styles.registered}>®</span></span></div>
  </div>;
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { reducedMotion } = useMotion();
  const [intro, setIntro] = useState(true);
  const completeIntro = useRef(() => setIntro(false)).current;
  useHeroMotion(root);
  useLayoutEffect(() => {
    if (reducedMotion) video.current?.pause();
    else void video.current?.play().catch(() => {});
  }, [reducedMotion]);
  return <>
    {intro && <Intro onComplete={completeIntro} />}
    <section ref={root} className={styles.hero} aria-label="Neiden design studio" data-section="H01" inert={intro}>
      <div className={styles.wrapper} data-hero-wrapper>
        <div className={styles.background} aria-hidden="true" data-hero-video-parallax>
          <div className={styles.backgroundAppear} data-hero-background>
            <video ref={video} src={assetUrl(content.videoId)} autoPlay={!reducedMotion} muted loop playsInline preload="auto" className={styles.video} />
          </div>
        </div>
        <div className={styles.grainFrame} aria-hidden="true"><div className={styles.grain} style={{ backgroundImage: `url("${assetUrl(content.grainId)}")` }} data-hero-grain /></div>
        <div className={styles.primary} data-hero-primary>
          <div className={styles.services} data-hero-parallax="-0.05">
            {content.services.map((service, index) => <p key={service.number} className={styles.service} data-hero-service={index}><span className={styles.serviceNumber}>{service.number}</span><span className={styles.serviceDesktop}>{service.desktop}</span><span className={styles.servicePhone}>{service.phone[0]}<br />{service.phone[1]}</span></p>)}
          </div>
          <div className={styles.logoFrame}>
            <div className={styles.dots} aria-hidden="true"><i /><i /><i /><i /></div>
            <div className={styles.logoParallax} data-hero-parallax="-0.15"><div data-hero-logo-appear><div className={styles.glitch} data-hero-glitch><div data-glitch-base><Wordmark /></div>{[0, 1, 2, 3].map(index => <div key={index} className={styles.glitchLayer} data-glitch-slice><Wordmark duplicate /></div>)}</div></div></div>
            <div className={styles.taglineGrid} data-hero-parallax="-0.1"><p className={styles.tagline}><Characters text={content.tagline} /></p></div>
          </div>
          <div className={styles.description} data-hero-parallax="-0.05"><p data-hero-description>We help brands make better decisions, build stronger products,<br className={styles.desktopBreak} /> and move forward with confidence.</p></div>
        </div>
        <div className={styles.actions}>
          <div className={styles.ctaCell} data-hero-cta style={{ '--h01-plus': `url("${assetUrl(content.plusId)}")` } as CSSProperties}><ActionLink dark className={styles.cta}>Start a Project</ActionLink></div>
          <div className={styles.reviewCell} data-hero-reviews><div className={styles.reviews} data-hero-review-presence>
            <div className={styles.people}>{content.avatars.map(avatar => <span className={styles.avatar} key={avatar.id}><img src={assetUrl(avatar.id)} alt={avatar.alt} width="40" height="44" /></span>)}<span className={styles.avatarCount}>80+</span></div>
            <div className={styles.rating}><div className={styles.ratingTop}><span className={styles.ratingDots} aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <i key={i} />)}</span><span>4.9/5</span></div><p><span>Based on </span><span>361 reviews</span></p></div>
          </div></div>
        </div>
        <div className={styles.clients}><div className={styles.tickerReveal} data-hero-ticker><Marquee speed={50} gap={100} className={styles.ticker}>{content.logos.map(logo => <span key={logo.id} className={styles.clientLogo} style={{ height: `${84 * logo.height / logo.width}px`, maskImage: `url("${assetUrl(logo.id)}")` } as CSSProperties} />)}</Marquee></div></div>
        <p className={styles.years}>2019-26©</p>
        <div className={styles.slots}><span><span>Projects <span className={styles.muted}>for</span></span><span>May</span></span><span className={styles.slotBars} aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <i key={i} data-hero-slot-blink={i === 2 ? '' : undefined} />)}</span><span className={styles.slotRemaining}><span>3</span><span>left</span></span></div>
        <div className={styles.social}><div className={styles.socialIcons}>{content.socials.map(social => <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} key={social.label}><MaskIcon id={social.iconId} size={21} /></a>)}</div><p><span>Stay</span><br />connected</p></div>
        <div className={styles.grid} aria-hidden="true"><i /><i /><i /></div>
      </div>
    </section>
  </>;
}
