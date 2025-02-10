import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { supabase } from '~/lib/supabase/client';

interface LoaderData {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    fontFamily: string;
  };
}

interface ActionData {
  success?: boolean;
  error?: string;
}

export const loader = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/authenticate/admin');
  }

  const { data: themeData } = await supabase
    .from('themes')
    .select('*')
    .single();

  return json<LoaderData>({
    theme: themeData || {
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
      accentColor: '#f59e0b',
      textColor: '#111827',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
    },
  });
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const theme = {
    primaryColor: formData.get('primaryColor'),
    secondaryColor: formData.get('secondaryColor'),
    accentColor: formData.get('accentColor'),
    textColor: formData.get('textColor'),
    backgroundColor: formData.get('backgroundColor'),
    fontFamily: formData.get('fontFamily'),
  };

  try {
    const { error } = await supabase
      .from('themes')
      .upsert(theme, { onConflict: 'id' });

    if (error) throw error;

    return json<ActionData>({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return json<ActionData>({ error: error.message }, { status: 400 });
    }
    return json<ActionData>(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
};

export default function ThemeRoute() {
  const { theme } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-medium text-card-foreground">
            Theme Settings
          </h3>

          <Form method="post" className="space-y-6">
            {actionData?.error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {actionData.error}
              </div>
            )}
            {actionData?.success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
                Theme settings saved successfully!
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="primaryColor"
                  className="block text-sm font-medium text-foreground"
                >
                  Primary Color
                </label>
                <div className="mt-1">
                  <input
                    type="color"
                    id="primaryColor"
                    name="primaryColor"
                    defaultValue={theme.primaryColor}
                    className="h-10 w-full rounded-md border border-input"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="secondaryColor"
                  className="block text-sm font-medium text-foreground"
                >
                  Secondary Color
                </label>
                <div className="mt-1">
                  <input
                    type="color"
                    id="secondaryColor"
                    name="secondaryColor"
                    defaultValue={theme.secondaryColor}
                    className="h-10 w-full rounded-md border border-input"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="accentColor"
                  className="block text-sm font-medium text-foreground"
                >
                  Accent Color
                </label>
                <div className="mt-1">
                  <input
                    type="color"
                    id="accentColor"
                    name="accentColor"
                    defaultValue={theme.accentColor}
                    className="h-10 w-full rounded-md border border-input"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="textColor"
                  className="block text-sm font-medium text-foreground"
                >
                  Text Color
                </label>
                <div className="mt-1">
                  <input
                    type="color"
                    id="textColor"
                    name="textColor"
                    defaultValue={theme.textColor}
                    className="h-10 w-full rounded-md border border-input"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="backgroundColor"
                  className="block text-sm font-medium text-foreground"
                >
                  Background Color
                </label>
                <div className="mt-1">
                  <input
                    type="color"
                    id="backgroundColor"
                    name="backgroundColor"
                    defaultValue={theme.backgroundColor}
                    className="h-10 w-full rounded-md border border-input"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="fontFamily"
                  className="block text-sm font-medium text-foreground"
                >
                  Font Family
                </label>
                <div className="mt-1">
                  <select
                    id="fontFamily"
                    name="fontFamily"
                    defaultValue={theme.fontFamily}
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Save Theme Settings
              </button>
            </div>
          </Form>
        </div>

        {/* Theme Preview */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-medium text-card-foreground">
            Theme Preview
          </h3>
          <div
            className="space-y-4 rounded-lg border p-4"
            style={{
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
              fontFamily: theme.fontFamily,
            }}
          >
            <h4
              className="text-xl font-bold"
              style={{ color: theme.primaryColor }}
            >
              Sample Heading
            </h4>
            <p>This is how your content will look with the selected theme.</p>
            <div className="flex space-x-4">
              <button
                className="rounded-md px-4 py-2 text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Primary Button
              </button>
              <button
                className="rounded-md px-4 py-2 text-white"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                Secondary Button
              </button>
              <button
                className="rounded-md px-4 py-2 text-white"
                style={{ backgroundColor: theme.accentColor }}
              >
                Accent Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 