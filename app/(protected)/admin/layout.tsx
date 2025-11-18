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
 const [isSidebarVisible, setSidebarVisible] = useState(true);

   return (
    <html lang="en">
      <body>
        <AdminGuard>
        <div className="flex pb-5 bg-gray-100 overflow-y-hidden relative justify-center w-[100%]">
          {/* Sidebar */}
          <div
            className={`w-[30%] sm:w-[25%] lg:w-[15%] md:[25%]   ${
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
          <main className="flex lg:w-[85%] sm:w-[75%] w-[100%] flex-1 px-6  bg-gray-100">
            <div className={`w-full bg-gray-100 flex flex-col h-max `}>
              <div className="relative w-full  bg-gray-100 mb-16 ">
                <nav className="p-4 fixed lg:w-[81%] top-0 z-50 bg-gray-100 items-center flex lg:justify-between md:justify-between  justify-center ">
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
