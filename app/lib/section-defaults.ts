import type {
  SectionType,
  SectionStyles,
  SectionContent,
  SingleMediaStyles,
  MediaCarouselStyles,
  FlexStyles,
  HeroStyles,
  FeaturesStyles,
  PricingStyles,
  ContactStyles,
  CustomStyles,
} from '~/types/section';

const baseStyles = {
  padding: 'py-12 md:py-16',
  margin: 'my-0',
  backgroundColor: 'bg-background', 
  containerClass: 'container mx-auto px-4',
  customClasses: [],
  borderRadius: '',
};

export const defaultSectionStyles = {
  hero: {
    type: 'hero',
    ...baseStyles,
    subtitleStyles: {
      fontSize: 'text-sm',
      fontWeight: 'font-normal',
      color: 'text-muted-foreground',
    },
    imageStyles: {
      borderRadius: 'rounded-lg',
      shadow: 'shadow-lg',
      hover: 'hover:scale-105',
    },
    buttonStyles: {
      backgroundColor: 'bg-primary',
      textColor: 'text-white',
      hoverColor: 'hover:bg-primary/90',
      borderRadius: 'rounded-md',
    },
    headingStyles: {
      fontSize: 'text-4xl md:text-5xl lg:text-6xl',
      fontWeight: 'font-bold',
      color: 'text-foreground',
    },
  },
  features: {
    type: 'features',
    ...baseStyles,
    cardStyles: {
      backgroundColor: 'bg-card',
      borderRadius: 'rounded-lg',
      shadow: 'shadow-sm',
      hover: 'hover:shadow-md',
      padding: 'p-6',
    },
    iconStyles: {
      size: 'h-12 w-12',
      color: 'text-primary',
      backgroundColor: 'bg-primary/10',
    },
    gridGap: 'gap-8',
    columns: 'md:grid-cols-2 lg:grid-cols-3',
  },
  pricing: {
    type: 'pricing',
    ...baseStyles,
    cardStyles: {
      backgroundColor: 'bg-card',
      borderRadius: 'rounded-lg',
      shadow: 'shadow-sm',
      hover: 'hover:shadow-md',
      padding: 'p-6',
      highlightedScale: 'scale-105',
    },
    buttonStyles: {
      backgroundColor: 'bg-primary',
      textColor: 'text-white',
      hoverColor: 'hover:bg-primary/90',
      borderRadius: 'rounded-md',
    },
    featuresListStyle: {
      iconColor: 'text-primary',
      spacing: 'space-y-4',
    },
  },
  contact: {
    type: 'contact',
    ...baseStyles,
    formStyles: {
      backgroundColor: 'bg-card',
      borderRadius: 'rounded-lg',
      shadow: 'shadow-sm',
      padding: 'p-6',
    },
    inputStyles: {
      backgroundColor: 'bg-background',
      borderColor: 'border-input',
      borderRadius: 'rounded-md',
      focusRing: 'focus-ring',
    },
    buttonStyles: {
      backgroundColor: 'bg-primary',
      textColor: 'text-white',
      hoverColor: 'hover:bg-primary/90',
      borderRadius: 'rounded-md',
    },
  },
  custom: {
    type: 'custom',
    ...baseStyles,
    blockStyles: {
      backgroundColor: 'bg-card',
      borderRadius: 'rounded-lg',
      shadow: 'shadow-sm',
      padding: 'p-6',
      margin: 'mb-6',
      hover: 'hover:shadow-md',
    },
    spacing: 'space-y-6',
    alignment: 'left',
  },
} as const;

export function getDefaultStylesForType(
  type: SectionType,
): SectionStyles {
  const baseStyles = {
    backgroundColor: '#ffffff',
    padding: '64px',
    useContainer: true,
    containerPadding: '16px',
  };

  switch (type) {
    case 'flex':
      return {
        ...baseStyles,
        type: 'flex',
        layout: 'flex',
        columns: 2,
        gap: 16,
      } as FlexStyles;

    case 'single-media':
      return {
        ...baseStyles,
        type: 'single-media',
        mediaStyles: {
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          borderRadius: '8px',
          shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          aspectRatio: '16/9',
        },
        captionStyles: {
          fontSize: '16px',
          fontWeight: '400',
          color: '#4B5563',
          textAlign: 'center',
        },
      } as SingleMediaStyles;

    case 'media-carousel':
      return {
        ...baseStyles,
        type: 'media-carousel',
        mediaStyles: {
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          borderRadius: '8px',
          shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          aspectRatio: '16/9',
        },
        carouselStyles: {
          gap: '16px',
          navigation: true,
          pagination: true,
          autoplay: true,
          autoplayDelay: 5000,
          effect: 'slide',
        },
        captionStyles: {
          fontSize: '16px',
          fontWeight: '400',
          color: '#ffffff',
          textAlign: 'center',
        },
      } as MediaCarouselStyles;

    case 'hero':
      return {
        ...baseStyles,
        type: 'hero',
        headingStyles: {
          color: '#111827',
          fontSize: '48px',
          fontWeight: '700',
        },
        subtitleStyles: {
          color: '#6B7280',
          fontSize: '18px',
          fontWeight: '400',
        },
        buttonStyles: {
          backgroundColor: '#3B82F6',
          textColor: '#FFFFFF',
          hoverColor: '#2563EB',
          borderRadius: '8px',
        },
        imageStyles: {
          borderRadius: '8px',
          shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
      } as HeroStyles;

    case 'features':
      return {
        ...baseStyles,
        type: 'features',
        cardStyles: {
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          shadow: '0 1px 3px rgba(0,0,0,0.1)',
          hover: 'hover:shadow-lg',
          padding: '24px',
        },
        iconStyles: {
          size: '48px',
          color: '#3B82F6',
          backgroundColor: '#EFF6FF',
        },
        gridGap: '32px',
        columns: '3',
      } as FeaturesStyles;

    case 'pricing':
      return {
        ...baseStyles,
        type: 'pricing',
        cardStyles: {
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          shadow: '0 1px 3px rgba(0,0,0,0.1)',
          hover: 'hover:shadow-lg',
          padding: '24px',
          highlightedScale: '1.05',
        },
        buttonStyles: {
          backgroundColor: '#3B82F6',
          textColor: '#FFFFFF',
          hoverColor: '#2563EB',
          borderRadius: '8px',
        },
        featuresListStyle: {
          iconColor: '#3B82F6',
          spacing: '16px',
        },
      } as PricingStyles;

    case 'contact':
      return {
        ...baseStyles,
        type: 'contact',
        formStyles: {
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          shadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '24px',
        },
        inputStyles: {
          backgroundColor: '#F9FAFB',
          borderColor: '#E5E7EB',
          borderRadius: '6px',
          focusRing: 'ring-2 ring-blue-500',
        },
        buttonStyles: {
          backgroundColor: '#3B82F6',
          textColor: '#FFFFFF',
          hoverColor: '#2563EB',
          borderRadius: '8px',
        },
      } as ContactStyles;

    case 'custom':
      return {
        ...baseStyles,
        type: 'custom',
        blockStyles: {
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          shadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '24px',
          margin: '24px',
          hover: 'hover:shadow-lg',
        },
        spacing: '24px',
        alignment: 'left',
      } as CustomStyles;

    default:
      return baseStyles as SectionStyles;
  }
}

export function getDefaultContentForType(type: SectionType): SectionContent {
  switch (type) {
    case 'single-media':
      return {
        media: {
          id: '',
          filePath: 'https://placehold.co/1600x900',
          fileName: 'placeholder.jpg',
          mimeType: 'image/jpeg',
          position: 0,
        },
        caption: 'Add a caption for your media',
      };

    case 'media-carousel':
      return {
        items: [
          {
            id: '',
            filePath: 'https://placehold.co/1600x900/1',
            fileName: 'placeholder-1.jpg',
            mimeType: 'image/jpeg',
            position: 0,
          },
          {
            id: '',
            filePath: 'https://placehold.co/1600x900/2',
            fileName: 'placeholder-2.jpg',
            mimeType: 'image/jpeg',
            position: 1,
          },
          {
            id: '',
            filePath: 'https://placehold.co/1600x900/3',
            fileName: 'placeholder-3.jpg',
            mimeType: 'image/jpeg',
            position: 2,
          },
        ],
        showCaptions: true,
      };

    default:
      throw new Error(`No default content for section type: ${type}`);
  }
}

export const defaultStyleOptions = {
  padding: [
    { value: 'py-12 md:py-16', label: 'Default' },
    { value: 'py-8 md:py-12', label: 'Small' },
    { value: 'py-16 md:py-24', label: 'Large' },
  ],
  margin: [
    { value: 'my-0', label: 'None' },
    { value: 'my-4', label: 'Small' },
    { value: 'my-8', label: 'Medium' },
    { value: 'my-12', label: 'Large' },
  ],
  shadow: [
    { value: '', label: 'None' },
    { value: 'shadow-sm', label: 'Small' },
    { value: 'shadow', label: 'Medium' },
    { value: 'shadow-lg', label: 'Large' },
  ],
  borderRadius: [
    { value: '', label: 'None' },
    { value: 'rounded-sm', label: 'Small' },
    { value: 'rounded', label: 'Medium' },
    { value: 'rounded-lg', label: 'Large' },
  ],
  hover: [
    { value: '', label: 'None' },
    { value: 'hover:shadow-md', label: 'Shadow' },
    { value: 'hover:scale-105', label: 'Scale' },
    { value: 'hover:bg-accent/10', label: 'Background' },
  ],
};
