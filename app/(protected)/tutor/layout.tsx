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
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  return (
    <html lang="en">
      <body className="min-h-screen overflow-y-auto bg-gray-100">
        <div className="flex items-start bg-gray-100 relative w-full min-h-screen overflow-y-auto">
          {/* Sidebar */}
          <div
            className={`flex-shrink-0 transition-[width] duration-300 w-0 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] ${
              isSidebarVisible ? "lg:w-[18%]" : "lg:w-16"
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
          <main className="flex flex-1 px-4 sm:px-6 bg-gray-100 transition-[width] duration-300 overflow-y-auto">
            <div className="w-full bg-gray-100 flex flex-col h-max">
              <div className="relative w-full bg-gray-100 mb-16">
                <nav className="fixed w-full top-0 z-50 bg-gray-100 items-center flex lg:justify-between md:justify-between justify-center p-0 sm:p-0 lg:p-4">
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
