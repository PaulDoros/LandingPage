import { json, type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Form, Link, useLoaderData, useActionData, isRouteErrorResponse, useRouteError, useNavigation, Outlet, useLocation } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { getInitialContent } from '~/lib/section-templates';

type SectionType = 'hero' | 'features' | 'pricing' | 'contact' | 'custom';

interface Section {
  id: string;
  landing_page_id: string;
  type: SectionType;
  content: Record<string, unknown>;
  styles: Record<string, unknown>;
  position: number;
  is_visible: boolean;
}

interface LoaderData {
  sections: Section[];
  landingPageId: string;
}

type ActionData = 
  | { success: true }
  | { error: string }
  | null;

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  // Check if user is authenticated
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Authentication error:', userError);
    throw redirect('/auth/signin');
  }

  console.log('=== Loader Debug ===');
  console.log('Authenticated User:', {
    id: user.id,
    email: user.email
  });

  // First get the landing page id
  const { data: landingPage, error: landingPageError } = await supabase
    .from('landing_pages')
    .select('id, user_id')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (landingPageError) {
    console.error('Error fetching landing page:', landingPageError);
    throw new Error('Failed to load landing page');
  }

  if (!landingPage) {
    throw new Error('No landing page found');
  }

  console.log('=== Landing Page Debug ===');
  console.log('Landing Page:', {
    id: landingPage.id,
    user_id: landingPage.user_id
  });

  // If the landing page is not associated with any user, associate it with the current user
  if (!landingPage.user_id) {
    console.log('Associating landing page with user:', user.id);
    const { error: updateError } = await supabase
      .from('landing_pages')
      .update({ user_id: user.id })
      .eq('id', landingPage.id);

    if (updateError) {
      console.error('Error associating landing page with user:', updateError);
      throw new Error('Failed to associate landing page with user');
    }
  }

  // Then get all sections for this landing page
  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .select('*')
    .eq('landing_page_id', landingPage.id)
    .order('position', { ascending: true });

  if (sectionsError) {
    console.error('Error fetching sections:', sectionsError);
    throw new Error('Failed to load sections');
  }

  if (!sections) {
    throw new Error('Failed to load sections');
  }

  console.log('=== Sections Debug ===');
  console.log('Sections loaded:', sections.map(s => ({
    id: s.id,
    type: s.type,
    position: s.position,
    is_visible: s.is_visible,
    is_visible_type: typeof s.is_visible
  })));

  return json<LoaderData>({
    sections,
    landingPageId: landingPage.id
  }, {
    headers: response.headers
  });
}



export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  // Check if user is authenticated
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Authentication error:', userError);
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  const formData = await request.formData();
  const action = formData.get('_action');

  console.log('=== Server-side Action Debug ===');
  console.log('Action type:', action);

  if (action === 'toggle-visibility') {
    const sectionId = formData.get('sectionId') as string;
    
    console.log('Toggling visibility for section:', sectionId);

    try {
      const { error: toggleError } = await supabase.rpc('toggle_section_visibility', {
        section_id: sectionId
      });

      if (toggleError) {
        console.error('Error toggling visibility:', toggleError);
        return json(
          { error: toggleError.message },
          { status: 500, headers: response.headers }
        );
      }

      return json(
        { success: true },
        { headers: response.headers }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      return json(
        { error: 'Failed to toggle visibility' },
        { status: 500, headers: response.headers }
      );
    }
  }

  if (action === 'reorder') {
    const positions = JSON.parse(formData.get('positions') as string);
    
    try {
      const { error } = await supabase.rpc('update_section_positions', {
        section_positions: positions
      });

      if (error) {
        console.error('Error updating positions:', error);
        return json(
          { error: 'Failed to update positions' },
          { status: 500, headers: response.headers }
        );
      }
    } catch (error) {
      console.error('Error updating positions:', error);
      return json(
        { error: 'Failed to update positions' },
        { status: 500, headers: response.headers }
      );
    }
  }

  if (action === 'delete') {
    const sectionId = formData.get('sectionId') as string;
    console.log('Deleting section:', sectionId);

    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', sectionId);

    if (error) {
      console.error('Error deleting section:', error);
      return json(
        { error: 'Failed to delete section' },
        { status: 500, headers: response.headers }
      );
    }
  }

  if (action === 'create') {
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
      styles: {
        padding: 'py-12 md:py-16',
        margin: 'my-0',
        backgroundColor: 'bg-background',
        textColor: 'text-foreground',
        containerClass: 'container mx-auto px-4'
      },
      position,
      is_visible: true
    });

    if (error) {
      return json({ error: error.message }, { status: 400 });
    }

    return json({ success: true }, { headers: response.headers });
  }

  return json({ success: true }, { headers: response.headers });
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-destructive/10 p-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-destructive">
            {error.status} {error.statusText}
          </h1>
          <p className="mb-4 text-muted-foreground">{error.data}</p>
          <Link
            to="/admin"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  let errorMessage = 'Unknown error';
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg bg-destructive/10 p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold text-destructive">Error</h1>
        <p className="mb-4 text-muted-foreground">{errorMessage}</p>
        <Link
          to="/admin"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function AdminSections() {
  const location = useLocation();
  const { sections, landingPageId } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const [orderedSections, setOrderedSections] = useState(sections);
  const [reorderFormData, setReorderFormData] = useState<{ positions: string } | null>(null);
  const reorderFormRef = useRef<HTMLFormElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<SectionType>('hero');
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const isIndex = location.pathname === '/admin/sections';

  useEffect(() => {
    console.log('Sections updated:', sections);
    setOrderedSections(sections);
  }, [sections]);

  useEffect(() => {
    if (actionData) {
      if ('error' in actionData) {
        console.error('Action error:', actionData.error);
        if (actionData.error === 'Not authenticated') {
          toast.error('Authentication required', {
            description: 'Please sign in to continue'
          });
        } else if (actionData.error === 'Not authorized to update this section') {
          toast.error('Not authorized', {
            description: 'You do not have permission to update this section'
          });
        } else {
          toast.error('Operation failed', {
            description: actionData.error
          });
        }
      } else if ('success' in actionData) {
        const activeForm = document.activeElement?.closest('form');
        if (activeForm instanceof HTMLFormElement) {
          const formData = new FormData(activeForm);
          const action = formData.get('_action');
          if (action === 'delete') {
            toast.success('Section deleted', {
              description: 'The section has been successfully removed'
            });
          } else if (action === 'create') {
            toast.success('Section created', {
              description: 'The new section has been added successfully'
            });
            setIsModalOpen(false);
          }
        }
      }
    }
  }, [actionData]);

  useEffect(() => {
    if (actionData && 'success' in actionData && navigation.state === 'idle') {
      setIsModalOpen(false);
      setSelectedType('hero');
    }
  }, [actionData, navigation.state]);

  useEffect(() => {
    // Submit the form when reorderFormData changes
    if (reorderFormData && reorderFormRef.current) {
      reorderFormRef.current.submit();
    }
  }, [reorderFormData]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || result.source.index === result.destination.index) {
      return;
    }

    const items = Array.from(orderedSections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    setOrderedSections(updatedItems);

    // Prepare positions data for the form
    const positions = updatedItems.map((item) => ({
      id: item.id,
      position: item.position
    }));

    // Update form data to trigger submission
    setReorderFormData({ positions: JSON.stringify(positions) });
  };

  // Return Outlet for child routes
  if (!isIndex) {
    return <Outlet />;
  }

  // Return the main sections management UI
  const sectionTypes: Array<{ type: SectionType; label: string; description: string; icon: string }> = [
    {
      type: 'hero',
      label: 'Hero Section',
      description: 'A prominent section at the top of your landing page',
      icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'
    },
    {
      type: 'features',
      label: 'Features Section',
      description: 'Showcase your product or service features',
      icon: 'M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3'
    },
    {
      type: 'pricing',
      label: 'Pricing Section',
      description: 'Display your pricing plans and tiers',
      icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      type: 'contact',
      label: 'Contact Section',
      description: 'Add contact information and a contact form',
      icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'
    },
    {
      type: 'custom',
      label: 'Custom Section',
      description: 'Create a custom section with your own content',
      icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
    }
  ];



  return (
    <div className="space-y-8">
    
    
      {/* Hidden form for reordering */}
      <Form ref={reorderFormRef} method="post" className="hidden">
        <input type="hidden" name="_action" value="reorder" />
        {reorderFormData && (
          <input type="hidden" name="positions" value={reorderFormData.positions} />
        )}
      </Form>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Sections</h1>
        <div className="flex gap-4">
        <button
        type="button"
        onClick={() => {
          console.log('Add Section button clicked');
          setIsModalOpen(true);
        }}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Add Section
      </button>
          <Link
            to="/admin"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Add Section Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-2xl font-semibold">Add New Section</h2>
              <p className="text-sm text-muted-foreground">
                Choose a section type to add to your landing page
              </p>
            </div>
            <Form method="post" className="space-y-8">
              <input type="hidden" name="landingPageId" value={landingPageId} />
              <input type="hidden" name="_action" value="create" />
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sectionTypes.map(({ type, label, description, icon }) => (
                  <label
                    key={type}
                    className={`relative flex cursor-pointer rounded-lg border p-6 ${
                      selectedType === type
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={selectedType === type}
                      onChange={(e) => setSelectedType(e.target.value as SectionType)}
                      className="sr-only"
                    />
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-2 ${
                          selectedType === type ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                          >
                            <path d={icon} />
                          </svg>
                        </div>
                        <h3 className="font-medium">{label}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    {selectedType === type && (
                      <div className="absolute right-4 top-4 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Cancel
                </button>
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
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {orderedSections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`rounded-lg border bg-card p-4 ${
                        snapshot.isDragging ? 'shadow-lg' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move p-2 hover:bg-accent rounded-md"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4 h-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </div>
                          <span className="text-lg font-medium capitalize">
                            {section.type} Section
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Position: {section.position}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Form method="post" className="inline">
                            <input type="hidden" name="_action" value="toggle-visibility" />
                            <input type="hidden" name="sectionId" value={section.id} />
                            <button
                              type="submit"
                              className={`p-2 rounded-full transition-colors ${
                                section.is_visible
                                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                  : 'bg-red-100 text-red-600 hover:bg-red-200'
                              }`}
                            >
                              {section.is_visible ? (
                                <div className='flex justify-center items-center gap-2'>
                                  <span>Visible</span>
                                  <EyeIcon className="w-5 h-5" />
                                </div>
                              ) : (
                                <div className='flex justify-center items-center gap-2'>
                                  <span>Hidden</span>
                                  <EyeSlashIcon className="w-5 h-5" />
                                </div>
                              )}
                            </button>
                          </Form>
                          <Link
                            to={`/admin/sections/${section.id}`}
                            prefetch="intent"
                            className="rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                          >
                            Edit
                          </Link>
                          <Form 
                            method="post" 
                            className="inline"
                          >
                            <input type="hidden" name="_action" value="delete" />
                            <input type="hidden" name="sectionId" value={section.id} />
                            <button
                              type="button"
                              onClick={() => {
                                setSectionToDelete(section.id);
                                setIsDeleteModalOpen(true);
                              }}
                              className="rounded-md bg-destructive px-3 py-1 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </Form>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-destructive">Delete Section</h2>
              <p className="text-muted-foreground">
                Are you sure you want to delete this section? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSectionToDelete(null);
                }}
                className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                Cancel
              </button>
              <Form method="post">
                <input type="hidden" name="_action" value="delete" />
                <input type="hidden" name="sectionId" value={sectionToDelete || ''} />
                <button
                  type="submit"
                  className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}