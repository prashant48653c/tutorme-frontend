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
import { User, Settings, LogOut, BookOpen, CreditCard, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import SignUpModal from "@/component/auth/SignUpPop"
import LoginModal from "@/component/auth/loginPopup"
import InstructorModal from "@/component/auth/instructor-signup"
import { useAuthStore } from "@/store/useAuthStore"

const Navbar = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
    setIsMobileMenuOpen(false) // Close mobile menu when opening modal
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false) // Close mobile menu after logout
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
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
      <nav className=" sticky flex justify-center w-full  items-center ">
        <div className="w-[85%] md:w-[80%] shadow-xl bg-[#061826] items-center px-4 py-2 my-5 flex justify-between rounded-4xl relative text-4xl">
          {/* Logo */}
          <div>
            <h1 className="titleFont text-white font-hove">
              TUTOR<span className="text-green-400">ME</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center justify-center gap-x-5">
            {links.map((link, i) => {
              return (
                <li className="text-white text-xl" key={i}>
                  <Link href={link.path}>{link.name}</Link>
                </li>
              )
            })}
          </ul>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
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
                      <span className="text-white text-sm font-medium">{user.name}</span>
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
                  className="font-bold bg-primaryGreen py-4 hover:bg-green-600 cursor-pointer rounded-full text-white"
                  onClick={() => openModal("login")}
                >
                  Login
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button and User Avatar */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-green-400 text-white text-xs font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-2"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#061826] rounded-lg shadow-xl border border-gray-700 z-999 mx-4">
              {/* Navigation Links */}
              <div className="py-2">
                {links.map((link, i) => (
                  <Link 
                    href={link.path} 
                    key={i}
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-700 py-2">
                {user ? (
                  <>
                    {/* User Info */}
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-white text-sm font-medium">{user.name}</p>
                      <p className="text-gray-400 text-xs">{user.email}</p>
                    </div>
                    
                    {/* User Menu Items */}
                    <div className="py-1">
                      <button className="flex items-center w-full px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors">
                        <User className="mr-3 h-4 w-4" />
                        Profile
                      </button>
                      <button className="flex items-center w-full px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors">
                        <BookOpen className="mr-3 h-4 w-4" />
                        My Courses
                      </button>
                      <button className="flex items-center w-full px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors">
                        <CreditCard className="mr-3 h-4 w-4" />
                        Billing
                      </button>
                      <button className="flex items-center w-full px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors">
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-3">
                    <Button
                      className="w-full font-bold bg-green-400 hover:bg-green-600 rounded-full text-white"
                      onClick={() => openModal("login")}
                    >
                      Login
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden" 
          onClick={closeMobileMenu}
        />
      )}

      {/* Modals */}
      <SignUpModal isOpen={activeModal === "signup"} onClose={closeModal} onSwitchToLogin={() => openModal("login")} />  
      <LoginModal isOpen={activeModal === "login"} onClose={closeModal} onSwitchToSignUp={() => openModal("signup")} />
    </>
  )
}

export default Navbar