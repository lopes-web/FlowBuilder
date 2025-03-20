
export type Widget = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  elementorCode: string;
  categories: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: User;
  isPublic: boolean;
  isFavorite: boolean;
}

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  widgetCount: number;
  joinedAt: string;
}

export type Category = {
  id: string;
  name: string;
  count: number;
}

export type Tag = {
  id: string;
  name: string;
  count: number;
}
