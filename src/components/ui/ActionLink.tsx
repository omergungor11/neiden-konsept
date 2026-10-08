import { Link } from 'react-router-dom';
import { TextSwap } from './TextSwap';
import './ui.css';

export function ActionLink({ children, to = '/contacts', dark = false, className = '' }: { children: string; to?: string; dark?: boolean; className?: string }) {
  return <Link to={to} className={`action-link ${dark ? 'action-link-dark' : ''} ${className}`}><TextSwap>{children}</TextSwap></Link>;
}
