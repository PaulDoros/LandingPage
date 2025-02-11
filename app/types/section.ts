export type SectionType = 'hero' | 'features' | 'pricing' | 'contact' | 'custom' | 'flex';

export interface BaseSection {
  id: string;
  landing_page_id: string;
  type: SectionType;
  position: number;
  is_visible: boolean;
  styles?: {
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    margin?: string;
    containerClass?: string;
    customClasses?: string[];
  };
}

export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesContent {
  title: string;
  subtitle: string;
  features: FeatureItem[];
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: { name: string; included: boolean }[];
  ctaText: string;
  ctaLink: string;
  highlighted?: boolean;
}

export interface PricingContent {
  title: string;
  subtitle: string;
  tiers: PricingTier[];
}

export interface ContactContent {
  title: string;
  subtitle: string;
  formTitle: string;
  formSubtitle: string;
  email: string;
  phone: string;
  address: string;
}

export interface CustomBlock {
  type: 'card' | 'banner' | 'cta' | 'testimonial';
  content: {
    title?: string;
    description?: string;
    badge?: {
      text: string;
      isVisible: boolean;
    };
    button?: {
      text: string;
      link: string;
      variant: 'primary' | 'secondary' | 'outline';
      isVisible: boolean;
    };
    features?: string[];
    author?: {
      name: string;
      title?: string;
      avatarUrl?: string;
    };
  };
}

export interface CustomContent {
  title: string;
  subtitle: string;
  blocks: CustomBlock[];
}

export interface FlexComponent {
  id: string;
  type: 'heading' | 'text' | 'image' | 'carousel' | 'button' | 'divider' | 'spacer';
  content: {
    text?: string;
    images?: string[];
    link?: string;
  };
  styles: {
    // Layout
    width: number; // 0-100 for percentage
    height?: number; // in pixels
    margin: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    padding: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    
    // Typography
    fontSize?: number; // in pixels
    fontWeight?: number; // 100-900
    lineHeight?: number; // multiplier
    letterSpacing?: number; // in pixels
    textAlign?: 'left' | 'center' | 'right';
    
    // Colors
    textColor?: string;
    backgroundColor?: string;
    
    // Border
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted';
    borderRadius?: number;
    
    // Effects
    opacity?: number; // 0-100
    shadow?: {
      x: number;
      y: number;
      blur: number;
      spread: number;
      color: string;
    };
    
    // Animation
    transition?: {
      property: string;
      duration: number;
      timing: 'linear' | 'ease' | 'ease-in' | 'ease-out';
    };
    
    // Hover States
    hover?: {
      textColor?: string;
      backgroundColor?: string;
      borderColor?: string;
      opacity?: number;
      scale?: number;
    };
  };
}

export interface FlexContent {
  title?: string;
  layout: 'flex' | 'grid';
  columns?: number; // For grid layout
  gap?: number;
  components: FlexComponent[];
}

export interface Section extends BaseSection {
  content: HeroContent | FeaturesContent | PricingContent | ContactContent | CustomContent | FlexContent;
}

export interface ThemeStyles {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
} 