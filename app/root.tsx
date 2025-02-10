import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { LinksFunction, MetaFunction } from "@remix-run/node";

import styles from '~/styles/globals.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
];

export const meta: MetaFunction = () => {
  return [
    { title: 'Landing Page Builder' },
    { name: 'description', content: 'A fully customizable landing page builder' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    // Ensure proper URL handling
    { httpEquiv: 'x-ua-compatible', content: 'ie=edge' },
    // Prevent caching during development
    { httpEquiv: 'cache-control', content: 'no-cache' },
    { httpEquiv: 'expires', content: '0' },
    { httpEquiv: 'pragma', content: 'no-cache' },
  ];
};

export default function App() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
