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
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            {subtitle}
          </p>
        )}
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="border-border/40 bg-card rounded-lg border p-6"
          >
            <div className="mb-6">
              <svg
                className="text-primary h-8 w-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <blockquote className="mb-4 text-lg">
              {testimonial.quote}
            </blockquote>
            <div className="flex items-center">
              {testimonial.avatar && (
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="mr-4 h-12 w-12 rounded-full object-cover"
                />
              )}
              <div>
                <div className="font-semibold">{testimonial.author}</div>
                {(testimonial.title || testimonial.company) && (
                  <div className="text-muted-foreground text-sm">
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
