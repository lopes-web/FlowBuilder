import { useState, useEffect } from 'react';
import { Grid, ListFilter } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SearchBar } from '@/components/ui/SearchBar';
import { CategoryFilter } from '@/components/ui/CategoryFilter';
import { WidgetCard } from '@/components/ui/WidgetCard';
import { myWidgets, categories, tags } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CreateWidgetModal } from '@/components/widgets/CreateWidgetModal';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredWidgets, setFilteredWidgets] = useState(myWidgets);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter widgets based on search, categories, and tags
  useEffect(() => {
    let filtered = [...myWidgets];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        widget => 
          widget.name.toLowerCase().includes(query) || 
          widget.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        widget => widget.categories.some(cat => selectedCategories.includes(cat))
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(
        widget => widget.tags.some(tag => selectedTags.includes(tag))
      );
    }
    
    setFilteredWidgets(filtered);
  }, [searchQuery, selectedCategories, selectedTags]);
  
  // Toggle favorite status
  const handleToggleFavorite = (id: string) => {
    // In a real app, this would update the server
    console.log(`Toggled favorite status for widget ${id}`);
  };
  
  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-semibold">My Widgets</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your Elementor widgets collection
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <SearchBar onSearch={setSearchQuery} />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="md:hidden glass-panel"
          >
            <ListFilter size={16} className="mr-2" />
            {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          <div className={cn(
            "w-full md:w-auto transition-all duration-200",
            isFiltersVisible ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0 md:max-h-[200px] md:opacity-100 overflow-hidden'
          )}>
            <CategoryFilter
              categories={categories}
              tags={tags}
              onCategoryChange={setSelectedCategories}
              onTagChange={setSelectedTags}
            />
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel rounded-xl p-5">
            <h3 className="text-muted-foreground">Total Widgets</h3>
            <p className="text-3xl font-bold mt-1">{myWidgets.length}</p>
          </div>
          
          <div className="glass-panel rounded-xl p-5">
            <h3 className="text-muted-foreground">Categories</h3>
            <p className="text-3xl font-bold mt-1">{categories.length}</p>
          </div>
          
          <div className="glass-panel rounded-xl p-5">
            <h3 className="text-muted-foreground">Recent Updates</h3>
            <p className="text-3xl font-bold mt-1">3 days ago</p>
          </div>
        </div>
        
        {/* Widgets Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Your Widgets</h2>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {filteredWidgets.length} widgets
              </span>
              
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Grid size={20} />
                </Button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(null).map((_, i) => (
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
                <h3 className="text-lg font-medium">No widgets found</h3>
                <p className="text-muted-foreground mt-2">
                  {searchQuery || selectedCategories.length > 0 || selectedTags.length > 0
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "You haven't created any widgets yet. Start by adding your first widget."
                  }
                </p>
                {searchQuery || selectedCategories.length > 0 || selectedTags.length > 0 ? (
                  <Button
                    variant="outline"
                    className="mt-4 glass-panel"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategories([]);
                      setSelectedTags([]);
                    }}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Button 
                    className="mt-4"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Create Widget
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateWidgetModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </MainLayout>
  );
}
