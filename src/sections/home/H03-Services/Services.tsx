import { Fragment, useEffect, useRef, useState } from 'react';
import { assetUrl, responsiveAssetUrl } from '../../../assets';
import { ActionLink } from '../../../components/ui/ActionLink';
import { servicesContent as content, type ServicesVariant } from '../../../content/H03';
import { useServicesMotion } from './useServicesMotion';
import styles from './Services.module.css';

function currentVariant(): ServicesVariant {
  if (typeof window === 'undefined') return 'desktop';
  if (window.innerWidth < 810) return 'phone';
  if (window.innerWidth < 1200) return 'tablet';
  return window.innerWidth < 1620 ? 'desktop' : 'xxl';
}

function ServicesLabel() {
  return <div className={styles.label} data-services-appear="label">
    <span className={styles.wave} aria-hidden="true">{content.label.waveIds.map((id, index) => <img key={id} src={assetUrl(id)} alt="" style={{ width: [12, 10, 8, 6, 4][index] }} height="14" />)}</span>
    <span className={styles.labelText}><span>[</span><span>ND®</span><span>‒</span><span>{content.label.title}</span><span className={styles.translation}>{content.label.translation}</span><span>]</span></span>
  </div>;
}

function ServicesTitle({ variant }: { variant: ServicesVariant }) {
  return <h2 className={styles.headline} data-services-title aria-label="What We Build">{content.title.map(line => <span key={line} data-services-title-line aria-hidden="true">{variant === 'phone' ? line : [...line].map((character, index) => character === ' ' ? ' ' : <span key={index}>{character}</span>)}</span>)}</h2>;
}

function Introduction({ variant }: { variant: ServicesVariant }) {
  const lines = content.introduction[variant === 'desktop' ? 'desktop' : 'other'];
  return <p className={styles.introduction} data-services-appear="introduction">{lines.map((line, index) => <Fragment key={line}>{index > 0 && <br />}{line}</Fragment>)}</p>;
}

function ProjectLink() {
  return <ActionLink dark className={styles.projectLink}>{content.project.cta}</ActionLink>;
}

type Service = typeof content.cards[number];
function ServiceCard({ card, variant, index }: { card: Service; variant: ServicesVariant; index: number }) {
  const tags = card.tags[variant];
  return <article className={styles.card} data-services-card={index} aria-labelledby={`service-title-${index}`}>
    <header className={styles.cardHeader}>
      <p className={styles.eyebrow}><span>{card.number}</span><span className={styles.translation}>{card.translation}</span></p>
      <h3 id={`service-title-${index}`} className={styles.cardTitle} data-services-card-title aria-label={card.title}>{card.title.split(' ').map((word, wordIndex) => <Fragment key={`${word}-${wordIndex}`}>{wordIndex > 0 && ' '}<span data-services-word aria-hidden="true">{word}</span></Fragment>)}</h3>
    </header>
    <div className={styles.media} aria-hidden="true">{card.images.map((id, imageIndex) => <div key={id} className={styles.imageFrame} data-services-image={imageIndex}><img src={responsiveAssetUrl(id, variant)} alt="" />{imageIndex === 0 && <svg className={styles.corner} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63 63" overflow="visible"><path d="M 0 0 L 63 63 L 63 0 Z" fill="rgb(242, 242, 242)" /></svg>}</div>)}</div>
    <div className={styles.cardFooter}>
      <div className={styles.copy}><p className={styles.description}>{card.description}</p><p className={styles.price}>{card.price}</p></div>
      <div className={styles.tags}>{[tags.slice(0, 3), tags.slice(3)].map((row, rowIndex) => <ul key={rowIndex} className={styles.tagRow}>{row.map(tag => <li key={tag}>{tag}</li>)}</ul>)}</div>
    </div>
  </article>;
}

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const [variant, setVariant] = useState<ServicesVariant>(currentVariant);
  useEffect(() => {
    const onResize = () => setVariant(currentVariant());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);
  useServicesMotion(root, variant);
  return <section ref={root} id="services" className={styles.services} data-section="H03" data-services-variant={variant} aria-label="What we build">
    <div className={styles.gridLines} aria-hidden="true"><i /><i /><i /></div>
    <div className={styles.boxed}>
      <div className={styles.headingWrapper}><div className={styles.sticky}>
        {variant === 'tablet' ? <div className={styles.tabletHeading}><div className={styles.inner}><ServicesLabel /><Introduction variant={variant} /></div><ServicesTitle variant={variant} /></div> : <div className={styles.inner}><div className={styles.headingBase}><ServicesLabel /><ServicesTitle variant={variant} /></div><Introduction variant={variant} /></div>}
        {(variant === 'desktop' || variant === 'xxl') && <div className={styles.project}><div className={styles.projectCopy} data-services-appear="project-copy"><p className={styles.projectEyebrow}>{content.project.eyebrow}</p><p className={styles.description}>{content.project.description}</p></div><div data-services-appear="project-cta"><ProjectLink /></div></div>}
      </div></div>
      <div className={styles.cards}>{content.cards.map((card, index) => <ServiceCard key={card.number} card={card} variant={variant} index={index} />)}</div>
      {variant === 'tablet' && <div className={styles.tabletProject}><div data-services-appear="project-copy"><p className={styles.tabletProjectTitle}>{content.project.tabletTitle}</p><p className={styles.description}>{content.project.tabletDescription}</p></div><div data-services-appear="project-cta"><ProjectLink /></div></div>}
    </div>
    <div className={styles.facts}><p className={styles.booking}>{content.facts.booking}<span> {content.facts.month}</span></p><p className={styles.delivery}><span>{content.facts.delivery}</span> {content.facts.weeks}</p></div>
  </section>;
}
