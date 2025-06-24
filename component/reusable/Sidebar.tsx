import React from 'react'
import Image from "next/image";
import Link from "next/link";



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
const Sidebar = () => {
  return (
   <aside className="w-[18%] pt-8 bg-gray-100 text-black p-4">
            <nav className="space-y-4 flex flex-col items-center">
              <div>
                <h1 className="font-extrabold text-3xl text-black">
                  TUTOR<span className="text-green-400">ME</span>
                </h1>
              </div>

              <div className="text-center flex flex-col items-center my-10">
                <div className="w-24 h-24 overflow-hidden rounded-full">
                  <Image
                    src="/static/landing/course.svg"
                    alt="profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h5 className="mt-1 text-lg text-green-600 font-medium">
                  Sandesh Poudel
                </h5>
                <p className="text-xs text-gray-500">Software Engineer</p>
              </div>
              <ul>
                {links.map((link, index) => (
                  <li key={index} className="mb-2 p-3  flex items-center">
                    <Link
                      href={link.path}
                      className="flex items-center hover:underline"
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
              </ul>
            </nav>
          </aside>
  )
}

export default Sidebar