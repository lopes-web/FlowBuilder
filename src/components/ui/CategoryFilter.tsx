
import { useState } from 'react';
import { Tag, Filter, X } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Category, Tag as TagType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  tags: TagType[];
  onCategoryChange: (selectedCategories: string[]) => void;
  onTagChange: (selectedTags: string[]) => void;
}

export function CategoryFilter({ 
  categories, 
  tags, 
  onCategoryChange, 
  onTagChange 
}: CategoryFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const handleCategoryChange = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelectedCategories);
    onCategoryChange(newSelectedCategories);
  };

  const handleTagChange = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newSelectedTags);
    onTagChange(newSelectedTags);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    onCategoryChange([]);
    onTagChange([]);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Categories Dropdown */}
      <DropdownMenu 
        open={showCategoryDropdown} 
        onOpenChange={setShowCategoryDropdown}
      >
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "gap-1.5 bg-secondary border-0 glass-input",
              selectedCategories.length > 0 && "bg-primary/10 text-primary"
            )}
          >
            <Filter size={14} /> 
            Categories 
            {selectedCategories.length > 0 && (
              <span className="ml-1 flex items-center justify-center rounded-full bg-primary text-white w-5 h-5 text-xs">
                {selectedCategories.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {categories.map((category) => (
            <DropdownMenuCheckboxItem
              key={category.id}
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={() => handleCategoryChange(category.id)}
            >
              <span className="flex-1">{category.name}</span>
              <span className="text-xs text-muted-foreground">{category.count}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Tags Dropdown */}
      <DropdownMenu 
        open={showTagDropdown} 
        onOpenChange={setShowTagDropdown}
      >
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "gap-1.5 bg-secondary border-0 glass-input",
              selectedTags.length > 0 && "bg-primary/10 text-primary"
            )}
          >
            <Tag size={14} /> 
            Tags 
            {selectedTags.length > 0 && (
              <span className="ml-1 flex items-center justify-center rounded-full bg-primary text-white w-5 h-5 text-xs">
                {selectedTags.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {tags.map((tag) => (
            <DropdownMenuCheckboxItem
              key={tag.id}
              checked={selectedTags.includes(tag.id)}
              onCheckedChange={() => handleTagChange(tag.id)}
            >
              <span className="flex-1">{tag.name}</span>
              <span className="text-xs text-muted-foreground">{tag.count}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Filters */}
      {(selectedCategories.length > 0 || selectedTags.length > 0) && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          Clear filters
        </Button>
      )}
      
      {/* Active Filters */}
      <div className="flex flex-wrap gap-1.5 ml-2">
        {selectedCategories.length > 0 && categories
          .filter(category => selectedCategories.includes(category.id))
          .map(category => (
            <span 
              key={category.id}
              className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
            >
              {category.name}
              <button 
                onClick={() => handleCategoryChange(category.id)}
                className="rounded-full hover:bg-primary/20 p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          ))
        }
        
        {selectedTags.length > 0 && tags
          .filter(tag => selectedTags.includes(tag.id))
          .map(tag => (
            <span 
              key={tag.id}
              className="flex items-center gap-1 text-xs bg-accent text-muted-foreground px-2 py-1 rounded-full"
            >
              {tag.name}
              <button 
                onClick={() => handleTagChange(tag.id)}
                className="rounded-full hover:bg-accent/80 p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          ))
        }
      </div>
    </div>
  );
}
