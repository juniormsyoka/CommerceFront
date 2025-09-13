// CartPage.tsx
import { useCartStore } from "../store/cartStore";
import { useUserStore } from "../store/userStore";
import { Button } from "../Components/UI/Button";
import "./CartPage.css";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

export default function CartPage() {
  const navigate = useNavigate();
   const { user } = useUserStore();
  const { cart, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } =
    useCartStore();

  useEffect(() => {
    if (!user?.id) {
      clearCart();
    }
  }, [user, clearCart]);

  if (!user?.id ||cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart-container">
          <div className="empty-cart-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C15.895 17 15 17.895 15 19C15 20.105 15.895 21 17 21C18.105 21 19 20.105 19 19C19 17.895 18.105 17 17 17ZM9 19C9 20.105 8.105 21 7 21C5.895 21 5 20.105 5 19C5 17.895 5.895 17 7 17C8.105 17 9 17.895 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p className="empty-cart-text">Looks like you haven't added anything to your cart yet</p>
          <Button variant="primary" className="continue-shopping-btn">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

 

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p className="cart-items-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="cart-content">
        <div className="cart-items-container">
          {cart.map((item, index) => (
            <div
              key={item.product.id}
              className="cart-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="product-info">
                {item.product.imageUrl && (
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="product-image"
                  />
                )}
                <div className="product-details">
                  <h2 className="product-name">{item.product.name}</h2>
                  <p className="product-price">${item.product.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="item-controls">
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn decrease"
                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, Math.max(1, Number(e.target.value)))}
                    className="quantity-input"
                    aria-label="Quantity"
                  />
                  <button 
                    className="quantity-btn increase"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <div className="item-subtotal">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
                
                <Button 
                  variant="danger" 
                  onClick={() => removeFromCart(item.product.id)}
                  className="remove-btn"
                  aria-label="Remove item"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 7L18.132 19.142C18.058 20.189 17.199 21 16.147 21H7.853C6.801 21 5.942 20.189 5.868 19.142L5 7M10 11V17M14 11V17M4 7H20M15 7V4C15 3.448 14.552 3 14 3H10C9.448 3 9 3.448 9 4V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-header">
            <h2>Order Summary</h2>
          </div>
          
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">Free</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${(totalPrice * 0.08).toFixed(2)}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${(totalPrice * 1.08).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="summary-actions">
            <Button variant="secondary" onClick={clearCart} className="clear-cart-btn">
              Clear Cart
            </Button>
            <Button variant="primary" className="checkout-btn" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </Button>
          </div>
          
          <div className="continue-shopping">
            <Button variant="secondary" className="continue-link" onClick={() => navigate("/browse") }>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

