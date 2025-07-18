'use client';
import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from '@/store/useAuthStore';




const Sidebar = ({links}:{links:any}) => {
  const user=useAuthStore((state=>state.user))
  return (
    <aside className="w-full h-screen relative bg-gray-100 text-black   ">
      <div className="flex w-[13rem] z-20 bg-gray-100  flex-col items-center  no-scrollbar absolute top-0 h-full overflow-y-auto pt-8 space-y-4">
        <div>
          <h1 className="font-extrabold text-3xl text-black">
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

        <ul className="w-full px-2">
          {links.map((link:{path:string;icon:string;name:string}, index:number) => (
            <li key={index} className="mb-2 hover:bg-[#09C4AE] rounded-3xl p-3 flex items-center hover:text-white">
              <Link
                href={link.path}
                className="flex  no-underline items-center hover:underline"
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

          <li className="mb-6 p-3  mt-36 flex items-center">
            <Link
              href="/"
              className="flex items-center hover:underline"
            >
              <Image
                src="/static/icons/logout.svg"
                width={25}
                height={25}
                alt="icon"
                className="mr-2"
              />
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar