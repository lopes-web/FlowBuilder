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
  FormDescription,
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
  elementor_code: z.string().optional(),
  is_public: z.boolean().default(false),
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
      elementor_code: "",
      is_public: false,
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
        elementor_code: values.elementor_code,
        is_public: values.is_public,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Widget name" {...field} />
                </FormControl>
                <FormDescription>
                  A unique name for your widget.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
                  </FormControl>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
                <FormDescription>
                  Choose a category for your widget.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
      </div>
      
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your widget..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A detailed description of what your widget does.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="elementor_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Elementor Code</FormLabel>
              <FormControl>
        <Textarea
                  placeholder="Paste your Elementor code here..." 
                  className="min-h-[200px] font-mono"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                The Elementor code that will be used to render your widget.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Widget"
        )}
      </Button>
        </div>
    </form>
    </Form>
  );
}
