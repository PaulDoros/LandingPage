import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { supabase } from '~/lib/supabase/client';

interface Section {
  id: string;
  content: string;
  order: number;
  type: string;
}

interface LandingPageData {
  title: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string | null;
  sections: Section[];
}

export const loader = async () => {
  const { data: landingPageData } = await supabase
    .from('landing_pages')
    .select('*')
    .single();

  return json({
    landingPageData: landingPageData || {
      title: 'Welcome to Your Landing Page',
      description: 'A fully customizable landing page builder',
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
      logo: null,
      sections: [],
    },
  });
};

export default function Index() {
  const { landingPageData } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {landingPageData.logo ? (
                <img
                  src={landingPageData.logo}
                  alt="Logo"
                  className="h-8 w-auto"
                />
              ) : (
                <span className="text-2xl font-bold">Logo</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/authenticate/admin"
                className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              >
                Admin Login
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold sm:text-6xl">
              {landingPageData.title}
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              {landingPageData.description}
            </p>
            <div className="flex justify-center space-x-4">
              <button className="rounded-md bg-primary px-8 py-3 text-primary-foreground hover:bg-primary/90">
                Get Started
              </button>
              <button className="rounded-md border border-input bg-background px-8 py-3 hover:bg-accent hover:text-accent-foreground">
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Dynamic Sections */}
        {landingPageData.sections?.map((section: Section, index: number) => (
          <section
            key={section.id}
            className="border-t py-16"
            style={{
              backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--muted)',
            }}
          >
            <div className="container mx-auto px-4">
              {/* Render dynamic section content */}
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          </section>
        ))}
      </main>

      <footer className="border-t bg-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
