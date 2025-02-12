import type {
  Section,
  HeroContent,
  FeaturesContent,
  PricingContent,
  ContactContent,
  CustomContent,
} from '~/types/section';
import { HeroSection } from './sections/hero-section';
import { ContactSection } from './sections/contact-section';
import { CustomSection } from './sections/custom-section';
import { FeaturesSection } from './sections/features-section';
import { PricingSection } from './sections/pricing-section';

interface SectionRendererProps {
  section: Section & { order: number; isVisible: boolean };
  className?: string;
}

export function SectionRenderer({
  section,
  className = '',
}: SectionRendererProps) {
  // Get theme variables from CSS
  const themeStyles = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    background: 'var(--color-background)',
    text: 'var(--color-text)',
    accent: 'var(--color-accent)',
  };
  console.log('section', section);
  const renderContent = () => {
    switch (section.type) {
      case 'hero':
        return (
          <HeroSection
            content={section.content as HeroContent}
            themeStyles={themeStyles}
            styles={section.styles}
          />
        );
      case 'features':
        return (
          <FeaturesSection
            content={section.content as FeaturesContent}
            themeStyles={themeStyles}
            styles={section.styles}
          />
        );
      case 'pricing':
        return (
          <PricingSection
            content={section.content as PricingContent}
            themeStyles={themeStyles}
            styles={section.styles}
          />
        );
      case 'contact':
        return (
          <ContactSection
            content={section.content as ContactContent}
            themeStyles={themeStyles}
            styles={section.styles}
          />
        );
      case 'custom':
        return (
          <CustomSection
            content={section.content as CustomContent}
            themeStyles={themeStyles}
            styles={section.styles}
          />
        );
      default:
        console.warn(`Section type "${section.type}" not found`);
        return null;
    }
  };

  return (
    <section
      className={`w-full ${className}`}
      style={section.styles as React.CSSProperties}
      data-section-id={section.id}
    >
      {renderContent()}
    </section>
  );
}
