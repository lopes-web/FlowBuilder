
import { Widget, User, Category, Tag } from './types';

// Mock current user
export const currentUser: User = {
  id: "user-1",
  name: "Alex Morgan",
  email: "alex@example.com",
  avatar: "https://ui-avatars.com/api/?name=Alex+Morgan&background=0077ED&color=fff",
  bio: "Elementor enthusiast and web designer with 5+ years of experience.",
  widgetCount: 28,
  joinedAt: "2023-01-15T00:00:00Z"
};

// Mock categories
export const categories: Category[] = [
  { id: "cat-1", name: "Headers", count: 12 },
  { id: "cat-2", name: "Footers", count: 8 },
  { id: "cat-3", name: "Hero Sections", count: 15 },
  { id: "cat-4", name: "Pricing Tables", count: 10 },
  { id: "cat-5", name: "Testimonials", count: 14 },
  { id: "cat-6", name: "Contact Forms", count: 7 },
  { id: "cat-7", name: "Image Galleries", count: 9 },
  { id: "cat-8", name: "Call to Action", count: 11 }
];

// Mock tags
export const tags: Tag[] = [
  { id: "tag-1", name: "Modern", count: 24 },
  { id: "tag-2", name: "Minimal", count: 18 },
  { id: "tag-3", name: "Dark", count: 15 },
  { id: "tag-4", name: "Light", count: 20 },
  { id: "tag-5", name: "Responsive", count: 32 },
  { id: "tag-6", name: "Corporate", count: 14 },
  { id: "tag-7", name: "Creative", count: 22 },
  { id: "tag-8", name: "E-commerce", count: 17 }
];

// Mock users for community
export const users: User[] = [
  currentUser,
  {
    id: "user-2",
    name: "Jordan Smith",
    email: "jordan@example.com",
    avatar: "https://ui-avatars.com/api/?name=Jordan+Smith&background=5856D6&color=fff",
    widgetCount: 42,
    joinedAt: "2022-08-10T00:00:00Z"
  },
  {
    id: "user-3",
    name: "Taylor Reed",
    email: "taylor@example.com",
    avatar: "https://ui-avatars.com/api/?name=Taylor+Reed&background=FF2D55&color=fff",
    widgetCount: 17,
    joinedAt: "2023-03-22T00:00:00Z"
  }
];

// Helper function to generate placeholder images
const getPlaceholderImage = (index: number, type: string = 'widget'): string => {
  const colors = ['1A73E8', '34A853', 'FBBC04', 'EA4335', '5F6368', '4285F4'];
  const color = colors[index % colors.length];
  return `https://via.placeholder.com/600x400/${color}/FFFFFF?text=${type.charAt(0).toUpperCase() + type.slice(1)}+${index}`;
};

// Mock widgets
export const widgets: Widget[] = Array(24).fill(null).map((_, index) => ({
  id: `widget-${index + 1}`,
  name: `Widget ${index + 1}`,
  description: index % 3 === 0 
    ? "A sophisticated header with animated elements and sleek design."
    : index % 3 === 1 
    ? "Elegant testimonial carousel with smooth transitions and rating stars."
    : "Modern pricing table with toggle between monthly and yearly plans.",
  thumbnail: getPlaceholderImage(index),
  elementorCode: JSON.stringify({ data: "Elementor code would go here", version: "3.5.0" }),
  categories: [categories[index % categories.length].id],
  tags: [
    tags[index % tags.length].id,
    tags[(index + 2) % tags.length].id
  ],
  createdAt: new Date(Date.now() - (index * 86400000)).toISOString(),
  updatedAt: new Date(Date.now() - (index * 43200000)).toISOString(),
  author: index % 4 === 0 ? users[1] : index % 4 === 1 ? users[2] : currentUser,
  isPublic: index % 3 === 0,
  isFavorite: index % 5 === 0
}));

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
