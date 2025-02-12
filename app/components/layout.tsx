import { useLocation } from '@remix-run/react';
import { Navigation } from './navigation';
import { Footer } from './footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isAdminRoute && <Navigation />}
      <main className="container mx-auto flex-1 px-4 pt-20 pb-16">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
