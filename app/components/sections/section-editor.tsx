import { Form, useSubmit, useNavigation } from '@remix-run/react';
import { useState } from 'react';
import { SectionRenderer } from '~/components/section-renderer';
import type { 
  Section, 
  SectionStyles, 
  SectionContent,
  HeroContent, 
  FeaturesContent, 
  ContactContent, 
  PricingContent, 
  CustomContent 
} from '~/types/section';
import { ColorPicker } from '~/components/ui/color-picker';
import { ImagePicker } from '~/components/ui/image-picker';
import { IconPicker } from '~/components/ui/icon-picker';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Card } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Switch } from '~/components/ui/switch';

interface SectionEditorProps {
  section: Section & { order: number; isVisible: boolean };
}

export function SectionEditor({ section }: SectionEditorProps) {
  const [previewContent, setPreviewContent] = useState<SectionContent>(() => {
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
  
  const defaultStyles = {
    backgroundColor: 'bg-background',
    textColor: 'text-foreground',
    padding: 'py-12 md:py-16',
    margin: 'my-0',
    containerClass: 'container mx-auto px-4',
    customClasses: [] as string[],
    hover: '',
    shadow: '',
    transition: '',
    borderColor: '',
    borderWidth: '',
    borderRadius: '',
    width: '',
    buttonStyles: {
      outline: {
        textColor: 'text-foreground',
        hoverColor: 'hover:bg-accent',
        borderColor: 'border-input',
        backgroundColor: 'bg-background'
      },
      primary: {
        textColor: 'text-primary-foreground',
        hoverColor: 'hover:bg-primary/90',
        backgroundColor: 'bg-primary'
      },
      secondary: {
        textColor: 'text-secondary-foreground',
        hoverColor: 'hover:bg-secondary/90',
        backgroundColor: 'bg-secondary'
      }
    },
    textStyles: {
      body: 'text-base text-foreground',
      small: 'text-sm text-muted-foreground',
      heading1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
      heading2: 'text-3xl md:text-4xl font-bold',
      heading3: 'text-2xl font-semibold',
      subtitle: 'text-xl text-muted-foreground'
    },
    cardStyles: {
      hover: 'hover:shadow-lg',
      shadow: 'shadow-sm',
      padding: 'p-6',
      textColor: 'text-card-foreground',
      borderColor: 'border-border/40',
      borderRadius: 'rounded-lg',
      backgroundColor: 'bg-card'
    }
  } as const;
  
  const [previewStyles, setPreviewStyles] = useState<Required<SectionStyles>>({
    ...defaultStyles,
    backgroundColor: section.styles?.backgroundColor ?? defaultStyles.backgroundColor,
    textColor: section.styles?.textColor ?? defaultStyles.textColor,
    padding: section.styles?.padding ?? defaultStyles.padding,
    margin: section.styles?.margin ?? defaultStyles.margin,
    containerClass: section.styles?.containerClass ?? defaultStyles.containerClass,
    customClasses: section.styles?.customClasses ?? defaultStyles.customClasses,
    hover: section.styles?.hover ?? defaultStyles.hover,
    shadow: section.styles?.shadow ?? defaultStyles.shadow,
    transition: section.styles?.transition ?? defaultStyles.transition,
    borderColor: section.styles?.borderColor ?? defaultStyles.borderColor,
    borderWidth: section.styles?.borderWidth ?? defaultStyles.borderWidth,
    borderRadius: section.styles?.borderRadius ?? defaultStyles.borderRadius,
    width: section.styles?.width ?? defaultStyles.width,
    buttonStyles: {
      outline: {
        textColor: section.styles?.buttonStyles?.outline?.textColor ?? defaultStyles.buttonStyles.outline.textColor,
        hoverColor: section.styles?.buttonStyles?.outline?.hoverColor ?? defaultStyles.buttonStyles.outline.hoverColor,
        borderColor: section.styles?.buttonStyles?.outline?.borderColor ?? defaultStyles.buttonStyles.outline.borderColor,
        backgroundColor: section.styles?.buttonStyles?.outline?.backgroundColor ?? defaultStyles.buttonStyles.outline.backgroundColor
      },
      primary: {
        textColor: section.styles?.buttonStyles?.primary?.textColor ?? defaultStyles.buttonStyles.primary.textColor,
        hoverColor: section.styles?.buttonStyles?.primary?.hoverColor ?? defaultStyles.buttonStyles.primary.hoverColor,
        backgroundColor: section.styles?.buttonStyles?.primary?.backgroundColor ?? defaultStyles.buttonStyles.primary.backgroundColor
      },
      secondary: {
        textColor: section.styles?.buttonStyles?.secondary?.textColor ?? defaultStyles.buttonStyles.secondary.textColor,
        hoverColor: section.styles?.buttonStyles?.secondary?.hoverColor ?? defaultStyles.buttonStyles.secondary.hoverColor,
        backgroundColor: section.styles?.buttonStyles?.secondary?.backgroundColor ?? defaultStyles.buttonStyles.secondary.backgroundColor
      }
    },
    textStyles: {
      body: section.styles?.textStyles?.body ?? defaultStyles.textStyles.body,
      small: section.styles?.textStyles?.small ?? defaultStyles.textStyles.small,
      heading1: section.styles?.textStyles?.heading1 ?? defaultStyles.textStyles.heading1,
      heading2: section.styles?.textStyles?.heading2 ?? defaultStyles.textStyles.heading2,
      heading3: section.styles?.textStyles?.heading3 ?? defaultStyles.textStyles.heading3,
      subtitle: section.styles?.textStyles?.subtitle ?? defaultStyles.textStyles.subtitle
    },
    cardStyles: {
      hover: section.styles?.cardStyles?.hover ?? defaultStyles.cardStyles.hover,
      shadow: section.styles?.cardStyles?.shadow ?? defaultStyles.cardStyles.shadow,
      padding: section.styles?.cardStyles?.padding ?? defaultStyles.cardStyles.padding,
      textColor: section.styles?.cardStyles?.textColor ?? defaultStyles.cardStyles.textColor,
      borderColor: section.styles?.cardStyles?.borderColor ?? defaultStyles.cardStyles.borderColor,
      borderRadius: section.styles?.cardStyles?.borderRadius ?? defaultStyles.cardStyles.borderRadius,
      backgroundColor: section.styles?.cardStyles?.backgroundColor ?? defaultStyles.cardStyles.backgroundColor
    }
  });

  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
  } & { [key: string]: unknown };

  const handleInputChange = (name: string, value: string) => {
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
      setPreviewContent(newContent);
    } else if (name.startsWith('styles.')) {
      const styleName = name.replace('styles.', '') as keyof SectionStyles;
      setPreviewStyles(prev => ({
        ...prev,
        [styleName]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', JSON.stringify(previewContent));
    formData.append('styles', JSON.stringify(previewStyles));
    submit(formData, { method: 'post' });
  };

  const renderEditor = () => {
    switch (section.type) {
      case 'hero': {
        const heroContent = previewContent;
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
        const contactContent = previewContent;
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
    <div className="space-y-8">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">General Styles</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <ColorPicker
              label="Background Color"
              name="styles.backgroundColor"
              value={previewStyles.backgroundColor}
              onChange={(value) => handleInputChange('styles.backgroundColor', value)}
            />
            <ColorPicker
              label="Text Color"
              name="styles.textColor"
              value={previewStyles.textColor}
              onChange={(value) => handleInputChange('styles.textColor', value)}
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Spacing</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Padding"
                name="styles.padding"
                defaultValue={previewStyles.padding}
                onChange={(e) => handleInputChange('styles.padding', e.target.value)}
              />
              <Input
                label="Margin"
                name="styles.margin"
                defaultValue={previewStyles.margin}
                onChange={(e) => handleInputChange('styles.margin', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Container</h4>
            <Input
              label="Container Class"
              name="styles.containerClass"
              defaultValue={previewStyles.containerClass}
              onChange={(e) => handleInputChange('styles.containerClass', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {previewStyles.buttonStyles && (
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Button Styles</h3>
          <div className="space-y-6">
            {(Object.entries(previewStyles.buttonStyles) as [ButtonVariant, any][]).map(([variant, styles]) => (
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
        </Card>
      )}

      {previewStyles.textStyles && (
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Typography</h3>
          <div className="space-y-6">
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
        </Card>
      )}

      {previewStyles.cardStyles && (
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Card Styles</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Background"
                name="styles.cardStyles.backgroundColor"
                value={previewStyles.cardStyles.backgroundColor}
                onChange={(value) =>
                  handleInputChange('styles.cardStyles.backgroundColor', value)
                }
              />
              <ColorPicker
                label="Text Color"
                name="styles.cardStyles.textColor"
                value={previewStyles.cardStyles.textColor}
                onChange={(value) =>
                  handleInputChange('styles.cardStyles.textColor', value)
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Border Radius"
                name="styles.cardStyles.borderRadius"
                defaultValue={previewStyles.cardStyles.borderRadius}
                onChange={(e) =>
                  handleInputChange('styles.cardStyles.borderRadius', e.target.value)
                }
              />
              <Input
                label="Border Color"
                name="styles.cardStyles.borderColor"
                defaultValue={previewStyles.cardStyles.borderColor}
                onChange={(e) =>
                  handleInputChange('styles.cardStyles.borderColor', e.target.value)
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Shadow"
                name="styles.cardStyles.shadow"
                defaultValue={previewStyles.cardStyles.shadow}
                onChange={(e) =>
                  handleInputChange('styles.cardStyles.shadow', e.target.value)
                }
              />
              <Input
                label="Hover Effect"
                name="styles.cardStyles.hover"
                defaultValue={previewStyles.cardStyles.hover}
                onChange={(e) =>
                  handleInputChange('styles.cardStyles.hover', e.target.value)
                }
              />
            </div>
            <Input
              label="Padding"
              name="styles.cardStyles.padding"
              defaultValue={previewStyles.cardStyles.padding}
              onChange={(e) =>
                handleInputChange('styles.cardStyles.padding', e.target.value)
              }
            />
          </div>
        </Card>
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