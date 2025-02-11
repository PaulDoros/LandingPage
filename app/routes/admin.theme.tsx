import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData, Link, useNavigation } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { useState, useEffect } from 'react';

interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      base: string;
      heading1: string;
      heading2: string;
      heading3: string;
      paragraph: string;
    };
  };
}

interface LoaderData {
  theme: Theme;
  themeId: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  // Get the current theme
  const { data: theme, error } = await supabase
    .from('themes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // If no theme exists, create a default one
  if (error?.code === 'PGRST116') {
    const defaultTheme = {
      primary_color: '#3b82f6',
      secondary_color: '#1e40af',
      background_color: '#ffffff',
      text_color: '#000000',
      accent_color: '#f59e0b',
      font_family: 'Inter',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: newTheme, error: insertError } = await supabase
      .from('themes')
      .insert(defaultTheme)
      .select()
      .single();

    if (insertError || !newTheme) {
      console.error('Error creating default theme:', insertError);
      throw new Error('Failed to create default theme');
    }

    return json<LoaderData>({
      theme: {
        colors: {
          primary: newTheme.primary_color,
          secondary: newTheme.secondary_color,
          background: newTheme.background_color,
          text: newTheme.text_color,
          accent: newTheme.accent_color,
        },
        typography: {
          fontFamily: newTheme.font_family,
          fontSize: {
            base: '16px',
            heading1: '48px',
            heading2: '36px',
            heading3: '24px',
            paragraph: '16px',
          }
        }
      },
      themeId: newTheme.id
    }, {
      headers: response.headers
    });
  }

  if (error || !theme) {
    console.error('Error loading theme:', error);
    throw new Error('Theme not found');
  }

  return json<LoaderData>({
    theme: {
      colors: {
        primary: theme.primary_color,
        secondary: theme.secondary_color,
        background: theme.background_color,
        text: theme.text_color,
        accent: theme.accent_color,
      },
      typography: {
        fontFamily: theme.font_family,
        fontSize: {
          base: '16px',
          heading1: '48px',
          heading2: '36px',
          heading3: '24px',
          paragraph: '16px',
        }
      }
    },
    themeId: theme.id
  }, {
    headers: response.headers
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const formData = await request.formData();
  const themeId = formData.get('themeId')?.toString();

  if (!themeId) {
    return json(
      { error: 'Theme ID is required' },
      { status: 400, headers: response.headers }
    );
  }

  try {
    // Map form field names to database column names
    const updateData = {
      primary_color: formData.get('primary')?.toString().toLowerCase(),
      secondary_color: formData.get('secondary')?.toString().toLowerCase(),
      background_color: formData.get('background')?.toString().toLowerCase(),
      text_color: formData.get('text')?.toString().toLowerCase(),
      accent_color: formData.get('accent')?.toString().toLowerCase(),
    };

    console.log('Updating theme colors:', updateData);

    const { error: updateError } = await supabase
      .from('themes')
      .update(updateData)
      .eq('id', themeId);

    if (updateError) {
      console.error('Error updating theme:', updateError);
      return json(
        { error: updateError.message },
        { status: 400, headers: response.headers }
      );
    }

    return json(
      { success: true },
      { headers: response.headers }
    );
  } catch (error) {
    console.error('Error in action:', error);
    return json(
      { error: 'Failed to update theme' },
      { status: 500, headers: response.headers }
    );
  }
}

export default function AdminTheme() {
  const { theme, themeId } = useLoaderData<typeof loader>();
  const { colors } = theme;
  const [previewStyles, setPreviewStyles] = useState(colors);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  // Handle color change from either color picker or text input
  const handleColorChange = (value: string, type: keyof typeof colors, isFromPicker = false) => {
    let newValue = value.toLowerCase();
    
    // If from text input, handle # prefix
    if (!isFromPicker) {
      newValue = newValue.startsWith('#') ? newValue : `#${newValue}`;
    }
    
    // Validate hex color format
    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(newValue);
    
    if (isValidHex) {
      setPreviewStyles(prev => ({ ...prev, [type]: newValue }));
    }
  };

  // Set initial colors
  useEffect(() => {
    setPreviewStyles(colors);
  }, [colors]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Theme Colors</h1>
        <div className="flex gap-4">
          <Link
            to="/admin"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <Form method="post" className="space-y-8">
        <input type="hidden" name="themeId" value={themeId} />
        
        {/* Colors */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(previewStyles).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label htmlFor={key} className="block text-sm font-medium capitalize">
                  {key} Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name={key}
                    id={`${key}-picker`}
                    value={value}
                    onChange={(e) => handleColorChange(e.target.value, key as keyof typeof colors, true)}
                    className="h-10 w-20"
                  />
                  <input
                    type="text"
                    name={key}
                    id={key}
                    value={value}
                    onChange={(e) => handleColorChange(e.target.value, key as keyof typeof colors, false)}
                    placeholder="Enter hex color (#RRGGBB)"
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">↻</span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </Form>
    </div>
  );
} 