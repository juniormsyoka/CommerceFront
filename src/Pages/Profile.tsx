import React, { useEffect, useState, useCallback } from "react";
import { useUserStore } from "../store/userStore";
import { productsApi } from "../Services/api";
import { Product } from "../types/types";
import { LoadingSpinner } from "../Components/UI/LoadingSpinner";
import { Alert } from "../Components/UI/Alert";
import { FiEdit, FiTrash2, FiChevronLeft, FiChevronRight, FiX, FiPlus, FiEye , FiBell, FiPackage} from "react-icons/fi";
import "./Profile.css"; // Import the CSS file
import DescriptionTruncate from "../Components/UI/DescriptionTruncate";
import { Link } from "react-router-dom";
import ProductModal from "../Components/Products/ProductModal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AppNotificationsApi } from "../Services/api";
import IconWrapper from "../Components/IconWrapper";
import { AppNotification } from "../types/types";



const EmptyState: React.FC<{ onCreateListing: () => void }> = ({ onCreateListing }) => (
  <div className="empty-state">
    <span><IconWrapper icon={FiEye} size={40} /></span>
    <h3>No listings yet</h3>
    <p>You haven't posted any items for sale. Create your first listing to start selling.</p>
    <button onClick={onCreateListing}>
      <Link to="/postitem" className="primary-btn tech-btn">
      <IconWrapper icon={FiPlus} size={18} /> Create Listing
      </Link>
      
    </button>
  </div>
);




const Profile: React.FC = () => {
//  const { user } = useUserStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "sold">("all");
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();


   // Fetch notifications for seller
  useEffect(() => {
    if (!user?.id) return;
    const fetchNotifications = async () => {
      try {
        const data = await AppNotificationsApi.getNotifications(true); // onlyUnread
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const allProducts = await productsApi.getAll();
        const myProducts = allProducts.filter(p => String(p.sellerId) === user.id);
        setProducts(myProducts);
      } catch (err) {
        console.error(err);
        setError("Failed to load your listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  const handleLogout = () => {
  if (window.confirm("Are you sure you want to log out?")) {
    clearUser();
    toast.success("Logged out successfully!");
    // Optionally, redirect to home or login page
   
    navigate("/signin");
  }
};



  const handleDeleteProduct = async (productId: string) => {
      if (!window.confirm("Are you sure you want to delete this listing?")) return;

      try {
        await productsApi.delete(productId); // call API
        setProducts(products.filter(p => p.id !== productId));
        setSelectedProduct(null);
      } catch (err) {
        console.error(err);
        alert("Failed to delete the product.");
      }
    };



  const filteredProducts = products.filter(product => {
    if (filter === "all") return true;
    return true; // Adjust once status field exists
  });

//  if (!user) return <p className="p-6 text-center">Please sign in to view your profile.</p>;
  useEffect(() => {
    if (!user?.id) {
      toast.error("Please sign in to view your profile");
      navigate("/signin");
    }
  }, [user, navigate]);
  return (
    <div className="page-container">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="avatar-container">
            <img src={user?.avatarUrl || "/profilePic.jpg"} alt={user?.username} />
          </div>
          <div className="profile-info">
            <h2>{user?.username}</h2>
            <p>{user?.email}</p>
            <div className="profile-stats">
              <span>{products.length} listings</span>
              <span>Member since 2023</span>
            </div>

             <div className="profile-notifications">
              <Link to="/notifications" className="notification-icon">
                <IconWrapper icon={FiBell} size={24} />
                {notifications.length > 0 && (
                  <span className="badge">{notifications.length}</span>
                )}
              </Link>
            </div>
            <div className="profile-orders">
              <Link to="/myorders" className="orders-icon">
              <IconWrapper icon={FiPackage} size={24} />

                <IconWrapper icon={FiChevronRight} size={24} />
                <span>My Orders</span>
              </Link>
            </div>


          </div>
        </div>
      </div>

      <div className="listings-container">
        <div className="listings-header">
          <h3>My Listings</h3>
          <div className="filter-actions">
            {(["all", "active", "sold"] as const).map(option => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={filter === option ? "active" : ""}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
            <button className="new-listing-btn">
              <IconWrapper icon={FiPlus} size={16} /> <Link to="/postitem">New Listing </Link>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <Alert type="error" message={error} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState onCreateListing={() => toast("Create new listing")} />
        ) : (
          <div className="product-grid">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() =>
                     setSelectedProduct(product)}
                >
                  <div className="product-image-container">
                    <img src={product.imageUrl || "/no-image.png"} alt={product.name} />
                    {product.images && product.images.length > 1 && (
                      <div className="image-count">
                        +{product.images.length - 1}
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-price">ksh.{product.price.toFixed(2)}</p>
                    
                    {/* Add the description component here */}
                    <DescriptionTruncate text={product.description} />
                    
                    <div className="product-meta">
                      <span>{product.condition}</span>
                      <span className="status">Active</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {selectedProduct && (
  <ProductModal
    product={selectedProduct}
    onClose={() => setSelectedProduct(null)}
    onUpdate={(updatedProduct) => {
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    }}
    onDelete={handleDeleteProduct}
    readOnly={true}
  />
)}
<div className="profile-actions">
  <button className="logout-btn" onClick={handleLogout}>
    Log Out
  </button>
</div>



    </div>
  );
};

export default Profile;