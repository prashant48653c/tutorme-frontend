"use client";
import Sidebar from "@/component/reusable/Sidebar";
import Topbar from "@/component/reusable/Topbar";
import type { Metadata } from "next";
import { useState } from "react";
import { ReactNode } from "react";

const links = [
    {
    path: "/student/profile",
    name: "Dashboard",
    icon: "icon3",
  },
  {
    path: "/student/mycourse",
    name: "My Courses",
    icon: "icon1",
  },
  {
    path: "/student/session",
    name: "Sessions",
    icon: "icon6",
  },
  {
    path: "/student/products",
    name: "Products",
    icon: "icon7",
  },
  {
    path: "/student/accomplishments",
    name: "Accomplishments",
    icon: "icon2",
  },
  {
    path: "/student/wallet",
    name: "Wallet",
    icon: "icon4",
  },
  {
    path: "/student/settings",
    name: "Settings",
    icon: "icon8",
  },
  {
    path: "/student/support",
    name: "Support",
    icon: "icon5",
  },
];
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  return (
    <html lang="en">
      <body className="relative">
        <div className="flex items-start bg-gray-100 relative w-full min-h-screen">
          {/* Sidebar */}
          <div
            className={`w-0 flex-shrink-0 transition-[width] duration-300 lg:sticky lg:top-[88px] lg:h-[calc(100vh-88px)] ${
              isSidebarVisible ? "w-20 lg:w-[18%]" : "w-0 lg:w-16"
            }`}
          >
            <Sidebar
              links={links}
              isOpen={isSidebarVisible}
              onClose={() => setSidebarVisible(false)}
              collapsed={!isSidebarVisible}
            />
          </div>
          {/* Main Content */}
          <main className="flex flex-1 w-full min-w-0 px-4 sm:px-6 bg-gray-100 transition-[width] duration-300">
            <div className="w-full bg-gray-100 flex flex-col h-max">
              <div className="relative w-full bg-gray-100 mb-6">
                <Topbar
                  isSidebarVisible={isSidebarVisible}
                  onToggleSidebar={() =>
                    setSidebarVisible((prev) => !prev)
                  }
                />
              </div>
              <div className="relative mt-2 sm:mt-4">{children}</div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
