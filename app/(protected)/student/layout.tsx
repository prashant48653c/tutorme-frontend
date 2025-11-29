"use client";
import Sidebar from "@/component/reusable/Sidebar";
import Topbar from "@/component/reusable/Topbar";
import { useState, ReactNode } from "react";

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
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const desktopSidebarWidth = isSidebarVisible ? "lg:w-64" : "lg:w-16";
  const mobileWrapperState = isSidebarVisible
    ? "pointer-events-auto"
    : "pointer-events-none";
  const mobileWrapperVisibility = isSidebarVisible ? "block" : "hidden";

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar
        isSidebarVisible={isSidebarVisible}
        onToggleSidebar={() => setSidebarVisible((prev) => !prev)}
      />

      {/* Mobile sidebar overlay (kept mounted for smooth transition) */}
      <div
        className={`lg:hidden ${mobileWrapperVisibility} fixed inset-y-0 left-0 z-[60] w-full ${mobileWrapperState}`}
        aria-hidden={!isSidebarVisible}
      >
        <Sidebar
          links={links}
          isOpen={isSidebarVisible}
          onClose={() => setSidebarVisible(false)}
          collapsed={false}
        />
      </div>

      <div className="flex w-full bg-gray-100">
        {/* Desktop sticky sidebar */}
        <div
          className={`hidden lg:block ${desktopSidebarWidth} transition-all duration-300`}
        >
          <div className="sticky top-16 h-[calc(100vh-64px)]">
            <Sidebar links={links} isOpen collapsed={!isSidebarVisible} />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pb-10 pt-20">
          <div className="max-w-screen-2xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
