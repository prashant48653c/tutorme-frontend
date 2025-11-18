"use client";

import { Check } from "lucide-react";
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
    <aside className="hidden lg:block w-full space-y-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
      <h4 className="text-lg font-semibold text-gray-900 sm:text-xl">
        Notifications
      </h4>
      <div className="flex max-h-[16rem] flex-col gap-4 overflow-y-auto rounded-xl border border-gray-100 bg-white p-3 sm:max-h-[20rem] sm:p-4">
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500 text-center">No notifications</p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-3">
              <Check fill={n.isRead ? "#09C4AE" : "#ccc"} size={20} />
              <div className="flex flex-col gap-1">
                <h5 className="text-base font-medium text-gray-900  sm:text-sm md:text-xs lg:text-base">
                  {n.message}
                </h5>
                <p className="text-xs font-light text-gray-400 sm:text-sm lg:text-xs">
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
