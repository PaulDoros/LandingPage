import type {
  Section,
  SectionType,
  SingleMediaContent,
  MediaCarouselContent,
  MediaItem,
  HeroContent,
  ContactContent,
} from '~/types/section';
import { MediaUpload } from './media-upload';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';

interface SectionContentEditorProps {
  section: Section;
  handleInputChange: (
    name: string,
    value: string | number | boolean | MediaItem | MediaItem[],
  ) => void;
}

export function SectionContentEditor({
  section,
  handleInputChange,
}: SectionContentEditorProps) {
  const content = section.content;
  const heroContent = section.type === 'hero' ? (content as HeroContent) : null;
  const contactContent =
    section.type === 'contact' ? (content as ContactContent) : null;

  const handleMediaUploadComplete = (media: MediaItem) => {
    if (section.type === 'single-media') {
      handleInputChange('content.media', media);
    } else if (section.type === 'media-carousel') {
      const content = section.content as MediaCarouselContent;
      const updatedItems = [
        ...content.items,
        { ...media, position: content.items.length },
      ];
      handleInputChange('content.items', updatedItems);
    }
  };

  const handleRemoveCarouselItem = (index: number) => {
    if (section.type === 'media-carousel') {
      const content = section.content as MediaCarouselContent;
      const updatedItems = content.items.filter((_, i) => i !== index);
      handleInputChange('content.items', updatedItems);
    }
  };

  switch (section.type) {
    case 'hero':
      return (
        <div className="space-y-4">
          <div>
            <Input
              label="Title"
              name="content.title"
              value={heroContent?.title || ''}
              onChange={(e) =>
                handleInputChange('content.title', e.target.value)
              }
            />
            <Input
              label="Subtitle"
              name="content.subtitle"
              value={heroContent?.subtitle || ''}
              onChange={(e) =>
                handleInputChange('content.subtitle', e.target.value)
              }
            />
            <Input
              label="CTA Text"
              name="content.ctaText"
              value={heroContent?.ctaText || ''}
              onChange={(e) =>
                handleInputChange('content.ctaText', e.target.value)
              }
            />
            <Input
              label="CTA Link"
              name="content.ctaLink"
              value={heroContent?.ctaLink || ''}
              onChange={(e) =>
                handleInputChange('content.ctaLink', e.target.value)
              }
            />
            <Input
              label="Image URL"
              name="content.imageUrl"
              value={heroContent?.imageUrl || ''}
              onChange={(e) =>
                handleInputChange('content.imageUrl', e.target.value)
              }
            />
          </div>
        </div>
      );

    case 'contact':
      return (
        <div className="space-y-4">
          <div>
            <Input
              label="Title"
              name="content.title"
              value={contactContent?.title || ''}
              onChange={(e) =>
                handleInputChange('content.title', e.target.value)
              }
            />
            <Input
              label="Subtitle"
              name="content.subtitle"
              value={contactContent?.subtitle || ''}
              onChange={(e) =>
                handleInputChange('content.subtitle', e.target.value)
              }
            />
            <Input
              label="Form Title"
              name="content.formTitle"
              value={contactContent?.formTitle || ''}
              onChange={(e) =>
                handleInputChange('content.formTitle', e.target.value)
              }
            />
            <Textarea
              label="Form Description"
              name="content.formSubtitle"
              value={contactContent?.formSubtitle || ''}
              onChange={(e) =>
                handleInputChange('content.formSubtitle', e.target.value)
              }
            />
          </div>
        </div>
      );

    case 'single-media': {
      const content = section.content as SingleMediaContent;
      return (
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">Media</h3>
            {content.media.filePath ? (
              <div className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  {content.media.mimeType.startsWith('video/') ? (
                    <video
                      src={content.media.filePath}
                      controls
                      className="h-full w-full object-cover"
                    >
                      <track kind="captions" />
                    </video>
                  ) : (
                    <img
                      src={content.media.filePath}
                      alt={content.media.altText || content.caption || ''}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <Button
                  onClick={() =>
                    handleInputChange('content.media', {
                      id: '',
                      filePath: '',
                      fileName: '',
                      mimeType: '',
                      position: 0,
                    })
                  }
                >
                  Remove Media
                </Button>
              </div>
            ) : (
              <MediaUpload
                sectionId={section.id}
                onUploadComplete={handleMediaUploadComplete}
              />
            )}
          </div>
          <div>
            <Input
              label="Caption"
              value={content.caption || ''}
              onChange={(e) =>
                handleInputChange('content.caption', e.target.value)
              }
              placeholder="Add a caption for your media"
            />
          </div>
          <div>
            <Input
              label="Link (optional)"
              value={content.link || ''}
              onChange={(e) =>
                handleInputChange('content.link', e.target.value)
              }
              placeholder="Add a link for your media"
            />
          </div>
        </div>
      );
    }

    case 'media-carousel': {
      const content = section.content as MediaCarouselContent;
      return (
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">Media Items</h3>
            <div className="space-y-4">
              {content.items.map((item, index) => (
                <div key={item.id || index} className="space-y-2">
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    {item.mimeType.startsWith('video/') ? (
                      <video
                        src={item.filePath}
                        controls
                        className="h-full w-full object-cover"
                      >
                        <track kind="captions" />
                      </video>
                    ) : (
                      <img
                        src={item.filePath}
                        alt={item.altText || ''}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <Button onClick={() => handleRemoveCarouselItem(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <MediaUpload onUploadComplete={handleMediaUploadComplete} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-captions"
              checked={content.showCaptions}
              onChange={(e) =>
                handleInputChange('content.showCaptions', e.target.checked)
              }
            />
            <label htmlFor="show-captions">Show Captions</label>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
