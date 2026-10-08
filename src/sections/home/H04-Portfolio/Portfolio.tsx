import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { assetUrl } from '../../../assets';
import { Marquee } from '../../../components/ui/Marquee';
import { portfolioContent as content, type PortfolioVariant } from '../../../content/H04';
import { usePortfolioMotion } from './usePortfolioMotion';
import styles from './Portfolio.module.css';

function currentVariant(): PortfolioVariant {
  if (typeof window === 'undefined') return 'desktop';
  if (window.innerWidth < 810) return 'phone';
  if (window.innerWidth < 1200) return 'tablet';
  return window.innerWidth < 1620 ? 'desktop' : 'xxl';
}

function PortfolioLabel() {
  return <div className={styles.label}>
    <span className={styles.wave} aria-hidden="true">{content.label.waveIds.map((id, index) => <img key={id} src={assetUrl(id)} alt="" style={{ width: [12, 10, 8, 6, 4][index] }} height="14" />)}</span>
    <span className={styles.labelText}><span>[</span><span>ND®</span><span>‒</span><span>{content.label.title}</span><span className={styles.translation}>{content.label.translation}</span><span>]</span></span>
  </div>;
}

function Heading() {
  return <div className={styles.heading} data-portfolio-heading><div className={styles.headingGrid}>
    <div className={styles.subheading} data-portfolio-subheading><PortfolioLabel /><p className={styles.introduction}>{content.introduction.map((line, index) => <Fragment key={line}>{index > 0 && <br />}{line}</Fragment>)}</p></div>
    <Marquee speed={50} gap={10} hoverSpeed={.5} className={styles.ticker}>{[0, 1].map(index => <div className={styles.tickerItem} key={index} aria-hidden={index > 0 || undefined}><h2 className={styles.title}>{content.heading}</h2><p className={styles.period}><span>©</span> {content.period}</p></div>)}</Marquee>
  </div></div>;
}

function Words({ text, delay = .3, distance = 50, className = '', title = false }: { text: string; delay?: number; distance?: number; className?: string; title?: boolean }) {
  return <p className={className} data-portfolio-text data-word-delay={delay} data-word-distance={distance} data-portfolio-title={title || undefined} aria-label={text}>{text.split(' ').map((word, index) => <Fragment key={`${word}-${index}`}>{index > 0 && ' '}<span data-portfolio-word aria-hidden="true">{word}</span></Fragment>)}</p>;
}

type Project = typeof content.projects[number];
function FeaturedCard({ project, index }: { project: Project; index: number }) {
  return <article id={project.marker} className={styles.marker} data-portfolio-marker={index} aria-label={project.title}>
    <div className={styles.cardWrapper}><Link to={project.href} className={styles.card} data-portfolio-card={index} aria-label={`View ${project.title}`}>
      <div className={styles.metadata}>
        <div className={styles.counter}><Words text={project.counter} distance={10} className={styles.muted} /></div>
        <div className={styles.metadataGroup}><Words text="year" delay={.4} className={styles.muted} /><Words text={project.year} delay={.4} /></div>
        <div className={styles.metadataGroup}><Words text="Client" delay={.5} className={styles.muted} /><Words text={project.client} delay={.5} /></div>
      </div>
      <div className={styles.imageSlot} data-portfolio-slot>
        {project.logoId && <img className={styles.logo} data-portfolio-logo src={assetUrl(project.logoId)} alt="" />}
        <div className={styles.hoverOverlay} data-portfolio-hover-overlay />
        <div className={styles.hoverScale} data-portfolio-hover-scale><div className={styles.imageAppear} data-portfolio-image-appear><div className={styles.parallaxFrame}><img className={styles.photo} src={assetUrl(project.imageId)} alt="" draggable="false" data-portfolio-photo /></div></div></div>
      </div>
      <div className={styles.caption}>
        <div className={styles.captionSpacer} />
        <div className={styles.captionTitle}><div className={styles.titleMask}><Words text={project.title} className={styles.projectTitle} title /></div></div>
        <div className={styles.categories}>{project.categories.map(category => <Words key={category} text={category} className={styles.category} />)}</div>
      </div>
    </Link></div>
    <div className={styles.gridLines} aria-hidden="true"><i /><i /><i /></div>
  </article>;
}

function FeaturedBackground() {
  return <div className={styles.backgroundHost} aria-hidden="true"><div className={styles.backgroundSticky} data-portfolio-background>
    {content.projects.map((project, index) => <div key={project.imageId} className={styles.backgroundLayer} data-portfolio-layer={index} style={{ opacity: index === 0 ? 1 : 0 }}>
      <div className={styles.backgroundImage} style={{ filter: `blur(${project.blur}px)` }}><img src={assetUrl(project.imageId)} alt="" /></div>
      <div className={styles.backgroundOverlay} style={{ backgroundColor: `rgba(0,0,0,${project.overlay})` }} />
      {index !== 2 && <div className={styles.grainFrame} data-portfolio-grain-frame={index} style={{ visibility: index === 0 ? 'visible' : 'hidden' }}><div className={styles.grain} data-portfolio-grain style={{ backgroundImage: `url("${assetUrl(content.grainId)}")` }} /></div>}
    </div>)}
  </div></div>;
}

export default function Portfolio() {
  const root = useRef<HTMLElement>(null);
  const [variant, setVariant] = useState<PortfolioVariant>(currentVariant);
  useEffect(() => {
    const onResize = () => setVariant(currentVariant());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);
  usePortfolioMotion(root, variant);
  return <section ref={root} className={styles.portfolio} data-section="H04" data-portfolio-variant={variant} aria-label="Portfolio">
    <Heading />
    <div className={styles.featuredStage} data-portfolio-stage><FeaturedBackground /><div className={styles.flow}>{content.projects.map((project, index) => <FeaturedCard key={project.marker} project={project} index={index} />)}</div></div>
  </section>;
}
