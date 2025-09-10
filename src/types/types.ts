export interface Product {
  id: string;//number;
  name: string;
  description: string;
  price: number;
  stock: number;
  condition: "New" | "Used";
  category: string;
  imageUrl?: string;
  images?: string[];
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

// Payload to create a new product
export interface ProductCreateDto {
  name: string;
  description: string;
  price: number;
  stock?: number; // optional, backend defaults to 1
  condition: "New" | "Used";
  category: string;
  imageUrl?: string;
  sellerId?: string;
}

// Payload to update an existing product
export interface ProductUpdateDto {
  name: string;
  description: string;
  price: number;
  stock?: number;
  condition: "New" | "Used";
  category: string;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
//  productId : number;
}

export interface User {
  id: string;
  username: string;
  email: string;
   avatarUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  items?: OrderItem[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderCreateDto {
  items: OrderItem[];
  totalAmount: number;
}
export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  condition: "New" | "Used";
  category: "Laptop" | "Phone" | "Accessory" | string; // extend later
  imageUrl: string;
  sellerId: number;
  createdAt: string;
  updatedAt: string;
  seller: User; // relation to the student who posted it
}
// src/types/Notification.ts
export interface AppNotification {
  id: string;          // Guid
  sellerId: string;    // Guid
  orderId: string;     // Guid
  productId?: string;  // Guid | null
  type: string;        // e.g. "NewOrder"
  message: string;
  isRead: boolean;
  createdAt: string;   // ISO string from backend
}
