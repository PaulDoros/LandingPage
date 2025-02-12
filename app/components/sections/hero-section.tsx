import type { HeroContent, ThemeStyles } from '~/types/section';
import { cn } from '~/lib/utils';

interface HeroSectionProps {
  content: HeroContent;
  themeStyles?: ThemeStyles;
  styles?: {
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    margin?: string;
    containerClass?: string;
    customClasses?: string[];
    borderRadius?: string;
    buttonStyles?: {
      primary?: {
        backgroundColor?: string;
        textColor?: string;
        hoverColor?: string;
      };
    };
    textStyles?: {
      heading1?: string;
      subtitle?: string;
    };
    cardStyles?: {
      padding?: string;
      backgroundColor?: string;
      borderRadius?: string;
      hover?: string;
      shadow?: string;
      borderColor?: string;
      textColor?: string;
    };
  };
}

export function HeroSection({ content, themeStyles, styles }: HeroSectionProps) {
  const { title, subtitle, ctaText, ctaLink, imageUrl } = content;

  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        styles?.padding,
        styles?.margin,
        styles?.customClasses
      )}
      style={{ 
        backgroundColor: styles?.backgroundColor || themeStyles?.background,
        color: styles?.textColor || themeStyles?.text,
     
        borderRadius: styles?.borderRadius || themeStyles?.borderRadius
      }}
    >
      <div className={cn(
        "container mx-auto px-4",
        styles?.containerClass
      )}>
        <div className={cn(
          "grid gap-8 py-12 md:grid-cols-2 md:py-16 lg:py-24",
          styles?.cardStyles?.padding
        )}>
          <div className="flex flex-col justify-center space-y-4">
            <h1 
              className={cn(
                "font-bold tracking-tight",
                styles?.textStyles?.heading1
              )}
            >
              {title}
            </h1>
            <p 
              className={cn(
                styles?.textStyles?.subtitle
              )}
            >
              {subtitle}
            </p>
            <div className="flex gap-4">
              <a
                href={ctaLink}
                className={cn(
                  "inline-flex items-center justify-center px-6 py-3 text-base font-medium transition-colors",
                  styles?.cardStyles?.borderRadius,
                  styles?.buttonStyles?.primary?.hoverColor
                )}
                style={{ 
                  backgroundColor: styles?.buttonStyles?.primary?.backgroundColor || themeStyles?.primary,
                  color: styles?.buttonStyles?.primary?.textColor || '#ffffff'
                }}
              >
                {ctaText}
              </a>
            </div>
          </div>
          <div className={cn(
            "relative",
            styles?.cardStyles?.padding
          )}>
            <img
              src={imageUrl}
              alt={title}
              className={cn(
                "object-cover w-full h-full",
                styles?.cardStyles?.borderRadius,
                styles?.cardStyles?.hover
              )}
              style={{
                boxShadow: styles?.cardStyles?.shadow,
                backgroundColor: styles?.cardStyles?.backgroundColor,
                borderColor: styles?.cardStyles?.borderColor
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