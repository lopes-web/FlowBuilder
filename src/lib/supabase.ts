import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
    debug: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
  },
});

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
};

// Widget helpers
export const createWidget = async (widgetData: {
  name: string;
  description?: string;
  thumbnail_url?: string;
  elementor_code: any;
  is_public: boolean;
  categories: string[];
  tags: string[];
}) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { name, description, thumbnail_url, elementor_code, is_public, categories, tags } = widgetData;

  // Start a transaction
  const { data: widget, error: widgetError } = await supabase
    .from('widgets')
    .insert({
      name,
      description,
      thumbnail_url,
      elementor_code,
      is_public,
      user_id: user.id
    })
    .select()
    .single();

  if (widgetError) throw widgetError;

  // Add categories
  if (categories.length > 0) {
    const { error: categoriesError } = await supabase
      .from('widget_categories')
      .insert(
        categories.map(categoryId => ({
          widget_id: widget.id,
          category_id: categoryId
        }))
      );

    if (categoriesError) throw categoriesError;
  }

  // Add tags
  if (tags.length > 0) {
    const { error: tagsError } = await supabase
      .from('widget_tags')
      .insert(
        tags.map(tagId => ({
          widget_id: widget.id,
          tag_id: tagId
        }))
      );

    if (tagsError) throw tagsError;
  }

  return widget;
};

// Category helpers
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
};

// Tag helpers
export const getTags = async () => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}; 