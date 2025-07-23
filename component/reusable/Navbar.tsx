"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, BookOpen, CreditCard } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import SignUpModal from "@/component/auth/SignUpPop"
import LoginModal from "@/component/auth/loginPopup"
import InstructorModal from "@/component/auth/instructor-signup"
import { useAuthStore } from "@/store/useAuthStore"

const Navbar = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const { user, logout } = useAuthStore()

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
  ]

  const openModal = (modalType: string) => {
    setActiveModal(modalType)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const handleLogout = () => {
    logout()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <nav className="flex justify-center items-center">
        <div className="w-[80%] shadow-xl bg-[#061826] items-center px-4 py-2 my-5 flex justify-between rounded-4xl">
          <div>
            <h1 className="font-extrabold text-white">
              TUTOR<span className="text-green-400">ME</span>
            </h1>
          </div>

          <ul className="flex items-center justify-center gap-x-5">
            {links.map((link, i) => {
              return (
                <li className="text-white text-sm" key={i}>
                  <Link href={link.path}>{link.name}</Link>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-auto px-3 rounded-full hover:bg-white/10">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-green-400 text-white text-xs font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white text-sm font-medium hidden md:block">{user.name}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>My Courses</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                 
                  className="font-bold bg-green-400   py-4 hover:bg-green-600 cursor-pointer rounded-full text-white"
                  onClick={() => openModal("login")}
                >
                  Login
                </Button>
                {/* <Button
                  className="font-bold rounded-3xl px-6 bg-green-400 hover:bg-green-500"
                  onClick={() => openModal("signup")}
                >
                  Sign Up
                </Button> */}
              
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Modals */}
      <SignUpModal isOpen={activeModal === "signup"} onClose={closeModal} onSwitchToLogin={() => openModal("login")} />  


      <LoginModal isOpen={activeModal === "login"} onClose={closeModal} onSwitchToSignUp={() => openModal("signup")} />
     
    </>
  )
}

export default Navbar
