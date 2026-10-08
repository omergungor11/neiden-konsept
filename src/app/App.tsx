import { Route, Routes, useLocation } from 'react-router-dom';
import { MotionProvider } from '../motion';
import { MotionDiagnostics } from './MotionDiagnostics';
import { GlobalEffects, SiteFooter, SiteHeader } from '../components/shell';
import Hero from '../sections/home/H01-Hero';
import About from '../sections/home/H02-About';
import Services from '../sections/home/H03-Services';
import Portfolio from '../sections/home/H04-Portfolio';
import { PortfolioSequence } from './PortfolioSequence';

export default function App() {
  const location = useLocation();
  return (
    <MotionProvider pathname={location.pathname} navigationKey={location.key} hash={location.hash}>
      <MotionDiagnostics />
      <div style={{ position: 'absolute', inset: '0 0 auto', zIndex: 60 }}><SiteHeader /></div>
      <main id="top">
        <Routes>
          <Route path="/" element={<><Hero /><About /><Services /><PortfolioSequence><Portfolio /></PortfolioSequence></>} />
          <Route path="*" element={<div style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', background: 'var(--dark)', color: 'white' }}><h1 style={{ fontFamily: 'var(--logo-font)', fontWeight: 400, fontSize: 'clamp(100px, 20vw, 300px)', letterSpacing: '-.05em' }}>ñeiden</h1></div>} />
        </Routes>
      </main>
      <SiteFooter />
      <GlobalEffects />
    </MotionProvider>
  );
}
