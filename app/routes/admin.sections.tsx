import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import {
  Form,
  Link,
  useLoaderData,
  useActionData,
  isRouteErrorResponse,
  useRouteError,
  useNavigation,
  Outlet,
  useLocation,
} from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { getInitialContent } from '~/lib/section-templates';
import { getDefaultStylesForType } from '~/lib/section-defaults';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { SectionTypeSelector } from '~/components/sections/section-type-selector';
import type { SectionType, Section } from '~/types/section';

interface LoaderData {
  sections: Section[];
  landingPageId: string;
}

type ActionData = { success: true } | { error: string } | null;

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response },
  );

  // Check if user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw redirect('/auth/signin');
  }

  // First get the landing page id
  const { data: landingPage, error: landingPageError } = await supabase
    .from('landing_pages')
    .select('id, user_id')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (landingPageError) {
    throw new Error('Failed to load landing page');
  }

  if (!landingPage) {
    throw new Error('No landing page found');
  }

  // If the landing page is not associated with any user, associate it with the current user
  if (!landingPage.user_id) {
    const { error: updateError } = await supabase
      .from('landing_pages')
      .update({ user_id: user.id })
      .eq('id', landingPage.id);

    if (updateError) {
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

  return json<LoaderData>(
    {
      sections,
      landingPageId: landingPage.id,
    },
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

  // Check if user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  const formData = await request.formData();
  const action = formData.get('_action');

  if (action === 'toggle-visibility') {
    const sectionId = formData.get('sectionId') as string;

    console.log('Toggling visibility for section:', sectionId);

    try {
      const { error: toggleError } = await supabase.rpc(
        'toggle_section_visibility',
        {
          section_id: sectionId,
        },
      );

      if (toggleError) {
        console.error('Error toggling visibility:', toggleError);
        return json(
          { error: toggleError.message },
          { status: 500, headers: response.headers },
        );
      }

      return json({ success: true }, { headers: response.headers });
    } catch (error) {
      console.error('Unexpected error:', error);
      return json(
        { error: 'Failed to toggle visibility' },
        { status: 500, headers: response.headers },
      );
    }
  }

  if (action === 'reorder') {
    const positions = JSON.parse(formData.get('positions') as string);

    try {
      const { error } = await supabase.rpc('update_section_positions', {
        section_positions: positions,
      });

      if (error) {
        console.error('Error updating positions:', error);
        return json(
          { error: 'Failed to update positions' },
          { status: 500, headers: response.headers },
        );
      }
    } catch (error) {
      console.error('Error updating positions:', error);
      return json(
        { error: 'Failed to update positions' },
        { status: 500, headers: response.headers },
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
        { status: 500, headers: response.headers },
      );
    }

    // Return success so the client can trigger UI updates
    return json({ success: true }, { headers: response.headers });
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
    // Get default styles based on section type
    const defaultStyles = getDefaultStylesForType(type);

    const { error } = await supabase.from('sections').insert({
      landing_page_id: landingPageId,
      type,
      content: initialContent,
      styles: defaultStyles,
      position,
      is_visible: true,
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
        <div className="bg-destructive/10 rounded-lg p-8 text-center">
          <h1 className="text-destructive mb-4 text-2xl font-bold">
            {error.status} {error.statusText}
          </h1>
          <p className="text-muted-foreground mb-4">{error.data}</p>
          <Link
            to="/admin"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
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
      <div className="bg-destructive/10 rounded-lg p-8 text-center">
        <h1 className="text-destructive mb-4 text-2xl font-bold">Error</h1>
        <p className="text-muted-foreground mb-4">{errorMessage}</p>
        <Link
          to="/admin"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
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
  const [reorderFormData, setReorderFormData] = useState<{
    positions: string;
  } | null>(null);
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
            description: 'Please sign in to continue',
          });
        } else if (
          actionData.error === 'Not authorized to update this section'
        ) {
          toast.error('Not authorized', {
            description: 'You do not have permission to update this section',
          });
        } else {
          toast.error('Operation failed', {
            description: actionData.error,
          });
        }
      } else if ('success' in actionData) {
        // Determine which form triggered the action
        const activeForm = document.activeElement?.closest('form');
        if (activeForm instanceof HTMLFormElement) {
          const formData = new FormData(activeForm);
          const action = formData.get('_action');
          if (action === 'delete') {
            toast.success('Section deleted', {
              description: 'The section has been successfully removed',
            });
            // Close the delete modal
            setIsDeleteModalOpen(false);
            setSectionToDelete(null);
          } else if (action === 'create') {
            toast.success('Section created', {
              description: 'The new section has been added successfully',
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
    if (
      !result.destination ||
      result.source.index === result.destination.index
    ) {
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
      position: item.position,
    }));

    // Update form data to trigger submission
    setReorderFormData({ positions: JSON.stringify(positions) });
  };

  // Return Outlet for child routes
  if (!isIndex) {
    return <Outlet />;
  }

  // Return the main sections management UI

  return (
    <div className="space-y-8">
      <button
        className="bg-green-500 p-3"
        onClick={() => {
          console.log('clicked');
          toast('Toast');
        }}
      >
        Render Toast
      </button>

      <Form ref={reorderFormRef} method="post" className="hidden">
        <input type="hidden" name="_action" value="reorder" />
        {reorderFormData && (
          <input
            type="hidden"
            name="positions"
            value={reorderFormData.positions}
          />
        )}
      </Form>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sections</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger>
            <button
              type="button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
            >
              Add New Section
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Section</DialogTitle>
              <DialogDescription>
                Choose a section type to add to your landing page.
              </DialogDescription>
            </DialogHeader>
            <Form
              method="post"
              className="space-y-8"
              onSubmit={() => setIsModalOpen(false)}
            >
              <input type="hidden" name="_action" value="create" />
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
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Section'}
                </button>
              </div>
            </Form>
          </DialogContent>
        </Dialog>
        <Link
          to="/admin"
          className="border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md border px-4 py-2 text-sm font-medium"
        >
          Back to Dashboard
        </Link>
      </div>
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
                      className={`bg-card rounded-lg border p-4 ${
                        snapshot.isDragging ? 'shadow-lg' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            {...provided.dragHandleProps}
                            className="hover:bg-accent cursor-move rounded-md p-2"
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
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </div>
                          <span className="text-lg font-medium capitalize">
                            {section.type} Section
                          </span>
                          <span className="text-muted-foreground text-sm">
                            Position: {section.position}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Form method="post" className="inline">
                            <input
                              type="hidden"
                              name="_action"
                              value="toggle-visibility"
                            />
                            <input
                              type="hidden"
                              name="sectionId"
                              value={section.id}
                            />
                            <button
                              type="submit"
                              className={`rounded-full p-2 transition-colors ${
                                section.is_visible
                                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                  : 'bg-red-100 text-red-600 hover:bg-red-200'
                              }`}
                            >
                              {section.is_visible ? (
                                <div className="flex items-center justify-center gap-2">
                                  <span>Visible</span>
                                  <EyeIcon className="h-5 w-5" />
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-2">
                                  <span>Hidden</span>
                                  <EyeSlashIcon className="h-5 w-5" />
                                </div>
                              )}
                            </button>
                          </Form>
                          <Link
                            to={`/admin/sections/${section.id}`}
                            prefetch="intent"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1 text-sm font-medium"
                          >
                            Edit
                          </Link>
                          <Form method="post" className="inline">
                            <input
                              type="hidden"
                              name="_action"
                              value="delete"
                            />
                            <input
                              type="hidden"
                              name="sectionId"
                              value={section.id}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setSectionToDelete(section.id);
                                setIsDeleteModalOpen(true);
                              }}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer rounded-md px-3 py-1 text-sm font-medium transition-colors"
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
        <div className="bg-background/80 fixed inset-0 z-50 backdrop-blur-sm">
          <div className="bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg">
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <h2 className="text-destructive text-2xl font-semibold">
                Delete Section
              </h2>
              <p className="text-muted-foreground">
                Are you sure you want to delete this section? This action cannot
                be undone.
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSectionToDelete(null);
                }}
                className="border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md border px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <Form method="post">
                <input type="hidden" name="_action" value="delete" />
                <input
                  type="hidden"
                  name="sectionId"
                  value={sectionToDelete || ''}
                />
                <button
                  type="submit"
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2 text-sm font-medium"
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
