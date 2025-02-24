import { json, redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response },
  );

  // Get authenticated user data from Supabase Auth server
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirect('/authenticate/admin', {
      headers: response.headers,
    });
  }

  // Verify admin role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    // Sign out the user if they're not an admin
    await supabase.auth.signOut();
    return redirect('/authenticate/admin', {
      headers: response.headers,
    });
  }

  return json({ user }, { headers: response.headers });
}

export default function AdminLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="bg-background min-h-screen">
      {/* Admin Navigation */}
      <nav className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 z-50 w-full border-b backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-bold">
              Admin Dashboard
            </Link>
            <div className="flex gap-4">
              <Link
                to="/admin/theme"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                Theme
              </Link>
              <Link
                to="/admin/sections"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                Sections
              </Link>
              <Link
                to="/admin/media"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                Media
              </Link>
              <Link
                to="/admin/settings"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                Settings
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">{user.email}</span>
            <Form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                Sign Out
              </button>
            </Form>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-16">
        <Outlet />
      </main>
    </div>
  );
}
