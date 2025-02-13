import type { SingleMediaContent, SingleMediaStyles } from '~/types/section';
import { cn, extractMediaUrl } from '~/lib/utils';

interface SingleMediaSectionProps {
  content: SingleMediaContent;
  styles?: Partial<SingleMediaStyles>;
  className?: string;
  isEditing?: boolean;
  onMediaChange?: (mediaPath: string | null) => void;
}

export function SingleMediaSection({
  content,
  styles,
  className,
  isEditing = false,
  onMediaChange,
  media_metadata,
}: SingleMediaSectionProps) {
  const { media, caption, link } = content;

  console.log(extractMediaUrl(media_metadata));
  const isVideo = media?.mimeType?.startsWith('video/');
  console.log(content);
  const MediaWrapper = link ? 'a' : 'div';
  const wrapperProps = link
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  const handleMediaRemove = () => {
    if (onMediaChange) {
      onMediaChange(null);
    }
  };

  return (
    <div
      className={cn('w-full', className)}
      style={{
        backgroundColor: styles?.backgroundColor || undefined,
        padding: styles?.padding || undefined,
        margin: styles?.margin || undefined,
      }}
    >
      <div className={cn('mx-auto', styles?.containerClass)}>
        {media ? (
          <div className="relative">
            <MediaWrapper
              {...wrapperProps}
              className={cn(
                'block overflow-hidden',
                link &&
                  'cursor-pointer transition-transform hover:scale-[1.02]',
              )}
              style={{
                borderRadius: styles?.mediaStyles?.borderRadius || undefined,
                boxShadow: styles?.mediaStyles?.shadow || undefined,
                aspectRatio: styles?.mediaStyles?.aspectRatio || undefined,
                width: styles?.mediaStyles?.width || undefined,
              }}
            >
              {isVideo ? (
                <video
                  src={extractMediaUrl(media_metadata) || media.url}
                  controls
                  className="h-full w-full"
                  style={{
                    objectFit: styles?.mediaStyles?.objectFit || 'cover',
                  }}
                >
                  <track kind="captions" />
                </video>
              ) : (
                <img
                  src={extractMediaUrl(media_metadata) || media.url}
                  alt={media.altText || caption || ''}
                  className="h-full w-full"
                  style={{
                    objectFit: styles?.mediaStyles?.objectFit || 'cover',
                  }}
                />
              )}
            </MediaWrapper>
            {isEditing && (
              <button
                onClick={handleMediaRemove}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute top-2 right-2 rounded-md px-2 py-1 text-sm"
                type="button"
              >
                Remove
              </button>
            )}
          </div>
        ) : isEditing ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
            <p className="text-muted-foreground text-sm">
              Drop media here or click to upload
            </p>
          </div>
        ) : null}
        {(caption || media?.title || media?.description) && (
          <div
            className="mt-4"
            style={{
              fontSize: styles?.captionStyles?.fontSize || undefined,
              fontWeight: styles?.captionStyles?.fontWeight || undefined,
              color: styles?.captionStyles?.color || undefined,
              textAlign: styles?.captionStyles?.textAlign || 'center',
            }}
          >
            {caption || media?.title || media?.description}
          </div>
        )}
      </div>
    </div>
  );
}
