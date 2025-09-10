import { AppNotificationsApi } from "../Services/api";
import { AppNotification } from "../types/types";
import { create } from "zustand";

interface NotificationStore {
  notifications: AppNotification[];
  unreadCount: number;
  fetchNotifications: (onlyUnread?: boolean) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async (onlyUnread = false) => {
    const data = await AppNotificationsApi.getNotifications(onlyUnread);
    set({ notifications: data });
    const countRes = await AppNotificationsApi.getUnreadCount();
    set({ unreadCount: countRes.count });
  },

  markAsRead: async (id: string) => {
    await AppNotificationsApi.markAsRead(id);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(state.unreadCount - 1, 0),
    }));
  },

  markAllAsRead: async () => {
    const res = await AppNotificationsApi.markAllAsRead();
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: Math.max(state.unreadCount - res.markedCount, 0),
    }));
  },
}));
