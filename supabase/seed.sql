-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create a trigger to create a profile when a user signs up
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role)
    VALUES (NEW.id, 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER create_profile_on_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_profile_for_user();

-- Create function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_profiles_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_profiles_updated_at_column();

-- Create default admin user
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@example.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- Set admin role for the default user
INSERT INTO public.profiles (id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@example.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Insert a default landing page
INSERT INTO landing_pages (
    id,
    user_id,
    theme,
    sections,
    meta
) VALUES (
    gen_random_uuid(),
    NULL, -- This will be updated when a user claims this page
    '{
        "colors": {
            "primary": "#3b82f6",
            "secondary": "#1e40af",
            "background": "#ffffff",
            "text": "#000000",
            "accent": "#f59e0b"
        },
        "typography": {
            "fontFamily": "Inter",
            "fontSize": {
                "base": "16px",
                "heading1": "48px",
                "heading2": "36px",
                "heading3": "24px",
                "paragraph": "16px"
            }
        }
    }'::jsonb,
    '[
        {
            "id": "hero-1",
            "type": "hero",
            "order": 1,
            "isVisible": true,
            "content": {
                "title": "Welcome to Your Landing Page",
                "subtitle": "Create beautiful, responsive landing pages in minutes",
                "ctaText": "Get Started",
                "ctaLink": "/authenticate/admin",
                "imageUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop"
            },
            "styles": {}
        },
        {
            "id": "features-1",
            "type": "features",
            "order": 2,
            "isVisible": true,
            "content": {
                "title": "Amazing Features",
                "subtitle": "Everything you need to create the perfect landing page",
                "features": [
                    {
                        "title": "Easy Customization",
                        "description": "Customize every aspect of your landing page with our intuitive editor",
                        "icon": "https://api.iconify.design/heroicons:paint-brush.svg"
                    },
                    {
                        "title": "Responsive Design",
                        "description": "Your landing page looks great on all devices, from mobile to desktop",
                        "icon": "https://api.iconify.design/heroicons:device-phone-mobile.svg"
                    },
                    {
                        "title": "Fast Loading",
                        "description": "Optimized for speed to ensure your visitors have the best experience",
                        "icon": "https://api.iconify.design/heroicons:rocket-launch.svg"
                    }
                ]
            },
            "styles": {}
        },
        {
            "id": "pricing-1",
            "type": "pricing",
            "order": 3,
            "isVisible": true,
            "content": {
                "title": "Simple Pricing",
                "subtitle": "Choose the plan that works best for you",
                "tiers": [
                    {
                        "name": "Starter",
                        "price": "$0",
                        "description": "Perfect for trying out our service",
                        "features": [
                            { "name": "1 Landing Page", "included": true },
                            { "name": "Basic Analytics", "included": true },
                            { "name": "Community Support", "included": true },
                            { "name": "Custom Domain", "included": false },
                            { "name": "Advanced Analytics", "included": false }
                        ],
                        "ctaText": "Contact Us",
                        "ctaLink": "#contact"
                    },
                    {
                        "name": "Pro",
                        "price": "$29",
                        "description": "For professionals and growing businesses",
                        "features": [
                            { "name": "Unlimited Landing Pages", "included": true },
                            { "name": "Advanced Analytics", "included": true },
                            { "name": "Priority Support", "included": true },
                            { "name": "Custom Domain", "included": true },
                            { "name": "A/B Testing", "included": true }
                        ],
                        "ctaText": "Contact Us",
                        "ctaLink": "#contact",
                        "highlighted": true
                    }
                ]
            },
            "styles": {}
        },
        {
            "id": "contact-1",
            "type": "contact",
            "order": 4,
            "isVisible": true,
            "content": {
                "title": "Get in Touch",
                "subtitle": "We'd love to hear from you",
                "email": "contact@example.com",
                "phone": "+1 (555) 123-4567",
                "address": "123 Main St, City, Country",
                "formTitle": "Send us a message",
                "formSubtitle": "We'll get back to you as soon as possible"
            },
            "styles": {}
        }
    ]'::jsonb,
    '{
        "title": "Landing Page Builder - Create Your Perfect Landing Page",
        "description": "Create beautiful, responsive landing pages in minutes with our easy-to-use builder",
        "keywords": ["landing page", "website builder", "responsive design"]
    }'::jsonb
); 