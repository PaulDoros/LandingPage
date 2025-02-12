import type { HeroContent, ThemeStyles, HeroStyles } from '~/types/section';
import { cn } from '~/lib/utils';

interface HeroSectionProps {
  content: HeroContent;
  themeStyles?: ThemeStyles;
  styles?: Partial<HeroStyles>;
}

export function HeroSection({
  content,
  themeStyles,
  styles,
}: HeroSectionProps) {
  const { title, subtitle, ctaText, ctaLink, imageUrl } = content;

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        styles?.padding,
        styles?.margin,
        styles?.customClasses,
        !styles?.backgroundColor?.startsWith('#') && styles?.backgroundColor,
      )}
      style={{
        backgroundColor: styles?.backgroundColor?.startsWith('#')
          ? styles.backgroundColor
          : undefined,
        borderRadius: styles?.borderRadius || themeStyles?.borderRadius,
      }}
    >
      <div className={cn('container mx-auto px-4', styles?.containerClass)}>
        <div className="grid gap-8 py-12 md:grid-cols-2 md:py-16 lg:py-24">
          <div className="flex flex-col justify-center space-y-4">
            <h1
              className={cn(
                'font-bold tracking-tight',
                styles?.headingStyles?.fontSize,
                styles?.headingStyles?.fontWeight,
                !styles?.headingStyles?.color?.startsWith('#') &&
                  styles?.headingStyles?.color,
              )}
              style={{
                color: styles?.headingStyles?.color?.startsWith('#')
                  ? styles.headingStyles.color
                  : undefined,
              }}
            >
              {title}
            </h1>
            <p
              className={cn(
                styles?.subtitleStyles?.fontSize,
                styles?.subtitleStyles?.fontWeight,
                !styles?.subtitleStyles?.color?.startsWith('#') &&
                  styles?.subtitleStyles?.color,
              )}
              style={{
                color: styles?.subtitleStyles?.color?.startsWith('#')
                  ? styles.subtitleStyles.color
                  : undefined,
              }}
            >
              {subtitle}
            </p>
            <div className="flex gap-4">
              <a
                href={ctaLink}
                className={cn(
                  'inline-flex items-center justify-center px-6 py-3 text-base font-medium transition-colors',
                  styles?.buttonStyles?.borderRadius,
                  !styles?.buttonStyles?.backgroundColor?.startsWith('#') &&
                    styles?.buttonStyles?.backgroundColor,
                  !styles?.buttonStyles?.textColor?.startsWith('#') &&
                    styles?.buttonStyles?.textColor,
                  styles?.buttonStyles?.hoverColor,
                )}
                style={{
                  backgroundColor:
                    styles?.buttonStyles?.backgroundColor?.startsWith('#')
                      ? styles.buttonStyles.backgroundColor
                      : undefined,
                  color: styles?.buttonStyles?.textColor?.startsWith('#')
                    ? styles.buttonStyles.textColor
                    : undefined,
                }}
              >
                {ctaText}
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src={imageUrl}
              alt={title}
              className={cn(
                'h-full w-full object-cover',
                styles?.imageStyles?.borderRadius,
                styles?.imageStyles?.hover,
              )}
              style={{
                boxShadow: styles?.imageStyles?.shadow,
              }}
              width={600}
              height={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
