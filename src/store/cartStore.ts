import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "../types/types";
import { useUserStore } from "./userStore"; // 👈 import user store
import { toast } from "react-hot-toast";
interface CartState {
  cart: CartItem[];
  loading: boolean;
  totalItems: number;
  totalPrice: number;

  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      loading: false,
      totalItems: 0,
      totalPrice: 0,

      addToCart: (product, qty = 1) => {
        const currentUserId = useUserStore.getState().userId;
        if (!currentUserId) {
         // throw new Error("You must be logged in to add to cart.");
        toast.error("⚠️ You must be logged in to add items to your cart.");
        }

        // 🚫 Prevent adding own product
        if (product.sellerId === currentUserId) {
         // throw new Error("You cannot add your own product to the cart.");
         toast.error("⚠️ You cannot add your own product to the cart.");
         return;
        }

        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.product.id === product.id
          );

          let newCart;
          if (existingItem) {
            newCart = state.cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + qty }
                : item
            );
          } else {
            newCart = [...state.cart, { product, quantity: qty }];
          }

          return {
            cart: newCart,
            totalItems: newCart.reduce((t, i) => t + i.quantity, 0),
            totalPrice: newCart.reduce(
              (t, i) => t + i.product.price * i.quantity,
              0
            ),
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => {
          const newCart = state.cart.filter(
            (item) => item.product.id !== productId
          );
          return {
            cart: newCart,
            totalItems: newCart.reduce((t, i) => t + i.quantity, 0),
            totalPrice: newCart.reduce(
              (t, i) => t + i.product.price * i.quantity,
              0
            ),
          };
        });
      },

      updateQuantity: (productId, qty) => {
        set((state) => {
          const newCart = state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity: qty } : item
          );
          return {
            cart: newCart,
            totalItems: newCart.reduce((t, i) => t + i.quantity, 0),
            totalPrice: newCart.reduce(
              (t, i) => t + i.product.price * i.quantity,
              0
            ),
          };
        });
      },

      clearCart: () => {
        set({
          cart: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
