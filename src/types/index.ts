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
}

export interface Store {
  id: string;
  name: string;
  image: string;
  description: string;
  address: string;
  whatsapp: string;
  mapUrl: string;
  rating: number;
  products: Product[];
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
