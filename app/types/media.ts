export interface MediaMetadata {
  url: string;
  path: string;
  fileName: string;
  mimeType: string;
  type: 'image' | 'video';
  altText?: string | null;
  title?: string | null;
  description?: string | null;
  uploadedAt: string;
  position?: number;
}

export interface SectionMediaMetadata {
  [path: string]: MediaMetadata;
} 