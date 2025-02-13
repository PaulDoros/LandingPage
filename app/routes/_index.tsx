import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { SectionRenderer } from '~/components/section-renderer';
import type { Theme } from '~/types/landing-page';
import type { Section, SectionType, SectionStyles } from '~/types/section';
import { cn } from '~/lib/utils';

interface LoaderData {
  sections: Section[];
  theme: Theme;
  layoutSettings: {
    useGap: boolean;
    gapSize: number;
    useContainer: boolean;
    containerPadding: number;
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response },
  );

  // First get the landing page id and theme
  const { data: landingPage } = await supabase
    .from('landing_pages')
    .select('id, theme, layout_settings')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!landingPage) {
    throw new Error('No landing page found');
  }

  // Then get all visible sections for this landing page
  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .eq('landing_page_id', landingPage.id)
    .eq('is_visible', true)
    .order('position', { ascending: true });

  if (!sections) {
    throw new Error('Failed to load sections');
  }

  // Type assertion to handle Supabase's JSON types
  const typedSections = sections.map((section) => {
    const parsedContent = section.content
      ? JSON.parse(JSON.stringify(section.content))
      : null;

    const parsedStyles = section.styles
      ? (JSON.parse(JSON.stringify(section.styles)) as SectionStyles)
      : undefined;

    if (!parsedContent) {
      throw new Error(`Section ${section.id} has invalid content`);
    }

    return {
      id: section.id,
      type: section.type as SectionType,
      content: parsedContent,
      styles: parsedStyles,
      position: section.position,
      is_visible: section.is_visible,
      landing_page_id: section.landing_page_id,
    } satisfies Section;
  });

  // Default layout settings
  const defaultLayoutSettings = {
    useGap: true,
    gapSize: 8,
    useContainer: true,
    containerPadding: 16,
  };

  return json<LoaderData>(
    {
      sections: typedSections,
      theme: landingPage.theme,
      layoutSettings: landingPage.layout_settings || defaultLayoutSettings,
    },
    {
      headers: response.headers,
    },
  );
}

export default function Index() {
  const { sections, layoutSettings } = useLoaderData<typeof loader>();
  const { useGap, gapSize, useContainer, containerPadding } = layoutSettings;
  console.log('layoutSettings', layoutSettings);
  return (
    <div
      className={cn('flex flex-col')}
      style={{
        gap: useGap ? gapSize : undefined,
        padding: useContainer ? `0 ${containerPadding}px` : undefined,
      }}
    >
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={{
            id: section.id,
            type: section.type,
            content: section.content,
            styles: section.styles || {},
            position: section.position,
            is_visible: section.is_visible,
            landing_page_id: section.landing_page_id,
          }}
          className="py-12 md:py-16"
        />
      ))}
    </div>
  );
}
