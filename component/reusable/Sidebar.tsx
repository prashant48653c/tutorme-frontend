'use client';
import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/hooks/axios';
import { usePathname, useRouter } from 'next/navigation';

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
  
  const handleLogout=async()=>{
    try {
      await api.post("/auth/logout");
      logout();
      router.push("/")
      
    } catch (error) {
      console.log(error)
    }
  }

  const showMobileOverlay = Boolean(onClose) && isOpen;
  const isCollapsed = collapsed;

  return (
    <aside className="w-full border relative bg-white text-black h-full">
      <div className=" lg:hidden">
        <div
          aria-hidden={!showMobileOverlay}
          className={`fixed inset-0 z-[50] bg-black/70 transition-opacity duration-900 ${showMobileOverlay ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0"}`}
          onClick={() => onClose?.()}
        />
      </div>
      <div
        className={`flex w-[40%] z-50 lg:z-[50] bg-white flex-col items-start no-scrollbar overflow-y-auto fixed top-0 h-full pt-6 space-y-4 xs:w-[55%] sm:w-[40%] md:w-[30%] lg:static lg:flex-shrink-0 lg:w-full transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{
          width: isCollapsed ? "4.5rem" : undefined,
        }}
      >
        <div className="w-full flex justify-center px-2">
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
        </div>

        {!isCollapsed && (
          <div className="text-center flex flex-col items-center my-8 pl-[4rem]">
            <div className="w-24 h-24 overflow-hidden rounded-full">
              <Image
                src={user?.image || "/icons/profile.png"}
                alt="profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <h5 className="mt-1 text-lg text-green-600 font-hove font-semibold">
           {user?.name}
            </h5>
            <p className="font-hove text-sm text-gray-500">
           {user?.tutorProfile?.jobTitle}

            </p>
          </div>
        )}

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

           <li onClick={handleLogout} className={`group mb-6 rounded-3xl flex items-center hover:bg-red-500 mt-10 ${isCollapsed ? "p-2 justify-center" : "p-3 w-fit"}`}>
            <div
               
              className="flex items-center transition group-hover:invert"
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
  );
};

export default Sidebar
