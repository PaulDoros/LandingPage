import type {
  MediaCarouselContent,
  MediaCarouselStyles,
} from '~/types/section';
import { cn } from '~/lib/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { SwiperModule } from 'swiper/types';
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectFade,
  EffectCube,
  EffectCoverflow,
  EffectFlip,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-flip';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';

interface MediaCarouselSectionProps {
  content: MediaCarouselContent;
  styles?: Partial<MediaCarouselStyles>;
  className?: string;
  isEditing?: boolean;
  onMediaChange?: (
    mediaItems: Array<{ path: string; position: number }>,
  ) => void;
  onMediaRemove?: (mediaPath: string) => void;
}

export function MediaCarouselSection({
  content,
  styles,
  className,
  isEditing = false,
  onMediaChange,
  onMediaRemove,
}: MediaCarouselSectionProps) {
  const { items = [], showCaptions } = content;

  const swiperModules: SwiperModule[] = [
    styles?.carouselStyles?.navigation && Navigation,
    styles?.carouselStyles?.pagination && Pagination,
    styles?.carouselStyles?.autoplay && !isEditing && Autoplay,
    styles?.carouselStyles?.effect === 'fade' && EffectFade,
    styles?.carouselStyles?.effect === 'cube' && EffectCube,
    styles?.carouselStyles?.effect === 'coverflow' && EffectCoverflow,
    styles?.carouselStyles?.effect === 'flip' && EffectFlip,
  ].filter((module): module is SwiperModule => Boolean(module));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = newItems.map((item, index) => ({
      ...item,
      position: index,
    }));

    if (onMediaChange) {
      onMediaChange(
        updatedItems.map((item) => ({
          path: item.path,
          position: item.position || 0,
        })),
      );
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="carousel-media" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="relative"
              >
                <Swiper
                  modules={swiperModules}
                  spaceBetween={parseInt(styles?.carouselStyles?.gap || '0')}
                  navigation={styles?.carouselStyles?.navigation}
                  pagination={
                    styles?.carouselStyles?.pagination
                      ? { clickable: true }
                      : false
                  }
                  autoplay={
                    styles?.carouselStyles?.autoplay && !isEditing
                      ? {
                          delay: styles?.carouselStyles?.autoplayDelay || 3000,
                          disableOnInteraction: false,
                        }
                      : false
                  }
                  effect={styles?.carouselStyles?.effect || 'slide'}
                  className="w-full"
                  style={{
                    aspectRatio: styles?.mediaStyles?.aspectRatio || undefined,
                  }}
                >
                  {items.map((item, index) => {
                    const isVideo = item.mimeType?.startsWith('video/');

                    return (
                      <SwiperSlide key={item.path}>
                        <Draggable
                          draggableId={item.path}
                          index={index}
                          isDragDisabled={!isEditing}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className={cn(
                                'relative h-full w-full overflow-hidden',
                                dragSnapshot.isDragging && 'opacity-50',
                              )}
                              style={{
                                ...dragProvided.draggableProps.style,
                                borderRadius:
                                  styles?.mediaStyles?.borderRadius ||
                                  undefined,
                                boxShadow:
                                  styles?.mediaStyles?.shadow || undefined,
                              }}
                            >
                              {isVideo ? (
                                <video
                                  src={item.url}
                                  controls={!isEditing}
                                  className="h-full w-full"
                                  style={{
                                    objectFit:
                                      styles?.mediaStyles?.objectFit || 'cover',
                                  }}
                                >
                                  <track kind="captions" />
                                </video>
                              ) : (
                                <img
                                  src={item.url}
                                  alt={item.altText || item.title || ''}
                                  className="h-full w-full"
                                  style={{
                                    objectFit:
                                      styles?.mediaStyles?.objectFit || 'cover',
                                  }}
                                />
                              )}
                              {isEditing && (
                                <button
                                  onClick={() => onMediaRemove?.(item.path)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute top-2 right-2 rounded-md px-2 py-1 text-sm"
                                  type="button"
                                >
                                  Remove
                                </button>
                              )}
                              {showCaptions &&
                                (item.title || item.description) && (
                                  <div
                                    className="absolute right-0 bottom-0 left-0 bg-black/50 p-4 text-white"
                                    style={{
                                      fontSize:
                                        styles?.captionStyles?.fontSize ||
                                        undefined,
                                      fontWeight:
                                        styles?.captionStyles?.fontWeight ||
                                        undefined,
                                      textAlign:
                                        styles?.captionStyles?.textAlign ||
                                        'center',
                                    }}
                                  >
                                    {item.title && (
                                      <h3 className="text-lg font-semibold">
                                        {item.title}
                                      </h3>
                                    )}
                                    {item.description && (
                                      <p>{item.description}</p>
                                    )}
                                  </div>
                                )}
                            </div>
                          )}
                        </Draggable>
                      </SwiperSlide>
                    );
                  })}
                  {provided.placeholder}
                </Swiper>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
