import { Form, useSubmit, useNavigation, useLocation } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { SectionRenderer } from '~/components/section-renderer';
import type { 
  Section, 
  HeroContent, 
  FeaturesContent, 
  ContactContent, 
  PricingContent, 
  CustomContent 
} from '~/types/section';

import { ImagePicker } from '~/components/ui/image-picker';
import { IconPicker } from '~/components/ui/icon-picker';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Card } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Switch } from '~/components/ui/switch';
import { ColorPicker } from '../ui/color-picker';
import { cn } from '~/lib/utils';
import { Slider } from '~/components/ui/slider';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '~/components/ui/collapsible';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface SectionEditorProps {
  section: Section & { order: number; isVisible: boolean };
}

export function SectionEditor({ section }: SectionEditorProps) {
  const [previewContent, setPreviewContent] = useState(() => {
    switch (section.type) {
      case 'hero':
        return section.content as HeroContent;
      case 'features':
        return section.content as FeaturesContent;
      case 'contact':
        return section.content as ContactContent;
      case 'pricing':
        return section.content as PricingContent;
      case 'custom':
        return section.content as CustomContent;
      default:
        return section.content;
    }
  });
  
  const navigation = useNavigation();
  const [previewStyles, setPreviewStyles] = useState(section.styles || {
    backgroundColor: '',
    textColor: '',
    padding: 'py-12 md:py-16',
    paddingX: '16',
    paddingY: '48',
    margin: 'my-0',
    marginX: '0',
    marginY: '0',
    containerClass: 'container mx-auto px-4',
    customClasses: [],
    useContainer: true,
    containerPadding: '16',
    borderColor: '',
    borderWidth: '0',
    borderRadius: '0',
    buttonStyles: {
      primary: {
        backgroundColor: 'var(--color-primary)',
        textColor: 'var(--color-primary-foreground)',
        hoverColor: 'hover:bg-primary/90'
      },
      secondary: {
        backgroundColor: 'var(--color-secondary)',
        textColor: 'var(--color-secondary-foreground)',
        hoverColor: 'hover:bg-secondary/90'
      },
      outline: {
        backgroundColor: 'var(--color-background)',
        textColor: 'var(--color-foreground)',
        borderColor: 'var(--color-border)',
        hoverColor: 'hover:bg-accent'
      }
    },
    textStyles: {
      heading1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
      heading2: 'text-3xl md:text-4xl font-bold',
      heading3: 'text-2xl font-semibold',
      subtitle: 'text-xl text-muted-foreground',
      body: 'text-base text-foreground',
      small: 'text-sm text-muted-foreground'
    },
    cardStyles: {
      padding: 'p-6',
      backgroundColor: 'var(--color-card)',
      borderRadius: 'rounded-lg',
      hover: 'hover:shadow-lg',
      shadow: 'shadow-sm',
      borderColor: 'var(--color-border)',
      textColor: 'var(--color-card-foreground)'
    }
  });

  const submit = useSubmit();
  const isSubmitting = navigation.state === 'submitting';

  // Add state for open sections
  const [openSections, setOpenSections] = useState<string[]>(['general']);
  const location = useLocation();

  // Restore scroll position after navigation
  useEffect(() => {
    const scrollPosition = sessionStorage.getItem('sectionEditorScrollPosition');
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
      sessionStorage.removeItem('sectionEditorScrollPosition');
    }
  }, [location]);

  const handleInputChange = (name: string, value: string | number | boolean) => {
    if (name.startsWith('content.')) {
      const path = name.replace('content.', '').split('.');
      const newContent = { ...previewContent };
      let current = newContent as Record<string, unknown>;
      
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]] as Record<string, unknown>;
      }
      current[path[path.length - 1]] = value;
      
      switch (section.type) {
        case 'hero':
          setPreviewContent(newContent as HeroContent);
          break;
        case 'features':
          setPreviewContent(newContent as FeaturesContent);
          break;
        case 'contact':
          setPreviewContent(newContent as ContactContent);
          break;
        case 'pricing':
          setPreviewContent(newContent as PricingContent);
          break;
        case 'custom':
          setPreviewContent(newContent as CustomContent);
          break;
        default:
          setPreviewContent(newContent);
      }
    } else if (name.startsWith('styles.buttonStyles.')) {
      const [, , variant, property] = name.split('.');
      setPreviewStyles(prev => ({
        ...prev,
        buttonStyles: {
          ...prev.buttonStyles,
          [variant]: {
            ...prev.buttonStyles?.[variant as ButtonVariant],
            [property]: value
          }
        }
      }));
    } else if (name.startsWith('styles.textStyles.')) {
      const [, , key] = name.split('.');
      setPreviewStyles(prev => ({
        ...prev,
        textStyles: {
          ...prev.textStyles,
          [key]: value
        }
      }));
    } else if (name.startsWith('styles.cardStyles.')) {
      const [, , key] = name.split('.');
      setPreviewStyles(prev => ({
        ...prev,
        cardStyles: {
          ...prev.cardStyles,
          [key]: value
        }
      }));
    } else if (name.startsWith('styles.')) {
      const key = name.replace('styles.', '');
      setPreviewStyles(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Save scroll position before form submission
    sessionStorage.setItem('sectionEditorScrollPosition', window.scrollY.toString());
    const formData = new FormData();
    formData.append('content', JSON.stringify(previewContent));
    formData.append('styles', JSON.stringify(previewStyles));
    submit(formData, { method: 'post' });
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const renderEditor = () => {
    switch (section.type) {
      case 'hero': {
        const heroContent = previewContent as HeroContent;
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Hero Content</h3>
              <div className="space-y-4">
                <Input
                  label="Title"
                  name="content.title"
                  defaultValue={heroContent.title}
                  onChange={(e) => handleInputChange('content.title', e.target.value)}
                />
                <Textarea
                  label="Subtitle"
                  name="content.subtitle"
                  defaultValue={heroContent.subtitle ?? ''}
                  onChange={(e) => handleInputChange('content.subtitle', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="CTA Text"
                    name="content.ctaText"
                    defaultValue={heroContent.ctaText ?? ''}
                    onChange={(e) => handleInputChange('content.ctaText', e.target.value)}
                  />
                  <Input
                    label="CTA Link"
                    name="content.ctaLink"
                    defaultValue={heroContent.ctaLink ?? ''}
                    onChange={(e) => handleInputChange('content.ctaLink', e.target.value)}
                  />
                </div>
                <ImagePicker
                  label="Hero Image"
                  name="content.imageUrl"
                  value={heroContent.imageUrl ?? ''}
                  onChange={(value) => handleInputChange('content.imageUrl', value)}
                />
              </div>
            </Card>
          </div>
        );
      }

      case 'features': {
        const featuresContent = previewContent as FeaturesContent;
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Features Section</h3>
              <div className="space-y-4">
                <Input
                  label="Title"
                  name="content.title"
                  defaultValue={featuresContent.title}
                  onChange={(e) => handleInputChange('content.title', e.target.value)}
                />
                <Textarea
                  label="Subtitle"
                  name="content.subtitle"
                  defaultValue={featuresContent.subtitle ?? ''}
                  onChange={(e) => handleInputChange('content.subtitle', e.target.value)}
                />
              </div>
            </Card>

            <div className="space-y-4">
              {featuresContent.features.map((feature, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <Input
                      label="Feature Title"
                      name={`content.features.${index}.title`}
                      defaultValue={feature.title}
                      onChange={(e) =>
                        handleInputChange(`content.features.${index}.title`, e.target.value)
                      }
                    />
                    <Textarea
                      label="Feature Description"
                      name={`content.features.${index}.description`}
                      defaultValue={feature.description}
                      onChange={(e) =>
                        handleInputChange(`content.features.${index}.description`, e.target.value)
                      }
                    />
                    <IconPicker
                      label="Feature Icon"
                      name={`content.features.${index}.icon`}
                      value={feature.icon ?? ''}
                      onChange={(value) =>
                        handleInputChange(`content.features.${index}.icon`, value)
                      }
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      }

      case 'contact': {
        const contactContent = previewContent as ContactContent;
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Contact Information</h3>
              <div className="space-y-4">
                <Input
                  label="Title"
                  name="content.title"
                  defaultValue={contactContent.title}
                  onChange={(e) => handleInputChange('content.title', e.target.value)}
                />
                <Textarea
                  label="Subtitle"
                  name="content.subtitle"
                  defaultValue={contactContent.subtitle ?? ''}
                  onChange={(e) => handleInputChange('content.subtitle', e.target.value)}
                />
                <Input
                  label="Email"
                  type="email"
                  name="content.email"
                  defaultValue={contactContent.email ?? ''}
                  onChange={(e) => handleInputChange('content.email', e.target.value)}
                />
                <Input
                  label="Phone"
                  type="tel"
                  name="content.phone"
                  defaultValue={contactContent.phone ?? ''}
                  onChange={(e) => handleInputChange('content.phone', e.target.value)}
                />
                <Textarea
                  label="Address"
                  name="content.address"
                  defaultValue={contactContent.address ?? ''}
                  onChange={(e) => handleInputChange('content.address', e.target.value)}
                />
              </div>
            </Card>
          </div>
        );
      }

      default:
        return <div>Editor not implemented for this section type.</div>;
    }
  };

  const renderStylesEditor = () => (
    <div className="space-y-4">
      <Collapsible open={openSections.includes('general')} onOpenChange={() => toggleSection('general')}>
        <Card className="p-4">
          <CollapsibleTrigger className="w-full">
            <h3 className="text-lg font-medium">General Styles</h3>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <ColorPicker
                  label="Background Color"
                  name="styles.backgroundColor"
                  value={previewStyles.backgroundColor || ''}
                  onChange={(value) => handleInputChange('styles.backgroundColor', value)}
                />
                <ColorPicker
                  label="Text Color"
                  name="styles.textColor"
                  value={previewStyles.textColor || ''}
                  onChange={(value) => handleInputChange('styles.textColor', value)}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible open={openSections.includes('border')} onOpenChange={() => toggleSection('border')}>
        <Card className="p-4">
          <CollapsibleTrigger className="w-full">
            <h3 className="text-lg font-medium">Border</h3>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-4 mt-4">
              <ColorPicker
                label="Border Color"
                name="styles.borderColor"
                value={previewStyles.borderColor || ''}
                onChange={(value) => handleInputChange('styles.borderColor', value)}
              />
              <div>
                <div id="border-width-label" className="text-sm font-medium block mb-2">Border Width (px)</div>
                <Slider
                  aria-labelledby="border-width-label"
                  value={[parseInt(previewStyles.borderWidth || '0')]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(values: number[]) => handleInputChange('styles.borderWidth', `${values[0]}px`)}
                />
              </div>
              <div>
                <div id="border-radius-label" className="text-sm font-medium block mb-2">Border Radius (px)</div>
                <Slider
                  aria-labelledby="border-radius-label"
                  value={[parseInt(previewStyles.borderRadius?.replace('px', '') || '0')]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={(values: number[]) => handleInputChange('styles.borderRadius', `${values[0]}px`)}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible open={openSections.includes('spacing')} onOpenChange={() => toggleSection('spacing')}>
        <Card className="p-4">
          <CollapsibleTrigger className="w-full">
            <h3 className="text-lg font-medium">Spacing</h3>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-4 mt-4">
              <div>
                <div id="padding-label" className="text-sm font-medium block mb-2">Padding (px)</div>
                <div className="grid grid-cols-2 gap-4" aria-labelledby="padding-label">
                  <div>
                    <div id="padding-y-label" className="text-sm text-muted-foreground">Vertical</div>
                    <Slider
                      aria-labelledby="padding-y-label"
                      value={[parseInt(previewStyles.paddingY || '0')]}
                      min={0}
                      max={200}
                      step={4}
                      onValueChange={(values: number[]) => {
                        handleInputChange('styles.paddingY', `${values[0]}px`);
                        handleInputChange('styles.padding', `py-[${values[0]}px]`);
                      }}
                    />
                  </div>
                  <div>
                    <div id="padding-x-label" className="text-sm text-muted-foreground">Horizontal</div>
                    <Slider
                      aria-labelledby="padding-x-label"
                      value={[parseInt(previewStyles.paddingX || '0')]}
                      min={0}
                      max={200}
                      step={4}
                      onValueChange={(values: number[]) => {
                        handleInputChange('styles.paddingX', `${values[0]}px`);
                        handleInputChange('styles.padding', `px-[${values[0]}px]`);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div id="margin-label" className="text-sm font-medium block mb-2">Margin (px)</div>
                <div className="grid grid-cols-2 gap-4" aria-labelledby="margin-label">
                  <div>
                    <div id="margin-y-label" className="text-sm text-muted-foreground">Vertical</div>
                    <Slider
                      aria-labelledby="margin-y-label"
                      value={[parseInt(previewStyles.marginY || '0')]}
                      min={0}
                      max={200}
                      step={4}
                      onValueChange={(values: number[]) => {
                        handleInputChange('styles.marginY', `${values[0]}px`);
                        handleInputChange('styles.margin', `my-[${values[0]}px]`);
                      }}
                    />
                  </div>
                  <div>
                    <div id="margin-x-label" className="text-sm text-muted-foreground">Horizontal</div>
                    <Slider
                      aria-labelledby="margin-x-label"
                      value={[parseInt(previewStyles.marginX || '0')]}
                      min={0}
                      max={200}
                      step={4}
                      onValueChange={(values: number[]) => {
                        handleInputChange('styles.marginX', `${values[0]}px`);
                        handleInputChange('styles.margin', `mx-[${values[0]}px]`);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible open={openSections.includes('container')} onOpenChange={() => toggleSection('container')}>
        <Card className="p-4">
          <CollapsibleTrigger className="w-full">
            <h3 className="text-lg font-medium">Container</h3>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="use-container"
                  checked={previewStyles.useContainer}
                  onCheckedChange={(checked) => {
                    handleInputChange('styles.useContainer', checked);
                    handleInputChange(
                      'styles.containerClass',
                      checked ? 'container mx-auto' : ''
                    );
                  }}
                />
                <label htmlFor="use-container" className="text-sm font-medium">Use Container</label>
              </div>
              {previewStyles.useContainer && (
                <div>
                  <div id="container-padding-label" className="text-sm font-medium block mb-2">Container Padding (px)</div>
                  <Slider
                    aria-labelledby="container-padding-label"
                    value={[parseInt(previewStyles.containerPadding || '16')]}
                    min={0}
                    max={100}
                    step={4}
                    onValueChange={(values: number[]) => {
                      handleInputChange('styles.containerPadding', `${values[0]}px`);
                      handleInputChange(
                        'styles.containerClass',
                        `container mx-auto px-[${values[0]}px]`
                      );
                    }}
                  />
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {previewStyles.buttonStyles && (
        <Collapsible open={openSections.includes('buttons')} onOpenChange={() => toggleSection('buttons')}>
          <Card className="p-4">
            <CollapsibleTrigger className="w-full">
              <h3 className="text-lg font-medium">Button Styles</h3>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-6 mt-4">
                {(Object.entries(previewStyles.buttonStyles || {}) as [ButtonVariant, Record<string, string>][]).map(([variant, styles]) => (
                  <div key={variant} className="space-y-4">
                    <h4 className="text-sm font-medium capitalize">{variant} Button</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <ColorPicker
                        label="Background"
                        name={`styles.buttonStyles.${variant}.backgroundColor`}
                        value={styles.backgroundColor}
                        onChange={(value) =>
                          handleInputChange(`styles.buttonStyles.${variant}.backgroundColor`, value)
                        }
                      />
                      <ColorPicker
                        label="Text Color"
                        name={`styles.buttonStyles.${variant}.textColor`}
                        value={styles.textColor}
                        onChange={(value) =>
                          handleInputChange(`styles.buttonStyles.${variant}.textColor`, value)
                        }
                      />
                    </div>
                    <Input
                      label="Hover Effect"
                      name={`styles.buttonStyles.${variant}.hoverColor`}
                      defaultValue={styles.hoverColor}
                      onChange={(e) =>
                        handleInputChange(`styles.buttonStyles.${variant}.hoverColor`, e.target.value)
                      }
                    />
                    {variant === 'outline' && (
                      <Input
                        label="Border Color"
                        name={`styles.buttonStyles.${variant}.borderColor`}
                        defaultValue={styles.borderColor}
                        onChange={(e) =>
                          handleInputChange(`styles.buttonStyles.${variant}.borderColor`, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {previewStyles.textStyles && (
        <Collapsible open={openSections.includes('typography')} onOpenChange={() => toggleSection('typography')}>
          <Card className="p-4">
            <CollapsibleTrigger className="w-full">
              <h3 className="text-lg font-medium">Typography</h3>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-6 mt-4">
                {(Object.entries(previewStyles.textStyles) as [string, string][]).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <h4 className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                    <Input
                      name={`styles.textStyles.${key}`}
                      defaultValue={value}
                      onChange={(e) => handleInputChange(`styles.textStyles.${key}`, e.target.value)}
                    />
                    <div className={cn('preview mt-2', value)}>
                      Preview Text
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {previewStyles.cardStyles && (
        <Collapsible open={openSections.includes('cards')} onOpenChange={() => toggleSection('cards')}>
          <Card className="p-4">
            <CollapsibleTrigger className="w-full">
              <h3 className="text-lg font-medium">Card Styles</h3>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <ColorPicker
                    label="Background"
                    name="styles.cardStyles.backgroundColor"
                    value={previewStyles.cardStyles?.backgroundColor || ''}
                    onChange={(value) =>
                      handleInputChange('styles.cardStyles.backgroundColor', value)
                    }
                  />
                  <ColorPicker
                    label="Text Color"
                    name="styles.cardStyles.textColor"
                    value={previewStyles.cardStyles?.textColor || ''}
                    onChange={(value) =>
                      handleInputChange('styles.cardStyles.textColor', value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Border Radius"
                    name="styles.cardStyles.borderRadius"
                    defaultValue={previewStyles.cardStyles?.borderRadius}
                    onChange={(e) =>
                      handleInputChange('styles.cardStyles.borderRadius', e.target.value)
                    }
                  />
                  <Input
                    label="Border Color"
                    name="styles.cardStyles.borderColor"
                    defaultValue={previewStyles.cardStyles?.borderColor}
                    onChange={(e) =>
                      handleInputChange('styles.cardStyles.borderColor', e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Shadow"
                    name="styles.cardStyles.shadow"
                    defaultValue={previewStyles.cardStyles?.shadow}
                    onChange={(e) =>
                      handleInputChange('styles.cardStyles.shadow', e.target.value)
                    }
                  />
                  <Input
                    label="Hover Effect"
                    name="styles.cardStyles.hover"
                    defaultValue={previewStyles.cardStyles?.hover}
                    onChange={(e) =>
                      handleInputChange('styles.cardStyles.hover', e.target.value)
                    }
                  />
                </div>
                <Input
                  label="Padding"
                  name="styles.cardStyles.padding"
                  defaultValue={previewStyles.cardStyles?.padding}
                  onChange={(e) =>
                    handleInputChange('styles.cardStyles.padding', e.target.value)
                  }
                />
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit {section.type} Section</h1>
        <div className="flex items-center gap-4">
          <Form method="post" className="flex items-center gap-2">
            <input type="hidden" name="intent" value="toggle-visibility" />
            <input type="hidden" name="is_visible" value={section.is_visible.toString()} />
            <div className="flex items-center gap-2">
              <Switch
                checked={section.is_visible}
                onCheckedChange={(checked) => {
                  const form = new FormData();
                  form.append('intent', 'toggle-visibility');
                  form.append('is_visible', checked.toString());
                  submit(form, { method: 'post' });
                }}
              />
              <span className="text-sm font-medium">
                {section.is_visible ? 'Visible' : 'Hidden'}
              </span>
            </div>
          </Form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Tabs defaultValue="content">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="styles">Styles</TabsTrigger>
            </TabsList>
            <Form method="post" onSubmit={handleSubmit}>
              <TabsContent value="content" className="space-y-6">
                {renderEditor()}
              </TabsContent>
              <TabsContent value="styles" className="space-y-6">
                {renderStylesEditor()}
              </TabsContent>
              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Form>
          </Tabs>
        </div>

        <div className="sticky top-4">
          <Card>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Preview</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Desktop</Button>
                  <Button variant="outline" size="sm">Tablet</Button>
                  <Button variant="outline" size="sm">Mobile</Button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <SectionRenderer
                section={{
                  ...section,
                  content: previewContent,
                  styles: previewStyles,
                }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 