import type { 
  SectionType, 
  HeroContent, 
  FeaturesContent, 
  PricingContent, 
  ContactContent, 
  CustomContent,
  PricingTier,
  CustomBlock,
  FlexContent,
  FlexComponent
} from '~/types/section';

export function getInitialContent(type: SectionType) {
  switch (type) {
    case 'hero':
      return {
        title: 'Welcome to Your Landing Page',
        subtitle: 'Create beautiful, responsive landing pages in minutes',
        ctaText: 'Get Started',
        ctaLink: '/authenticate/sign-up',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop'
      } satisfies HeroContent;

    case 'features':
      return {
        title: 'Amazing Features',
        subtitle: 'Everything you need to create the perfect landing page',
        features: [
          {
            title: 'Easy Customization',
            description: 'Customize every aspect of your landing page with our intuitive editor',
            icon: 'https://api.iconify.design/heroicons:paint-brush.svg'
          },
          {
            title: 'Responsive Design',
            description: 'Your landing page looks great on all devices, from mobile to desktop',
            icon: 'https://api.iconify.design/heroicons:device-phone-mobile.svg'
          },
          {
            title: 'Fast Loading',
            description: 'Optimized for speed to ensure your visitors have the best experience',
            icon: 'https://api.iconify.design/heroicons:rocket-launch.svg'
          }
        ]
      } satisfies FeaturesContent;

    case 'pricing':
      return {
        title: 'Simple Pricing',
        subtitle: 'Choose the plan that works best for you',
        tiers: [
          {
            name: 'Starter',
            price: '$0',
            description: 'Perfect for trying out our service',
            features: [
              { name: '1 Landing Page', included: true },
              { name: 'Basic Analytics', included: true },
              { name: 'Community Support', included: true },
              { name: 'Custom Domain', included: false },
              { name: 'Advanced Analytics', included: false }
            ] satisfies PricingFeature[],
            ctaText: 'Start Free',
            ctaLink: '/authenticate/sign-up'
          } satisfies PricingTier,
          {
            name: 'Pro',
            price: '$29',
            description: 'For professionals and growing businesses',
            features: [
              { name: 'Unlimited Landing Pages', included: true },
              { name: 'Advanced Analytics', included: true },
              { name: 'Priority Support', included: true },
              { name: 'Custom Domain', included: true },
              { name: 'A/B Testing', included: true }
            ] satisfies PricingFeature[],
            ctaText: 'Get Started',
            ctaLink: '/authenticate/sign-up',
            highlighted: true
          } satisfies PricingTier
        ]
      } satisfies PricingContent;

    case 'contact':
      return {
        title: 'Get in Touch',
        subtitle: 'We would love to hear from you',
        email: 'contact@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, City, Country',
        formTitle: 'Send us a message',
        formSubtitle: 'We will get back to you as soon as possible'
      } satisfies ContactContent;

    case 'custom':
      return {
        title: 'Custom Section',
        subtitle: 'Add your own custom content',
        blocks: [
          {
            type: 'card',
            content: {
              title: 'Custom Card',
              description: 'This is a custom card block',
              badge: {
                text: 'New',
                isVisible: true
              },
              button: {
                text: 'Learn More',
                link: '#',
                variant: 'primary',
                isVisible: true
              }
            },
            styles: {
              padding: 'p-6',
              backgroundColor: 'bg-white',
              borderRadius: 'rounded-lg',
              shadow: 'shadow-sm',
              hover: 'hover:shadow-md'
            }
          } satisfies CustomBlock
        ]
      } satisfies CustomContent;

    case 'flex':
      return {
        title: 'Flexible Section',
        layout: 'flex',
        gap: 16,
        components: [
          {
            id: crypto.randomUUID(),
            type: 'heading',
            content: {
              text: 'Welcome to Flex Section'
            },
            styles: {
              width: 100,
              margin: { top: 0, right: 0, bottom: 16, left: 0 },
              padding: { top: 16, right: 16, bottom: 16, left: 16 },
              fontSize: 32,
              fontWeight: 700,
              textAlign: 'center',
              textColor: 'var(--color-text)',
              backgroundColor: 'transparent'
            }
          } as FlexComponent
        ]
      } as FlexContent;

    default:
      throw new Error(`Unsupported section type: ${type}`);
  }
} 