import { Widget, User, Category, Tag } from './types';

// Mock current user
export const currentUser: User = {
  id: "user-1",
  name: "Alex Morgan",
  email: "alex@example.com",
  avatar: "https://ui-avatars.com/api/?name=Alex+Morgan&background=0077ED&color=fff",
  bio: "Elementor enthusiast and web designer with 5+ years of experience.",
  widgetCount: 0,
  joinedAt: "2023-01-15T00:00:00Z"
};

// Mock categories
export const categories: Category[] = [
  { id: "cat-1", name: "Headers", count: 0 },
  { id: "cat-2", name: "Footers", count: 0 },
  { id: "cat-3", name: "Hero Sections", count: 0 },
  { id: "cat-4", name: "Pricing Tables", count: 0 },
  { id: "cat-5", name: "Testimonials", count: 0 },
  { id: "cat-6", name: "Contact Forms", count: 0 },
  { id: "cat-7", name: "Image Galleries", count: 0 },
  { id: "cat-8", name: "Call to Action", count: 0 }
];

// Mock tags
export const tags: Tag[] = [
  { id: "tag-1", name: "Modern", count: 0 },
  { id: "tag-2", name: "Minimal", count: 0 },
  { id: "tag-3", name: "Dark", count: 0 },
  { id: "tag-4", name: "Light", count: 0 },
  { id: "tag-5", name: "Responsive", count: 0 },
  { id: "tag-6", name: "Corporate", count: 0 },
  { id: "tag-7", name: "Creative", count: 0 },
  { id: "tag-8", name: "E-commerce", count: 0 }
];

// Mock users for community
export const users: User[] = [
  currentUser,
  {
    id: "user-2",
    name: "Jordan Smith",
    email: "jordan@example.com",
    avatar: "https://ui-avatars.com/api/?name=Jordan+Smith&background=5856D6&color=fff",
    widgetCount: 0,
    joinedAt: "2022-08-10T00:00:00Z"
  },
  {
    id: "user-3",
    name: "Taylor Reed",
    email: "taylor@example.com",
    avatar: "https://ui-avatars.com/api/?name=Taylor+Reed&background=FF2D55&color=fff",
    widgetCount: 0,
    joinedAt: "2023-03-22T00:00:00Z"
  }
];

// Helper function to generate placeholder images
const getPlaceholderImage = (index: number, type: string = 'widget'): string => {
  const colors = ['1A73E8', '34A853', 'FBBC04', 'EA4335', '5F6368', '4285F4'];
  const color = colors[index % colors.length];
  return `https://via.placeholder.com/600x400/${color}/FFFFFF?text=${type.charAt(0).toUpperCase() + type.slice(1)}+${index}`;
};

// Mock widgets (empty array)
export const widgets: Widget[] = [];

// My widgets (current user's widgets)
export const myWidgets = widgets.filter(widget => widget.author.id === currentUser.id);

// Favorite widgets
export const favoriteWidgets = widgets.filter(widget => widget.isFavorite);

// Recent widgets (last 10 widgets)
export const recentWidgets = [...widgets].sort((a, b) => 
  new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
).slice(0, 10);

// Community widgets (all public widgets)
export const communityWidgets = widgets.filter(widget => widget.isPublic);
