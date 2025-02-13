import type { SectionStyles } from '~/types/section';

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

export const getDefaultStylesForType = (type: SectionStyles['type']) => {
  return defaultSectionStyles[type as keyof typeof defaultSectionStyles];
};

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
