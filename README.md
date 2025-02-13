# Landing Page Builder

A modern, customizable landing page builder built with Remix, Supabase, and
TailwindCSS. This application allows users to create and customize their landing
pages with a user-friendly admin interface.

## Features

- 🎨 Fully customizable landing page
- 🔒 Secure admin authentication
- 🎯 Drag-and-drop section editor
- 🎨 Theme customization
- 📱 Responsive design
- 🔄 Real-time preview
- 📱 QR code generator
- 🚀 Easy deployment to Vercel

## Tech Stack

- **Framework**: [Remix](https://remix.run)
- **Database**: [Supabase](https://supabase.com)
- **Styling**: [TailwindCSS](https://tailwindcss.com)
- **Authentication**: Supabase Auth
- **Deployment**: [Vercel](https://vercel.com)

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd landing-page-builder
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a Supabase project and set up the following environment variables in a
   `.env` file:

   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database schema in Supabase:

   ```sql
   -- Create landing_pages table
   create table landing_pages (
     id uuid default uuid_generate_v4() primary key,
     title text not null,
     description text,
     primary_color text,
     secondary_color text,
     logo text,
     sections jsonb[]
   );

   -- Create themes table
   create table themes (
     id uuid default uuid_generate_v4() primary key,
     primary_color text not null,
     secondary_color text not null,
     accent_color text not null,
     text_color text not null,
     background_color text not null,
     font_family text not null
   );
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
app/
├── components/         # Reusable components
│   ├── ui/            # UI components
│   └── qr-code-generator.tsx
├── lib/               # Utility functions and configurations
│   └── supabase/      # Supabase client and types
├── routes/            # Application routes
│   ├── _index.tsx     # Landing page
│   ├── admin.tsx      # Admin layout
│   ├── admin._index.tsx    # Admin dashboard
│   ├── admin.theme.tsx     # Theme customization
│   ├── admin.qr-code.tsx   # QR code generator
│   └── authenticate.admin.tsx  # Admin authentication
└── styles/            # Global styles and Tailwind configuration
    └── globals.css
```

## Features in Detail

### Landing Page

- Customizable sections
- Dynamic content loading
- Responsive design
- Theme integration

### Admin Dashboard

- Secure authentication
- Real-time preview
- Theme customization
- Section management
- QR code generator

### Theme Customization

- Color picker for primary, secondary, and accent colors
- Font family selection
- Background color customization
- Live preview

### QR Code Generator

- Custom URL input
- Color customization
- Size adjustment
- Download as PNG

## Deployment

1. Create a new project on Vercel
2. Connect your repository
3. Set up environment variables
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For support, please open an issue in the repository or contact the maintainers.
