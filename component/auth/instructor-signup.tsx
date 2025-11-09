"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema, SignUpFormData } from "@/lib/validations/auth"
import { useRegister } from "@/hooks/useAuth"
import { useAuthStore } from "@/store/useAuthStore"
import { RegisterRequest } from "@/types/auth"
import GoogleButton from "./GoogleAuth"

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export default function SignUpModal({ isOpen, onClose, onSwitchToLogin }: SignUpModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const isLoading = useAuthStore((state) => state.isLoading)
  const registerMutation = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      agreedToTerms: false,
    },
  })

  const agreedToTerms = watch("agreedToTerms")

  const onSubmit = async (data: SignUpFormData) => {
    const registerData: RegisterRequest = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
      role: "TUTOR",
      phoneNumber: data.phoneNumber,
      fcmToken:""
    }

    try {
      await registerMutation.mutateAsync(registerData)
      onClose() 
    } catch (error) {
     
      console.error('Registration failed:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[60rem] p-0 bg-white rounded-3xl">
        <div className="grid md:grid-cols-2">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Become an Instructor</h2>
              <p className="text-cyan-500 font-medium">{"Let's get your setup ready."}</p>
            </div>

            <div className="max-w-sm mx-auto w-full overflow-y-auto" style={{ maxHeight: "calc(90vh - 104px)" }}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="sr-only">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="First Name"
                      className="bg-gray-50 border-0 h-12"
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="sr-only">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Last Name"
                      className="bg-gray-50 border-0 h-12"
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="sr-only">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      className="bg-gray-50 border-0 h-12"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className="sr-only">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Phone Number"
                      className="bg-gray-50 border-0 h-12"
                      {...register("phoneNumber")}
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
                    )}
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
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                  )}
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
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setValue("agreedToTerms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600">
                    I agree with the{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms and Conditions
                    </a>
                  </Label>
                </div>
                {errors.agreedToTerms && (
                  <p className="text-red-500 text-xs mt-1">{errors.agreedToTerms.message}</p>
                )}

                {/* Create Account Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg"
                  disabled={!agreedToTerms || isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
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
             <GoogleButton role="TUTOR" />

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600 mt-6">
                  Already a tutor?{" "}
                  <button type="button" onClick={onSwitchToLogin} className="text-cyan-500 hover:underline font-medium">
                    Login
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}