import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@remix-run/node';
import { Link, useLoaderData, useSubmit } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import type { Section } from '~/types/landing-page';
import { SectionRenderer } from '~/components/section-renderer';
import { Switch } from '~/components/ui/switch';
import { Slider } from '~/components/ui/slider';
import { Card } from '~/components/ui/card';
import { useState, useEffect } from 'react';
import { Button } from '~/components/ui/Button';

interface LoaderData {
  sections: Section[];
  theme: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      accent: string;
    };
  };
  layoutSettings: {
    useGap: boolean;
    gapSize: number;
    useContainer: boolean;
    containerPadding: number;
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response },
  );

  const formData = await request.formData();
  const layoutSettingsStr = formData.get('layoutSettings');

  if (!layoutSettingsStr || typeof layoutSettingsStr !== 'string') {
    throw new Error('Invalid layout settings data');
  }

  const layoutSettings = JSON.parse(layoutSettingsStr);
  console.log('Updating layout settings:', layoutSettings);

  // Get the latest landing page
  const { data: landingPage, error: fetchError } = await supabase
    .from('landing_pages')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (fetchError || !landingPage) {
    console.error('Error fetching landing page:', fetchError);
    throw new Error('No landing page found');
  }

  // Direct SQL update to ensure the JSONB field is updated correctly
  const { error: updateError } = await supabase.rpc('update_layout_settings', {
    p_landing_page_id: landingPage.id,
    p_layout_settings: layoutSettings,
  });

  if (updateError) {
    console.error('Error updating layout settings:', updateError);
    throw new Error('Failed to update layout settings');
  }

  // Fetch the updated record
  const { data: updatedLandingPage, error: fetchUpdateError } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('id', landingPage.id)
    .single();

  if (fetchUpdateError) {
    console.error('Error fetching updated landing page:', fetchUpdateError);
    throw new Error('Failed to fetch updated landing page');
  }

  console.log('Successfully updated layout settings:', updatedLandingPage);

  return json(
    { success: true, data: updatedLandingPage },
    {
      headers: response.headers,
      status: 200,
    },
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response },
  );

  // First get the landing page id
  const { data: landingPage } = await supabase
    .from('landing_pages')
    .select('id, theme, layout_settings')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!landingPage) {
    throw new Error('No landing page found');
  }

  // Then get all sections for this landing page
  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .eq('landing_page_id', landingPage.id)
    .eq('is_visible', true)
    .order('position', { ascending: true });

  if (!sections) {
    throw new Error('Failed to load sections');
  }

  const defaultLayoutSettings = {
    useGap: true,
    gapSize: 8,
    useContainer: true,
    containerPadding: 16,
  };

  return json<LoaderData>(
    {
      sections,
      theme: landingPage.theme as LoaderData['theme'],
      layoutSettings: landingPage.layout_settings || defaultLayoutSettings,
    },
    {
      headers: response.headers,
    },
  );
}

export default function AdminIndex() {
  const {
    sections,
    theme,
    layoutSettings: initialLayoutSettings,
  } = useLoaderData<typeof loader>();
  const [useGap, setUseGap] = useState(initialLayoutSettings.useGap);
  const [gapSize, setGapSize] = useState(initialLayoutSettings.gapSize);
  const [useContainer, setUseContainer] = useState(
    initialLayoutSettings.useContainer,
  );
  const [containerPadding, setContainerPadding] = useState(
    initialLayoutSettings.containerPadding,
  );
  const [hasChanges, setHasChanges] = useState(false);
  const submit = useSubmit();

  // Track changes
  useEffect(() => {
    const currentSettings = {
      useGap,
      gapSize,
      useContainer,
      containerPadding,
    };

    setHasChanges(
      JSON.stringify(currentSettings) !== JSON.stringify(initialLayoutSettings),
    );
  }, [useGap, gapSize, useContainer, containerPadding, initialLayoutSettings]);

  const handleSave = () => {
    const settings = {
      useGap,
      gapSize,
      useContainer,
      containerPadding,
    };
    console.log('Saving settings:', settings);

    const formData = new FormData();
    formData.append('layoutSettings', JSON.stringify(settings));

    submit(formData, {
      method: 'post',
      // Add these options to ensure the form submission works correctly
      replace: true,
      preventScrollReset: true,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Landing Page Preview</h1>
        <div className="flex gap-4">
          <Link
            to="/admin/theme"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
          >
            Edit Theme
          </Link>
          <Link
            to="/admin/content"
            className="border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md border px-4 py-2 text-sm font-medium"
          >
            Add Content block
          </Link>
          <Link
            to="/admin/sections"
            className="border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md border px-4 py-2 text-sm font-medium"
          >
            Edit Sections
          </Link>
          <Link
            to="/"
            target="_blank"
            className="border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md border px-4 py-2 text-sm font-medium"
          >
            View Live Site
          </Link>
        </div>
      </div>

      {/* Layout Controls */}
      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Layout Settings</h2>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            variant={hasChanges ? 'default' : 'ghost'}
          >
            {hasChanges ? 'Save Changes' : 'No Changes'}
          </Button>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Switch
                  id="use-container"
                  checked={useContainer}
                  onCheckedChange={setUseContainer}
                />
                <label htmlFor="use-container" className="text-sm font-medium">
                  Use Container Layout
                </label>
              </div>
              <p className="text-muted-foreground text-sm">
                Centers content and adds padding on the sides
              </p>
            </div>
            {useContainer && (
              <div className="w-[200px]">
                <label
                  htmlFor="container-padding"
                  className="mb-2 block text-sm font-medium"
                >
                  Container Padding (px)
                </label>
                <Slider
                  id="container-padding"
                  value={[containerPadding]}
                  min={0}
                  max={64}
                  step={4}
                  onValueChange={(values) => setContainerPadding(values[0])}
                  className="py-4"
                />
                <div className="mt-1 text-right text-xs text-gray-500">
                  {containerPadding}px
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Switch
                  id="use-gap"
                  checked={useGap}
                  onCheckedChange={setUseGap}
                />
                <label htmlFor="use-gap" className="text-sm font-medium">
                  Use Gap Between Sections
                </label>
              </div>
              <p className="text-muted-foreground text-sm">
                Adds consistent spacing between sections
              </p>
            </div>
            {useGap && (
              <div className="w-[200px]">
                <label
                  htmlFor="gap-size"
                  className="mb-2 block text-sm font-medium"
                >
                  Gap Size (px)
                </label>
                <Slider
                  id="gap-size"
                  value={[gapSize]}
                  min={0}
                  max={64}
                  step={4}
                  onValueChange={(values) => setGapSize(values[0])}
                  className="py-4"
                />
                <div className="mt-1 text-right text-xs text-gray-500">
                  {gapSize}px
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Preview Frame */}
      <div className="border-border/40 bg-background rounded-lg border shadow-sm">
        <div className="border-border/40 bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Preview</h2>
          </div>
        </div>

        <div
          className="flex flex-col"
          style={
            {
              gap: useGap ? `${gapSize}px` : undefined,
              padding: useContainer ? `${containerPadding}px` : undefined,
              '--color-primary': theme.colors.primary,
              '--color-secondary': theme.colors.secondary,
              '--color-background': theme.colors.background,
              '--color-text': theme.colors.text,
              '--color-accent': theme.colors.accent,
            } as React.CSSProperties
          }
        >
          {sections.map((section) => (
            <div key={section.id} className="group relative">
              <SectionRenderer section={section} className="py-12 md:py-16" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 transition-opacity group-hover:opacity-100">
                <Link
                  to={`/admin/sections/${section.id}`}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
                >
                  Edit Section
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
