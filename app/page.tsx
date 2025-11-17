'use client'

import Course from "@/component/landing/Course";
import Hero from "@/component/landing/Hero";
import Instruction from "@/component/landing/Instruction";
import Offer from "@/component/landing/Offer";
import Tutor from "@/component/landing/Tutor";
import Navbar from "@/component/reusable/Navbar";
import Forum from "@/component/landing/Forum";
import { Onest } from "next/font/google";
import Shop from "@/component/landing/Shop";
import SignUpPopup from "@/component/auth/SignUpPop";
import Footer from "@/component/reusable/Footer";
import Blog from "@/component/landing/Blog";
import KYCVerificationModal from "@/component/auth/KycPop";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const OnestFont = Onest({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
   const user = useAuthStore((state) => state.user);
    const router = useRouter();
  
    useEffect(() => {
      if (user?.role === "TUTOR") {
        console.log("first");
        router.push("/tutor/profile");
      }
      else if(user?.role === "STUDENT"){
        console.log("second");
        router.push("/student/profile");
      }
      else if(user?.role === "ADMIN"){
        console.log("third");
        router.push("/admin/dashboard");
      }
    }, [user]);
  return (
    <div className={` ${OnestFont.className} w-full flex flex-col items-center h-fit`}>
      <Navbar />
      <Hero />
      <Tutor />
      <Offer />
      <Instruction />
      <Course />
      <Forum />
      <Shop />
      <Blog />
      <Footer />

      {/* <SignUpPopup/> */}
    </div>
  );
}
