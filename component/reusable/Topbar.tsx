"use client";

import NotificationBar from "@/components/NotificationBar";
import api from "@/hooks/axios";
import { initClientSocket } from "@/hooks/socket";
import { useAuthStore } from "@/store/useAuthStore";
import { Bell, Menu, X } from "lucide-react";
import Image from "next/image";
import React from "react";

type TopbarProps = {
  onToggleSidebar?: () => void;
  isSidebarVisible?: boolean;
};

const Topbar = ({ onToggleSidebar, isSidebarVisible }: TopbarProps) => {
  const user = useAuthStore((state) => state.user);
  const [notifications, setNotifications] = React.useState<number>(0);
  const [isVisible, setIsVisible] = React.useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/notifications/counts/${user?.id}`);

      console.log(res.data.data, "Counts");
      setNotifications(res.data.data);
    } catch (error) {}
  };

  React.useEffect(() => {
    fetchNotifications();
    if (!user?.id) return;

    const socket = initClientSocket(user.id.toString());

    socket.on("notification", (payload) => {
      console.log("Notification received:", payload);
      setNotifications((prev) => prev + 1);
    });

    return () => {
      socket.off("notification");
    };
  }, [user?.id, isVisible]);

  const handleBellClick = async () => {
    setIsVisible(!isVisible);

    setNotifications(0);
  };

  return (
    <>
      {/* Fixed full-width topbar so it doesn't move when sidebar toggles */}
      <div className="fixed left-0 right-0 top-0 z-10 bg-white border rounded-2xl px-4 py-2 shadow-sm">
        <div className="w-full px-6 flex items-center justify-between h-16">
          {/* Left side greeting + sidebar toggle */}
          <div className="flex items-center gap-3 flex-1  ">
            {onToggleSidebar && (
              <button
                type="button"
                aria-label="Toggle sidebar"
                onClick={onToggleSidebar}
                className="inline-flex items-center justify-center rounded-full text-green-600 p-2 transition hover:bg-green-600"
              >
                {isSidebarVisible ? <X size={18} /> : <Menu size={18} color="green" className="hover:text-white" />}
              </button>
            )}
            <div className={`flex flex-col justify-center lg:items-start gap-1 transition-all duration-300 ease-in-out ${isSidebarVisible ? "lg:ml-[182px]" : "lg:ml-0"}`}>
              <h5 className="text-lg font-hove hidden lg:block font-semibold">
                Hi! {user?.name?.split(" ")[0]}
              </h5>
              <p className="text-sm hidden lg:block text-gray-500">
                Let's do something new today!
              </p>
            </div>
          </div>

          <div className="flex justify-end items-center gap-6 ml-auto">
            <div className="flex items-center justify-center gap-3">
              {/* Bell + Notification Badge */}
              <div onClick={handleBellClick} className="relative cursor-pointer">
                <Bell size={23} />
                {notifications > 0 && (
                  <div className="bg-green-600 text-white rounded-full w-5 h-5 absolute -top-1 -right-1 border-2 border-white flex items-center justify-center text-[10px] leading-none">
                    {notifications}
                  </div>
                )}
              </div>

              {/* Profile image */}
              <div className="w-10 h-10">
                <Image
                  src={user?.image || "/static/landing/course.svg"}
                  width={40}
                  height={40}
                  alt="profile-pic"
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* spacer so page content isn't hidden under the fixed topbar */}
      <div className="h-16" />

      {/* Notifications: fixed under the topbar */}
      {isVisible && (
        <div className="fixed top-5 right-4 z-50">
          <NotificationBar />
        </div>
      )}
    </>
  );
};

export default Topbar;
