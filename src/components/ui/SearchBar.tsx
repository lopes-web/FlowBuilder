
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onSearch, placeholder = "Search widgets...", className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search when user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className={cn(
        "relative flex items-center w-full max-w-md transition-all duration-200",
        isFocused && "scale-[1.02]",
        className
      )}
    >
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <Search size={18} />
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "pl-10 py-6 rounded-full bg-secondary border-0",
            "focus:ring-2 focus:ring-primary/30 focus:outline-none",
            "glass-input",
            "placeholder:text-muted-foreground"
          )}
        />
        
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full"
          >
            <X size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
