import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData, Link, useNavigation } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';

interface ContentBlock {
  id: string;
  section_id: string;
  block_type: 'heading' | 'text' | 'button' | 'image' | 'video' | 'html' | 'card';
  content: {
    title?: string;
    description?: string;
    text?: string;
    image?: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
    price?: {
      amount: string;
      currency: string;
      period: string;
    };
    features?: string[];
    button?: {
      text: string;
      link: string;
      variant: 'primary' | 'secondary' | 'outline';
      isVisible: boolean;
    };
    badge?: {
      text: string;
      isVisible: boolean;
    };
  };
  styles: {
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    borderColor?: string;
    borderWidth?: string;
    shadow?: string;
    width?: string;
    hover?: string;
    transition?: string;
  };
  position: number;
  is_visible: boolean;
}

interface LoaderData {
  contentBlocks: ContentBlock[];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const { data: contentBlocks, error } = await supabase
    .from('content_blocks')
    .select('*')
    .order('position');

  if (error) {
    throw new Error('Failed to load content blocks');
  }

  return json<LoaderData>(
    { contentBlocks: contentBlocks as ContentBlock[] },
    { headers: response.headers }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const formData = await request.formData();
  const action = formData.get('_action');

  if (action === 'updatePositions') {
    const positions = JSON.parse(formData.get('positions') as string);
    
    // Update positions in parallel
    await Promise.all(
      Object.entries(positions).map(([id, position]) =>
        supabase
          .from('content_blocks')
          .update({ position })
          .eq('id', id)
      )
    );
  }

  if (action === 'updateBlock') {
    const blockId = formData.get('blockId') as string;
    const content = JSON.parse(formData.get('content') as string);
    const styles = JSON.parse(formData.get('styles') as string);
    const isVisible = formData.get('isVisible') === 'true';

    await supabase
      .from('content_blocks')
      .update({ content, styles, is_visible: isVisible })
      .eq('id', blockId);
  }

  if (action === 'createBlock') {
    const blockType = formData.get('blockType') as ContentBlock['block_type'];
    const sectionId = formData.get('sectionId') as string;

    await supabase
      .from('content_blocks')
      .insert({
        section_id: sectionId,
        block_type: blockType,
        content: {},
        position: 0,
      });
  }

  if (action === 'deleteBlock') {
    const blockId = formData.get('blockId') as string;
    await supabase.from('content_blocks').delete().eq('id', blockId);
  }

  return json({ success: true }, { headers: response.headers });
}

// Fix form submission helper
function submitFormData(formData: FormData) {
  const form = document.createElement('form');
  form.method = 'post';
  for (const [key, value] of formData.entries()) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value.toString();
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

export default function AdminContent() {
  const { contentBlocks } = useLoaderData<typeof loader>();
  const [blocks, setBlocks] = useState(contentBlocks);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    setBlocks(contentBlocks);
  }, [contentBlocks]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    setBlocks(updatedItems);

    // Save new positions
    const formData = new FormData();
    formData.append('_action', 'updatePositions');
    formData.append(
      'positions',
      JSON.stringify(
        Object.fromEntries(updatedItems.map((item) => [item.id, item.position]))
      )
    );

    // Submit the form
    submitFormData(formData);
  };

  const handleStyleChange = (
    blockId: string,
    property: keyof ContentBlock['styles'],
    value: string
  ) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? { ...block, styles: { ...block.styles, [property]: value } }
          : block
      )
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Blocks</h1>
        <div className="flex gap-4">
          <Link
            to="/admin"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Back to Dashboard
          </Link>
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              const formData = new FormData();
              formData.append('_action', 'createBlock');
              formData.append('blockType', 'card');
              formData.append('sectionId', blocks[0]?.section_id || '');
              submitFormData(formData);
            }}
          >
            Add New Block
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {blocks.map((block, index) => (
                <Draggable
                  key={block.id}
                  draggableId={block.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="rounded-lg border bg-card p-6"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-medium capitalize">
                          {block.block_type} Block
                        </h3>
                        <div className="flex items-center gap-4">
                          <Form method="post">
                            <input type="hidden" name="_action" value="updateBlock" />
                            <input type="hidden" name="blockId" value={block.id} />
                            <input
                              type="hidden"
                              name="content"
                              value={JSON.stringify(block.content)}
                            />
                            <input
                              type="hidden"
                              name="styles"
                              value={JSON.stringify(block.styles)}
                            />
                            <input
                              type="hidden"
                              name="isVisible"
                              value={(!block.is_visible).toString()}
                            />
                            <button
                              type="submit"
                              className={`rounded-md px-3 py-1 text-sm ${
                                block.is_visible
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {block.is_visible ? 'Visible' : 'Hidden'}
                            </button>
                          </Form>
                          <Form method="post">
                            <input type="hidden" name="_action" value="deleteBlock" />
                            <input type="hidden" name="blockId" value={block.id} />
                            <button
                              type="submit"
                              className="rounded-md bg-red-100 px-3 py-1 text-sm text-red-700"
                            >
                              Delete
                            </button>
                          </Form>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Content Editor */}
                        <div className="space-y-4">
                          <h4 className="font-medium">Content</h4>
                          {block.block_type === 'card' && (
                            <>
                              <div>
                                <label htmlFor={`title-${block.id}`} className="block text-sm font-medium mb-1">
                                  Title
                                </label>
                                <input
                                  id={`title-${block.id}`}
                                  type="text"
                                  className="w-full rounded-md border-gray-300"
                                  value={block.content.title || ''}
                                  onChange={(e) => {
                                    const newContent = {
                                      ...block.content,
                                      title: e.target.value,
                                    };
                                    setBlocks((prev) =>
                                      prev.map((b) =>
                                        b.id === block.id
                                          ? { ...b, content: newContent }
                                          : b
                                      )
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <label htmlFor={`description-${block.id}`} className="block text-sm font-medium mb-1">
                                  Description
                                </label>
                                <textarea
                                  id={`description-${block.id}`}
                                  className="w-full rounded-md border-gray-300"
                                  value={block.content.description || ''}
                                  onChange={(e) => {
                                    const newContent = {
                                      ...block.content,
                                      description: e.target.value,
                                    };
                                    setBlocks((prev) =>
                                      prev.map((b) =>
                                        b.id === block.id
                                          ? { ...b, content: newContent }
                                          : b
                                      )
                                    );
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </div>

                        {/* Styles Editor */}
                        <div className="space-y-4">
                          <h4 className="font-medium">Styles</h4>
                          <div className="grid gap-4">
                            <div>
                              <label htmlFor={`bg-color-${block.id}`} className="block text-sm font-medium mb-1">
                                Background Color
                              </label>
                              <select
                                id={`bg-color-${block.id}`}
                                className="w-full rounded-md border-gray-300"
                                value={block.styles.backgroundColor || 'bg-white'}
                                onChange={(e) =>
                                  handleStyleChange(
                                    block.id,
                                    'backgroundColor',
                                    e.target.value
                                  )
                                }
                              >
                                <option value="bg-white">White</option>
                                <option value="bg-gray-50">Light Gray</option>
                                <option value="bg-primary">Primary</option>
                                <option value="bg-secondary">Secondary</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor={`text-color-${block.id}`} className="block text-sm font-medium mb-1">
                                Text Color
                              </label>
                              <select
                                id={`text-color-${block.id}`}
                                className="w-full rounded-md border-gray-300"
                                value={block.styles.textColor || 'text-gray-900'}
                                onChange={(e) =>
                                  handleStyleChange(
                                    block.id,
                                    'textColor',
                                    e.target.value
                                  )
                                }
                              >
                                <option value="text-gray-900">Dark</option>
                                <option value="text-gray-600">Gray</option>
                                <option value="text-white">White</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor={`border-radius-${block.id}`} className="block text-sm font-medium mb-1">
                                Border Radius
                              </label>
                              <select
                                id={`border-radius-${block.id}`}
                                className="w-full rounded-md border-gray-300"
                                value={block.styles.borderRadius || 'rounded-lg'}
                                onChange={(e) =>
                                  handleStyleChange(
                                    block.id,
                                    'borderRadius',
                                    e.target.value
                                  )
                                }
                              >
                                <option value="rounded-none">None</option>
                                <option value="rounded">Small</option>
                                <option value="rounded-lg">Medium</option>
                                <option value="rounded-xl">Large</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor={`shadow-${block.id}`} className="block text-sm font-medium mb-1">
                                Shadow
                              </label>
                              <select
                                id={`shadow-${block.id}`}
                                className="w-full rounded-md border-gray-300"
                                value={block.styles.shadow || 'shadow-sm'}
                                onChange={(e) =>
                                  handleStyleChange(
                                    block.id,
                                    'shadow',
                                    e.target.value
                                  )
                                }
                              >
                                <option value="shadow-none">None</option>
                                <option value="shadow-sm">Small</option>
                                <option value="shadow">Medium</option>
                                <option value="shadow-lg">Large</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Form method="post">
                          <input type="hidden" name="_action" value="updateBlock" />
                          <input type="hidden" name="blockId" value={block.id} />
                          <input
                            type="hidden"
                            name="content"
                            value={JSON.stringify(block.content)}
                          />
                          <input
                            type="hidden"
                            name="styles"
                            value={JSON.stringify(block.styles)}
                          />
                          <input
                            type="hidden"
                            name="isVisible"
                            value={block.is_visible.toString()}
                          />
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                          >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                          </button>
                        </Form>
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
    </div>
  );
} 