export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      widgets: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          thumbnail_url: string | null;
          elementor_code: any;
          is_public: boolean;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          thumbnail_url?: string | null;
          elementor_code: any;
          is_public?: boolean;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          thumbnail_url?: string | null;
          elementor_code?: any;
          is_public?: boolean;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      widget_categories: {
        Row: {
          widget_id: string;
          category_id: string;
          created_at: string;
        };
        Insert: {
          widget_id: string;
          category_id: string;
          created_at?: string;
        };
        Update: {
          widget_id?: string;
          category_id?: string;
          created_at?: string;
        };
      };
      widget_tags: {
        Row: {
          widget_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          widget_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          widget_id?: string;
          tag_id?: string;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          user_id: string;
          widget_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          widget_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          widget_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 