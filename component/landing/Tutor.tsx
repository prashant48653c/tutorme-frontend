"use client";
import { Button } from "@/components/ui/button";
import { DialogContent, Dialog, DialogTitle } from "@/components/ui/dialog";
import { HoveFont } from "@/constant/font";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const Tutor = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="w-full lg:mt-[5rem] md:mt-[15rem]   mt-[0rem] flex flex-col items-center">
      <div className="w-max  my-6  text-center">
        <div
          className={`text-[4rem]  scale-125 flex w-full items-center justify-center leading-13 font-[800] w-fit`}
        >
          <p className="genera block hidden md:block max-w-[20rem] text-right leading-[1.2] md:leading-[1.6]">
            {" "}
            Find the <br  />
            <span className="text-green-400 "> Tutors </span>
          </p>
          <section className="relative lg:w-[13rem] sm:w-[10rem] w-[8rem]">

         
          <div className="text-sm ">
            <Image
              className="z-50   rotate-3"
              src={"/static/landing/tutor.svg"}
              alt="ai-image"
              width={200}
              height={120}
            />
          </div>
           <div className="text-sm">
            <Image
              className="absolute z-10 rotate-[11deg] top-0"
              src={"/static/landing/tutor.svg"}
              alt="ai-image"
              width={200}
              height={120}
            />
          </div>
           <div className="text-sm">
            <Image
              className="absolute z-10 rotate-[-3deg] top-0"
              src={"/static/landing/tutor.svg"}
              alt="ai-image"
              width={200}
              height={120}
            />
          </div>
 </section>
          <p className="genera block hidden md:block max-w-[20rem] text-left leading-[1.2] md:leading-[1.6]">
  <span className="text-green-400">Best</span>
  <br />
  <span className="pl-4">in Nepal</span>
</p>

        </div>

        <div className="">
          <p className="mt-6 md:mt-8 text-sm md:text-base text-gray-700 max-w-[48rem] mx-auto md:mx-0 sm:w-[40rem] w-[30rem] leading-7">
            TutorMe is a platform designed to connect students with the right
            tutors for last-minute syllabus coverage. Whether you need
            one-to-one sessions or group discussions, we help you find online
            tutors instantly, all equipped with concise notes, crash materials,
            and extra reading resources to get you exam-ready fast.{" "}
          </p>
          <div className="flex mt-5 items-center justify-center gap-8">
            <Button
              onClick={() => setIsVideoOpen(true)}
              className=" min-w-[15rem] bg-transparent py-6 border-2 border-black hover:bg-green-200 hover:border-green-200 rounded-full text-black "
            >
              Watch Video
              <PlayCircle size={15} />
            </Button>
            <Button className="group bg-green-400 hover:!bg-gray-900 min-w-[15rem] py-6 rounded-full text-white">
              {" "}
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="p-0 min-w-3xl rounded-2xl overflow-hidden aspect-video ">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/bpzQLYe1Z54?autoplay=1o"
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tutor;
