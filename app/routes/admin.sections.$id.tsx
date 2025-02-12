import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { SectionEditor } from '~/components/sections/section-editor';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/card';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response },
  );

  const { data: section, error } = await supabase
    .from('sections')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !section) {
    throw new Error('Section not found');
  }

  return json({ section });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response },
  );

  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'toggle-visibility') {
    const { error } = await supabase.rpc('toggle_section_visibility', {
      section_id: params.id,
    });

    if (error) {
      return json({ error: error.message }, { status: 400 });
    }

    return json({ success: true });
  }

  // Handle content/styles update
  const content = JSON.parse(formData.get('content') as string);
  const styles = JSON.parse(formData.get('styles') as string);

  const { error } = await supabase.rpc('update_section_content', {
    section_id: params.id,
    new_content: content,
    new_styles: styles,
  });

  if (error) {
    return json({ error: error.message }, { status: 400 });
  }

  return redirect('/admin/sections');
}

export default function AdminSectionEdit() {
  const { section } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Section</h1>
          <p className="text-muted-foreground mt-1">
            Customize the content and appearance of your section
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin/sections">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </div>

      <Card className="p-6">
        <SectionEditor
          section={{
            ...section,
            order: section.order || 0,
            isVisible: section.is_visible,
          }}
        />
      </Card>
    </div>
  );
}
