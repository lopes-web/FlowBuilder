
import { MainLayout } from '@/components/layout/MainLayout';
import { AddWidgetForm } from '@/components/widgets/AddWidgetForm';
import { categories, tags } from '@/lib/data';

export default function AddWidget() {
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
          <AddWidgetForm 
            categories={categories}
            tags={tags}
          />
        </div>
      </div>
    </MainLayout>
  );
}
