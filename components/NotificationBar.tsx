"use client";

import api from "@/hooks/axios";
import { useAuthStore } from "@/store/useAuthStore";
import React, { useEffect, useState } from "react";

interface Notification {
  id: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

const NotificationBar = () => {
  const user = useAuthStore((state) => state.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await api.get(`/notifications/${user.id}`);
      setNotifications(res.data.data || []);
    } catch (error) {
      console.error("❌ Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  return (
    <div className="absolute top-12 right-0 w-80 bg-white shadow-lg rounded-xl border z-50">
      <div className="p-3 border-b font-semibold">Notifications</div>
      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <p className="p-3 text-gray-500">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="p-3 text-gray-500">No notifications</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 border-b last:border-0 text-sm ${
                n.isRead ? "bg-white" : "bg-gray-100"
              }`}
            >
              <p>{n.message}</p>
              <span className="text-xs text-gray-400">
            {n.createdAt.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationBar;
