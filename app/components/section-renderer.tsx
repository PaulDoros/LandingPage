import type {
  Section,
  HeroContent,
  FeaturesContent,
  PricingContent,
  ContactContent,
  CustomContent,
  FlexContent,
  SingleMediaContent,
  MediaCarouselContent,
  HeroStyles,
  FeaturesStyles,
  PricingStyles,
  ContactStyles,
  CustomStyles,
  FlexStyles,
  SingleMediaStyles,
  MediaCarouselStyles,
} from '~/types/section';
import { HeroSection } from './sections/hero-section';
import { FeaturesSection } from './sections/features-section';
import { PricingSection } from './sections/pricing-section';
import { ContactSection } from './sections/contact-section';
import { CustomSection } from './sections/custom-section';
import { FlexSection } from './sections/flex-section';
import { SingleMediaSection } from './sections/single-media-section';
import { MediaCarouselSection } from './sections/media-carousel-section';

interface SectionRendererProps {
  section: Section;
  className?: string;
}

export function SectionRenderer({ section, className }: SectionRendererProps) {
  const { type, content, styles } = section;

  switch (type) {
    case 'hero':
      return (
        <HeroSection
          content={content as HeroContent}
          styles={styles as Partial<HeroStyles>}
          className={className}
        />
      );
    case 'features':
      return (
        <FeaturesSection
          content={content as FeaturesContent}
          styles={styles as Partial<FeaturesStyles>}
          className={className}
        />
      );
    case 'pricing':
      return (
        <PricingSection
          content={content as PricingContent}
          styles={styles as Partial<PricingStyles>}
          className={className}
        />
      );
    case 'contact':
      return (
        <ContactSection
          content={content as ContactContent}
          styles={styles as Partial<ContactStyles>}
          className={className}
        />
      );
    case 'custom':
      return (
        <CustomSection
          content={content as CustomContent}
          styles={styles as Partial<CustomStyles>}
          className={className}
        />
      );
    case 'flex':
      return (
        <FlexSection
          content={content as FlexContent}
          styles={styles as Partial<FlexStyles>}
          className={className}
        />
      );
    case 'single-media':
      return (
        <SingleMediaSection
          media_metadata={section.media_metadata}
          content={content as SingleMediaContent}
          styles={styles as Partial<SingleMediaStyles>}
          className={className}
        />
      );
    case 'media-carousel':
      return (
        <MediaCarouselSection
          content={content as MediaCarouselContent}
          styles={styles as Partial<MediaCarouselStyles>}
          className={className}
        />
      );
    default:
      return null;
  }
}
