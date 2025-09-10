import React, { useEffect, useState } from "react";
import { AppNotification } from "../types/types";
import { AppNotificationsApi } from "../Services/api";
import { FiCheckCircle, FiMail} from "react-icons/fi";
import { IoMdMailOpen } from "react-icons/io";
import "./NotificationsPage.css";

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await AppNotificationsApi.getNotifications(false); // all
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await AppNotificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await AppNotificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2>Inbox</h2>
        <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
          <FiCheckCircle size={16} /> Mark all as read
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="empty">No notifications</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`notification-item ${n.isRead ? "read" : "unread"}`}
              onClick={() => handleMarkAsRead(n.id)}
            >
              <span className="icon">
                {n.isRead ? <IoMdMailOpen />: <FiMail />}
              </span>
              <div className="content">
                <p className="message">{n.message}</p>
                <small className="date">
                  {new Date(n.createdAt).toLocaleString()}
                </small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
