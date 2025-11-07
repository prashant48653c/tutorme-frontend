"use client";
import { Button } from "@/components/ui/button";
import localFont from "next/font/local";
import Image from "next/image";
import React from "react";

const HoveFont = localFont({ src: "../../public/fonts/hove.ttf" });

const Hero = () => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* top pill */}
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-3 rounded-full border border-blue-400 px-4 py-2 text-gray-600">
          <p className="text-sm sm:text-base">Last-Minute Prep?</p>
          <Image
            src="/static/landing/ai.svg"
            alt=""
            width={24}
            height={24}
            className="shrink-0"
            aria-hidden
          />
          <p className="text-sm sm:text-base">We&apos;ve Got You.</p>
        </div>

        {/* heading */}
        <div className="my-6 text-center sm:my-8">
          <h2
            className={`tracking-tight genera font-extrabold text-3xl sm:text-5xl md:text-5xl lg:text-6xl leading-[1.1]`}
          >
            Connect with Verified Tutors &amp;
            <br className="hidden sm:block" />
            <span className="text-green-400">Cover your Syllabus </span>
            <br className="hidden sm:block" />
            Just in Time
          </h2>
        </div>

        {/* ctas */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
<Button className="min-w-[10rem] md:mb-10 py-6 rounded-full text-white bg-green-400 hover:bg-gray-900 transition pointer-events-auto">    Explore our Courses
  </Button>

  <Button className=" min-w-[10rem] md:mb-10  py-6 rounded-full border-2 text-black bg-gray-100 border-gray-700 hover:!bg-green-200 hover:!border-green-200 transition pointer-events-auto">
    Visit Shop
  </Button>
</div>



        {/* Responsive hero art */}
<div className="relative -mt-28 sm:-mt-16 md:-mt-28 lg:-mt-30 z-10 pointer-events-none">     <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-2xl ">
            <Image
              src="/static/landing/heros.png"
              alt="Hero illustration"
              fill
              priority
              className="object-contain pointer-events-none "
              sizes="(max-width: 640px) 100vw  , (max-width: 1024px) 90vw, 1200px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
