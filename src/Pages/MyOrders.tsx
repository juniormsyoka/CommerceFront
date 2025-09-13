// Pages/MyOrders.tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { ordersApi } from "../Services/api";
import { Order } from "../types/types";
import { LoadingSpinner } from "../Components/UI/LoadingSpinner";
import "./MyOrders.css";

const ITEMS_PER_PAGE = 6;

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await ordersApi.getUserOrders();
        setOrders(data.reverse()); // newest first
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Infinite scroll observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastOrderRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreOrders();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  const loadMoreOrders = () => {
    setLoadingMore(true);
    const currentLength = displayedOrders.length;
    const nextOrders = orders.slice(currentLength, currentLength + ITEMS_PER_PAGE);
    setDisplayedOrders((prev) => [...prev, ...nextOrders]);
    setHasMore(currentLength + nextOrders.length < orders.length);
    setLoadingMore(false);
  };

  // Reset displayed orders when orders change
  useEffect(() => {
    setDisplayedOrders(orders.slice(0, ITEMS_PER_PAGE));
    setHasMore(orders.length > ITEMS_PER_PAGE);
  }, [orders]);

  return (
    <div className="my-orders-page">
      <h1>My Orders</h1>

      {loading ? (
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      ) : displayedOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p className="empty-text">You have no orders yet.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {displayedOrders.map((order, index) => (
            <div
              key={order.id}
              ref={index === displayedOrders.length - 1 ? lastOrderRef : null}
              className="order-card"
            >
              <div className="order-header">
                <span className="order-number">Order #{order.id}</span>
                <span className="order-date">
                  {order.orderDate
                    ? `Order Created On: ${new Date(order.orderDate).toLocaleDateString()} At ${new Date(order.orderDate).toLocaleTimeString()}`
                    : "N/A"}
                </span>
              </div>

              <div className="order-status">
                Status:{" "}
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-shipping">
                Shipping Address: {order.shippingAddress || "N/A"}
              </div>

             

              <div className="order-footer">
                Total: Ksh.{order.totalAmount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}

      {loadingMore && (
        <div className="loading-more">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default MyOrders;
