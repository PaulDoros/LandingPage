import { json, type ActionFunctionArgs } from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { uploadMedia, createSectionFolderStructure } from '~/lib/storage.server';

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
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const sectionId = formData.get('sectionId') as string;
    const altText = formData.get('altText') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return json({ error: 'No file provided' }, { status: 400 });
    }

    if (!sectionId) {
      return json({ error: 'Section ID is required' }, { status: 400 });
    }

    // Verify the section exists
    const { data: section, error: sectionError } = await supabase
      .from('sections')
      .select('id, media_metadata')
      .eq('id', sectionId)
      .single();

    if (sectionError || !section) {
      return json({ error: 'Invalid section ID' }, { status: 400 });
    }

    // Create section folders if they don't exist
    await createSectionFolderStructure(sectionId);

    // Upload the file
    const { publicUrl, storagePath } = await uploadMedia(
      file,
      file.name,
      sectionId,
      file.type,
    );

    // Prepare media metadata
    const mediaMetadata = {
      url: publicUrl,
      path: storagePath,
      fileName: file.name,
      mimeType: file.type,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      altText: altText || null,
      title: title || null,
      description: description || null,
      uploadedAt: new Date().toISOString(),
    };

    // Update section's media metadata
    const currentMetadata = section.media_metadata || {};
    const updatedMetadata = {
      ...currentMetadata,
      [storagePath]: mediaMetadata,
    };

    const { error: updateError } = await supabase
      .from('sections')
      .update({ media_metadata: updatedMetadata })
      .eq('id', sectionId);

    if (updateError) {
      throw updateError;
    }

    return json(
      {
        ...mediaMetadata,
        id: storagePath, // Use storage path as unique identifier
      },
      {
        headers: response.headers,
      },
    );
  } catch (error) {
    console.error('Upload error:', error);
    return json(
      {
        error: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500 },
    );
  }
} 