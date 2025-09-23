// components/LoginModal.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { useLogin } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import GoogleButton from "./GoogleAuth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
}: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  const loginMutation = useLogin();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginMutation.mutateAsync(data);
      console.log(res, "Login");
      setUser(res.data.user);
      if (res.data.user.role === "TUTOR") {
        router.push("/tutor/profile");
      } else if (res.data.user.role == "ADMIN") {
        router.push("/admin/dashboard");
      }else{
        router.push("/student/profile");
      }
      reset();
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[50rem] p-0 bg-white rounded-3xl">
        <div className="grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 flex items-center justify-center rounded-l-3xl">
            <div className="relative w-full max-w-sm">
              <div className="relative">
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

                <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-4 shadow-lg transform -rotate-6 absolute top-16 right-0">
                  <div className="w-8 h-8 bg-white rounded-full mb-2"></div>
                  <div className="bg-white/80 h-2 rounded mb-1"></div>
                  <div className="bg-white/80 h-2 rounded w-2/3"></div>
                </div>

                <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl p-4 shadow-lg transform rotate-12 absolute bottom-0 left-4">
                  <div className="w-6 h-6 bg-white rounded mb-2"></div>
                  <div className="bg-white/80 h-2 rounded mb-1"></div>
                  <div className="bg-white/80 h-2 rounded w-1/2"></div>
                </div>

                <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-400 rounded-full"></div>
                <div className="absolute -bottom-8 -left-2 w-6 h-6 bg-purple-400 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="p-8 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
                <p className="text-cyan-500 font-medium">{"Let's Dive in."}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

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
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-cyan-500 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Or Login with
                    </span>
                  </div>
                </div>

            <GoogleButton role="STUDENT" />

                <p className="text-center text-sm text-gray-600 mt-6">
                  {"Don't have an account ?"}{" "}
                  <button
                    type="button"
                    onClick={onSwitchToSignUp}
                    className="text-cyan-500 hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
