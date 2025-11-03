'use client'
import Sidebar from "@/component/reusable/Sidebar";
import Topbar from "@/component/reusable/Topbar";
import AdminGuard from "@/components/admin/AdminGuard";
import { Menu, X } from "lucide-react";
import type { Metadata } from "next";

import { ReactNode, useState } from "react";

 
  const links = [
    {
      path: "/admin/dashboard",
      name: "Manage Tutors",
      icon: "icon1",
    },
    {
      path: "/admin/course",
      name: "Manage Courses",

      icon: "icon2",
    },
    {
      path: "/",
      name: "Manage Ticket",

      icon: "icon4",
    },
    {
      path: "/",
      name: "Forum Surveillence",

      icon: "icon5",
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
              <div className="relative mt-8">{children}</div>
            </div>
          </main>
        </div>
        </AdminGuard>
      </body>
    </html>
  );
}
