import { Link } from 'react-router-dom';
import { assetUrl } from '../../assets';
import { MaskIcon } from '../ui/MaskIcon';
import { TextSwap } from '../ui/TextSwap';

export const shellLinks = [
  { text: 'ABOUT STUDIO', to: '/about-us' },
  { text: 'PROJECTS', to: '/projects', count: '15' },
  { text: 'ARTICLES', to: '/blog' },
  { text: 'CONTACT', to: '/contacts' },
  { text: 'CAREER', to: '/career' },
  { text: '404', to: '/404' },
];

export function ShellBrand({ menu = false, onNavigate }: { menu?: boolean; onNavigate?: () => void }) {
  return <Link className={`shell-brand ${menu ? 'shell-brand-menu' : ''}`} to="/" onClick={onNavigate} aria-label="Neiden home">
    <span className="shell-brand-lockup"><img className="shell-brand-mark" src={assetUrl(menu ? 'db63dd750eb3f9e0' : '59bc6ecd4c72944e')} alt="" /><span className="shell-brand-name">ñeiden®</span></span>
    <span className="shell-brand-badge">Built With Purpose</span>
  </Link>;
}

export function ShellNavigation({ onNavigate }: { onNavigate?: () => void }) {
  return <nav aria-label="Site navigation" className="shell-navigation">
    <p className="shell-eyebrow">NAVIGATION</p>
    <ul>{shellLinks.map(({ text, to, count }) => <li key={to}><Link to={to} onClick={onNavigate}><TextSwap>{text}</TextSwap>{count && <sup>{count}</sup>}</Link></li>)}</ul>
  </nav>;
}

export function ShellSocials() {
  return <div className="shell-socials" aria-label="Social accounts">
    {[['X', 'https://x.com', 'a3be02ce20d5ef65'], ['Instagram', 'https://instagram.com', '6dfcbc4c624166a8'], ['Dribbble', 'https://dribbble.com', '37a75d6c3b4bb1d9']].map(([label, href, id]) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}><MaskIcon id={id} size={21} /></a>)}
  </div>;
}

export function ShellLegal() {
  return <div className="shell-legal"><Link to="/terms-of-services">TERMS OF SERVICE</Link><span aria-hidden="true" /><Link to="/privacy">PRIVACY POLICY</Link></div>;
}

export function FramerCredit() {
  return <div className="shell-framer-credit"><span className="shell-framer-icon"><img src={assetUrl('ddcbdd6c606bc43c')} alt="" /></span><strong>Built in Framer</strong></div>;
}

export function Hamburger({ open }: { open: boolean }) {
  return <span className={`shell-hamburger ${open ? 'shell-hamburger-open' : ''}`} aria-hidden="true"><i /><i /><i /></span>;
}
