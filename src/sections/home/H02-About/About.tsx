import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../../../assets';
import { aboutContent as content } from '../../../content/H02';
import { useAboutMotion } from './useAboutMotion';
import styles from './About.module.css';

type Variant = keyof typeof content.reveal;
function currentVariant(): Variant {
  if (typeof window === 'undefined') return 'desktop';
  if (window.innerWidth < 810) return 'phone';
  if (window.innerWidth < 1200) return 'tablet';
  return window.innerWidth < 1620 ? 'desktop' : 'xxl';
}

function AboutLabel() {
  return <div className={styles.label} data-about-appear="label">
    <span className={styles.wave} aria-hidden="true">{content.label.waveIds.map((id, index) => <img key={id} src={assetUrl(id)} alt="" style={{ width: [12, 10, 8, 6, 4][index] }} height="14" />)}</span>
    <span className={styles.labelText}><span>[</span><span>ND®</span><span>‒</span><span>{content.label.title}</span><span className={styles.translation}>{content.label.translation}</span><span>]</span></span>
  </div>;
}

function AboutImages() {
  return <div className={styles.images} aria-hidden="true">
    <div className={styles.imageCell}><div className={styles.leftImage} data-about-parallax="-0.1"><img className={styles.photo} src={assetUrl(content.images.left)} alt="" width="960" height="1200" /><img className={styles.stackedLab} src={assetUrl(content.images.stackedLab)} alt="" /></div></div>
    <div className={styles.imageSpacer} />
    <div className={styles.imageCell}><div className={styles.rightImage} data-about-parallax="-0.3"><img className={styles.photo} src={assetUrl(content.images.right)} alt="" width="960" height="1200" /><img className={styles.corner} src={assetUrl(content.images.corner)} alt="" /><img className={styles.alphaWave} src={assetUrl(content.images.alphaWave)} alt="" /></div></div>
  </div>;
}

export default function About() {
  const root = useRef<HTMLElement>(null);
  const [variant, setVariant] = useState<Variant>(currentVariant);
  useEffect(() => {
    const onResize = () => setVariant(currentVariant());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);
  useAboutMotion(root, variant);
  return <section ref={root} id="e3sqjn" className={styles.about} data-section="H02" data-about-variant={variant} aria-label="Who we are">
    <div className={styles.gridLines} aria-hidden="true"><i /><i /><i /></div>
    <div className={styles.wrapper}><div className={styles.quote}>
      <div className={styles.labelGrid}><AboutLabel /></div>
      <div className={styles.headlineFrame}>
        <i className={styles.lineFirst} aria-hidden="true" /><i className={styles.lineSecond} aria-hidden="true" /><i className={styles.lineThird} aria-hidden="true" /><i className={styles.linePhone} aria-hidden="true" />
        <div className={styles.reveal} data-about-reveal><h2 className={styles.headline} aria-label={content.title}>{[...content.reveal[variant]].map((character, index) => character === '\n' ? <br key={index} /> : <span key={index} data-about-character={index} aria-hidden="true" style={{ whiteSpace: character === ' ' ? 'pre' : 'normal' }}>{character}</span>)}</h2></div>
      </div>
      <AboutImages />
      <div className={styles.authorGrid}><div className={styles.authorWrapper}>
        <p className={styles.description} data-about-appear="description">{content.description}</p>
        <div className={styles.author} data-about-appear="author"><img className={styles.portrait} src={assetUrl(content.author.portraitId)} alt="Lars Nyström" width="60" height="60" /><div><p className={styles.authorName}>{content.author.name}</p><p className={styles.authorRole}><span>{content.author.role}</span><span>at</span></p><p className={styles.authorName}>{content.author.company}</p></div></div>
      </div></div>
    </div></div>
    <div className={styles.facts}><p className={styles.established}>{content.facts.established}</p><p className={styles.projects}>{content.facts.projects}</p></div>
  </section>;
}
