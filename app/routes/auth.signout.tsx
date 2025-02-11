import { redirect, type ActionFunctionArgs } from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';

export async function loader() {
  return redirect('/authenticate/admin');
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  await supabase.auth.signOut();

  return redirect('/authenticate/admin', {
    headers: response.headers,
  });
} 