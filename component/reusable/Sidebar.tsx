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
};

const Sidebar = ({ links, isOpen = true, onClose }: SidebarProps) => {
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

  return (
    <aside className="w-full border  relative bg-white text-black">
      <div className=" lg:hidden">
        <div
          aria-hidden={!showMobileOverlay}
          className={`fixed inset-0 z-[50] bg-black/70 transition-opacity duration-900 ${showMobileOverlay ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0"}`}
          onClick={() => onClose?.()}
        />
      </div>
      <div
        className={`flex w-[40%] z-50 lg:z-[50] bg-white flex-col items-center no-scrollbar overflow-y-auto fixed top-0 h-full pt-8 space-y-4 xs:w-[55%] sm:w-[40%] md:w-[30%] lg:static lg:w-full lg:flex-shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <h1 onClick={() => router.push("/")} className="font-extrabold cursor-pointer text-3xl text-black">
            TUTOR<span className="text-primeGreen">ME</span>
          </h1>
        </div>

        <div className="text-center flex flex-col items-center my-10">
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

        <ul className="w-full decoration-0 no-underline px-2 ml-5 mr-5">
  {links.map((link, index) => (
    <li
      key={index}
      className={`group mb-2 ${
        params === link.path ? "bg-green-400 text-white" : "bg-transparent"
      } hover:bg-[#09C4AE] rounded-3xl p-3 flex items-center hover:text-white`}
    >
      <Link href={link.path} className="flex no-underline items-center">
        <Image
          src={`/static/icons/${link.icon}.svg`}
          width={25}
          height={25}
          alt="icon"
          className={`mr-2 transition group-hover:invert ${params === link.path ? "invert" : ""}`}
        />
        {link.name}
      </Link>
    </li>
  ))}

           <li onClick={handleLogout} className="group mb-6 rounded-3xl p-3 flex items-center hover:bg-red-500 mt-28 w-fit !important">
            <div
               
              className="flex items-center transition group-hover:invert"
            >
              <img
                src="/static/icons/logout.svg"
                width={25}
                height={25}
                alt="icon"
                className="mr-2 hover:fill-red-500"
              />
              Logout
            </div>
          </li>
        </ul>
       
      </div>
    </aside>
  );
};

export default Sidebar
