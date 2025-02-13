import type { SectionType } from '~/types/section';

interface SectionTypeDefinition {
  type: SectionType;
  label: string;
  description: string;
  icon: string;
  styleOptions: {
    label: string;
    key: string;
    type: 'color' | 'text' | 'select' | 'number' | 'boolean';
    options?: string[];
    group?: string;
  }[];
}

export const sectionTypes: SectionTypeDefinition[] = [
  {
    type: 'hero',
    label: 'Hero Section',
    description: 'A prominent section at the top of your landing page',
    icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
    styleOptions: [
      // General Styles
      { label: 'Background Color', key: 'backgroundColor', type: 'color', group: 'general' },
      { label: 'Text Color', key: 'textColor', type: 'color', group: 'general' },
      { label: 'Padding', key: 'padding', type: 'text', group: 'general' },
      { label: 'Margin', key: 'margin', type: 'text', group: 'general' },
      { label: 'Border Radius', key: 'borderRadius', type: 'text', group: 'general' },
      
      // Heading Styles
      { label: 'Heading Color', key: 'headingStyles.color', type: 'color', group: 'heading' },
      { label: 'Heading Font Size', key: 'headingStyles.fontSize', type: 'text', group: 'heading' },
      { label: 'Heading Font Weight', key: 'headingStyles.fontWeight', type: 'text', group: 'heading' },
      
      // Subtitle Styles
      { label: 'Subtitle Color', key: 'subtitleStyles.color', type: 'color', group: 'subtitle' },
      { label: 'Subtitle Font Size', key: 'subtitleStyles.fontSize', type: 'text', group: 'subtitle' },
      { label: 'Subtitle Font Weight', key: 'subtitleStyles.fontWeight', type: 'text', group: 'subtitle' },
      
      // Button Styles
      { label: 'Button Background', key: 'buttonStyles.backgroundColor', type: 'color', group: 'button' },
      { label: 'Button Text Color', key: 'buttonStyles.textColor', type: 'color', group: 'button' },
      { label: 'Button Hover Color', key: 'buttonStyles.hoverColor', type: 'text', group: 'button' },
      { label: 'Button Border Radius', key: 'buttonStyles.borderRadius', type: 'text', group: 'button' },
      
      // Image Styles
      { label: 'Image Border Radius', key: 'imageStyles.borderRadius', type: 'text', group: 'image' },
      { label: 'Image Shadow', key: 'imageStyles.shadow', type: 'text', group: 'image' },
      { label: 'Image Hover Effect', key: 'imageStyles.hover', type: 'text', group: 'image' },
    ],
  },
  {
    type: 'features',
    label: 'Features Section',
    description: 'Showcase your product or service features',
    icon: 'M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3',
    styleOptions: [
      // General Styles
      { label: 'Background Color', key: 'backgroundColor', type: 'color', group: 'general' },
      { label: 'Text Color', key: 'textColor', type: 'color', group: 'general' },
      { label: 'Padding', key: 'padding', type: 'text', group: 'general' },
      { label: 'Margin', key: 'margin', type: 'text', group: 'general' },
      
      // Card Styles
      { label: 'Card Background', key: 'cardStyles.backgroundColor', type: 'color', group: 'card' },
      { label: 'Card Border Radius', key: 'cardStyles.borderRadius', type: 'text', group: 'card' },
      { label: 'Card Shadow', key: 'cardStyles.shadow', type: 'text', group: 'card' },
      { label: 'Card Hover Effect', key: 'cardStyles.hover', type: 'text', group: 'card' },
      { label: 'Card Padding', key: 'cardStyles.padding', type: 'text', group: 'card' },
      
      // Icon Styles
      { label: 'Icon Size', key: 'iconStyles.size', type: 'text', group: 'icon' },
      { label: 'Icon Color', key: 'iconStyles.color', type: 'color', group: 'icon' },
      { label: 'Icon Background', key: 'iconStyles.backgroundColor', type: 'color', group: 'icon' },
      
      // Grid Styles
      { label: 'Grid Gap', key: 'gridGap', type: 'text', group: 'layout' },
      { label: 'Grid Columns', key: 'columns', type: 'text', group: 'layout' },
    ],
  },
  {
    type: 'pricing',
    label: 'Pricing Section',
    description: 'Display your pricing plans and tiers',
    icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    styleOptions: [
      // General Styles
      { label: 'Background Color', key: 'backgroundColor', type: 'color', group: 'general' },
      { label: 'Text Color', key: 'textColor', type: 'color', group: 'general' },
      { label: 'Padding', key: 'padding', type: 'text', group: 'general' },
      { label: 'Margin', key: 'margin', type: 'text', group: 'general' },
      
      // Card Styles
      { label: 'Card Background', key: 'cardStyles.backgroundColor', type: 'color', group: 'card' },
      { label: 'Card Border Radius', key: 'cardStyles.borderRadius', type: 'text', group: 'card' },
      { label: 'Card Shadow', key: 'cardStyles.shadow', type: 'text', group: 'card' },
      { label: 'Card Hover Effect', key: 'cardStyles.hover', type: 'text', group: 'card' },
      { label: 'Card Padding', key: 'cardStyles.padding', type: 'text', group: 'card' },
      { label: 'Highlighted Scale', key: 'cardStyles.highlightedScale', type: 'text', group: 'card' },
      
      // Features List Style
      { label: 'Features Icon Color', key: 'featuresListStyle.iconColor', type: 'color', group: 'features' },
      { label: 'Features Spacing', key: 'featuresListStyle.spacing', type: 'text', group: 'features' },
    ],
  },
  {
    type: 'contact',
    label: 'Contact Section',
    description: 'Add contact information and a contact form',
    icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
    styleOptions: [
      // General Styles
      { label: 'Background Color', key: 'backgroundColor', type: 'color', group: 'general' },
      { label: 'Text Color', key: 'textColor', type: 'color', group: 'general' },
      { label: 'Padding', key: 'padding', type: 'text', group: 'general' },
      { label: 'Margin', key: 'margin', type: 'text', group: 'general' },
      
      // Form Styles
      { label: 'Form Background', key: 'formStyles.backgroundColor', type: 'color', group: 'form' },
      { label: 'Form Border Radius', key: 'formStyles.borderRadius', type: 'text', group: 'form' },
      { label: 'Form Shadow', key: 'formStyles.shadow', type: 'text', group: 'form' },
      { label: 'Form Padding', key: 'formStyles.padding', type: 'text', group: 'form' },
      
      // Input Styles
      { label: 'Input Background', key: 'inputStyles.backgroundColor', type: 'color', group: 'input' },
      { label: 'Input Border Color', key: 'inputStyles.borderColor', type: 'color', group: 'input' },
      { label: 'Input Border Radius', key: 'inputStyles.borderRadius', type: 'text', group: 'input' },
      { label: 'Input Focus Ring', key: 'inputStyles.focusRing', type: 'text', group: 'input' },
    ],
  },
  {
    type: 'custom',
    label: 'Custom Section',
    description: 'Create a custom section with your own content',
    icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125',
    styleOptions: [
      // General Styles
      { label: 'Background Color', key: 'backgroundColor', type: 'color', group: 'general' },
      { label: 'Text Color', key: 'textColor', type: 'color', group: 'general' },
      { label: 'Padding', key: 'padding', type: 'text', group: 'general' },
      { label: 'Margin', key: 'margin', type: 'text', group: 'general' },
      
      // Block Styles
      { label: 'Block Background', key: 'blockStyles.backgroundColor', type: 'color', group: 'block' },
      { label: 'Block Border Radius', key: 'blockStyles.borderRadius', type: 'text', group: 'block' },
      { label: 'Block Shadow', key: 'blockStyles.shadow', type: 'text', group: 'block' },
      { label: 'Block Padding', key: 'blockStyles.padding', type: 'text', group: 'block' },
      { label: 'Block Margin', key: 'blockStyles.margin', type: 'text', group: 'block' },
      { label: 'Block Hover Effect', key: 'blockStyles.hover', type: 'text', group: 'block' },
      
      // Layout
      { label: 'Spacing', key: 'spacing', type: 'text', group: 'layout' },
      { label: 'Alignment', key: 'alignment', type: 'select', options: ['left', 'center', 'right'], group: 'layout' },
    ],
  },
  {
    type: 'flex',
    label: 'Flex Section',
    description: 'Create a flexible section with customizable components',
    icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
    styleOptions: [
      // Layout
      { label: 'Layout Type', key: 'layout', type: 'select', options: ['flex', 'grid'], group: 'layout' },
      { label: 'Grid Columns', key: 'columns', type: 'number', group: 'layout' },
      { label: 'Gap', key: 'gap', type: 'number', group: 'layout' },
      
      // Typography
      { label: 'Font Size', key: 'styles.fontSize', type: 'number', group: 'typography' },
      { label: 'Font Weight', key: 'styles.fontWeight', type: 'number', group: 'typography' },
      { label: 'Line Height', key: 'styles.lineHeight', type: 'number', group: 'typography' },
      { label: 'Letter Spacing', key: 'styles.letterSpacing', type: 'number', group: 'typography' },
      { label: 'Text Align', key: 'styles.textAlign', type: 'select', options: ['left', 'center', 'right'], group: 'typography' },
      
      // Colors
      { label: 'Text Color', key: 'styles.textColor', type: 'color', group: 'colors' },
      { label: 'Background Color', key: 'styles.backgroundColor', type: 'color', group: 'colors' },
      
      // Border
      { label: 'Border Width', key: 'styles.borderWidth', type: 'number', group: 'border' },
      { label: 'Border Color', key: 'styles.borderColor', type: 'color', group: 'border' },
      { label: 'Border Style', key: 'styles.borderStyle', type: 'select', options: ['solid', 'dashed', 'dotted'], group: 'border' },
      { label: 'Border Radius', key: 'styles.borderRadius', type: 'number', group: 'border' },
    ],
  },
  {
    type: 'single-media',
    label: 'Single Media Section',
    description: 'Display a single image or video with optional caption',
    icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
    styleOptions: [
      // General Styles
      { label: 'Background Color', key: 'backgroundColor', type: 'color', group: 'general' },
      { label: 'Text Color', key: 'textColor', type: 'color', group: 'general' },
      { label: 'Padding', key: 'padding', type: 'text', group: 'general' },
      { label: 'Margin', key: 'margin', type: 'text', group: 'general' },
      { label: 'Container Width', key: 'containerClass', type: 'text', group: 'general' },
      
      // Media Styles
      { label: 'Media Width', key: 'mediaStyles.width', type: 'text', group: 'media' },
      { label: 'Media Height', key: 'mediaStyles.height', type: 'text', group: 'media' },
      { label: 'Object Fit', key: 'mediaStyles.objectFit', type: 'select', options: ['contain', 'cover', 'fill', 'none', 'scale-down'], group: 'media' },
      { label: 'Border Radius', key: 'mediaStyles.borderRadius', type: 'text', group: 'media' },
      { label: 'Shadow', key: 'mediaStyles.shadow', type: 'text', group: 'media' },
      { label: 'Aspect Ratio', key: 'mediaStyles.aspectRatio', type: 'text', group: 'media' },
      
      // Caption Styles
      { label: 'Caption Font Size', key: 'captionStyles.fontSize', type: 'text', group: 'caption' },
      { label: 'Caption Font Weight', key: 'captionStyles.fontWeight', type: 'text', group: 'caption' },
      { label: 'Caption Color', key: 'captionStyles.color', type: 'color', group: 'caption' },
      { label: 'Caption Alignment', key: 'captionStyles.textAlign', type: 'select', options: ['left', 'center', 'right'], group: 'caption' },
    ],
  },
  {
    type: 'media-carousel',
    label: 'Media Carousel Section',
    description: 'Display multiple images or videos in a carousel',
    icon: 'M15.75 5.25a3 3 0 013 3m3.75 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z',
    styleOptions: [
      // General Styles
      { label: 'Background Color', key: 'backgroundColor', type: 'color', group: 'general' },
      { label: 'Text Color', key: 'textColor', type: 'color', group: 'general' },
      { label: 'Padding', key: 'padding', type: 'text', group: 'general' },
      { label: 'Margin', key: 'margin', type: 'text', group: 'general' },
      { label: 'Container Width', key: 'containerClass', type: 'text', group: 'general' },
      
      // Media Styles
      { label: 'Media Width', key: 'mediaStyles.width', type: 'text', group: 'media' },
      { label: 'Media Height', key: 'mediaStyles.height', type: 'text', group: 'media' },
      { label: 'Object Fit', key: 'mediaStyles.objectFit', type: 'select', options: ['contain', 'cover', 'fill', 'none', 'scale-down'], group: 'media' },
      { label: 'Border Radius', key: 'mediaStyles.borderRadius', type: 'text', group: 'media' },
      { label: 'Shadow', key: 'mediaStyles.shadow', type: 'text', group: 'media' },
      { label: 'Aspect Ratio', key: 'mediaStyles.aspectRatio', type: 'text', group: 'media' },
      
      // Carousel Styles
      { label: 'Gap Between Slides', key: 'carouselStyles.gap', type: 'text', group: 'carousel' },
      { label: 'Show Navigation', key: 'carouselStyles.navigation', type: 'boolean', group: 'carousel' },
      { label: 'Show Pagination', key: 'carouselStyles.pagination', type: 'boolean', group: 'carousel' },
      { label: 'Enable Autoplay', key: 'carouselStyles.autoplay', type: 'boolean', group: 'carousel' },
      { label: 'Autoplay Delay (ms)', key: 'carouselStyles.autoplayDelay', type: 'number', group: 'carousel' },
      { label: 'Transition Effect', key: 'carouselStyles.effect', type: 'select', options: ['slide', 'fade', 'cube', 'coverflow', 'flip'], group: 'carousel' },
      
      // Caption Styles
      { label: 'Caption Font Size', key: 'captionStyles.fontSize', type: 'text', group: 'caption' },
      { label: 'Caption Font Weight', key: 'captionStyles.fontWeight', type: 'text', group: 'caption' },
      { label: 'Caption Color', key: 'captionStyles.color', type: 'color', group: 'caption' },
      { label: 'Caption Alignment', key: 'captionStyles.textAlign', type: 'select', options: ['left', 'center', 'right'], group: 'caption' },
    ],
  },
];
