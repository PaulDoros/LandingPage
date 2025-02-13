import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 50MB in bytes (Supabase free tier limit)
export const MAX_FILE_SIZE = 52428800;

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}


export const extractMediaUrl = (mediaMetadata: Record<string, any>) => {
  // Extract first key (assuming there's only one media object)
  const mediaKey = Object.keys(mediaMetadata)[0];

  // Return URL if exists
  return mediaMetadata[mediaKey]?.url || null;
};
