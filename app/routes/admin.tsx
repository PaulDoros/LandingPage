import { json, redirect } from '@remix-run/node';
import { Link, Outlet, useLocation } from '@remix-run/react';
import { supabase } from '~/lib/supabase/client';

export const loader = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/authenticate/admin');
  }

  return json({});
};

export default function AdminLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

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
          <Link
            to="/admin"
            className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive('/admin')
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            General Settings
          </Link>
          <Link
            to="/admin/theme"
            className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive('/admin/theme')
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            Theme & Colors
          </Link>
          <Link
            to="/admin/sections"
            className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive('/admin/sections')
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            Sections
          </Link>
          <Link
            to="/admin/qr-code"
            className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive('/admin/qr-code')
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            QR Code Generator
          </Link>
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
              <Link
                to="/"
                target="_blank"
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
              >
                View Site
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = '/authenticate/admin';
                }}
                className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 