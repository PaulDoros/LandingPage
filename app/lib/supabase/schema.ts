export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      landing_pages: {
        Row: {
          id: string;
          user_id: string;
          theme: Json;
          sections: Json;
          meta: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme: Json;
          sections: Json;
          meta: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: Json;
          sections?: Json;
          meta?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      carousel_images: {
        Row: {
          id: string;
          landing_page_id: string;
          url: string;
          alt: string;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          landing_page_id: string;
          url: string;
          alt: string;
          order: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          landing_page_id?: string;
          url?: string;
          alt?: string;
          order?: number;
          created_at?: string;
        };
      };
    };
  };
} 