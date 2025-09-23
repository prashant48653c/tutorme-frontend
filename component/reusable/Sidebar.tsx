'use client';
import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/hooks/axios';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';




const Sidebar = ({links}:{links:any}) => {
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
  return (
    <aside className="w-full border h-screen relative bg-gray-100 text-black   ">
      <div className="flex lg:w-[18%] w-[25%] z-20 bg-gray-100  flex-col items-center  no-scrollbar  overflow-y-auto  fixed top-0 h-full pt-8 space-y-4">
        <div>
          <h1 onClick={() => router.push("/")} className="font-extrabold cursor-pointer text-3xl text-black">
            TUTOR<span className="text-primeGreen">ME</span>
          </h1>
        </div>

        <div className="text-center flex flex-col items-center my-10">
          <div className="w-24 h-24 overflow-hidden rounded-full">
            <Image
              src={user?.image || "/static/landing/course.svg"}
              alt="profile"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <h5 className="mt-1 text-lg text-green-600 font-medium">
         {user?.name}
          </h5>
          <p className="text-xs text-gray-500">
         {user?.tutorProfile?.jobTitle}

          </p>
        </div>

        <ul className="w-full decoration-0 no-underline px-2">
          {links.map((link:{path:string;icon:string;name:string}, index:number) => (
            <li key={index} className={`mb-2 ${params == link.path ? "bg-green-400 text-white ": "bg-transparent"} hover:bg-[#09C4AE] rounded-3xl p-3 flex items-center  hover:text-white`}>
              <Link
                href={link.path}
                className="flex  no-underline items-center"
              >
                <Image
                  src={`/static/icons/${link.icon}.svg`}
                  width={25}
                  height={25}
                  alt="icon"
                  className="mr-2"
                />
                {link.name}
              </Link>
            </li>
          ))}

           <li onClick={handleLogout} className="mb-6 hover:bg-red-500 rounded-3xl p-3 flex items-center hover:text-white  mt-36  ">
            <div
               
              className="flex items-center  hover:underline"
            >
              <Image
                src="/static/icons/logout.svg"
                width={25}
                height={25}
                alt="icon"
                className="mr-2"
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