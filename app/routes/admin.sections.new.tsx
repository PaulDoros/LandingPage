import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData, useNavigation, Link } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { useState } from 'react';
import type { SectionType } from '~/types/section';
import { getInitialContent } from '~/lib/section-templates';
import { defaultSectionStyles } from '~/lib/section-defaults';
import { SectionTypeSelector } from '~/components/sections/section-type-selector';

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  // Get the landing page id
  const { data: landingPage } = await supabase
    .from('landing_pages')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!landingPage) {
    throw new Error('No landing page found');
  }

  return json({ landingPageId: landingPage.id });
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const formData = await request.formData();
  const type = formData.get('type') as SectionType;
  const landingPageId = formData.get('landingPageId') as string;

  // Get the current highest position
  const { data: lastSection } = await supabase
    .from('sections')
    .select('position')
    .order('position', { ascending: false })
    .limit(1)
    .single();

  const position = lastSection ? lastSection.position + 1 : 1;

  // Create initial content based on section type
  const initialContent = getInitialContent(type);

  const { error } = await supabase.from('sections').insert({
    landing_page_id: landingPageId,
    type,
    content: initialContent,
    styles: defaultSectionStyles,
    position,
    is_visible: true
  });

  if (error) {
    return json({ error: error.message }, { status: 400 });
  }

  return redirect('/admin/sections');
}

export default function NewSection() {
  const { landingPageId } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState<SectionType>('hero');
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Section</h1>
        <Link
          to="/admin/sections"
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          Cancel
        </Link>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <Form method="post" className="space-y-8">
          <input type="hidden" name="landingPageId" value={landingPageId} />
          <input type="hidden" name="type" value={selectedType} />
          
          <SectionTypeSelector
            selectedType={selectedType}
            onChange={setSelectedType}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Section'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
} 