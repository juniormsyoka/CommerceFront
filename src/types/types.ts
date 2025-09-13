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
  orderDate: string;
  shippingAddress:string;
  status: string;
  totalAmount: number;
  orderItems?: OrderItem[]; // renamed from "items" to match backend
}


export interface OrderItem {
  id: string;        // unique ID of the order item
  orderId: string;   // parent order ID
  productId: string;
  quantity: number;
  unitPrice: number; // renamed from "price" to match DB
}


/*export interface OrderCreateDto {
  //customerId: string;
  items: OrderItem[];
  shippingAddress: string;
  totalAmount: number;
}*/
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
export interface OrderCreateItemDto {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderCreateDto {
  items: OrderCreateItemDto[];
  shippingAddress: string;
  totalAmount: number;
}
