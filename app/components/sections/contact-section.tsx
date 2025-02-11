interface ContactContent {
  title: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  formTitle?: string;
  formSubtitle?: string;
}

interface ContactSectionProps {
  content: ContactContent;
  themeStyles?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
}

export function ContactSection({ content, themeStyles }: ContactSectionProps) {
  const { title, subtitle, email, phone, address, formTitle, formSubtitle } = content;

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: themeStyles?.text }}
        >
          {title}
        </h2>
        {subtitle && (
          <p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            style={{ color: themeStyles?.text }}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          {formTitle && (
            <h3 
              className="text-2xl font-bold"
              style={{ color: themeStyles?.text }}
            >
              {formTitle}
            </h3>
          )}
          {formSubtitle && (
            <p 
              className="text-muted-foreground"
              style={{ color: themeStyles?.text }}
            >
              {formSubtitle}
            </p>
          )}
          <form className="space-y-6">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium mb-2"
                style={{ color: themeStyles?.text }}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full rounded-md border px-3 py-2"
                style={{ 
                  borderColor: `${themeStyles?.text}20`,
                  backgroundColor: themeStyles?.background,
                  color: themeStyles?.text
                }}
                required
              />
            </div>
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-2"
                style={{ color: themeStyles?.text }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full rounded-md border px-3 py-2"
                style={{ 
                  borderColor: `${themeStyles?.text}20`,
                  backgroundColor: themeStyles?.background,
                  color: themeStyles?.text
                }}
                required
              />
            </div>
            <div>
              <label 
                htmlFor="message" 
                className="block text-sm font-medium mb-2"
                style={{ color: themeStyles?.text }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full rounded-md border px-3 py-2"
                style={{ 
                  borderColor: `${themeStyles?.text}20`,
                  backgroundColor: themeStyles?.background,
                  color: themeStyles?.text
                }}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md px-4 py-2 font-medium transition-colors hover:opacity-90"
              style={{ 
                backgroundColor: themeStyles?.primary,
                color: '#ffffff'
              }}
            >
              Send Message
            </button>
          </form>
        </div>
        <div className="space-y-8">
          <div>
            <h3 
              className="text-2xl font-bold mb-4"
              style={{ color: themeStyles?.text }}
            >
              Contact Information
            </h3>
            <div className="space-y-4">
              {email && (
                <div className="flex items-center gap-2">
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
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span style={{ color: themeStyles?.text }}>{email}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2">
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
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span style={{ color: themeStyles?.text }}>{phone}</span>
                </div>
              )}
              {address && (
                <div className="flex items-center gap-2">
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
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span style={{ color: themeStyles?.text }}>{address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 