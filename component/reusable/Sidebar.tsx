'use client';
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/hooks/axios';
import { usePathname, useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

type SidebarProps = {
  links: Array<{ path: string; icon: string; name: string }>;
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
};

const Sidebar = ({ links, isOpen = true, onClose, collapsed = false }: SidebarProps) => {
  const router=useRouter()
  const params=usePathname();
  console.log(params)
  const {user,logout}=useAuthStore()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleLogout=async()=>{
    setIsLoggingOut(true);
    try {
      await api.post("/auth/logout");
      logout();
      router.push("/");
      
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
      toast.success("Logged Out Successfully");
    }
  }

  const showMobileOverlay = Boolean(onClose) && isOpen;
  const isCollapsed = collapsed;

  return (
    <>
    {mounted && showLogoutConfirm && createPortal(
      <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}
        />
        <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 bouncy-popup">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.75 6a.75.75 0 1 1 1.5 0v5a.75.75 0 0 1-1.5 0v-5Zm0 8a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Confirm log out?</h3>
              <p className="text-sm text-gray-600 mt-1">
                You can always sign back in later. Do you want to continue?
              </p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              className="w-1/2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
              onClick={() => setShowLogoutConfirm(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-1/2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-200 hover:bg-red-600 transition disabled:opacity-60"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </div>
      </div>, document.body
    )}
    <aside className="w-full border relative bg-white text-black h-full">
      <div className=" lg:hidden">
        <div
          aria-hidden={!showMobileOverlay}
          className={`fixed inset-0 z-[50] bg-black/70 transition-opacity duration-900 ${showMobileOverlay ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0"}`}
          onClick={() => onClose?.()}
        />
      </div>
      <div
        className={`flex w-[80vw] max-w-xs sm:max-w-sm z-50 lg:z-[50] bg-white flex-col items-start no-scrollbar overflow-y-auto fixed top-16 h-[calc(100vh-64px)] pt-6 space-y-4 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] lg:flex-shrink-0 lg:w-full transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{
          width: isCollapsed ? "4.5rem" : undefined,
        }}
      >
        {/* <div className="w-full flex justify-center px-2">
          <h1
            onClick={() => router.push("/")}
            className={`font-extrabold cursor-pointer text-black transition-all duration-200 ${
              isCollapsed ? "text-xl" : "text-3xl"
            }`}
          >
            {isCollapsed ? (
              <span className="text-primeGreen">TM</span>
            ) : (
              <>
                TUTOR<span className="text-primeGreen">ME</span>
              </>
            )}
          </h1>
        </div> */}

        <ul className={`w-full decoration-0 no-underline ${isCollapsed ? "px-1" : "px-3"}`}>
  {links.map((link, index) => (
    <li
      key={index}
      className={`group mb-2 ${
        params === link.path ? "bg-green-400 text-white" : "bg-transparent"
      } hover:bg-[#09C4AE] rounded-3xl ${isCollapsed ? "p-2 justify-center" : "p-3"} flex items-center hover:text-white`}
    >
      <Link href={link.path} className={`flex no-underline items-center ${isCollapsed ? "justify-center w-full" : "gap-3 w-full"}`}>
        <Image
          src={`/static/icons/${link.icon}.svg`}
          width={25}
          height={25}
          alt="icon"
          className={`transition group-hover:invert ${params === link.path ? "invert" : ""} ${isCollapsed ? "mr-0" : "mr-2"}`}
        />
        <span className={`${isCollapsed ? "hidden" : "inline"}`}>{link.name}</span>
      </Link>
    </li>
  ))}

           <li onClick={() => setShowLogoutConfirm(true)} className={`group mb-6 rounded-3xl flex items-center hover:bg-red-500 mt-10 ${isCollapsed ? "p-2 justify-center" : "p-3 w-full"}`}>
            <div         
              className="flex items-center gap-3 transition group-hover:invert"
            >
              <img
                src="/static/icons/logout.svg"
                width={25}
                height={25}
                alt="icon"
                className={`${isCollapsed ? "mr-0" : "mr-2"} hover:fill-red-500`}
              />
              <span className={`${isCollapsed ? "hidden" : "inline"}`}>Logout</span>
            </div>
          </li>
        </ul>
      </div>
    </aside>
    </>
  );
};

export default Sidebar
