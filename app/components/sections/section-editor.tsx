import { Form, useSubmit, useNavigation } from '@remix-run/react';
import { useState } from 'react';
import { SectionRenderer } from '~/components/section-renderer';
import type { Section, SectionStyles } from '~/types/section';
import { getDefaultStylesForType } from '~/lib/section-defaults';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Switch } from '~/components/ui/switch';
import { SectionContentEditor } from './section-content-editor';
import { SectionStylesEditor } from './section-styles-editor';

interface SectionEditorProps {
  section: Section & { order: number; isVisible: boolean };
}

export function SectionEditor({ section }: SectionEditorProps) {
  const [previewContent, setPreviewContent] = useState(() => section.content);
  const [previewStyles, setPreviewStyles] = useState<SectionStyles>(() => {
    const defaultStyles = getDefaultStylesForType(
      section.type as SectionStyles['type'],
    );
    const styles = section.styles || defaultStyles;
    return {
      ...styles,
      type: section.type,
    } as SectionStyles;
  });
  const [openSections, setOpenSections] = useState<string[]>(['general']);

  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const handleInputChange = (
    name: string,
    value: string | number | boolean,
  ) => {
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
      const path = name.replace('styles.', '').split('.');
      setPreviewStyles((prev) => {
        const newStyles = { ...prev };
        let current = newStyles as Record<string, unknown>;
        const lastIndex = path.length - 1;

        for (let i = 0; i < lastIndex; i++) {
          const key = path[i];
          if (
            typeof current[key] === 'string' ||
            typeof current[key] === 'number' ||
            typeof current[key] === 'boolean'
          ) {
            // If we encounter a primitive value but need an object, create a new object
            current[key] = {};
          } else if (!current[key]) {
            current[key] = {};
          }
          current = current[key] as Record<string, unknown>;
        }

        current[path[lastIndex]] = value;
        return newStyles as SectionStyles;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', JSON.stringify(previewContent));
    formData.append('styles', JSON.stringify(previewStyles));

    submit(formData, { method: 'post' });
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit {section.type} Section</h1>
        <div className="flex items-center gap-4">
          <Form method="post" className="flex items-center gap-2">
            <input type="hidden" name="intent" value="toggle-visibility" />
            <input
              type="hidden"
              name="is_visible"
              value={section.is_visible.toString()}
            />
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

      <Form method="post" onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card className="p-4">
              <Tabs defaultValue="content">
                <TabsList className="mb-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="styles">Styles</TabsTrigger>
                </TabsList>
                <TabsContent value="content">
                  <SectionContentEditor
                    section={section}
                    handleInputChange={handleInputChange}
                  />
                </TabsContent>
                <TabsContent value="styles">
                  <SectionStylesEditor
                    type={section.type}
                    previewStyles={previewStyles}
                    openSections={openSections}
                    toggleSection={toggleSection}
                    handleInputChange={handleInputChange}
                  />
                </TabsContent>
              </Tabs>
            </Card>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          <div className="sticky top-4">
            <Card className="">
              <div className="p-4">
                <h3 className="mb-2 text-lg font-medium">Preview</h3>
                <div className="p-3">
                  {' '}
                  <SectionRenderer
                    section={{
                      ...section,
                      content: previewContent,
                      styles: previewStyles,
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
}
