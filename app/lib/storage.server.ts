import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// 50MB in bytes (Supabase free tier limit)
const MAX_FILE_SIZE = 52428800;

// Create a Supabase client with the service role key for admin operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

// Initialize storage buckets and folder structure
export async function initializeStorage() {
  try {
    // List all buckets
    const { data: buckets, error: listError } =
      await supabaseAdmin.storage.listBuckets();

    if (listError) {
      throw listError;
    }

    // We'll use a single bucket for all media, organized by section
    const bucketConfig = {
      name: 'sections',
      public: true,
      fileSizeLimit: MAX_FILE_SIZE,
      allowedMimeTypes: ['image/*', 'video/*'],
    };

    const existingBucket = buckets?.find(
      (bucket) => bucket.name === bucketConfig.name,
    );

    if (!existingBucket) {
      const { error: createError } = await supabaseAdmin.storage.createBucket(
        bucketConfig.name,
        {
          public: bucketConfig.public,
          fileSizeLimit: bucketConfig.fileSizeLimit,
          allowedMimeTypes: bucketConfig.allowedMimeTypes,
        },
      );

      if (createError) {
        console.error(`Error creating bucket ${bucketConfig.name}:`, createError);
        throw createError;
      }

      console.log(`${bucketConfig.name} bucket created successfully`);
    } else {
      console.log(`${bucketConfig.name} bucket already exists`);
    }

    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw error;
  }
}

// Create section folder structure
export async function createSectionFolderStructure(sectionId: string) {
  try {
    // Create an empty file to establish the folder structure
    const placeholderFile = new Uint8Array(0);

    // Create folders for different media types
    await Promise.all([
      supabaseAdmin.storage
        .from('sections')
        .upload(`${sectionId}/images/.keep`, placeholderFile, {
          upsert: true,
        }),
      supabaseAdmin.storage
        .from('sections')
        .upload(`${sectionId}/videos/.keep`, placeholderFile, {
          upsert: true,
        }),
    ]);

    console.log('Folder structure created for section:', sectionId);
  } catch (error) {
    console.error('Error creating folder structure:', error);
    throw error;
  }
}

// Delete section media
export async function deleteSectionMedia(sectionId: string) {
  try {
    // List all files in the section folder and its subfolders
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from('sections')
      .list(sectionId, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (listError) {
      throw listError;
    }

    if (files && files.length > 0) {
      const filePaths = files.map((file) => `${sectionId}/${file.name}`);
      
      // Delete all files in the section folder
      const { error: deleteError } = await supabaseAdmin.storage
        .from('sections')
        .remove(filePaths);

      if (deleteError) {
        throw deleteError;
      }
    }

    console.log('Section media deleted successfully:', sectionId);
    return true;
  } catch (error) {
    console.error('Error deleting section media:', error);
    throw error;
  }
}

// Helper function to format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Upload media file
export async function uploadMedia(
  file: Blob,
  fileName: string,
  sectionId: string,
  mimeType?: string,
) {
  try {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File size exceeds limit of ${formatFileSize(MAX_FILE_SIZE)}`,
      );
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).slice(2, 15);
    const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
    const isImage = mimeType?.startsWith('image/');
    
    // Create the file path within the section's media type folder
    const mediaType = isImage ? 'images' : 'videos';
    const filePath = `${sectionId}/${mediaType}/${timestamp}-${randomString}.${fileExt}`;

    // Convert Blob to Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload the file
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from('sections')
      .upload(filePath, buffer, {
        contentType: mimeType || file.type,
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('sections')
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return {
      publicUrl: urlData.publicUrl,
      storagePath: data?.path || filePath,
    };
  } catch (error) {
    console.error('Media upload error:', error);
    throw error;
  }
} 