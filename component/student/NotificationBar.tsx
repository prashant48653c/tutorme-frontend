"use client";

import { Check, MoveRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "@/hooks/axios";
import { useAuthStore } from "@/store/useAuthStore";

interface Notification {
  id: string;
  message: string;
  createdAt: string; // Keep as string to avoid Date conversion issues
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
    <aside className="p-4 w-auto">
      <h4 className="text-xl font-semibold mb-4">Notifications</h4>
      <div className="flex flex-col  gap-4 h-[18rem] p-6 my-1 rounded-sm border border-gray-100 shadow-xl bg-white overflow-y-auto">
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500 text-center">No notifications</p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-3">
              <Check fill={n.isRead ? "#ccc" : "#09C4AE"} size={20} />
              <div className="flex flex-col gap-1">
                <h5 className="text-lg">{n.message}</h5>
                <p className="text-sm font-light text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default NotificationBar;
