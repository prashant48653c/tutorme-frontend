'use client'
import Sidebar from "@/component/reusable/Sidebar";
import Topbar from "@/component/reusable/Topbar";
import AdminGuard from "@/components/admin/AdminGuard";
import type { Metadata } from "next";

import { ReactNode, useState } from "react";

 
  const links = [
    {
      path: "/admin/dashboard",
      name: "Manage Tutors",
      icon: "icon2",
    },
    {
      path: "/admin/course",
      name: "Manage Courses",

      icon: "icon1",
    },
    {
      path: "/",
      name: "Manage Ticket",

      icon: "icon5",
    },
    {
      path: "/admin/blogs",
      name: "Manage Blogs",

      icon: "icon5",
    },
    {
      path: "/",
      name: "Forum Surveillence",

      icon: "icon4",
    },
    {
      path: "/",
      name: "Analytics",

      icon: "icon3",
    }
  ];
export default function ProtectedLayout({ children }: { children: ReactNode }) {
 const [isSidebarVisible, setSidebarVisible] = useState(false);

  return (
   <html lang="en">
      <body className="min-h-screen bg-gray-100 overflow-visible">
        <AdminGuard>
        <div className="flex items-start pb-5 bg-gray-100 relative w-[100%] min-h-screen overflow-visible">
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
          <main className="flex flex-1 px-4 sm:px-6 bg-gray-100 transition-[width] duration-300 overflow-visible">
            <div className={`w-full bg-gray-100 flex flex-col h-max `}>
              <div className="relative w-full  bg-gray-100 mb-16 ">
                <nav className="p-0 sm:p-0 lg:p-4 fixed w-full top-0 z-50 bg-gray-100 items-center flex lg:justify-between md:justify-between  justify-center ">
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
        </AdminGuard>
      </body>
    </html>
  );
}
