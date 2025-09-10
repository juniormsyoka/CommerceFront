import React, { useState } from "react";
import { useCartStore } from "../store/cartStore";
import { ordersApi } from "../Services/api";
import { OrderCreateDto } from "../types/types";

const Checkout: React.FC = () => {
  const userId = 1; // demo user
  const { cart, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    setMessage(null);

    try {
      const orderDto: OrderCreateDto = {
        items: cart.map(item => ({
          productId: item.product.id.toString(),
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: totalPrice,
      };

      await ordersApi.createOrder(orderDto);
      clearCart();
      setMessage({ type: "success", text: "✅ Order placed successfully!" });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "❌ Failed to place order." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>💳 Checkout</h2>

      {message && (
        <div className={`alert ${message.type === "error" ? "alert-error" : "alert-success"}`}>
          {message.text}
        </div>
      )}

      {cart.length === 0 ? (
        <p>Your cart is empty. Add some products first.</p>
      ) : (
        <>
          <ul className="checkout-list">
            {cart.map(item => (
              <li key={item.product.id}>
                {item.product.name} x {item.quantity} = ${(item.product.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>

          <h3>Total: ${totalPrice.toFixed(2)}</h3>

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
