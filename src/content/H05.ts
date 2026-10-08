export const moreCasesContent = {
  label: {
    title: 'MORE CASES / ', translation: '他の事例',
    waveIds: ['494851aaceec8e45', '4c2c83d0cab51864', '706019cfe4ca47f8', 'e2678138a494bd36', 'c86ef7f79086d779'],
  },
  introduction: ['Design isn’t always about looks — strategy ', 'and systems matter just as much.'],
  cta: 'All projects',
  facts: { label: 'LATEST WORK', period: 'Q2 2026' },
  rows: [
    { number: '01.', year: '2024', title: 'Brands Built Through Consistency', description: 'Code review, Debugging, Refactoring', href: '/projects/data-driven-ux-decisions', imageId: '971e82e195a66983', logoId: 'c295c3cd460b9450' },
    { number: '02.', year: '2024', title: 'Exploring New Digital Interactions', description: 'API debugging, Error handling', href: '/projects/strategic-thinking-and-brand-foundations-for-dribbble', imageId: '5081a3d1c8f20898', logoId: '0ac60417fed6baf1' },
    { number: '03.', year: '2025', title: 'Shaping Brands Through Design', description: 'Case Study, CMS', href: '/projects/creating-a-scalable-system-for-growth', imageId: 'b138d993b4500882', logoId: '50ebd006fbf80cc7' },
  ],
} as const;

export type MoreCasesVariant = 'phone' | 'tablet' | 'desktop' | 'xxl';
