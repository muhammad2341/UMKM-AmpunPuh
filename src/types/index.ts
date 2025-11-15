export interface SizeChart {
  size: string;
  chest?: string;
  waist?: string;
  hips?: string;
  length?: string;
  shoulder?: string;
}

export interface NutritionInfo {
  calories: number;
  protein?: string;
  carbs?: string;
  fat?: string;
  fiber?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  storeId: string;
  storeName: string;
  description: string;
  ingredients?: string[];
  nutritionInfo?: NutritionInfo;
  stock?: number;
  isAvailable?: boolean;
  availableSizes?: string[];
  sizeChart?: SizeChart[];
}

export interface Store {
  id: string;
  name: string;
  image: string;
  description: string;
  category?: string;
  address: string;
  whatsapp: string;
  mapUrl: string;
  lat?: number;
  lng?: number;
  rating: number;
  products: Product[];
  openingTime?: string;
  closingTime?: string;
}

export interface User {
  id: string;
  role: "buyer" | "seller";
  name: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}
