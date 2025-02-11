import type { CustomContent } from '~/types/section';

interface CustomSectionProps {
  content: CustomContent;
  themeStyles?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
}

function renderBlock(block: CustomContent['blocks'][0], index: number, themeStyles?: CustomSectionProps['themeStyles']) {
  const { type, content } = block;

  switch (type) {
    case 'card':
      return (
        <div
          key={index}
          className="rounded-lg border p-6"
          style={{
            backgroundColor: themeStyles?.background,
            borderColor: `${themeStyles?.text}20`,
            color: themeStyles?.text
          }}
        >
          {content.title && (
            <h3 className="text-xl font-semibold mb-2" style={{ color: themeStyles?.text }}>
              {content.title}
            </h3>
          )}
          {content.description && (
            <p className="text-muted-foreground mb-4" style={{ color: themeStyles?.text }}>
              {content.description}
            </p>
          )}
          {content.badge?.isVisible && (
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mb-4"
              style={{ backgroundColor: `${themeStyles?.primary}20`, color: themeStyles?.primary }}
            >
              {content.badge.text}
            </span>
          )}
          {content.features && (
            <ul className="space-y-2 mb-4">
              {content.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                    style={{ color: themeStyles?.primary }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{ color: themeStyles?.text }}>{feature}</span>
                </li>
              ))}
            </ul>
          )}
          {content.button?.isVisible && (
            <a
              href={content.button.link}
              className="inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:opacity-90"
              style={{
                backgroundColor: content.button.variant === 'primary' ? themeStyles?.primary : themeStyles?.background,
                color: content.button.variant === 'primary' ? '#ffffff' : themeStyles?.text,
                border: content.button.variant === 'primary' ? 'none' : `1px solid ${themeStyles?.text}20`
              }}
            >
              {content.button.text}
            </a>
          )}
        </div>
      );

    case 'banner':
      return (
        <div
          key={index}
          className="rounded-lg p-6"
          style={{
            backgroundColor: `${themeStyles?.primary}10`,
            color: themeStyles?.text
          }}
        >
          {content.title && (
            <h3 className="text-xl font-semibold mb-2" style={{ color: themeStyles?.text }}>
              {content.title}
            </h3>
          )}
          {content.description && (
            <p className="text-muted-foreground" style={{ color: themeStyles?.text }}>
              {content.description}
            </p>
          )}
        </div>
      );

    case 'cta':
      return (
        <div
          key={index}
          className="text-center py-12"
          style={{ color: themeStyles?.text }}
        >
          {content.title && (
            <h3 className="text-2xl font-bold mb-4" style={{ color: themeStyles?.text }}>
              {content.title}
            </h3>
          )}
          {content.description && (
            <p className="text-muted-foreground mb-6" style={{ color: themeStyles?.text }}>
              {content.description}
            </p>
          )}
          {content.button?.isVisible && (
            <a
              href={content.button.link}
              className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium transition-colors hover:opacity-90"
              style={{
                backgroundColor: themeStyles?.primary,
                color: '#ffffff'
              }}
            >
              {content.button.text}
            </a>
          )}
        </div>
      );

    case 'testimonial':
      return (
        <div
          key={index}
          className="rounded-lg border p-6"
          style={{
            backgroundColor: themeStyles?.background,
            borderColor: `${themeStyles?.text}20`,
            color: themeStyles?.text
          }}
        >
          {content.description && (
            <p className="text-lg mb-6" style={{ color: themeStyles?.text }}>
              {content.description}
            </p>
          )}
          {content.author && (
            <div className="flex items-center gap-4">
              {content.author.avatarUrl && (
                <img
                  src={content.author.avatarUrl}
                  alt={content.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <div className="font-semibold" style={{ color: themeStyles?.text }}>
                  {content.author.name}
                </div>
                {content.author.title && (
                  <div className="text-sm text-muted-foreground" style={{ color: themeStyles?.text }}>
                    {content.author.title}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

export function CustomSection({ content, themeStyles }: CustomSectionProps) {
  return (
    <div className="container mx-auto px-4">
      {content.title && (
        <h2 
          className="text-3xl font-bold text-center mb-4"
          style={{ color: themeStyles?.text }}
        >
          {content.title}
        </h2>
      )}
      {content.subtitle && (
        <p 
          className="text-xl text-muted-foreground text-center mb-8"
          style={{ color: themeStyles?.text }}
        >
          {content.subtitle}
        </p>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {content.blocks.map((block, index) => renderBlock(block, index, themeStyles))}
      </div>
    </div>
  );
} 