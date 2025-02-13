import { useCallback, useState, useEffect } from 'react';
import { useFetcher } from '@remix-run/react';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { cn, formatFileSize, MAX_FILE_SIZE } from '~/lib/utils';
import type { MediaItem } from '~/types/section';

interface MediaUploadProps {
  onUploadComplete: (media: MediaItem) => void;
  className?: string;
  sectionId: string; // Make sectionId required
}

interface UploadResponse {
  error?: string;
  id?: string;
  filePath?: string;
  fileName?: string;
  mimeType?: string;
  altText?: string;
  title?: string;
  description?: string;
  position?: number;
  url?: string;
}

export function MediaUpload({
  onUploadComplete,
  className,
  sectionId,
  url,
}: MediaUploadProps) {
  const fetcher = useFetcher<UploadResponse>();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isUploading = fetcher.state === 'submitting';

  // Handle upload response
  useEffect(() => {
    if (fetcher.data && !isUploading) {
      if (fetcher.data.error) {
        setError(fetcher.data.error);
      } else if (
        fetcher.data.id &&
        fetcher.data.filePath &&
        fetcher.data.fileName &&
        fetcher.data.mimeType
      ) {
        onUploadComplete({
          id: fetcher.data.id,
          filePath: fetcher.data.filePath,
          fileName: fetcher.data.fileName,
          mimeType: fetcher.data.mimeType,
          altText: fetcher.data.altText,
          title: fetcher.data.title,
          description: fetcher.data.description,
          position: fetcher.data.position || 0,
        });
        // Reset form
        setFile(null);
        setPreview(null);
        setAltText('');
        setTitle('');
        setDescription('');
      }
    }
  }, [fetcher.data, isUploading, onUploadComplete]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const isImage = selectedFile.type.startsWith('image/');
    const isVideo = selectedFile.type.startsWith('video/');

    if (!isImage && !isVideo) {
      setError('Please select an image or video file');
      return;
    }

    // Validate file size (50MB limit)
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File size must be less than ${formatFileSize(MAX_FILE_SIZE)}`);
      return;
    }

    if (selectedFile.size === 0) {
      setError('File is empty');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Create preview
    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else if (isVideo) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sectionId', sectionId);
      formData.append('altText', altText);
      formData.append('title', title);
      formData.append('description', description);

      fetcher.submit(formData, {
        method: 'POST',
        action: '/api/upload',
        encType: 'multipart/form-data',
      });
    } catch (err) {
      console.error('Upload failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during upload',
      );
    }
  }, [file, altText, title, description, sectionId, fetcher]);

  return (
    <div className={cn('space-y-6', className)}>
      <div
        className={`relative rounded-lg border-2 border-dashed border-gray-300 p-6 transition-all hover:border-gray-400 ${
          url ? 'bg-red-500/30' : ''
        }`}
      >
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          disabled={isUploading || url}
          className={`"absolute opacity-0" } inset-0 z-50 h-full w-full cursor-pointer`}
        />
        <div className="text-center">
          {preview ? (
            <div className="mx-auto aspect-video w-full max-w-md overflow-hidden rounded-lg">
              {file?.type.startsWith('video/') ? (
                <video
                  src={preview}
                  controls
                  className="h-full w-full object-cover"
                >
                  <track kind="captions" />
                </video>
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <svg
                className="mb-4 h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              {url ? (
                <>
                  <p className="mb-1 text-sm text-gray-500">
                    Remove Media to add new
                  </p>
                  <p className="text-xs text-gray-400"></p>
                </>
              ) : (
                <>
                  <p className="mb-1 text-sm text-gray-500">
                    Drag and drop or click to select
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports images and videos up to{' '}
                    {formatFileSize(MAX_FILE_SIZE)}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {file && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <Label htmlFor="alt-text">Alt Text</Label>
              <Input
                id="alt-text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the media for accessibility"
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title for your media"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for your media"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  setAltText('');
                  setTitle('');
                  setDescription('');
                }}
                variant="outline"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
