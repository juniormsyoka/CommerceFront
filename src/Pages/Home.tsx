import React, { useEffect, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import { useCartStore } from "../store/cartStore";
import { Product } from "../types/types";
import { LoadingSpinner } from "../Components/UI/LoadingSpinner";
import { Alert } from "../Components/UI/Alert";
import  ProductCard  from "../Components/Products/ProductCard";
import { Link } from "react-router-dom";
import ImageCarousel from "../Components/UI/ImageCarousel";
import ProductModal from "../Components/Products/ProductModal";
import  FaqSection  from "../Components/UI/FaqSection";
import "./Home.css";


const Home: React.FC = () => {
//  const userId = 1; // demo user - in a real app, get this from auth context
  const { products, loading, error, refetch } = useProducts();
  //const { addToCart, fetchCart, cartItems } = useCartStore();
  const { addToCart,  cart } = useCartStore();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  // Memoize the latest products to prevent unnecessary re-renders
  const latestProducts = useMemo(() => {
    return [...products].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 8); // Show only the 8 latest products
  }, [products]);

  

  // Handle retry for fetching products
  const handleRetry = () => {
    refetch();
  };

 return (
  <div className="page-container">
    <div className="tech-background">
        <div className="circuit-line circuit-line-1"></div>
        <div className="circuit-line circuit-line-2"></div>
        <div className="circuit-node node-1"></div>
        <div className="circuit-node node-2"></div>
        <div className="circuit-node node-3"></div>
      </div>
    {/* Hero Section */}
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="tech-title">
              <span className="tech-gradient">Campus</span>
              <span className="tech-outline">Marketplace</span>
            </h1>
          <p className="hero-subtitle">
              The premier platform for students to buy and sell used electronics. 
              Connect directly with campus community members for secure, convenient transactions.
            </p>
          <div className="hero-actions">
              <Link to="/postitem" className="primary-btn tech-btn">
                <span className="btn-icon">+</span>
                Post an Item
              </Link>
              <Link to="/browse" className="secondary-btn tech-btn-outline">
                <span className="btn-icon">🔍</span>
                Browse Inventory
              </Link>
            </div>
        </div>
        <div className="tech-stats">
              <div className="stat">
                <span className="stat-number">{products.length}+</span>
                <span className="stat-label">Active Listings</span>
              </div>
              <div className="stat">
                <span className="stat-number">24h</span>
                <span className="stat-label">Avg. Response</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Campus Verified</span>
              </div>
            </div>
        <div className="hero-img">
          <ImageCarousel />
        </div>
         <div className="scroll-indicator">
          <div className="scroll-line"></div>
          <div className="scroll-dot"></div>
        </div>
      </div>
    </section>

    {/* Categories Section */}
    <section className="categories-section">
        <div className="section-header-center">
          <h2 className="section-title-tech">
            <span className="tech-underline">Browse Categories</span>
          </h2>
          <p className="section-subtitle">Find exactly what you're looking for</p>
        </div>
        <div className="category-grid">
          <Link to="/category/phones" className="category-card tech-card">
            <div className="category-icon tech-icon">📱</div>
            <span>Phones</span>
            <div className="category-hover-effect"></div>
          </Link>
          <Link to="/category/laptops" className="category-card tech-card">
            <div className="category-icon tech-icon">💻</div>
            <span>Laptops</span>
            <div className="category-hover-effect"></div>
          </Link>
          <Link to="/category/accessories" className="category-card tech-card">
            <div className="category-icon tech-icon">🎧</div>
            <span>Accessories</span>
            <div className="category-hover-effect"></div>
          </Link>
          <Link to="/category/other" className="category-card tech-card">
            <div className="category-icon tech-icon">🔍</div>
            <span>Other Tech</span>
            <div className="category-hover-effect"></div>
          </Link>
        </div>
      </section>

    {/* Latest Listings Section */}
    <section className="listings-section">
      <div className="section-header">
        <h2>🔥 Latest Listings</h2>
        <Link to="/browse" className="view-all-link">
          View all &rarr;
        </Link>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading latest products...</p>
        </div>
      ) : error ? (
        <Alert 
          type="error" 
          message={error} 
          action={
            <button onClick={handleRetry} className="retry-btn">
              Try Again
            </button>
          }
        />
      ) : latestProducts.length === 0 ? (
        <div className="empty-state">
          <p>No listings yet. Be the first to post an item!</p>
          <Link to="/post-item" className="primary-btn">
            Post an Item
          </Link>
        </div>
      ) : (
        <div className="product-grid">
           {latestProducts.slice(0, 10).map((product: Product) => (
            <ProductCard
              product={product}
              onAddToCart={() => addToCart(product)}
              isInCart={cart.some((item) => item.product.id === product.id)}
            />
          ))}
        </div>
      )}
    </section>

    {/* Call to Action Section */}
     <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">
            <span className="tech-gradient">Ready to join the</span>
            <span className="tech-outline">Campus Economy?</span>
          </h2>
          <p>Join thousands of students buying and selling tech on our secure platform</p>
          <div className="cta-actions">
            <Link to="/signup" className="secondary-btn large tech-btn">
              Create Account
            </Link>
            <Link to="/browse" className="secondary-btn large tech-btn-outline">
              Explore Listings
            </Link>
          </div>
        </div>
      </section>

    <FaqSection />
    {selectedProduct && (
  <ProductModal
    product={selectedProduct}
    onClose={() => setSelectedProduct(null)}
    onUpdate={(updatedProduct) => {
      // Update the product in latestProducts if needed
      // If using products from the hook, you might need to refetch or update the store
    }}
    onDelete={(productId) => {
      // Optional: remove the product from your products state
      setSelectedProduct(null);
    }}
    readOnly={false}
  />
)}

  </div>
);
};

export default Home;