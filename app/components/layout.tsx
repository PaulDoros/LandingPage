import { useLocation } from '@remix-run/react';
import { Navigation } from './navigation';
import { Footer } from './footer';
import { cn } from '~/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  useContainer?: boolean;
  containerPadding?: number;
}

export function Layout({
  children,
  useContainer = true,
  containerPadding = 16,
}: LayoutProps) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isIndexRoute = location.pathname === '/';

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isAdminRoute && <Navigation />}
      <main
        className={cn(
          useContainer && 'flex-1',
          useContainer && !isIndexRoute && 'container mx-auto',
          useContainer && !isIndexRoute && `px-[${containerPadding}px]`,
          'pt-20 pb-16',
        )}
      >
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
