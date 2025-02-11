INSERT INTO landing_pages (id, user_id, theme, sections, meta) 
VALUES (
    gen_random_uuid(),
    NULL,
    jsonb_build_object(
        'colors', jsonb_build_object(
            'primary', '#3b82f6',
            'secondary', '#1e40af',
            'background', '#ffffff',
            'text', '#000000',
            'accent', '#f59e0b'
        ),
        'typography', jsonb_build_object(
            'fontFamily', 'Inter',
            'fontSize', jsonb_build_object(
                'base', '16px',
                'heading1', '48px',
                'heading2', '36px',
                'heading3', '24px',
                'paragraph', '16px'
            )
        )
    ),
    jsonb_build_array(
        jsonb_build_object(
            'id', 'hero-1',
            'type', 'hero',
            'order', 1,
            'isVisible', true,
            'content', jsonb_build_object(
                'title', 'Welcome to Your Landing Page',
                'subtitle', 'Create beautiful, responsive landing pages in minutes',
                'ctaText', 'Get Started',
                'ctaLink', '/authenticate/sign-up',
                'imageUrl', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop'
            ),
            'styles', '{}'::jsonb
        ),
        jsonb_build_object(
            'id', 'features-1',
            'type', 'features',
            'order', 2,
            'isVisible', true,
            'content', jsonb_build_object(
                'title', 'Amazing Features',
                'subtitle', 'Everything you need to create the perfect landing page',
                'features', jsonb_build_array(
                    jsonb_build_object(
                        'title', 'Easy Customization',
                        'description', 'Customize every aspect of your landing page with our intuitive editor',
                        'icon', 'https://api.iconify.design/heroicons:paint-brush.svg'
                    ),
                    jsonb_build_object(
                        'title', 'Responsive Design',
                        'description', 'Your landing page looks great on all devices, from mobile to desktop',
                        'icon', 'https://api.iconify.design/heroicons:device-phone-mobile.svg'
                    ),
                    jsonb_build_object(
                        'title', 'Fast Loading',
                        'description', 'Optimized for speed to ensure your visitors have the best experience',
                        'icon', 'https://api.iconify.design/heroicons:rocket-launch.svg'
                    )
                )
            ),
            'styles', '{}'::jsonb
        ),
        jsonb_build_object(
            'id', 'pricing-1',
            'type', 'pricing',
            'order', 3,
            'isVisible', true,
            'content', jsonb_build_object(
                'title', 'Simple Pricing',
                'subtitle', 'Choose the plan that works best for you',
                'tiers', jsonb_build_array(
                    jsonb_build_object(
                        'name', 'Starter',
                        'price', '$0',
                        'description', 'Perfect for trying out our service',
                        'features', jsonb_build_array(
                            jsonb_build_object('name', '1 Landing Page', 'included', true),
                            jsonb_build_object('name', 'Basic Analytics', 'included', true),
                            jsonb_build_object('name', 'Community Support', 'included', true),
                            jsonb_build_object('name', 'Custom Domain', 'included', false),
                            jsonb_build_object('name', 'Advanced Analytics', 'included', false)
                        ),
                        'ctaText', 'Start Free',
                        'ctaLink', '/authenticate/sign-up'
                    ),
                    jsonb_build_object(
                        'name', 'Pro',
                        'price', '$29',
                        'description', 'For professionals and growing businesses',
                        'features', jsonb_build_array(
                            jsonb_build_object('name', 'Unlimited Landing Pages', 'included', true),
                            jsonb_build_object('name', 'Advanced Analytics', 'included', true),
                            jsonb_build_object('name', 'Priority Support', 'included', true),
                            jsonb_build_object('name', 'Custom Domain', 'included', true),
                            jsonb_build_object('name', 'A/B Testing', 'included', true)
                        ),
                        'ctaText', 'Get Started',
                        'ctaLink', '/authenticate/sign-up',
                        'highlighted', true
                    )
                )
            ),
            'styles', '{}'::jsonb
        ),
        jsonb_build_object(
            'id', 'contact-1',
            'type', 'contact',
            'order', 4,
            'isVisible', true,
            'content', jsonb_build_object(
                'title', 'Get in Touch',
                'subtitle', 'We would love to hear from you',
                'email', 'contact@example.com',
                'phone', '+1 (555) 123-4567',
                'address', '123 Main St, City, Country',
                'formTitle', 'Send us a message',
                'formSubtitle', 'We will get back to you as soon as possible'
            ),
            'styles', '{}'::jsonb
        )
    ),
    jsonb_build_object(
        'title', 'Landing Page Builder - Create Your Perfect Landing Page',
        'description', 'Create beautiful, responsive landing pages in minutes with our easy-to-use builder',
        'keywords', jsonb_build_array('landing page', 'website builder', 'responsive design')
    )
); 