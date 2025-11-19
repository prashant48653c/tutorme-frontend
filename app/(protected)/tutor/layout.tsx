"use client";
import Sidebar from "@/component/reusable/Sidebar";
import Topbar from "@/component/reusable/Topbar";
import type { Metadata } from "next";
import { useState } from "react";
import { ReactNode } from "react";

const links = [
  {
    path: "/tutor/mycourse",
    name: "My Courses",
    icon: "icon1",
  },
  {
    path: "/tutor/session",
    name: "Session",
    icon: "icon2",
  },
  {
    path: "/",
    name: "Accomplishments",
    icon: "icon2",
  },
  {
    path: "/",
    name: "Analytics",
    icon: "icon3",
  },
  {
    path: "/",
    name: "Wallet",
    icon: "icon4",
  },
  {
    path: "/",
    name: "Support",
    icon: "icon5",
  },
];
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  return (
    <html lang="en">
      <body className="relative">
        <div className="flex bg-gray-100 relative justify-center w-[100%] min-h-screen">
          {/* Sidebar */}
          <div
            className={`flex-shrink-0 transition-[width] duration-300 ${
              isSidebarVisible ? "w-[30%] sm:w-[20%] lg:w-[15%]" : "w-0"
            }`}
          >
            <Sidebar
              links={links}
              isOpen={isSidebarVisible}
              onClose={() => setSidebarVisible(false)}
            />
          </div>
          {/* Main Content */}
          <main className="flex flex-1 px-6 bg-gray-100 transition-[width] duration-300">
            <div className={`w-full bg-gray-100 flex flex-col h-max `}>
              <div className="relative w-full  bg-gray-100 mb-16 ">
                <nav className="p-4 fixed lg:w-[81%]    top-0 z-50 bg-gray-100 items-center flex lg:justify-between  justify-center ">
                  <Topbar
                    isSidebarVisible={isSidebarVisible}
                    onToggleSidebar={() =>
                      setSidebarVisible((prev) => !prev)
                    }
                  />
                </nav>
              </div>
              <div className="relative">{children}</div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
