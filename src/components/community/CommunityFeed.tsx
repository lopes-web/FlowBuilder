
import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { WidgetCard } from '@/components/ui/WidgetCard';
import { communityWidgets, users } from '@/lib/data';
import { cn } from '@/lib/utils';

interface CommunityFeedProps {
  className?: string;
}

export function CommunityFeed({ className }: CommunityFeedProps) {
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredWidgets, setFilteredWidgets] = useState(communityWidgets);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter widgets by author
  useEffect(() => {
    if (selectedAuthor) {
      setFilteredWidgets(
        communityWidgets.filter(widget => widget.author.id === selectedAuthor)
      );
    } else {
      setFilteredWidgets(communityWidgets);
    }
  }, [selectedAuthor]);
  
  // Toggle favorite status
  const handleToggleFavorite = (id: string) => {
    // In a real app, this would update the server
    console.log(`Toggled favorite status for widget ${id}`);
  };
  
  return (
    <div className={cn("space-y-8", className)}>
      {/* Community Members */}
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Community Contributors</h2>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setSelectedAuthor(null)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
              !selectedAuthor 
                ? "bg-primary text-white" 
                : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            All Contributors
          </button>
          
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedAuthor(user.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                selectedAuthor === user.id 
                  ? "bg-primary text-white" 
                  : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-6 h-6 rounded-full"
              />
              <span>{user.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Widgets Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">
            {selectedAuthor 
              ? `${users.find(u => u.id === selectedAuthor)?.name}'s Shared Widgets` 
              : "Shared Widgets"
            }
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredWidgets.length} widgets
          </span>
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWidgets.map((widget) => (
              <WidgetCard
                key={widget.id}
                widget={widget}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
            
            {filteredWidgets.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <h3 className="text-lg font-medium">No widgets found</h3>
                <p className="text-muted-foreground mt-2">
                  {selectedAuthor 
                    ? "This user hasn't shared any widgets yet."
                    : "No widgets have been shared in the community yet."
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
