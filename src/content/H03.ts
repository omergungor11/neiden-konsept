export const servicesContent = {
  title: ['What', 'We Build'],
  label: { title: 'SERVICES / ', translation: '思想と実行', waveIds: ['494851aaceec8e45', '4c2c83d0cab51864', '706019cfe4ca47f8', 'e2678138a494bd36', 'c86ef7f79086d779'] },
  introduction: {
    desktop: ['Four core disciplines. One goal: helping brands ', 'communicate, grow, and stay memorable.'],
    other: ['Four core disciplines. One clear goal: helping brands ', 'communicate, grow, and stay memorable.'],
  },
  project: { eyebrow: 'BEYOND STANDARD PROJECT SCOPE', description: 'Made for different. Built together.', tabletTitle: 'Your idea doesn’t fit a box?', tabletDescription: 'Neither do we. Let’s shape it together.', cta: 'Discuss Your Project', plusId: '9d550f944aa94749' },
  facts: { booking: 'NOW BOOKING', month: 'MAY', delivery: 'DELIVERY', weeks: '2–4 WEEKS' },
  cards: [
    {
      title: 'Brand Positioning & Identity', number: '001. /', translation: '物語と個性',
      description: 'We define how your brand looks, speaks, and is remembered. From positioning and visual identity to scalable design systems, every element is built to create recognition and consistency.',
      price: 'Starting From $4500', images: ['c2439cb54f9fe04b', '19a13d1f927f649c'],
      tags: {
        xxl: ['Visual identity', 'Typography systems', 'Brand Positioning', 'Logo design', 'Packaging design', 'Rebranding'],
        desktop: ['Visual identity', 'Typography', 'Branding', 'Logo design', 'Packaging design', 'Rebranding'],
        tablet: ['Visual identity', 'Typography', 'Branding', 'Logo design', 'Packaging design', 'Rebranding'],
        phone: ['Visual identity', 'Typography', 'Positioning', 'Logo design', 'Packaging', 'Rebranding'],
      },
    },
    {
      title: 'Product Experience Design', number: '002. /', translation: '体験と設計',
      description: 'We design websites, platforms, and digital products that balance usability, performance, and visual clarity. Every interaction is shaped to help users move faster and make better decisions.',
      price: 'Starting From $3500', images: ['9fb32b63364017f7', '5b95b5e80c77d3d1'],
      tags: {
        xxl: ['UX Design', 'UI Systems', 'Product Strategy', 'Wireframing', 'Prototyping', 'Design Audits'],
        desktop: ['UX Design', 'UI Systems', 'Product Strategy', 'Wireframing', 'Prototyping', 'Design Audits'],
        tablet: ['UX Design', 'UI Systems', 'Product Strategy', 'Wireframing', 'Prototyping', 'Design Audits'],
        phone: ['UX Design', 'UI Systems', 'Product Strategy', 'Wireframing', 'Prototyping', 'Design Audits'],
      },
    },
    {
      title: 'Social Presence & Content', number: '003. /', translation: '影響と発信',
      description: 'We create content systems that keep brands active, consistent, and recognizable across social platforms. From strategy to execution, every touchpoint supports long-term brand growth.',
      price: 'Starting From $2500', images: ['256d1050a1780ed0', 'b4387741bfa6dc28'],
      tags: {
        xxl: ['Content Strategy', 'Creative Campaigns', 'Art Direction', 'Community Building', 'Brand Content', 'Social Media'],
        desktop: ['Content Strategy', 'Creatives', 'Art Direction', 'Networking', 'Brand Content', 'Social Media'],
        tablet: ['Content Strategy', 'Creatives', 'Art Direction', 'Community Building', 'Brand Content', 'Social Media'],
        phone: ['Strategy', 'Creatives', 'Art Direction', 'Community', 'Brand Content', 'SMM'],
      },
    },
    {
      title: 'Organic Growth & Visibility', number: '004. /', translation: '検索と成長',
      description: 'We increase visibility where it matters most. Through SEO, content strategy, and technical improvements, we help brands attract the right audience and create lasting growth.',
      price: 'Starting From $6000', images: ['93c60342e279bdfe', '7c1894afae8c04b1'],
      tags: {
        xxl: ['SEO Strategy', 'Technical SEO', 'Content Strategy', 'Keyword Research', 'Site Performance', 'Search Analytics'],
        desktop: ['SEO Strategy', 'Technical SEO', 'Content', 'Keywords', 'Performance', ' Analytics'],
        tablet: ['SEO Strategy', 'Technical SEO', 'Content', 'Keyword Research', 'Site Performance', 'Search Analytics'],
        phone: ['SEO Strategy', 'Technical SEO', 'Content', 'Keyword', 'Performance', 'Analytics'],
      },
    },
  ],
} as const;

export type ServicesVariant = 'xxl' | 'desktop' | 'tablet' | 'phone';
