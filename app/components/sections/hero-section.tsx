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
      className="relative overflow-hidden"
      style={{
        backgroundColor: styles?.backgroundColor?.startsWith('#')
          ? styles.backgroundColor
          : undefined,
        borderRadius: styles?.borderRadius || themeStyles?.borderRadius,
        padding: styles?.padding || undefined,
        margin: styles?.margin || undefined,
      }}
    >
      <div className={cn('w-full', styles?.containerClass)}>
        <div className="grid gap-8 py-12 md:grid-cols-2 md:py-16 lg:py-24">
          <div className="flex flex-col justify-center space-y-4">
            <h1
              className="tracking-tight"
              style={{
                color: styles?.headingStyles?.color?.startsWith('#')
                  ? styles.headingStyles.color
                  : undefined,
                fontSize: styles?.headingStyles?.fontSize || undefined,
                fontWeight: styles?.headingStyles?.fontWeight || 'bold',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                color: styles?.subtitleStyles?.color?.startsWith('#')
                  ? styles.subtitleStyles.color
                  : undefined,
                fontSize: styles?.subtitleStyles?.fontSize || undefined,
                fontWeight: styles?.subtitleStyles?.fontWeight || undefined,
              }}
            >
              {subtitle}
            </p>
            <div className="flex gap-4">
              <a
                href={ctaLink}
                className="inline-flex items-center justify-center border px-6 py-3 text-base transition-colors hover:opacity-90"
                style={{
                  backgroundColor:
                    styles?.buttonStyles?.backgroundColor?.startsWith('#')
                      ? styles.buttonStyles.backgroundColor
                      : undefined,
                  color: styles?.buttonStyles?.textColor?.startsWith('#')
                    ? styles.buttonStyles.textColor
                    : undefined,
                  borderRadius: styles?.buttonStyles?.borderRadius || undefined,
                  fontWeight: 'medium',
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
              className="h-full w-full object-cover"
              style={{
                boxShadow: styles?.imageStyles?.shadow || undefined,
                borderRadius: styles?.imageStyles?.borderRadius || undefined,
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
