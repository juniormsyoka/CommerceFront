import { Product, ProductCreateDto, ProductUpdateDto } from "../types/types";
import { CartItem, Listing } from "../types/types";
import { useUserStore } from "../store/userStore";
import { RegisterDto, LoginDto, AuthResult } from "../types/auth";
import { Order, OrderCreateDto } from "../types/types";
import { AppNotification } from "../types/types";

const API_BASE_URL = "https://localhost:44390/api";

// Enhanced apiFetch with better error handling
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from Zustand store
  const token = useUserStore.getState().token;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    // Handle specific HTTP error statuses
    if (!response.ok) {
      let errorMessage = `API error: ${response.status} ${response.statusText}`;
      
      // Try to get error details from response body
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use default message
      }
      
      throw new Error(errorMessage);
    }

    // For DELETE requests that might not return content
    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Network error: ${error.message}`);
    }
    throw new Error('Unknown network error occurred');
  }
};

// Products API https://localhost:44390/api/products
export const productsApi = {
  getAll: (): Promise<Product[]> => apiFetch("/products"),
  
  getById: (id: string): Promise<Product> =>
    apiFetch(`/products/${id}`),

  create: (product: ProductCreateDto): Promise<Product> =>
    apiFetch("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),

  update: (id: string, product: ProductUpdateDto): Promise<void> =>
    apiFetch(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),

  delete: (id: string): Promise<void> =>
    apiFetch(`/products/${id}`, {
      method: "DELETE",
    }),
};


// Orders API
// Orders API
export const ordersApi = {
  createOrder: (order: OrderCreateDto): Promise<Order> =>
    apiFetch("/orders", { 
      method: "POST", 
      body: JSON.stringify(order) 
    }),

  getUserOrders: (): Promise<Order[]> =>
    apiFetch("/orders/my"),

  updateLatestOrderStatus: (status: string): Promise<boolean> =>
    apiFetch("/orders/my/latest/status", {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};


// Users API - Updated to use apiFetch for consistency
export const usersApi = {
  register: (data: RegisterDto): Promise<AuthResult> =>
    apiFetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  login: (data: LoginDto): Promise<AuthResult> =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Consider adding these common user operations:
  getProfile: (): Promise<any> => 
    apiFetch("/auth/profile"),
    
  updateProfile: (data: any): Promise<any> =>
    apiFetch("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Listings API
export const listingsApi = {
  getAll: () => apiFetch('/listings'),
  getById: (id: number) => apiFetch(`/listings/${id}`),
  getByUser: (userId: number) => apiFetch(`/listings/user/${userId}`),
  create: (listing: Omit<Listing, "id" | "createdAt" | "updatedAt" | "seller">) =>
    apiFetch('/listings', { method: 'POST', body: JSON.stringify(listing) }),
  update: (id: number, listing: Partial<Listing>) =>
    apiFetch(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(listing) }),
  delete: (id: number) => apiFetch(`/listings/${id}`, { method: 'DELETE' }),
  
  // Consider adding search functionality:
  search: (query: string, category?: string) => {
    const params = new URLSearchParams();
    params.append('query', query);
    if (category) params.append('category', category);
    
    return apiFetch(`/listings/search?${params.toString()}`);
  }
};

export const AppNotificationsApi = {
  // Get all notifications (optionally only unread)
  getNotifications: (onlyUnread: boolean = false): Promise<AppNotification[]> =>   // ✅
    apiFetch(`/notifications?onlyUnread=${onlyUnread}`),

  // Mark a single notification as read
  markAsRead: (id: string): Promise<void> =>
    apiFetch(`/notifications/${id}/read`, {
      method: "PUT",
    }),

  // Mark all notifications as read
  markAllAsRead: (): Promise<{ markedCount: number }> =>
    apiFetch("/notifications/read-all", {
      method: "PUT",
    }),

  // Get count of unread notifications (for badge)
  getUnreadCount: (): Promise<{ count: number }> =>
    apiFetch("/notifications/unread/count"),
};
