export type PortfolioVariant = 'xxl' | 'desktop' | 'tablet' | 'phone';

export const portfolioContent = {
  heading: 'Case studies.',
  period: '2023-25',
  introduction: ['Stories of how we helped brands evolve, ', 'connect with audiences, and scale effectively.'],
  label: { title: 'PORTFOLIO / ', translation: '実績と成果', waveIds: ['558c77fce726afa5', 'a062ddf2668cfdbe', '7fb2de0c5ec5d008', 'c1004e66745ca406', '48e27c042288ca8e'] },
  grainId: 'c55875619c77133f',
  projects: [
    { title: 'Identity Through Visual Contrast', href: '/projects/featured-1', marker: 'featured-1-portfolio-item-scroll', imageId: '50dddefad347f3ff', logoId: '3a580605ce6dd3a8', year: '2025', client: 'Clandesite', counter: '01.', categories: ['E-Commerce', 'UI/UX', 'Frontend'], blur: 10, overlay: .3 },
    { title: 'Digital Products Through Interaction', href: '/projects/featured-2', marker: 'featured-2-portfolio-item-scroll', imageId: '93c60342e279bdfe', logoId: '29324c6f390b43ba', year: '2025', client: 'Clandesite', counter: '01.', categories: ['Web Design', 'Branding'], blur: 7, overlay: .6 },
    { title: 'Brand Systems for Modern Audiences', href: '/projects/featured-3', marker: 'featured-3-portfolio-item-scroll', imageId: '0297947ad35a9508', logoId: null, year: '2025', client: 'Clandesite', counter: '01.', categories: ['Backend', 'Frontend'], blur: 7, overlay: .6 },
    { title: 'Visual Languages for Growing Brands', href: '/projects/featured-4', marker: 'featured-4-portfolio-item-scroll', imageId: '23dd3bb5c8b4216d', logoId: null, year: '2025', client: 'Clandesite', counter: '01.', categories: ['UI/UX', 'E-Commerce', 'Branding'], blur: 10, overlay: .3 },
  ],
} as const;
