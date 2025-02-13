import type { Section as BaseSection } from './section';

export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
};

export interface Typography {
  fontFamily: string;
  fontSize: {
    base: string;
    heading1: string;
    heading2: string;
    heading3: string;
    paragraph: string;
  };
  headingFontFamily: string;
}

export type CarouselImage = {
  id: string;
  url: string;
  alt: string;
  order: number;
};

// Define specific content types for each section
export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface FeaturesContent {
  title: string;
  subtitle: string;
  features: Feature[];
}

export type TestimonialsContent = {
  title: string;
  subtitle?: string;
  testimonials: Array<{
    quote: string;
    author: string;
    title?: string;
    company?: string;
    avatar?: string;
  }>;
};

export interface ContactContent {
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  address: string;
  formTitle: string;
  formSubtitle: string;
}

export interface CustomBlock {
  type: 'heading' | 'text' | 'button' | 'image' | 'video' | 'html';
  content:
    | string
    | {
        text?: string;
        link?: string;
        variant?: 'primary' | 'secondary' | 'outline';
        src?: string;
        alt?: string;
      };
  styles: Record<string, string>;
}

export interface CustomContent {
  title: string;
  subtitle?: string;
  blocks: CustomBlock[];
}

export interface PricingContent {
  title: string;
  subtitle: string;
  tiers: Array<{
    name: string;
    price: string;
    description: string;
    features: Array<{ name: string; included: boolean }>;
    ctaText: string;
    ctaLink: string;
    highlighted?: boolean;
  }>;
}

export type SectionContent =
  | { type: 'hero'; content: HeroContent }
  | { type: 'features'; content: FeaturesContent }
  | { type: 'testimonials'; content: TestimonialsContent }
  | { type: 'contact'; content: ContactContent }
  | { type: 'custom'; content: CustomContent }
  | { type: 'pricing'; content: PricingContent };

export type SectionStyles = {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
  [key: string]: string | undefined;
};

export interface Theme {
  colors: ThemeColors;
  typography: Typography;
}

export interface Meta {
  title: string;
  description: string;
  keywords: string[];
}

export interface Section extends BaseSection {
  order: number;
  isVisible: boolean;
}

export interface LandingPageConfig {
  id: string;
  user_id: string | null;
  theme: Theme;
  sections: Section[];
  meta: Meta;
  created_at: string;
  updated_at: string;
}
