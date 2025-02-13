import type { Section, SectionContent, SectionStyles } from './section';
import type { MediaMetadata } from './media';

export interface SectionContentEditorProps {
  section: Section;
  handleInputChange: (
    name: string,
    value: string | number | boolean | MediaItem | MediaItem[],
  ) => void;
}

export interface SectionStylesEditorProps {
  section: Section;
  handleInputChange: (name: string, value: unknown) => void;
}

export interface SectionEditorProps {
  section: Section & {
    order: number;
    isVisible: boolean;
    media_metadata?: Record<string, MediaMetadata>;
  };
  onUpdate?: (section: Section & { order: number; isVisible: boolean }) => void;
}

export interface MediaItem {
  id: string;
  filePath: string;
  fileName: string;
  mimeType: string;
  position: number;
  altText?: string;
} 