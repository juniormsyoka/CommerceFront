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
    {/* Hero Section */}
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>📚 Campus Marketplace</h1>
          <p>
            Buy and sell used electronics with fellow students. 
            Got a spare laptop? Need a budget phone? 
            This is your safe space to trade on campus.
          </p>
          <div className="hero-actions">
            <Link to="/postitem" className="primary-btn">
              + Post an Item
            </Link>
            <Link to="/browse" className="secondary-btn">
              Browse Items
            </Link>
          </div>
        </div>
        <div className="hero-img">
          <ImageCarousel />
        </div>
      </div>
    </section>

    {/* Categories Section */}
    <section className="categories-section">
      <h2>Browse by Category</h2>
      <div className="category-grid">
        <Link to="/category/phones" className="category-card">
          <div className="category-icon">📱</div>
          <span>Phones</span>
        </Link>
        <Link to="/category/laptops" className="category-card">
          <div className="category-icon">💻</div>
          <span>Laptops</span>
        </Link>
        <Link to="/category/accessories" className="category-card">
          <div className="category-icon">🎧</div>
          <span>Accessories</span>
        </Link>
        <Link to="/category/other" className="category-card">
          <div className="category-icon">🔍</div>
          <span>Other</span>
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
        <h2>Ready to find your next tech treasure?</h2>
        <p>Join thousands of students buying and selling on our platform</p>
        <div className="cta-actions">
          <Link to="/signup" className="primary-btn large">
            Join Now
          </Link>
          <Link to="/browse" className="secondary-btn large">
            Browse Listings
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