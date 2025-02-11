import { LinksFunction, MetaFunction, json } from "@remix-run/node";
import { createClient } from '@supabase/supabase-js';
import { Toaster } from 'sonner';


import { ThemeProvider } from '~/components/theme-provider';
import { Layout } from '~/components/layout';

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react';
import { useState } from "react";
import styles from '~/styles/globals.css?url';
// Define default theme as a constant to be used across the application
const DEFAULT_THEME = {
  colors: {
    primary: '#3b82f6',
    secondary: '#1e40af',
    background: '#ffffff',
    text: '#000000',
    accent: '#f59e0b',
  },
  typography: {
    fontFamily: 'Inter',
    fontSize: {
      base: '16px',
      heading1: '48px',
      heading2: '36px',
      heading3: '24px',
      paragraph: '16px',
    },
  },
} as const;

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
];

export const meta: MetaFunction = () => {
  return [
    { title: 'Landing Page Builder' },
    { name: 'description', content: 'A fully customizable landing page builder' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { httpEquiv: 'x-ua-compatible', content: 'ie=edge' },
    { httpEquiv: 'cache-control', content: 'no-cache' },
    { httpEquiv: 'expires', content: '0' },
    { httpEquiv: 'pragma', content: 'no-cache' },
  ];
};

interface LoaderData {
  theme: typeof DEFAULT_THEME;
}

export async function loader() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  try {
    const { data: themeData, error } = await supabase
      .from('themes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching theme:', error);
      return json<LoaderData>({ theme: DEFAULT_THEME });
    }

    // Map database fields to theme structure
    const validatedTheme = {
      colors: {
        primary: themeData.primary_color ?? DEFAULT_THEME.colors.primary,
        secondary: themeData.secondary_color ?? DEFAULT_THEME.colors.secondary,
        background: themeData.background_color ?? DEFAULT_THEME.colors.background,
        text: themeData.text_color ?? DEFAULT_THEME.colors.text,
        accent: themeData.accent_color ?? DEFAULT_THEME.colors.accent,
      },
      typography: {
        fontFamily: themeData.font_family ?? DEFAULT_THEME.typography.fontFamily,
        fontSize: {
          base: themeData.font_size_base ?? DEFAULT_THEME.typography.fontSize.base,
          heading1: themeData.font_size_h1 ?? DEFAULT_THEME.typography.fontSize.heading1,
          heading2: themeData.font_size_h2 ?? DEFAULT_THEME.typography.fontSize.heading2,
          heading3: themeData.font_size_h3 ?? DEFAULT_THEME.typography.fontSize.heading3,
          paragraph: themeData.font_size_paragraph ?? DEFAULT_THEME.typography.fontSize.paragraph,
        },
      },
    };

    return json<LoaderData>({ theme: validatedTheme });
  } catch (error) {
    console.error('Error in loader:', error);
    return json<LoaderData>({ theme: DEFAULT_THEME });
  }
}

export default function App() {
  const { theme } = useLoaderData<LoaderData>();
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith('/authenticate') || 
                     location.pathname.startsWith('/auth');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider theme={theme}>
          {isAuthRoute ? (
            <Outlet />
          ) : (
            <Layout>
              <Outlet />
            </Layout>
          )}
        </ThemeProvider>
        <Toaster richColors position="top-right" />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith('/authenticate') || 
                     location.pathname.startsWith('/auth');

  function getErrorContent() {
    if (isRouteErrorResponse(error)) {
      return {
        status: error.status,
        title: error.statusText,
        message: error.data,
      };
    } else if (error instanceof Error) {
      return {
        status: 500,
        title: 'An unexpected error occurred',
        message: error.message,
      };
    } else {
      return {
        status: 500,
        title: 'An unexpected error occurred',
        message: 'Something went wrong. Please try again later.',
      };
    }
  }

  const errorContent = getErrorContent();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider theme={DEFAULT_THEME}>
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-[var(--color-primary)]">
                  {errorContent.status}
                </h1>
                <h2 className="text-2xl font-semibold">
                  {errorContent.title}
                </h2>
                <p className="text-[var(--color-text)] opacity-80">
                  {errorContent.message}
                </p>
                <div className="pt-6 space-y-4">
                <button
                    type="button"
                    onClick={() => {
                      console.log('Button clicked');
                      setIsOpen(!isOpen);
                    }}
                    className="inline-flex items-center justify-center rounded-md bg-[var(--color-primary)] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[var(--color-primary)]/90"
                >
                    {isOpen ? 'Hide Content' : 'Show Content'}
                </button>
                  {isOpen && (
                    <div className="p-4 border rounded-md bg-white/10">
                      <p className="text-white">Additional error details will be shown here.</p>
                    </div>
                  )}
                  <a
                    href={isAuthRoute ? '/authenticate/admin' : '/'}
                    className="inline-flex items-center justify-center rounded-md bg-[var(--color-primary)] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[var(--color-primary)]/90"
                  >
                    {isAuthRoute ? 'Back to Login' : 'Back to Home'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ThemeProvider>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}


