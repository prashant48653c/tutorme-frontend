import Sidebar from "@/component/reusable/Sidebar";
import type { Metadata } from "next";

import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sidebar Layout App",
  description: "A Next.js app with sidebar layout",
};

const links = [
  {
    path: "/",
    name: "My Courses",
    icon: "icon1",
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
  return (
    <html lang="en">
      <body>
        <div className="flex w-full min-h-screen">
          {/* Sidebar */}
         <Sidebar/>

          {/* Main Content */}
          <main className="flex-1 w-full p-6 bg-gray-100">{children}</main>
        </div>
      </body>
    </html>
  );
}
