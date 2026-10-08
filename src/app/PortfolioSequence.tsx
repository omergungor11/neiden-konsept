import type { ReactNode } from 'react';
import './portfolio-sequence.css';

/** Source Portfolio parent shared by H04, H05 and H06. */
export function PortfolioSequence({ children }: { children: ReactNode }) {
  return <section className="portfolio-sequence" aria-label="Portfolio" data-portfolio-sequence>
    <div className="portfolio-sequence-grid" aria-hidden="true"><i /><i /><i /></div>
    {children}
  </section>;
}
