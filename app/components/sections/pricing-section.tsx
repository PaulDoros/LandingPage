import type { PricingContent } from '~/types/section';

interface PricingSectionProps {
  content: PricingContent;
  themeStyles?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
}

export function PricingSection({ content, themeStyles }: PricingSectionProps) {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 
          className="text-3xl font-bold mb-4"
          style={{ color: themeStyles?.text }}
        >
          {content.title}
        </h2>
        {content.subtitle && (
          <p 
            className="text-xl text-muted-foreground"
            style={{ color: themeStyles?.text }}
          >
            {content.subtitle}
          </p>
        )}
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        {content.tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-lg border p-8`}
            style={{
              borderColor: tier.highlighted ? themeStyles?.primary : `${themeStyles?.text}20`,
              backgroundColor: tier.highlighted ? `${themeStyles?.primary}10` : themeStyles?.background,
            }}
          >
            <div className="mb-6">
              <h3 
                className="text-2xl font-bold"
                style={{ color: themeStyles?.text }}
              >
                {tier.name}
              </h3>
              <div className="mt-2">
                <span 
                  className="text-4xl font-bold"
                  style={{ color: themeStyles?.text }}
                >
                  {tier.price}
                </span>
              </div>
              {tier.description && (
                <p 
                  className="mt-2 text-muted-foreground"
                  style={{ color: themeStyles?.text }}
                >
                  {tier.description}
                </p>
              )}
            </div>
            <ul className="mb-6 space-y-4">
              {tier.features.map((feature, featureIndex) => (
                <li
                  key={featureIndex}
                  className="flex items-center gap-2"
                >
                  {feature.included ? (
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
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                      style={{ color: `${themeStyles?.text}60` }}
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                  <span
                    style={{ 
                      color: feature.included ? themeStyles?.text : `${themeStyles?.text}60`
                    }}
                  >
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href={tier.ctaLink}
              className={`inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:opacity-90`}
              style={{
                backgroundColor: tier.highlighted ? themeStyles?.primary : themeStyles?.background,
                color: tier.highlighted ? '#ffffff' : themeStyles?.text,
                border: tier.highlighted ? 'none' : `1px solid ${themeStyles?.text}20`,
              }}
            >
              {tier.ctaText}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
} 