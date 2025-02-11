import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import type { Section } from '~/types/landing-page';
import { SectionRenderer } from '~/components/section-renderer';

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
}

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  // First get the landing page id
  const { data: landingPage } = await supabase
    .from('landing_pages')
    .select('id, theme')
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

  return json<LoaderData>({
    sections,
    theme: landingPage.theme as LoaderData['theme']
  }, {
    headers: response.headers
  });
}

export default function AdminIndex() {
  const { sections, theme } = useLoaderData<typeof loader>();
console.log(sections)
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Landing Page Preview</h1>
        <div className="flex gap-4">
          <Link
            to="/admin/theme"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Edit Theme
          </Link>
          <Link
            to="/admin/content"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Add Content block
          </Link>
          <Link
            to="/admin/sections"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Edit Sections
          </Link>
          <Link
            to="/"
            target="_blank"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            View Live Site
          </Link>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="rounded-lg border border-border/40 bg-background shadow-sm">
        <div className="border-b border-border/40 bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Preview</h2>
            <div className="flex gap-2">
              <button className="rounded-md border border-input bg-background px-3 py-1 text-sm hover:bg-accent hover:text-accent-foreground">
                Desktop
              </button>
              <button className="rounded-md border border-input bg-background px-3 py-1 text-sm hover:bg-accent hover:text-accent-foreground">
                Tablet
              </button>
              <button className="rounded-md border border-input bg-background px-3 py-1 text-sm hover:bg-accent hover:text-accent-foreground">
                Mobile
              </button>
            </div>
          </div>
        </div>
        
        <div 
          className="p-4"
          style={{
            '--color-primary': theme.colors.primary,
            '--color-secondary': theme.colors.secondary,
            '--color-background': theme.colors.background,
            '--color-text': theme.colors.text,
            '--color-accent': theme.colors.accent,
          } as React.CSSProperties}
        >
          {sections.map(section => (
            <div key={section.id} className="relative group">
              <SectionRenderer
                section={section}
                className="py-12 md:py-16"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 flex items-center justify-center">
                <Link
                  to={`/admin/sections/${section.id}`}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
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