import Sidebar from "@/component/reusable/Sidebar";
import Topbar from "@/component/reusable/Topbar";
import AdminGuard from "@/components/admin/AdminGuard";
import type { Metadata } from "next";

import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sidebar Layout App",
  description: "A Next.js app with sidebar layout",
};

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const links = [
    {
      path: "/",
      name: "Manage Tutors",
      icon: "icon1",
    },
    {
      path: "/",
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
   return (
    <html lang="en">
      <body>
        <AdminGuard>
        <div className="flex w-full min-h-screen">
          {/* Sidebar */}
          <Sidebar links={links} />

          {/* Main Content */}
          <main className="flex-1 w-full p-6 bg-gray-100">
            <div className={`w-full  h-max `}>
              <Topbar />
              {children}
            </div>
          </main>
        </div>
        </AdminGuard>
      </body>
    </html>
  );
}
