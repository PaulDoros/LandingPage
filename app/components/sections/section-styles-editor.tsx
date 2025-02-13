import type { SectionStyles, SectionType, HeroStyles } from '~/types/section';
import { getDefaultStylesForType } from '~/lib/section-defaults';
import { Card } from '~/components/ui/card';
import { ColorPicker } from '~/components/ui/color-picker';
import { Slider } from '~/components/ui/slider';
import { Switch } from '~/components/ui/switch';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/ui/collapsible';

interface SectionStylesEditorProps {
  type: SectionType;
  previewStyles: SectionStyles;
  openSections: string[];
  toggleSection: (section: string) => void;
  handleInputChange: (name: string, value: string | number | boolean) => void;
}

function isHeroStyles(styles: SectionStyles): styles is HeroStyles {
  return styles.type === 'hero';
}

export function SectionStylesEditor({
  type,
  previewStyles,
  openSections,
  toggleSection,
  handleInputChange,
}: SectionStylesEditorProps) {
  const defaultStyles =
    type !== 'flex'
      ? getDefaultStylesForType(type as Exclude<SectionType, 'flex'>)
      : null;

  if (type === 'flex') {
    return null;
  }

  const heroStyles = isHeroStyles(previewStyles) ? previewStyles : null;
  const heroDefaults =
    type === 'hero' && defaultStyles ? (defaultStyles as HeroStyles) : null;

  const handleSliderChange = (name: string, values: number[], unit = 'px') => {
    // Debounce the actual update to prevent too many re-renders
    const value = Math.round(values[0] * 10) / 10; // Round to 1 decimal place
    handleInputChange(name, `${value}${unit}`);
  };

  return (
    <div className="space-y-4">
      {/* General Styles */}
      <Collapsible
        open={openSections.includes('general')}
        onOpenChange={() => toggleSection('general')}
      >
        <Card className="p-4">
          <CollapsibleTrigger className="w-full">
            <h3 className="text-lg font-medium">General</h3>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="use-container"
                  checked={previewStyles.useContainer}
                  onCheckedChange={(checked) => {
                    handleInputChange('styles.useContainer', checked);
                    handleInputChange(
                      'styles.containerClass',
                      checked ? 'container mx-auto' : '',
                    );
                  }}
                />
                <label htmlFor="use-container" className="text-sm font-medium">
                  Use Container
                </label>
              </div>
              {previewStyles.useContainer && (
                <div>
                  <label
                    htmlFor="container-padding"
                    className="mb-2 block text-sm font-medium"
                  >
                    Container Padding (px)
                  </label>
                  <Slider
                    id="container-padding"
                    value={[
                      parseFloat(
                        previewStyles.containerPadding?.replace('px', '') ||
                          '16',
                      ),
                    ]}
                    min={0}
                    max={100}
                    step={0.1}
                    onValueChange={(values: number[]) => {
                      handleSliderChange('styles.containerPadding', values);
                      handleInputChange(
                        'styles.containerClass',
                        `container mx-auto px-[${values[0]}px]`,
                      );
                    }}
                    className="py-4"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {Math.round(
                      parseFloat(
                        previewStyles.containerPadding?.replace('px', '') ||
                          '16',
                      ) * 10,
                    ) / 10}
                    px
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 space-y-4">
              <ColorPicker
                label="Background Color"
                name="styles.backgroundColor"
                value={
                  previewStyles.backgroundColor ||
                  defaultStyles?.backgroundColor ||
                  ''
                }
                onChange={(value) =>
                  handleInputChange('styles.backgroundColor', value)
                }
              />
              <div>
                <label
                  htmlFor="general-padding"
                  className="mb-2 block text-sm font-medium"
                >
                  Padding (px)
                </label>
                <Slider
                  id="general-padding"
                  value={[
                    parseFloat(previewStyles.padding?.replace('px', '') || '0'),
                  ]}
                  min={0}
                  max={100}
                  step={0.1}
                  onValueChange={(values: number[]) =>
                    handleSliderChange('styles.padding', values)
                  }
                  className="py-4"
                />
                <div className="mt-1 text-xs text-gray-500">
                  {Math.round(
                    parseFloat(
                      previewStyles.padding?.replace('px', '') || '0',
                    ) * 10,
                  ) / 10}
                  px
                </div>
              </div>
              <div>
                <label
                  htmlFor="general-border-radius"
                  className="mb-2 block text-sm font-medium"
                >
                  Border Radius (px)
                </label>
                <Slider
                  id="general-border-radius"
                  value={[
                    parseFloat(
                      previewStyles.borderRadius?.replace('px', '') || '0',
                    ),
                  ]}
                  min={0}
                  max={50}
                  step={0.1}
                  onValueChange={(values: number[]) =>
                    handleSliderChange('styles.borderRadius', values)
                  }
                  className="py-4"
                />
                <div className="mt-1 text-xs text-gray-500">
                  {Math.round(
                    parseFloat(
                      previewStyles.borderRadius?.replace('px', '') || '0',
                    ) * 10,
                  ) / 10}
                  px
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Heading Styles */}
      {heroStyles && heroDefaults && (
        <Collapsible
          open={openSections.includes('heading')}
          onOpenChange={() => toggleSection('heading')}
        >
          <Card className="p-4">
            <CollapsibleTrigger className="w-full">
              <h3 className="text-lg font-medium">Heading</h3>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 space-y-4">
                <ColorPicker
                  label="Color"
                  name="styles.headingStyles.color"
                  value={
                    heroStyles.headingStyles?.color ||
                    heroDefaults.headingStyles?.color ||
                    ''
                  }
                  onChange={(value) =>
                    handleInputChange('styles.headingStyles.color', value)
                  }
                />
                <div>
                  <label
                    htmlFor="heading-font-size"
                    className="mb-2 block text-sm font-medium"
                  >
                    Font Size (px)
                  </label>
                  <Slider
                    id="heading-font-size"
                    value={[
                      parseFloat(
                        heroStyles.headingStyles?.fontSize?.replace('px', '') ||
                          '48',
                      ),
                    ]}
                    min={16}
                    max={96}
                    step={0.1}
                    onValueChange={(values: number[]) =>
                      handleSliderChange(
                        'styles.headingStyles.fontSize',
                        values,
                      )
                    }
                    className="py-4"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {Math.round(
                      parseFloat(
                        heroStyles.headingStyles?.fontSize?.replace('px', '') ||
                          '48',
                      ) * 10,
                    ) / 10}
                    px
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="heading-font-weight"
                    className="mb-2 block text-sm font-medium"
                  >
                    Font Weight
                  </label>
                  <Slider
                    id="heading-font-weight"
                    value={[
                      parseInt(heroStyles.headingStyles?.fontWeight || '600'),
                    ]}
                    min={100}
                    max={900}
                    step={10}
                    onValueChange={(values: number[]) =>
                      handleSliderChange(
                        'styles.headingStyles.fontWeight',
                        values,
                        '',
                      )
                    }
                    className="py-4"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {parseInt(heroStyles.headingStyles?.fontWeight || '600')}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Subtitle Styles */}
      {heroStyles && heroDefaults && (
        <Collapsible
          open={openSections.includes('subtitle')}
          onOpenChange={() => toggleSection('subtitle')}
        >
          <Card className="p-4">
            <CollapsibleTrigger className="w-full">
              <h3 className="text-lg font-medium">Subtitle</h3>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 space-y-4">
                <ColorPicker
                  label="Color"
                  name="styles.subtitleStyles.color"
                  value={
                    heroStyles.subtitleStyles?.color ||
                    heroDefaults.subtitleStyles?.color ||
                    ''
                  }
                  onChange={(value) =>
                    handleInputChange('styles.subtitleStyles.color', value)
                  }
                />
                <div>
                  <label
                    htmlFor="subtitle-font-size"
                    className="mb-2 block text-sm font-medium"
                  >
                    Font Size (px)
                  </label>
                  <Slider
                    id="subtitle-font-size"
                    value={[
                      parseFloat(
                        heroStyles.subtitleStyles?.fontSize?.replace(
                          'px',
                          '',
                        ) || '18',
                      ),
                    ]}
                    min={12}
                    max={48}
                    step={0.1}
                    onValueChange={(values: number[]) =>
                      handleSliderChange(
                        'styles.subtitleStyles.fontSize',
                        values,
                      )
                    }
                    className="py-4"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {Math.round(
                      parseFloat(
                        heroStyles.subtitleStyles?.fontSize?.replace(
                          'px',
                          '',
                        ) || '18',
                      ) * 10,
                    ) / 10}
                    px
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subtitle-font-weight"
                    className="mb-2 block text-sm font-medium"
                  >
                    Font Weight
                  </label>
                  <Slider
                    id="subtitle-font-weight"
                    value={[
                      parseInt(heroStyles.subtitleStyles?.fontWeight || '400'),
                    ]}
                    min={100}
                    max={900}
                    step={10}
                    onValueChange={(values: number[]) =>
                      handleSliderChange(
                        'styles.subtitleStyles.fontWeight',
                        values,
                        '',
                      )
                    }
                    className="py-4"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {parseInt(heroStyles.subtitleStyles?.fontWeight || '400')}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Button Styles */}
      {heroStyles && heroDefaults && (
        <Collapsible
          open={openSections.includes('button')}
          onOpenChange={() => toggleSection('button')}
        >
          <Card className="p-4">
            <CollapsibleTrigger className="w-full">
              <h3 className="text-lg font-medium">Button</h3>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 space-y-4">
                <ColorPicker
                  label="Background Color"
                  name="styles.buttonStyles.backgroundColor"
                  value={
                    heroStyles.buttonStyles?.backgroundColor ||
                    heroDefaults.buttonStyles?.backgroundColor ||
                    ''
                  }
                  onChange={(value) =>
                    handleInputChange(
                      'styles.buttonStyles.backgroundColor',
                      value,
                    )
                  }
                />
                <ColorPicker
                  label="Text Color"
                  name="styles.buttonStyles.textColor"
                  value={
                    heroStyles.buttonStyles?.textColor ||
                    heroDefaults.buttonStyles?.textColor ||
                    ''
                  }
                  onChange={(value) =>
                    handleInputChange('styles.buttonStyles.textColor', value)
                  }
                />
                <ColorPicker
                  label="Hover Color"
                  name="styles.buttonStyles.hoverColor"
                  value={
                    heroStyles.buttonStyles?.hoverColor ||
                    heroDefaults.buttonStyles?.hoverColor ||
                    ''
                  }
                  onChange={(value) =>
                    handleInputChange('styles.buttonStyles.hoverColor', value)
                  }
                />
                <div>
                  <label
                    htmlFor="button-border-radius"
                    className="mb-2 block text-sm font-medium"
                  >
                    Border Radius (px)
                  </label>
                  <Slider
                    id="button-border-radius"
                    value={[
                      parseFloat(
                        heroStyles.buttonStyles?.borderRadius?.replace(
                          'px',
                          '',
                        ) || '8',
                      ),
                    ]}
                    min={0}
                    max={50}
                    step={0.1}
                    onValueChange={(values: number[]) =>
                      handleSliderChange(
                        'styles.buttonStyles.borderRadius',
                        values,
                      )
                    }
                    className="py-4"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {Math.round(
                      parseFloat(
                        heroStyles.buttonStyles?.borderRadius?.replace(
                          'px',
                          '',
                        ) || '8',
                      ) * 10,
                    ) / 10}
                    px
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Image Styles */}
      {heroStyles && heroDefaults && (
        <Collapsible
          open={openSections.includes('image')}
          onOpenChange={() => toggleSection('image')}
        >
          <Card className="p-4">
            <CollapsibleTrigger className="w-full">
              <h3 className="text-lg font-medium">Image</h3>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="image-border-radius"
                    className="mb-2 block text-sm font-medium"
                  >
                    Border Radius (px)
                  </label>
                  <Slider
                    id="image-border-radius"
                    value={[
                      parseFloat(
                        heroStyles.imageStyles?.borderRadius?.replace(
                          'px',
                          '',
                        ) || '8',
                      ),
                    ]}
                    min={0}
                    max={50}
                    step={0.1}
                    onValueChange={(values: number[]) =>
                      handleSliderChange(
                        'styles.imageStyles.borderRadius',
                        values,
                      )
                    }
                    className="py-4"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {Math.round(
                      parseFloat(
                        heroStyles.imageStyles?.borderRadius?.replace(
                          'px',
                          '',
                        ) || '8',
                      ) * 10,
                    ) / 10}
                    px
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="image-shadow"
                    className="mb-2 block text-sm font-medium"
                  >
                    Shadow Intensity
                  </label>
                  <Slider
                    id="image-shadow"
                    value={[
                      parseFloat(
                        heroStyles.imageStyles?.shadow?.split('px')[0] || '0',
                      ),
                    ]}
                    min={0}
                    max={50}
                    step={0.1}
                    onValueChange={(values: number[]) => {
                      const value = Math.round(values[0] * 10) / 10;
                      handleInputChange(
                        'styles.imageStyles.shadow',
                        `${value}px ${value}px ${value * 2}px rgba(0, 0, 0, ${value / 100})`,
                      );
                    }}
                    className="py-4"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {Math.round(
                      parseFloat(
                        heroStyles.imageStyles?.shadow?.split('px')[0] || '0',
                      ) * 10,
                    ) / 10}
                    px
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  );
}
