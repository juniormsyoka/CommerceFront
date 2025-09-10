import { useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import { useUserStore } from "../store/userStore";

export const useCart = () => {
  const userId = useUserStore((s) => s.userId);
  const { cart, loading, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCartStore();

  // auto-fetch cart when user logs in


  return {
    cart,
    loading,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
