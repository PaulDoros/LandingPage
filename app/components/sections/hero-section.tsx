import type { HeroContent, ThemeStyles } from '~/types/section';

interface HeroSectionProps {
  content: HeroContent;
  themeStyles?: ThemeStyles;
}

export function HeroSection({ content, themeStyles }: HeroSectionProps) {
  const { title, subtitle, ctaText, ctaLink, imageUrl } = content;

  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 py-12 md:grid-cols-2 md:py-16 lg:py-24">
          <div className="flex flex-col justify-center space-y-4">
            <h1 
              className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
              style={{ color: themeStyles?.text }}
            >
              {title}
            </h1>
            <p 
              className="text-xl"
              style={{ color: themeStyles?.text }}
            >
              {subtitle}
            </p>
            <div className="flex gap-4">
              <a
                href={ctaLink}
                className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: themeStyles?.primary, color: '#ffffff' }}
              >
                {ctaText}
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src={imageUrl}
              alt={title}
              className="rounded-lg object-cover"
              width={600}
              height={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 