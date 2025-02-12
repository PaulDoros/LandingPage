import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
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

  // If already logged in, check if user is admin
  if (user && !userError) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      return redirect('/admin', {
        headers: response.headers,
      });
    }

    // If not admin, sign them out
    await supabase.auth.signOut();
  }

  return json(
    {},
    {
      headers: response.headers,
    },
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response },
  );

  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return json(
      { error: 'Email and password are required' },
      { status: 400, headers: response.headers },
    );
  }

  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    return json(
      { error: authError.message },
      { status: 400, headers: response.headers },
    );
  }

  // Check if user is an admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return json(
      { error: 'Profile not found' },
      { status: 400, headers: response.headers },
    );
  }

  if (profile.role !== 'admin') {
    await supabase.auth.signOut();
    return json(
      { error: 'Unauthorized access. Admin privileges required.' },
      { status: 403, headers: response.headers },
    );
  }

  return redirect('/admin', {
    headers: response.headers,
  });
}

export default function AdminLogin() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="bg-card w-full max-w-md space-y-8 rounded-lg border p-6 shadow-lg">
        <div className="text-center">
          <h2 className="text-card-foreground text-2xl font-bold tracking-tight">
            Admin Login
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Sign in to access your admin dashboard
          </p>
        </div>

        <Form method="post" className="mt-8 space-y-6">
          {actionData?.error && (
            <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
              {actionData.error}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label
                htmlFor="email"
                className="text-foreground block text-sm font-medium"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-1 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-foreground block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-1 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-primary flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Sign in
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
