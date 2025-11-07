"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const courses = Array.from({ length: 4 }).map((_, i) => ({
  id: i,
  title: "Computer Science with Artificial Intelligence",
  desc: "Bsc (Third Year)",
  img: "/static/landing/course.svg",
}));

export default function Course() {
  const sliderRef = useRef(null);

  const scrollNext = () => {
    const el = sliderRef.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: step, behavior: "smooth" });
  };
  const scrollPrev = () => {
    const el = sliderRef.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: -step, behavior: "smooth" });
  };

  return (
    <section className="w-full">
      <div className="flex w-full gap-16">
        {/* Left column (desktop) */}
        <div className="md:w-[55%] w-[90%">
          <div className="w-full flex flex-col items-start mx-20 ">
            <h4 className="genera text-[3rem] text-left gap-y-5 leading-14 font-[800]">
              Our Popular <br />
              <span className="text-green-400">Course</span> Categories
            </h4>
            <p className="my-2 text-sm max-w-[29rem]">
              Porttitor cursus leo tincidunt rutrum diam eleifend quam proin sed
              in sem.
            </p>
            <div>
              <Button className="bg-green-400 min-w-[10rem] flex gap-x-2 py-4 mt-3 rounded-full text-white hover:!bg-gray-900 transition">
                Explore More
                <ArrowUpRight color={"white"} size={15} />
              </Button>
            </div>
          </div>

          {/* DESKTOP: stacked cards (visible from md and up) */}
          <div className="hidden md:flex w-full items-center md:items-end mt-16 flex-col gap-y-3">
            {courses.slice(0, 2).map((c) => (
              <div
                key={c.id}
                className="w-[25rem] my-2 pb-6 rounded-2xl bg-[#FFEEE2] flex flex-col gap-y-2 p-0"
              >
                <CardHeader className="p-0">
                  <Image
                    className="w-[25rem] rounded-t-2xl"
                    src={c.img}
                    alt="ai-image"
                    width={400}
                    height={420}
                  />

                  <CardDescription className="p-1 px-3">
                    {c.desc}
                  </CardDescription>
                  <CardTitle className="text-2xl px-3 font-extrabold">
                    {c.title}
                  </CardTitle>
                  <div className="p-1 px-3">
                    <Button className="min-w-[6rem] bg-white py-4 border border-black hover:!bg-green-200 hover:!border-green-200 rounded-full text-black">
                      View More
                      <ArrowUpRight size={15} />
                    </Button>
                  </div>
                </CardHeader>
              </div>
            ))}
          </div>
        </div>

        {/* Right column (desktop-only side cards) */}
        <div className="md:w-[35%] hidden md:block">
          <div className="flex items-start pt-9 w-full mt-5 flex-col gap-y-3">
            {courses.slice(2).map((c) => (
              <div
                key={c.id}
                className="w-[25rem] my-2 pb-6 rounded-2xl bg-[#FFEEE2] flex flex-col gap-y-2 p-0"
              >
                <CardHeader className="p-0">
                  <Image
                    className="w-[25rem] rounded-t-2xl"
                    src={c.img}
                    alt="ai-image"
                    width={400}
                    height={420}
                  />

                  <CardDescription className="p-1 px-3">{c.desc}</CardDescription>
                  <CardTitle className="text-2xl px-3 font-extrabold">
                    {c.title}
                  </CardTitle>
                  <div className="p-1 px-3">
                    <Button className="min-w-[6rem] bg-transparent py-4 border border-black hover:!bg-green-200 hover:!border-green-200 rounded-full text-black">
                      View More
                      <ArrowUpRight size={15} />
                    </Button>
                  </div>
                </CardHeader>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* -------------------------
          MOBILE SLIDER (shown only on small screens)
         ------------------------- */}
      <div className="md:hidden mt-8 relative">
        {/* Prev/Next controls */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={scrollPrev}
            aria-label="Previous"
            className="h-10 w-10 rounded-full bg-white/90 shadow flex items-center justify-center"
          >
            ◀
          </button>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={scrollNext}
            aria-label="Next"
            className="h-10 w-10 rounded-full bg-white/90 shadow flex items-center justify-center"
          >
            ▶
          </button>
        </div>

        {/* scroll container */}
        <div
          ref={sliderRef}
          className="w-full overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x px-4 py-2 space-x-4 scrollbar-hide"
        >
          <div className="flex gap-4">
            {courses.map((c) => (
              <article
                key={c.id}
                className="snap-start shrink-0 w-[80%] sm:w-[65%] rounded-2xl bg-[#FFEEE2] p-0"
                aria-roledescription="slide"
              >
                <div className="overflow-hidden rounded-t-2xl">
                  <Image
                    src={c.img}
                    alt={c.title}
                    width={600}
                    height={320}
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div className="p-3">
                  <p className="text-sm">{c.desc}</p>
                  <h3 className="text-xl font-extrabold my-2">{c.title}</h3>

                  <div>
                    <Button className="min-w-[6rem] bg-transparent py-3 border border-black hover:!bg-green-200 hover:!border-green-200 rounded-full text-black">
                      View More
                      <ArrowUpRight size={15} />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
