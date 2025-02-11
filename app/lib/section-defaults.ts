import type { SectionStyles } from '~/types/section';

export const defaultSectionStyles: SectionStyles = {
  padding: 'py-12 md:py-16',
  margin: 'my-0',
  backgroundColor: 'bg-background',
  textColor: 'text-foreground',
  containerClass: 'container mx-auto px-4',
  customClasses: [],
  hover: '',
  shadow: '',
  transition: '',
  borderColor: '',
  borderWidth: '',
  borderRadius: '',
  width: ''
};

export const defaultStyleOptions = {
  padding: [
    { value: 'py-12 md:py-16', label: 'Default' },
    { value: 'py-8 md:py-12', label: 'Small' },
    { value: 'py-16 md:py-24', label: 'Large' }
  ],
  margin: [
    { value: 'my-0', label: 'None' },
    { value: 'my-4', label: 'Small' },
    { value: 'my-8', label: 'Medium' },
    { value: 'my-12', label: 'Large' }
  ],
  shadow: [
    { value: '', label: 'None' },
    { value: 'shadow-sm', label: 'Small' },
    { value: 'shadow', label: 'Medium' },
    { value: 'shadow-lg', label: 'Large' }
  ],
  borderRadius: [
    { value: '', label: 'None' },
    { value: 'rounded-sm', label: 'Small' },
    { value: 'rounded', label: 'Medium' },
    { value: 'rounded-lg', label: 'Large' }
  ],
  borderWidth: [
    { value: '', label: 'None' },
    { value: 'border', label: 'Default' },
    { value: 'border-2', label: 'Medium' },
    { value: 'border-4', label: 'Large' }
  ]
}; 