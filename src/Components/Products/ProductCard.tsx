// Components/Products/ProductCard.tsx
import React, { useState } from "react";
import { Product } from "../../types/types";
import { FiEye, FiShoppingCart, FiCheck } from "react-icons/fi";
import { useCartStore } from "../../store/cartStore";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { useUserStore } from "../../store/userStore";
import IconWrapper from "../IconWrapper";

interface ProductCardProps {
  product: Product;
  onCardClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  isInCart?: boolean;
  showAddToCart?: boolean;
  showImageCount?: boolean;
}


const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onCardClick,
  onAddToCart,
  isInCart = false,
  showAddToCart = true,
  showImageCount = true,
}) => {
  const [imageError, setImageError] = useState(false);
   const addToCart = useCartStore((state) => state.addToCart);
  const navigate = useNavigate();
  
  const currentUserId = useUserStore((state) => state.userId);

  const isOwnProduct = product.sellerId === currentUserId;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
     if (!currentUserId) {
    toast.error("⚠️ You must be logged in to add items to the cart");
  //  navigate("/signin"); // Optional: redirect to sign-in page
    return;
  }
    addToCart(product, 1); // 🔥 actually updates the cart

    // ✅ Toast feedback
    toast.success(
      (t) => (
        <div className="flex items-center gap-2">
          <IconWrapper icon={FiCheck} size={18} />
          <span>{product.name} added to cart</span>
          <button
          onClick={() => {
            toast.dismiss(t.id);
            navigate("/cartpage"); // SPA navigation
          }}
          className="ml-3 text-blue-500 underline"
        >
          Go to Cart
        </button>
        </div>
      ),
      { duration: 3000 }
    );
  };

  return (
    <div className="product-card" onClick={() => onCardClick?.(product)}>
      <div className="product-image-container">
        <img
          src={imageError ? "/no-image.png" : product.imageUrl || "/no-image.png"}
          alt={product.name}
          onError={() => setImageError(true)}
        />
        {showImageCount && product.images && product.images.length > 1 && (
          <div className="image-count">+{product.images.length - 1}</div>
        )}

        {/* Show "Add to Cart" only if not in cart */}
        {showAddToCart && !isInCart && !isOwnProduct &&(
        <button
          className="absolute bottom-3 right-3 p-2 rounded-full shadow-lg transition bg-blue-500 text-white hover:bg-blue-600"
          onClick={handleAddToCart}
          aria-label="Add to Cart"
        >
          <IconWrapper icon={FiShoppingCart} size={18} />
        </button>
      )}

      {isOwnProduct && (
        <div className="absolute bottom-3 right-3 p-2 rounded-full bg-gray-300 text-white shadow-lg text-xs flex items-center justify-center">
          Your Item
        </div>
      )}



        {/* If already in cart, show a dull checkmark */}
        {isInCart && (
        <div className="absolute bottom-3 right-3 p-2 rounded-full bg-gray-400 text-white shadow-lg">
          <IconWrapper icon={FiCheck } size={18} />
        </div>
      )}
      </div>

      <div className="product-info">
        <h4 className="product-title">{product.name}</h4>
        <p className="product-price">Ksh.{product.price.toFixed(2)}</p>

        {/* Truncated description with modal */}
        {product.description && (
          <DescriptionTruncate text={product.description} />
        )}

        <div className="product-meta">
          <span className="product-condition">{product.condition}</span>
          <span
            className={`product-status px-2 py-1 rounded text-xs font-medium ${
              isInCart ? "bg-gray-300 text-gray-500" : "bg-green-100 text-green-700"
            }`}
          >
            {isInCart ? "In Cart" : "Active"}
          </span>
        </div>

        <div className="product-footer">
          <span className="product-date">
            {new Date(product.createdAt).toLocaleDateString()}
          </span>
          <button
            className="view-details-btn"
            onClick={(e) => {
              e.stopPropagation();
              onCardClick?.(product);
            }}
          >
            <IconWrapper icon={FiEye} size={14} />
            View
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Move DescriptionTruncate outside to keep render clean
const DescriptionTruncate: React.FC<{ text: string }> = ({ text }) => {
  const [showModal, setShowModal] = useState(false);
  const maxLength = 120;

  const needsTruncation = text.length > maxLength;
  const truncatedText = needsTruncation
    ? text.slice(0, maxLength) + "..."
    : text;

  return (
    <>
      <p className="product-description">
        {truncatedText}
        {needsTruncation && (
          <button
            className="read-more-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
          >
            Read more
          </button>
        )}
      </p>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="description-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Description</h3>
              <button
                className="close-modal"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>{text}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
