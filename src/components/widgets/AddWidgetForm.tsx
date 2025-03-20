import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { createWidget } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category_id: z.string({
    required_error: "Please select a category.",
  }),
  tag_ids: z.array(z.string()).optional(),
})

interface AddWidgetFormProps {
  categories: Category[];
  tags: TagType[];
  onSuccess?: () => void;
}

export function AddWidgetForm({ categories, tags, onSuccess }: AddWidgetFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category_id: "",
      tag_ids: [],
    },
  })

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      let thumbnail_url = null;
      
      // Upload thumbnail if exists
      if (thumbnail) {
        const fileExt = thumbnail.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `widget-thumbnails/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('widgets')
          .upload(filePath, thumbnail);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('widgets')
          .getPublicUrl(filePath);
          
        thumbnail_url = publicUrl;
      }
      
      // Create widget
      await createWidget({
        name: values.name,
        description: values.description,
        thumbnail_url,
        elementor_code: values.elementorCode,
        is_public: values.isPublic,
        categories: values.category_id ? [values.category_id] : [],
        tags: values.tag_ids
      });
      
      toast({
        title: "Widget created",
        description: "Your widget has been successfully created",
      });
      
      // Call onSuccess callback if provided
      onSuccess?.();
      
    } catch (error) {
      console.error('Error creating widget:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create widget. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        
        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter widget description"
            className="glass-input min-h-[100px]"
          />
        </div>
        
        {/* Elementor Code */}
        <div className="space-y-2">
          <Label htmlFor="elementorCode">Elementor Code</Label>
          <Textarea
            id="elementorCode"
            name="elementorCode"
            value={formData.elementorCode}
            onChange={handleChange}
            placeholder="Paste your Elementor widget code here"
            className="glass-input min-h-[200px] font-mono"
            required
          />
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
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tagName}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tagId)}
                      className="hover:text-primary/80"
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
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomTag();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCustomTag}
              disabled={!customTag.trim()}
            >
              Add
            </Button>
          </div>
        </div>
        
        {/* Visibility */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleCheckboxChange}
            className="rounded border-white/20 bg-white/5"
          />
          <Label htmlFor="isPublic" className="text-sm font-normal">
            Make this widget public
          </Label>
        </div>
        
        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Widget"
          )}
        </Button>
      </form>
    </Form>
  );
}
