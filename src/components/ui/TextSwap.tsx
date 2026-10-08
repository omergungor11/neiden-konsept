import type { CSSProperties } from 'react';
import './ui.css';

export function TextSwap({ children }: { children: string }) {
  return <span className="text-swap">
    <span className="visually-hidden">{children}</span>
    <span className="text-swap-original" aria-hidden="true">{children}</span>
    <span className="text-swap-copy" aria-hidden="true">
      {Array.from(children).map((char, index) => <span key={index} style={{ '--char': index } as CSSProperties}>{char === ' ' ? '\u00a0' : char}</span>)}
    </span>
  </span>;
}
