"use client";

import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { useAuthStore } from "@/store/useAuthStore";
import { Bell, Search } from "lucide-react";
import Image from "next/image";
import React from "react";

const Topbar = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="relative bg-gray-100 mb-16 ">
      <nav className="w-[80%]  p-4 fixed top-0 z-50 bg-gray-100 items-center flex justify-between">
        <div className="flex w-full flex-col items-start gap-1">
          <h5 className="text-lg font-medium">
            Hi! {user?.name?.split(" ")[0]}
          </h5>
          <p className="text-sm text-gray-500">
            Let’s do something new today!
          </p>
        </div>

        <div className="flex items-center">
          <div className="flex items-center border rounded-lg bg-[#F5F7F9] p-2 gap-2 justify-center">
            <Search size={18} />
            <input
              className="border-0 min-w-[20rem] outline-0 hover:outline-0 bg-transparent"
              placeholder="Search.."
            />
          </div>

          <div className="flex ml-6 items-center justify-center gap-2">
            <div className="relative">
              <Bell fill="black" size={23} />
              <div className="bg-green-600 rounded-full w-3 h-3 absolute top-[-2px] right-0 border-2 border-white" />
            </div>
            <div className="w-10 h-10">
              <Image
                src={user?.image || "/static/landing/course.svg"}
                width={40}
                height={40}
                alt="profile"
                className="rounded-full object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Topbar;
