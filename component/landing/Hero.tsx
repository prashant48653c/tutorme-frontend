"use client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { Trash } from "lucide-react";
import localFont from "next/font/local";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const HoveFont = localFont({
  src: "../../public/fonts/hove.ttf",
});
const Hero = () => {
 
  return (
    <div className="w-full mt-7 flex flex-col items-center">
      <div className="flex text-gray-600 rounded-4xl border px-6 py-2 border-blue-400 items-center justify-between gap-x-3 w-fit">
        <p>Last Minute Prep?</p>
        <Image
          src={"/static/landing/ai.svg"}
          alt="ai-image"
          width={25}
          height={25}
        />
        <p>We've Got You</p>
      </div>
      <div className="w-max   my-6  text-center">
        <h2 className={`text-5xl leading-13 font-[800]  ${HoveFont.className}`}>
          Connect with Verified Tutors &
          <br />
          <span className="text-green-400">Cover your Syllabus </span>
          <br />
          Just in Time
        </h2>
      </div>
      <div className="flex items-center justify-center gap-8">
        <Button className="bg-green-400 min-w-[15rem] py-6 rounded-full text-white">
          {" "}
          Explore our Courses
        </Button>
        <Button className=" min-w-[15rem] bg-transparent py-6 border-1 border-black hover:bg-green-200 hover:border-green-200 rounded-full text-black ">
          Visit Shop
        </Button>
      </div>

      <div className="w-full relative ">
        <Image
          className="absolute top-[-6rem] left-0 w-full"
          src={"/static/landing/heros.svg"}
          alt="ai-image"
          width={300}
          height={300}
        />
      </div>
    </div>
  );
};

export default Hero;
