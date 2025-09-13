// src/Components/ProductModal.tsx
import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom"; // <-- import ReactDOM for portal
import { Product } from "../../types/types";
import { productsApi } from "../../Services/api";
import { FiEdit, FiTrash2, FiX, FiChevronLeft, FiChevronRight, FiSave } from "react-icons/fi";
import IconWrapper from "../IconWrapper";
import './ProductModal.css';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onUpdate?: (updatedProduct: Product) => void; // optional
  onDelete?: (productId: string) => void;       // optional
  readOnly?: boolean;    
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onUpdate, onDelete,readOnly = false }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    condition: product.condition,
    category: product.category,
    imageUrl: product.imageUrl || "",
    stock: product.stock || 1,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.imageUrl || "/no-image.png"];

  // Image carousel
  const prevImage = useCallback(() => setCurrentImageIndex(i => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
  const nextImage = useCallback(() => setCurrentImageIndex(i => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

  // Handle Escape key and arrow keys
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  }, [onClose, prevImage, nextImage]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // prevent background scroll
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [handleKeyDown]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "price" || name === "stock" ? Number(value) : value }));
  };

  // Save updated product
  const handleSave = async () => {
    try {
      await productsApi.update(product.id, form);
      if (onUpdate){
      onUpdate({ ...product, ...form });}
      setEditing(false);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update product.");
    }
  };

  // Modal JSX
  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editing ? "Edit Product" : product.name}</h2>
          <button onClick={onClose} aria-label="Close"><IconWrapper icon={FiX} size={24} /></button>
        </div>

        <div className="modal-body">
          {/* Image carousel */}
          <div className="image-container">
            <img src={images[currentImageIndex]} alt={product.name} />
            {images.length > 1 && (
              <>
                <button onClick={prevImage} aria-label="Previous image"><IconWrapper icon={FiChevronLeft}/></button>
                <button onClick={nextImage} aria-label="Next image"><IconWrapper icon={FiChevronRight}  /></button>
                <div className="image-indicators">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={currentImageIndex === idx ? "active" : ""}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Edit form */}
          {editing ? (
            <div className="edit-form">
              <label>Name:
                <input type="text" name="name" value={form.name} onChange={handleChange} />
              </label>
              <label>Description:
                <textarea name="description" value={form.description} onChange={handleChange} />
              </label>
              <label>Price:
                <input type="number" name="price" value={form.price} onChange={handleChange} />
              </label>
              <label>Stock:
                <input type="number" name="stock" value={form.stock} onChange={handleChange} />
              </label>
              <label>Condition:
                <select name="condition" value={form.condition} onChange={handleChange}>
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </select>
              </label>
              <label>Category:
                <input type="text" name="category" value={form.category} onChange={handleChange} />
              </label>
              <label>Image URL:
                <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
              </label>

              <div className="modal-actions">
                <button onClick={handleSave}><IconWrapper icon={FiSave}/> Save</button>
                <button onClick={() => setEditing(false)}> Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h3>${product.price.toFixed(2)}</h3>
              <p>{product.description}</p>
              <div className="modal-details">
                <span>Condition: {product.condition}</span>
                <span>Category: {product.category}</span>
                <span>Stock: {product.stock}</span>
              </div>

              {readOnly && (
                    <div className="modal-actions">
                        <button onClick={() => setEditing(true)}><IconWrapper icon={FiEdit}  />Edit</button>
                        <button onClick={() => onDelete && onDelete(product.id)}><IconWrapper icon={FiTrash2} /> Delete</button>
                    </div>
                    )}

              {readOnly && (
                        <div className="seller-info">
                            <p><strong>Product ID:</strong> {product.id}</p>
                            <p><strong>Seller ID:</strong> {product.sellerId}</p>
                         {/* 
                         <button onClick={() => navigator.clipboard.writeText(`${product.id}`)}>Copy Product ID</button>
                            <button onClick={() => navigator.clipboard.writeText('${product.sellerId}')}>Copy Seller ID</button>
                       */}    </div>
                        )}

            </>
          )}
        </div>
      </div>
    </div>
  );

  // Use React portal to render outside parent containers
  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root")! // ensure you added <div id="modal-root"></div> in index.html
  );
};

export default ProductModal;
