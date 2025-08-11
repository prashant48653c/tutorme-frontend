"use client";
import Sidebar from "@/component/reusable/Sidebar";
import Topbar from "@/component/reusable/Topbar";
import type { Metadata } from "next";
import { useState } from "react";
import { Menu, X } from "lucide-react";
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
            className={`lg:w-[18%]  sm:w-[25%] w-[30%] ${
              isSidebarVisible ? "block z-50 " : "hidden"
            } `}
          >
            <Sidebar links={links} />
          </div>
          <button
            className="fixed bottom-6 left-4 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition"
            onClick={() => setSidebarVisible((prev) => !prev)}
          >
            {isSidebarVisible ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Main Content */}
          <main className="flex lg:w-[82%] sm:w-[75%] w-[100%] flex-1 px-6  bg-gray-100">
            <div className={`w-full bg-gray-100 flex flex-col h-max `}>
              <div className="relative w-full  bg-gray-100 mb-16 ">
                <nav className="p-4 fixed lg:w-[81%]    top-0 z-50 bg-gray-100 items-center flex lg:justify-between  justify-center ">
                  <Topbar />
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
