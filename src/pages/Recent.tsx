
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { WidgetCard } from '@/components/ui/WidgetCard';
import { recentWidgets } from '@/lib/data';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Recent() {
  const [isLoading, setIsLoading] = useState(true);
  const [widgets, setWidgets] = useState(recentWidgets);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Toggle favorite status
  const handleToggleFavorite = (id: string) => {
    // In a real app, this would update the server
    console.log(`Toggled favorite status for widget ${id}`);
  };
  
  // Group widgets by date (today, yesterday, this week, earlier)
  const groupedWidgets = widgets.reduce((acc, widget) => {
    const updatedDate = new Date(widget.updatedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let group = 'Earlier';
    
    if (updatedDate.toDateString() === today.toDateString()) {
      group = 'Today';
    } else if (updatedDate.toDateString() === yesterday.toDateString()) {
      group = 'Yesterday';
    } else if (updatedDate > new Date(today.setDate(today.getDate() - 7))) {
      group = 'This Week';
    }
    
    if (!acc[group]) {
      acc[group] = [];
    }
    
    acc[group].push(widget);
    return acc;
  }, {} as Record<string, typeof widgets>);
  
  // Array of groups in the order we want to display them
  const groupOrder = ['Today', 'Yesterday', 'This Week', 'Earlier'];
  
  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-semibold">Recent Widgets</h1>
          <p className="text-muted-foreground mt-2">
            Your recently created or modified Elementor widgets
          </p>
        </div>
        
        {/* Widgets Groups */}
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-8">
            {Array(2).fill(null).map((_, groupIndex) => (
              <div key={groupIndex} className="space-y-4">
                <div className="h-6 w-24 bg-secondary/50 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(3).fill(null).map((_, i) => (
                    <div 
                      key={i} 
                      className="aspect-[1.5/1] rounded-xl bg-secondary/50 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : widgets.length > 0 ? (
          <div className="space-y-10">
            {groupOrder.map(group => 
              groupedWidgets[group] && (
                <div key={group} className="space-y-4">
                  <h2 className="text-xl font-medium">{group}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedWidgets[group].map(widget => (
                      <WidgetCard
                        key={widget.id}
                        widget={widget}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="py-16 text-center rounded-xl border border-white/5 bg-secondary">
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-muted-foreground mb-4">
                <Clock size={28} />
              </div>
              <h3 className="text-lg font-medium">No recent activity</h3>
              <p className="text-muted-foreground mt-2">
                You haven't created or modified any widgets recently.
              </p>
              <Button
                className="mt-4"
                onClick={() => window.location.href = '/add-widget'}
              >
                Create Widget
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
