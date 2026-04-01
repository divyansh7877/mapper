export interface Group {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  category: { name: string; color: string | null; icon: string | null };
  creator: { name: string | null; avatarUrl: string | null };
  _count: { members: number };
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  description: string | null;
  icon: string | null;
  _count?: { groups: number };
}
