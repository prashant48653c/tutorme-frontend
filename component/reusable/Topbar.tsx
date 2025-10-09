"use client";

import NotificationBar from "@/components/NotificationBar";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { requestNotificationToken } from "@/firebase";
import api from "@/hooks/axios";
import { initClientSocket } from "@/hooks/socket";
import { useAuthStore } from "@/store/useAuthStore";
import { Bell, Search } from "lucide-react";
import Image from "next/image";
import React from "react";

const Topbar = () => {
  const user = useAuthStore((state) => state.user);
const [notifications, setNotifications] = React.useState<number>(0);
const [isVisible, setIsVisible] = React.useState(false);

const fetchNotifications=async()=>{
  try {
    const res=await api.get(`/notifications/counts/${user?.id}`);

    console.log(res.data.data, "Counts")
    setNotifications(res.data.data)
  } catch (error) {
    
  }
}



  React.useEffect(() => {
    fetchNotifications()
    if (!user?.id) return;

    const socket = initClientSocket(user.id.toString());

    socket.on("notification", (payload) => {
      console.log("📩 Notification received:", payload);
      setNotifications((prev) => prev + 1);
    });

    return () => {
      socket.off("notification");
    };
  }, [user?.id,isVisible]);

  const handleBellClick=async()=>{
    setIsVisible(!isVisible);
  const t= await requestNotificationToken();
  console.log(t)
      setNotifications(0);   
    
  }

  return (
    <>
      {/* Left side greeting */}
      <div className="flex relative w-full flex-col justify-center lg:items-start gap-1">
        <h5 className="text-lg hidden lg:block font-medium">
          Hi! {user?.name?.split(" ")[0]}
        </h5>
        <p className="text-sm hidden lg:block text-gray-500">
          Let’s do something new today!
        </p>
      </div>

      {/* Right side search + actions */}
      <div className="flex items-center md:pr-0 pr-[4rem]">
        {/* Search */}
        <div className="flex items-center border rounded-lg bg-[#F5F7F9] p-2 gap-2 justify-center">
          <Search size={18} />
          <input
            className="border-0 md:min-w-[20rem] min-w-[10rem] outline-0 bg-transparent"
            placeholder="Search.."
          />
        </div>

        {/* Actions */}
        <div className="flex ml-6 items-center justify-center gap-2">
          {/* Bell + Notification Badge */}
          <div onClick={handleBellClick} className="relative">
            <Bell  size={23} />
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

        {
          isVisible && <div className="absolute top-12 right-0"><NotificationBar /></div>
        }
      </div>
    </>
  );
};

export default Topbar;
