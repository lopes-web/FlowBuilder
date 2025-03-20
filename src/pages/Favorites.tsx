
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SearchBar } from '@/components/ui/SearchBar';
import { WidgetCard } from '@/components/ui/WidgetCard';
import { favoriteWidgets } from '@/lib/data';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Favorites() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWidgets, setFilteredWidgets] = useState(favoriteWidgets);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter widgets based on search
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredWidgets(
        favoriteWidgets.filter(
          widget => 
            widget.name.toLowerCase().includes(query) || 
            widget.description.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredWidgets(favoriteWidgets);
    }
  }, [searchQuery]);
  
  // Toggle favorite status
  const handleToggleFavorite = (id: string) => {
    // In a real app, this would update the server and remove the widget from the favorites list
    console.log(`Removed widget ${id} from favorites`);
    
    // For demo purposes, let's remove it from the filtered list
    setFilteredWidgets(filteredWidgets.filter(widget => widget.id !== id));
  };
  
  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-semibold">Favorite Widgets</h1>
          <p className="text-muted-foreground mt-2">
            Quick access to your favorite Elementor widgets
          </p>
        </div>
        
        {/* Search */}
        <div className="flex justify-between items-center">
          <SearchBar onSearch={setSearchQuery} />
          
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">
              {filteredWidgets.length} favorites
            </span>
          </div>
        </div>
        
        {/* Widgets Grid */}
        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(null).map((_, i) => (
              <div 
                key={i} 
                className="aspect-[1.5/1] rounded-xl bg-secondary/50 animate-pulse"
              />
            ))}
          </div>
        ) : filteredWidgets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWidgets.map((widget) => (
              <WidgetCard
                key={widget.id}
                widget={widget}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-xl border border-white/5 bg-secondary">
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-muted-foreground mb-4">
                <Heart size={28} />
              </div>
              <h3 className="text-lg font-medium">No favorites found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery
                  ? "No favorite widgets match your search criteria."
                  : "You haven't added any widgets to your favorites yet."
                }
              </p>
              {searchQuery ? (
                <Button
                  variant="outline"
                  className="mt-4 glass-panel"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="mt-4 glass-panel"
                  onClick={() => window.location.href = '/'}
                >
                  Browse your widgets
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
