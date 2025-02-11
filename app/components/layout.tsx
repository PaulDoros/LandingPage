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
    <div className="relative min-h-screen flex flex-col">
      {!isAdminRoute && <Navigation />}
      <main className="flex-1 container mx-auto px-4 pt-20 pb-16">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
} 