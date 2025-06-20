"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  return (
    <div className="">
      <Dialog>  
        <DialogTrigger asChild>
          <Button className="font-bold rounded-3xl px-9 bg-green-400">Sign Up</Button>
        </DialogTrigger>

        <DialogContent className="min-w-[60rem] rou p-0 bg-white rounded-3xl ">
          <div className="grid md:grid-cols-2 ">
            {/* Left side - Illustration */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                <div className="relative">
                  {/* 3D Browser Window */}
                  <div className="bg-white rounded-2xl p-4 shadow-lg transform rotate-3 mb-4">
                    <div className="flex gap-2 mb-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="bg-blue-500 h-8 rounded mb-2"></div>
                    <div className="bg-gray-200 h-2 rounded mb-1"></div>
                    <div className="bg-gray-200 h-2 rounded w-3/4"></div>
                  </div>

                  {/* Profile Card */}
                  <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-4 shadow-lg transform -rotate-6 absolute top-16 right-0">
                    <div className="w-8 h-8 bg-white rounded-full mb-2"></div>
                    <div className="bg-white/80 h-2 rounded mb-1"></div>
                    <div className="bg-white/80 h-2 rounded w-2/3"></div>
                  </div>

                  {/* Settings Card */}
                  <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl p-4 shadow-lg transform rotate-12 absolute bottom-0 left-4">
                    <div className="w-6 h-6 bg-white rounded mb-2"></div>
                    <div className="bg-white/80 h-2 rounded mb-1"></div>
                    <div className="bg-white/80 h-2 rounded w-1/2"></div>
                  </div>

                  {/* Gear Icons */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-400 rounded-full"></div>
                  <div className="absolute -bottom-8 -left-2 w-6 h-6 bg-purple-400 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
         <div className="p-8 flex flex-col max-h-[90vh]">
  <div className="max-w-sm mx-auto w-full text-center mb-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h2>
    <p className="text-cyan-500 font-medium">{"Let's get your setup ready."}</p>
  </div>

               <div className="max-w-sm mx-auto w-full overflow-y-auto" style={{ maxHeight: "calc(90vh - 104px)" }}>
    <form className="space-y-4">
              
 
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="sr-only">
                        First Name
                      </Label>
                      <Input id="firstName" placeholder="First Name" className="bg-gray-50 border-0 h-12" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="sr-only">
                        Last Name
                      </Label>
                      <Input id="lastName" placeholder="Last Name" className="bg-gray-50 border-0 h-12" />
                    </div>
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="sr-only">
                        Email
                      </Label>
                      <Input id="email" type="email" placeholder="Email" className="bg-gray-50 border-0 h-12" />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="sr-only">
                        Phone Number
                      </Label>
                      <Input id="phone" type="tel" placeholder="Phone Number" className="bg-gray-50 border-0 h-12" />
                    </div>
                  </div>

                  {/* Password Fields */}
                  <div className="relative">
                    <Label htmlFor="password" className="sr-only">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="bg-gray-50 border-0 h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Label htmlFor="confirmPassword" className="sr-only">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="bg-gray-50 border-0 h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-600">
                      I agree with the{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Terms and Conditions
                      </a>
                    </Label>
                  </div>

                  {/* Create Account Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg"
                    disabled={!agreedToTerms}
                  >
                    Create Account
                  </Button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or Login with</span>
                    </div>
                  </div>

                  {/* Google Sign In */}
                  <Button type="button" variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  {/* Login Link */}
                  <p className="text-center text-sm text-gray-600 mt-6">
                    Already a student?{" "}
                    <a href="#" className="text-cyan-500 hover:underline font-medium">
                      Login
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
