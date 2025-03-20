
import { useState } from 'react';
import { Upload, Tag, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Category, Tag as TagType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AddWidgetFormProps {
  categories: Category[];
  tags: TagType[];
}

export function AddWidgetForm({ categories, tags }: AddWidgetFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    elementorCode: '',
    isPublic: false
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setThumbnailPreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleAddCustomTag = () => {
    if (customTag && customTag.trim() !== '') {
      // In a real app, we would validate and create a new tag
      // For now, let's just add it to selectedTags
      const newTagId = `new-${customTag.toLowerCase().replace(/\s+/g, '-')}`;
      
      if (!selectedTags.includes(newTagId)) {
        setSelectedTags([...selectedTags, newTagId]);
      }
      
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the data to your backend
      // For demo purposes, let's simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Widget created",
        description: "Your widget has been successfully created",
      });
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        description: '',
        elementorCode: '',
        isPublic: false
      });
      setThumbnail(null);
      setThumbnailPreview('');
      setSelectedTags([]);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create widget. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Thumbnail Upload */}
      <div className="space-y-2">
        <Label htmlFor="thumbnail">Widget Thumbnail</Label>
        <div className="flex items-center gap-4">
          <div 
            className={cn(
              "relative flex flex-col items-center justify-center w-48 h-32 rounded-lg border-2 border-dashed",
              "transition-colors duration-200 cursor-pointer overflow-hidden",
              thumbnailPreview ? "border-primary/30" : "border-white/10 hover:border-white/20"
            )}
          >
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {thumbnailPreview ? (
              <div className="relative w-full h-full">
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnail(null);
                    setThumbnailPreview('');
                  }}
                  className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white p-1 rounded-full"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={24} className="text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Upload thumbnail
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Recommended size: 600×400
                </span>
              </>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>A thumbnail helps users quickly identify your widget.</p>
            <p className="mt-1">We recommend using a clear, high-quality image that showcases your widget's appearance.</p>
          </div>
        </div>
      </div>
      
      {/* Widget Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Widget Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter widget name"
          className="glass-input"
          required
        />
      </div>
      
      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger className="glass-input">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagSelect(tag.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-colors duration-200",
                selectedTags.includes(tag.id)
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-muted-foreground hover:bg-accent"
              )}
            >
              {tag.name}
            </button>
          ))}
        </div>
        
        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
            {selectedTags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              const tagName = tag ? tag.name : tagId.replace('new-', '').split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ');
              
              return (
                <span
                  key={tagId}
                  className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {tagName}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tagId)}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </span>
              );
            })}
          </div>
        )}
        
        {/* Custom Tag Input */}
        <div className="flex gap-2">
          <Input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Add custom tag"
            className="glass-input"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAddCustomTag}
            disabled={!customTag.trim()}
            className="glass-panel hover:bg-primary/10 hover:text-primary"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your widget"
          className="min-h-[100px] glass-input"
        />
      </div>
      
      {/* Elementor Code */}
      <div className="space-y-2">
        <Label htmlFor="elementorCode">Elementor JSON Code</Label>
        <Textarea
          id="elementorCode"
          name="elementorCode"
          value={formData.elementorCode}
          onChange={handleChange}
          placeholder='Paste your Elementor JSON code here. Example: {"id":"123","elements":[...]}'
          className="min-h-[200px] font-mono text-sm glass-input"
          required
        />
      </div>
      
      {/* Public Toggle */}
      <div className="flex items-center space-x-2">
        <input
          id="isPublic"
          name="isPublic"
          type="checkbox"
          checked={formData.isPublic}
          onChange={handleCheckboxChange}
          className="rounded bg-secondary border-white/10 focus:ring-primary focus:ring-offset-0"
        />
        <Label htmlFor="isPublic">Share with community</Label>
      </div>
      
      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full sm:w-auto transition-all duration-300 relative overflow-hidden"
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Widget...
          </span>
        ) : (
          <span>Create Widget</span>
        )}
      </Button>
    </form>
  );
}
