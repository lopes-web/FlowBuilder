import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AddWidgetForm } from '@/components/widgets/AddWidgetForm';
import { getCategories, getTags } from '@/lib/supabase';
import { Category, Tag } from '@/lib/types';

export default function AddWidget() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getCategories(),
          getTags()
        ]);

        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-semibold">Add New Widget</h1>
          <p className="text-muted-foreground mt-2">
            Create and save a new Elementor widget to your collection
          </p>
        </div>
        
        {/* Add Widget Form */}
        <div className="glass-panel rounded-xl p-6 border border-white/5">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <AddWidgetForm 
              categories={categories}
              tags={tags}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
