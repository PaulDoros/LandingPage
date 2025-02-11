import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData, Link, useSubmit, useNavigation } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { useState } from 'react';
import { SectionRenderer } from '~/components/section-renderer';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const { data: section, error } = await supabase
    .from('sections')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !section) {
    throw new Error('Section not found');
  }

  return json({ section });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'toggle-visibility') {
    const { error } = await supabase.rpc('toggle_section_visibility', {
      section_id: params.id
    });

    if (error) {
      return json({ error: error.message }, { status: 400 });
    }

    return json({ success: true });
  }

  // Handle content/styles update
  const content = JSON.parse(formData.get('content') as string);
  const styles = JSON.parse(formData.get('styles') as string);

  const { error } = await supabase.rpc('update_section_content', {
    section_id: params.id,
    new_content: content,
    new_styles: styles
  });

  if (error) {
    return json({ error: error.message }, { status: 400 });
  }

  return redirect('/admin/sections');
}

function SectionEditor() {
  const { section } = useLoaderData<typeof loader>();
  const [previewContent, setPreviewContent] = useState(section.content);
  const [previewStyles, setPreviewStyles] = useState(section.styles);
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content: Record<string, unknown> = {};
    const styles: Record<string, unknown> = {};

    // Convert form data to content object based on section type
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('content.')) {
        const path = key.replace('content.', '').split('.');
        let current = content;
        for (let i = 0; i < path.length - 1; i++) {
          if (!current[path[i]]) {
            current[path[i]] = {};
          }
          current = current[path[i]] as Record<string, unknown>;
        }
        current[path[path.length - 1]] = value;
      } else if (key.startsWith('styles.')) {
        const styleName = key.replace('styles.', '');
        styles[styleName] = value;
      }
    }

    const submitData = new FormData();
    submitData.append('content', JSON.stringify(content));
    submitData.append('styles', JSON.stringify(styles));
    submit(submitData, { method: 'post' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('content.')) {
      const path = name.replace('content.', '').split('.');
      const newContent = { ...previewContent };
      let current = newContent;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]] as Record<string, unknown>;
      }
      current[path[path.length - 1]] = value;
      setPreviewContent(newContent);
    } else if (name.startsWith('styles.')) {
      const styleName = name.replace('styles.', '');
      setPreviewStyles({ ...previewStyles, [styleName]: value });
    }
  };

  const renderEditor = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="content.title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="content.title"
                name="content.title"
                defaultValue={section.content.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="content.subtitle" className="block text-sm font-medium mb-2">
                Subtitle
              </label>
              <input
                type="text"
                id="content.subtitle"
                name="content.subtitle"
                defaultValue={section.content.subtitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="content.ctaText" className="block text-sm font-medium mb-2">
                CTA Text
              </label>
              <input
                type="text"
                id="content.ctaText"
                name="content.ctaText"
                defaultValue={section.content.ctaText}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="content.ctaLink" className="block text-sm font-medium mb-2">
                CTA Link
              </label>
              <input
                type="text"
                id="content.ctaLink"
                name="content.ctaLink"
                defaultValue={section.content.ctaLink}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="content.imageUrl" className="block text-sm font-medium mb-2">
                Image URL
              </label>
              <input
                type="text"
                id="content.imageUrl"
                name="content.imageUrl"
                defaultValue={section.content.imageUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        );
      case 'features':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="content.title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="content.title"
                name="content.title"
                defaultValue={section.content.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="content.subtitle" className="block text-sm font-medium mb-2">
                Subtitle
              </label>
              <input
                type="text"
                id="content.subtitle"
                name="content.subtitle"
                defaultValue={section.content.subtitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Features</h3>
              {(section.content.features as Array<{ title: string; description: string; icon?: string }>).map((feature, index) => (
                <div key={index} className="space-y-4 p-4 border border-border rounded-md">
                  <div>
                    <label htmlFor={`content.features.${index}.title`} className="block text-sm font-medium mb-2">
                      Feature Title
                    </label>
                    <input
                      type="text"
                      id={`content.features.${index}.title`}
                      name={`content.features.${index}.title`}
                      defaultValue={feature.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor={`content.features.${index}.description`} className="block text-sm font-medium mb-2">
                      Feature Description
                    </label>
                    <textarea
                      id={`content.features.${index}.description`}
                      name={`content.features.${index}.description`}
                      defaultValue={feature.description}
                      rows={3}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor={`content.features.${index}.icon`} className="block text-sm font-medium mb-2">
                      Feature Icon URL
                    </label>
                    <input
                      type="text"
                      id={`content.features.${index}.icon`}
                      name={`content.features.${index}.icon`}
                      defaultValue={feature.icon}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="content.title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="content.title"
                name="content.title"
                defaultValue={section.content.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="content.subtitle" className="block text-sm font-medium mb-2">
                Subtitle
              </label>
              <input
                type="text"
                id="content.subtitle"
                name="content.subtitle"
                defaultValue={section.content.subtitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="content.email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="content.email"
                name="content.email"
                defaultValue={section.content.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="content.phone" className="block text-sm font-medium mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="content.phone"
                name="content.phone"
                defaultValue={section.content.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="content.address" className="block text-sm font-medium mb-2">
                Address
              </label>
              <textarea
                id="content.address"
                name="content.address"
                defaultValue={section.content.address}
                rows={3}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="content.formTitle" className="block text-sm font-medium mb-2">
                Form Title
              </label>
              <input
                type="text"
                id="content.formTitle"
                name="content.formTitle"
                defaultValue={section.content.formTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="content.formSubtitle" className="block text-sm font-medium mb-2">
                Form Subtitle
              </label>
              <input
                type="text"
                id="content.formSubtitle"
                name="content.formSubtitle"
                defaultValue={section.content.formSubtitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        );
      default:
        return <div>Editor not implemented for this section type.</div>;
    }
  };

  const renderStylesEditor = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Styles</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="styles.backgroundColor" className="block text-sm font-medium mb-2">
            Background Color
          </label>
          <input
            type="text"
            id="styles.backgroundColor"
            name="styles.backgroundColor"
            defaultValue={section.styles.backgroundColor || 'bg-background'}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="styles.textColor" className="block text-sm font-medium mb-2">
            Text Color
          </label>
          <input
            type="text"
            id="styles.textColor"
            name="styles.textColor"
            defaultValue={section.styles.textColor || 'text-foreground'}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="styles.padding" className="block text-sm font-medium mb-2">
            Padding
          </label>
          <input
            type="text"
            id="styles.padding"
            name="styles.padding"
            defaultValue={section.styles.padding || 'py-12 md:py-16'}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="styles.margin" className="block text-sm font-medium mb-2">
            Margin
          </label>
          <input
            type="text"
            id="styles.margin"
            name="styles.margin"
            defaultValue={section.styles.margin || 'my-0'}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="styles.containerClass" className="block text-sm font-medium mb-2">
            Container Class
          </label>
          <input
            type="text"
            id="styles.containerClass"
            name="styles.containerClass"
            defaultValue={section.styles.containerClass || 'container mx-auto px-4'}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="styles.customClasses" className="block text-sm font-medium mb-2">
            Custom Classes
          </label>
          <input
            type="text"
            id="styles.customClasses"
            name="styles.customClasses"
           defaultValue={
    Array.isArray(section.styles.customClasses)
      ? section.styles.customClasses.join(' ')
      : section.styles.customClasses || ''
  }
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
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
            <button
              type="submit"
              className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                section.is_visible
                  ? 'bg-primary/10 text-primary hover:bg-primary/20'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {section.is_visible ? 'Visible' : 'Hidden'}
            </button>
          </Form>
          <Link
            to="/admin/sections"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Back to Sections
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-lg border bg-card p-6">
          <Form method="post" onSubmit={handleSubmit} className="space-y-6">
            {renderEditor()}
            {renderStylesEditor()}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </Form>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Preview</h2>
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
        </div>
      </div>
    </div>
  );
}

export default SectionEditor; 