import Sidebar from "@/component/reusable/Sidebar";
import Topbar from "@/component/reusable/Topbar";
import type { Metadata } from "next";

import { ReactNode } from "react";

export const metadata: Metadata = {
 title: "Tutor Dashboard",
  description: "Dashboard for tutor",
};

const links = [
  {
    path: "/tutor/mycourse",
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
        <div className="flex bg-gray-100 relative justify-center w-[100%] min-h-screen">
          {/* Sidebar */}
          <div className="w-[18%]">
          <Sidebar links={links} />
            
          </div>

          {/* Main Content */}
          <main className="flex w-[82%] px-6  bg-gray-100">
            <div className={`w-full bg-gray-100 flex flex-col h-max `}>
              <Topbar />
              <div className="relative">
              {children}

              </div>
            </div>
          </main>

        </div>
      </body>
    </html>
  );
}
