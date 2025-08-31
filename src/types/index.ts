import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'client' | 'admin' | 'superadmin';

export interface UserProfile {
  uid: string;
  email: string;
  businessName: string;
  phone: string;
  address: string;
  role: UserRole;
  createdAt: Timestamp;
}

export interface Product {
  id: string;
  name: string;
  photoUrl: string;
  stock: number;
  price: number;
  category: string;
  createdAt: Timestamp;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  businessName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Timestamp;
  shippingAddress: string;
}
