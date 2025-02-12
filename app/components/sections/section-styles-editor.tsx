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
                <label className="mb-2 block text-sm font-medium">
                  Padding (px)
                </label>
                <Slider
                  value={[
                    parseInt(previewStyles.padding?.replace('px', '') || '0'),
                  ]}
                  min={0}
                  max={100}
                  step={4}
                  onValueChange={(values: number[]) =>
                    handleInputChange('styles.padding', `${values[0]}px`)
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Border Radius (px)
                </label>
                <Slider
                  value={[
                    parseInt(
                      previewStyles.borderRadius?.replace('px', '') || '0',
                    ),
                  ]}
                  min={0}
                  max={50}
                  step={2}
                  onValueChange={(values: number[]) =>
                    handleInputChange('styles.borderRadius', `${values[0]}px`)
                  }
                />
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
                  <label className="mb-2 block text-sm font-medium">
                    Font Size (px)
                  </label>
                  <Slider
                    value={[
                      parseInt(
                        heroStyles.headingStyles?.fontSize?.replace('px', '') ||
                          '48',
                      ),
                    ]}
                    min={16}
                    max={96}
                    step={2}
                    onValueChange={(values: number[]) =>
                      handleInputChange(
                        'styles.headingStyles.fontSize',
                        `${values[0]}px`,
                      )
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Font Weight
                  </label>
                  <Slider
                    value={[
                      parseInt(heroStyles.headingStyles?.fontWeight || '600'),
                    ]}
                    min={100}
                    max={900}
                    step={100}
                    onValueChange={(values: number[]) =>
                      handleInputChange(
                        'styles.headingStyles.fontWeight',
                        values[0].toString(),
                      )
                    }
                  />
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
                  <label className="mb-2 block text-sm font-medium">
                    Font Size (px)
                  </label>
                  <Slider
                    value={[
                      parseInt(
                        heroStyles.subtitleStyles?.fontSize?.replace(
                          'px',
                          '',
                        ) || '18',
                      ),
                    ]}
                    min={12}
                    max={48}
                    step={2}
                    onValueChange={(values: number[]) =>
                      handleInputChange(
                        'styles.subtitleStyles.fontSize',
                        `${values[0]}px`,
                      )
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Font Weight
                  </label>
                  <Slider
                    value={[
                      parseInt(heroStyles.subtitleStyles?.fontWeight || '400'),
                    ]}
                    min={100}
                    max={900}
                    step={100}
                    onValueChange={(values: number[]) =>
                      handleInputChange(
                        'styles.subtitleStyles.fontWeight',
                        values[0].toString(),
                      )
                    }
                  />
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
                  <label className="mb-2 block text-sm font-medium">
                    Border Radius (px)
                  </label>
                  <Slider
                    value={[
                      parseInt(
                        heroStyles.buttonStyles?.borderRadius?.replace(
                          'px',
                          '',
                        ) || '8',
                      ),
                    ]}
                    min={0}
                    max={50}
                    step={2}
                    onValueChange={(values: number[]) =>
                      handleInputChange(
                        'styles.buttonStyles.borderRadius',
                        `${values[0]}px`,
                      )
                    }
                  />
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
                  <label className="mb-2 block text-sm font-medium">
                    Border Radius (px)
                  </label>
                  <Slider
                    value={[
                      parseInt(
                        heroStyles.imageStyles?.borderRadius?.replace(
                          'px',
                          '',
                        ) || '8',
                      ),
                    ]}
                    min={0}
                    max={50}
                    step={2}
                    onValueChange={(values: number[]) =>
                      handleInputChange(
                        'styles.imageStyles.borderRadius',
                        `${values[0]}px`,
                      )
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Shadow Intensity
                  </label>
                  <Slider
                    value={[
                      parseInt(
                        heroStyles.imageStyles?.shadow?.split('px')[0] || '0',
                      ),
                    ]}
                    min={0}
                    max={50}
                    step={2}
                    onValueChange={(values: number[]) =>
                      handleInputChange(
                        'styles.imageStyles.shadow',
                        `${values[0]}px ${values[0]}px ${values[0] * 2}px rgba(0, 0, 0, 0.1)`,
                      )
                    }
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Container Settings */}
      <Collapsible
        open={openSections.includes('container')}
        onOpenChange={() => toggleSection('container')}
      >
        <Card className="p-4">
          <CollapsibleTrigger className="w-full">
            <h3 className="text-lg font-medium">Container</h3>
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
                  <label className="mb-2 block text-sm font-medium">
                    Container Padding (px)
                  </label>
                  <Slider
                    value={[
                      parseInt(
                        previewStyles.containerPadding?.replace('px', '') ||
                          '16',
                      ),
                    ]}
                    min={0}
                    max={100}
                    step={4}
                    onValueChange={(values: number[]) => {
                      handleInputChange(
                        'styles.containerPadding',
                        `${values[0]}px`,
                      );
                      handleInputChange(
                        'styles.containerClass',
                        `container mx-auto px-[${values[0]}px]`,
                      );
                    }}
                  />
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
