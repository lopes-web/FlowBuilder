
import { useState } from 'react';
import { Heart, Copy, Eye, Share2, Trash2 } from 'lucide-react';
import { Widget } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ToastAction } from '@/components/ui/toast';

interface WidgetCardProps {
  widget: Widget;
  onToggleFavorite?: (id: string) => void;
}

export function WidgetCard({ widget, onToggleFavorite }: WidgetCardProps) {
  const [isFavorite, setIsFavorite] = useState(widget.isFavorite);
  const [isHovering, setIsHovering] = useState(false);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(widget.id);
    }
    
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: widget.name,
      action: (
        <ToastAction altText="Undo" onClick={() => {
          setIsFavorite(isFavorite);
          if (onToggleFavorite) onToggleFavorite(widget.id);
        }}>
          Undo
        </ToastAction>
      )
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(widget.elementorCode);
    toast({
      title: "Copied to clipboard",
      description: "Widget code has been copied to your clipboard"
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl bg-card border border-white/5",
        "transition-all duration-200",
        "hover:border-primary/20"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Card Image Area */}
      <div className="aspect-video w-full overflow-hidden relative">
        <img
          src={widget.thumbnail}
          alt={widget.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay for hover actions */}
        <div className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-2 transition-opacity duration-200",
          isHovering ? "opacity-100" : "opacity-0"
        )}>
          <Button 
            size="sm" 
            variant="outline" 
            className="glass-panel text-white border-white/20 hover:bg-white/20 hover:text-white"
            onClick={handleCopyCode}
          >
            <Copy size={14} className="mr-1" /> Copy
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="glass-panel text-white border-white/20 hover:bg-white/20 hover:text-white"
          >
            <Eye size={14} className="mr-1" /> Preview
          </Button>
        </div>
        
        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full transition-all duration-200",
            isFavorite 
              ? "bg-primary/20 text-primary hover:bg-primary/30" 
              : "bg-black/40 text-white hover:bg-black/60"
          )}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        
        {/* Category pill */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
            {widget.categories.length > 0 ? widget.categories[0] : 'Uncategorized'}
          </span>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-foreground line-clamp-1">{widget.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{widget.description}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 1.5C1.5 1.89782 1.65804 2.27936 1.93934 2.56066C2.22064 2.84196 2.60218 3 3 3C3.39782 3 3.77936 2.84196 4.06066 2.56066C4.34196 2.27936 4.5 1.89782 4.5 1.5C4.5 1.10218 4.34196 0.720644 4.06066 0.43934C3.77936 0.158035 3.39782 0 3 0C2.60218 0 2.22064 0.158035 1.93934 0.43934C1.65804 0.720644 1.5 1.10218 1.5 1.5Z" fill="currentColor"/>
                  <path d="M6 1.5C6 1.89782 6.15804 2.27936 6.43934 2.56066C6.72064 2.84196 7.10218 3 7.5 3C7.89782 3 8.27936 2.84196 8.56066 2.56066C8.84196 2.27936 9 1.89782 9 1.5C9 1.10218 8.84196 0.720644 8.56066 0.43934C8.27936 0.158035 7.89782 0 7.5 0C7.10218 0 6.72064 0.158035 6.43934 0.43934C6.15804 0.720644 6 1.10218 6 1.5Z" fill="currentColor"/>
                  <path d="M10.5 1.5C10.5 1.89782 10.658 2.27936 10.9393 2.56066C11.2206 2.84196 11.6022 3 12 3C12.3978 3 12.7794 2.84196 13.0607 2.56066C13.342 2.27936 13.5 1.89782 13.5 1.5C13.5 1.10218 13.342 0.720644 13.0607 0.43934C12.7794 0.158035 12.3978 0 12 0C11.6022 0 11.2206 0.158035 10.9393 0.43934C10.658 0.720644 10.5 1.10218 10.5 1.5Z" fill="currentColor"/>
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleCopyCode}>
                <Copy size={14} className="mr-2" /> Copy code
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 size={14} className="mr-2" /> Share
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 size={14} className="mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Tags */}
        {widget.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {widget.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent text-muted-foreground">
                {tag}
              </span>
            ))}
            {widget.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent text-muted-foreground">
                +{widget.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center">
            <img 
              src={widget.author.avatar} 
              alt={widget.author.name}
              className="w-5 h-5 rounded-full mr-2"
            />
            <span>{widget.author.name}</span>
          </div>
          <span>Updated {formatDate(widget.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
