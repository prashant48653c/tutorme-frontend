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
    icon: "icon1",
  },
  {
    path: "/student/mycourse",
    name: "My Courses",
    icon: "icon1",
  },
  {
    path: "/student/session",
    name: "Sessions",
    icon: "icon2",
  },
  {
    path: "/student/products",
    name: "Products",
    icon: "icon2",
  },
  {
    path: "/student/accomplishments",
    name: "Accomplishments",
    icon: "icon3",
  },
  {
    path: "/student/wallet",
    name: "Wallet",
    icon: "icon4",
  },
  {
    path: "/student/settings",
    name: "Settings",
    icon: "icon5",
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
        <div className="flex bg-gray-100 relative justify-center w-[100%] min-h-screen">
          {/* Sidebar */}
          <div
            className={`lg:w-[18%]  sm:w-[25%] w-[30%] ${
              isSidebarVisible ? "block z-50 " : "hidden"
            } `}
          >
            <Sidebar
              links={links}
              isOpen={isSidebarVisible}
              onClose={() => setSidebarVisible(false)}
            />
          </div>
          {/* Main Content */}
          <main className="flex lg:w-[82%] sm:w-[75%] w-[100%] flex-1 px-6  bg-gray-100">
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
              <div className="relative mt-8">{children}</div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
