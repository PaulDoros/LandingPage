import type { FeaturesContent, ThemeStyles } from '~/types/section';

interface FeaturesSectionProps {
  content: FeaturesContent;
  themeStyles?: ThemeStyles;
}

export function FeaturesSection({ content, themeStyles }: FeaturesSectionProps) {
  const { title, subtitle, features } = content;

  return (
    <div className="container mx-auto px-4">
      <div className="space-y-12 py-12 md:py-16 lg:py-24">
        <div className="space-y-4 text-center">
          <h2 
            className="text-3xl font-bold md:text-4xl"
            style={{ color: themeStyles?.text }}
          >
            {title}
          </h2>
          <p 
            className="text-xl"
            style={{ color: themeStyles?.text }}
          >
            {subtitle}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg border p-6"
              style={{
                backgroundColor: themeStyles?.background,
                borderColor: `${themeStyles?.text}20`,
                color: themeStyles?.text
              }}
            >
              <div className="mb-4">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="h-8 w-8"
                  style={{ color: themeStyles?.primary }}
                />
              </div>
              <h3 
                className="mb-2 text-xl font-semibold"
                style={{ color: themeStyles?.text }}
              >
                {feature.title}
              </h3>
              <p 
                className="text-base"
                style={{ color: themeStyles?.text }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 