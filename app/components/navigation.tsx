import { Link } from '@remix-run/react';
import { ThemeToggle } from './theme-toggle';

export function Navigation() {
  return (
    <nav className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">Landing Builder</span>
          </Link>
          <div className="hidden gap-6 md:flex">
            <Link
              to="/#features"
              className="text-muted-foreground hover:text-primary flex items-center text-sm font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              to="/#pricing"
              className="text-muted-foreground hover:text-primary flex items-center text-sm font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/#contact"
              className="text-muted-foreground hover:text-primary flex items-center text-sm font-medium transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
