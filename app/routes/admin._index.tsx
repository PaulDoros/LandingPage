import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { supabase } from '~/lib/supabase/client';

interface Section {
  id: string;
  content: string;
  order: number;
  type: string;
}

type LandingPageData = {
  title: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string | null;
  sections: Section[];
};

type LoaderData = {
  landingPageData: LandingPageData;
};

export const loader = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/authenticate/admin');
  }

  const { data: landingPageData } = await supabase
    .from('landing_pages')
    .select('*')
    .single();

  return json<LoaderData>({
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

export default function AdminDashboard() {
  const { landingPageData } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            Page Editor
          </h2>
        </div>
        <nav className="space-y-1 p-2">
          <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
            General Settings
          </button>
          <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
            Theme & Colors
          </button>
          <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
            Sections
          </button>
          <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
            QR Code Generator
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b bg-card">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-semibold text-card-foreground">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Preview
              </button>
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Publish
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* General Settings Form */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-lg font-medium text-card-foreground">
                General Settings
              </h3>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-foreground"
                  >
                    Page Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={landingPageData.title}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-foreground"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={landingPageData.description}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="logo"
                    className="block text-sm font-medium text-foreground"
                  >
                    Logo
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    {landingPageData.logo && (
                      <img
                        src={landingPageData.logo}
                        alt="Current logo"
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    )}
                    <button
                      type="button"
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      Upload New Logo
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Theme & Colors */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-lg font-medium text-card-foreground">
                Theme & Colors
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="primaryColor"
                    className="block text-sm font-medium text-foreground"
                  >
                    Primary Color
                  </label>
                  <input
                    type="color"
                    id="primaryColor"
                    name="primaryColor"
                    defaultValue={landingPageData.primaryColor}
                    className="mt-1 h-10 w-full rounded-md border border-input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="secondaryColor"
                    className="block text-sm font-medium text-foreground"
                  >
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    id="secondaryColor"
                    name="secondaryColor"
                    defaultValue={landingPageData.secondaryColor}
                    className="mt-1 h-10 w-full rounded-md border border-input"
                  />
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-card-foreground">
                  Page Sections
                </h3>
                <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Add Section
                </button>
              </div>
              <div className="mt-4 space-y-4">
                {landingPageData.sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between rounded-md border border-input p-4"
                  >
                    <div>
                      <h4 className="font-medium text-foreground">
                        {section.type}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Order: {section.order}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="rounded-md bg-accent px-2 py-1 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                        Edit
                      </button>
                      <button className="rounded-md bg-destructive px-2 py-1 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 