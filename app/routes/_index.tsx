import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { SectionRenderer } from '~/components/section-renderer';
import type { Theme } from '~/types/landing-page';
import type { Section, SectionType } from '~/types/section';

interface LoaderData {
  sections: Section[];
  theme: Theme;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  // First get the landing page id and theme
  const { data: landingPage } = await supabase
    .from('landing_pages')
    .select('id, theme')
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
  const typedSections = sections.map(section => {
    const typedSection = section as unknown as Section;
    return {
      ...typedSection,
      type: section.type as SectionType,
      content: JSON.parse(JSON.stringify(section.content)) // Deep clone to remove Supabase's JSON types
    };
  });

  return json<LoaderData>({
    sections: typedSections,
    theme: landingPage.theme,
  }, {
    headers: response.headers
  });
}

export default function Index() {
  const { sections } = useLoaderData<typeof loader>();

  return (
    <div
      
    >
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={{
            id: section.id,
            type: section.type,
            content: section.content,
            styles: section.styles,
            order: section.position,
            isVisible: section.is_visible,
            landing_page_id: section.landing_page_id,
            position: section.position,
            is_visible: section.is_visible
          }}
          className="py-12 md:py-16"
        />
      ))}
    </div>
  );
}
