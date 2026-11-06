export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  tag?: string;
  sizes?: string[];
  soldOut?: boolean;
  createdAt?: number;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  size?: string;
  quantity: number;
};

export type Order = {
  id: string;
  reference?: string;
  email?: string;
  items: OrderItem[];
  subtotal: number;
  currency?: string;
  channel?: string;
  status?: string;
  createdAt?: number;
};
