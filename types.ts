export interface Package {
  _id?: string;
  id: string;
  name: string;
  price: number;
  highlight?: boolean;
  isActive: boolean;
}

export interface Service {
  _id?: string;
  id: string;
  name: string;
  name_en: string;
  slug: string;
  description: string;
  image: string;
  category: 'balance' | 'games' | 'apps' | 'subs' | 'social' | 'cards';
  isActive: boolean;
  order: number;
  packages: Package[];
}