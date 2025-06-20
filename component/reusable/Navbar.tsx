import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Onest } from 'next/font/google'
import SignUp from "../auth/SignUpPop";



const Navbar = () => {
  const links = [
    {
      path: "/",
      name: "About Us",
    },
    {
      path: "/",
      name: "Courses",
    },
    {
      path: "/",
      name: "Shop",
    },
    {
      path: "/",
      name: "Find Tutors",
    },
    {
      path: "/",
      name: "Contact Us",
    },
  ];

  return (
    <nav className={` flex   justify-center items-center`}>
    <div className="w-[80%] shadow-xl bg-[#061826] items-center px-4 py-2 my-5 flex justify-between rounded-4xl">

      <div>
        {/* <Image /> */}
        <h1 className="font-extrabold text-white">
          TUTOR<span className="text-green-400">ME</span>
        </h1>
      </div>
      <ul className="flex items-center justify-center gap-x-5">
        {links.map((link, i) => {
          return (
            <li className="text-white text-sm " key={i}>
              <Link href={link.path} >{link.name}</Link>
            </li>
          );
        })}
      </ul>
      <div>
        <SignUp/>
      </div>
      
    </div>
    </nav>

  );
};

export default Navbar;
