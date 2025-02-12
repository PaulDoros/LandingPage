import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import type { Section, HeroContent, ContactContent } from '~/types/section';

interface SectionContentEditorProps {
  section: Section;
  handleInputChange: (name: string, value: string) => void;
}

export function SectionContentEditor({
  section,
  handleInputChange,
}: SectionContentEditorProps) {
  const content = section.content;
  const heroContent = section.type === 'hero' ? (content as HeroContent) : null;
  const contactContent = section.type === 'contact' ? (content as ContactContent) : null;

  switch (section.type) {
    case 'hero':
      return (
        <div className="space-y-4">
          <Input
            label="Title"
            name="content.title"
            value={heroContent?.title || ''}
            onChange={(e) => handleInputChange('content.title', e.target.value)}
          />
          <Textarea
            label="Subtitle"
            name="content.subtitle"
            value={heroContent?.subtitle || ''}
            onChange={(e) => handleInputChange('content.subtitle', e.target.value)}
          />
          <Input
            label="CTA Text"
            name="content.ctaText"
            value={heroContent?.ctaText || ''}
            onChange={(e) => handleInputChange('content.ctaText', e.target.value)}
          />
          <Input
            label="CTA Link"
            name="content.ctaLink"
            value={heroContent?.ctaLink || ''}
            onChange={(e) => handleInputChange('content.ctaLink', e.target.value)}
          />
          <Input
            label="Image URL"
            name="content.imageUrl"
            value={heroContent?.imageUrl || ''}
            onChange={(e) => handleInputChange('content.imageUrl', e.target.value)}
          />
        </div>
      );

    case 'contact':
      return (
        <div className="space-y-4">
          <Input
            label="Title"
            name="content.title"
            value={contactContent?.title || ''}
            onChange={(e) => handleInputChange('content.title', e.target.value)}
          />
          <Textarea
            label="Description"
            name="content.subtitle"
            value={contactContent?.subtitle || ''}
            onChange={(e) => handleInputChange('content.subtitle', e.target.value)}
          />
          <Input
            label="Form Title"
            name="content.formTitle"
            value={contactContent?.formTitle || ''}
            onChange={(e) => handleInputChange('content.formTitle', e.target.value)}
          />
          <Textarea
            label="Form Description"
            name="content.formSubtitle"
            value={contactContent?.formSubtitle || ''}
            onChange={(e) => handleInputChange('content.formSubtitle', e.target.value)}
          />
        </div>
      );

    default:
      return null;
  }
} 