interface Testimonial {
  quote: string;
  author: string;
  title?: string;
  company?: string;
  avatar?: string;
}

interface TestimonialsContent {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

interface TestimonialsSectionProps {
  content: TestimonialsContent;
}

export function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const { title, subtitle, testimonials } = content;

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        {subtitle && (
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="p-6 rounded-lg border border-border/40 bg-card"
          >
            <div className="mb-6">
              <svg
                className="h-8 w-8 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <blockquote className="text-lg mb-4">{testimonial.quote}</blockquote>
            <div className="flex items-center">
              {testimonial.avatar && (
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
              )}
              <div>
                <div className="font-semibold">{testimonial.author}</div>
                {(testimonial.title || testimonial.company) && (
                  <div className="text-sm text-muted-foreground">
                    {testimonial.title}
                    {testimonial.title && testimonial.company && ' at '}
                    {testimonial.company}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 