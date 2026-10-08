import './ui.css';

export function SectionLabel({ children, number }: { children: string; number?: string }) {
  return <div className="section-label"><span className="section-plus" aria-hidden="true">+</span><span>{children}</span>{number ? <sup>{number}</sup> : null}</div>;
}
