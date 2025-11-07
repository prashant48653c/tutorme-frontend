"use client";
import { Button } from "@/components/ui/button";
import { DialogContent, Dialog, DialogTitle } from "@/components/ui/dialog";
import { HoveFont } from "@/constant/font";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import RotatingCards from "./AnimatedCard";

const Tutor = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="w-full lg:mt-[25rem] md:mt-[15rem]   mt-[10rem] flex flex-col items-center">
      <div className="w-max  my-6  text-center">
        <div
          className={`text-[4rem]   flex w-full items-center justify-center leading-13 font-[800]  ${HoveFont.className}`}
        >
          <p className="max-w-[20rem] hidden md:block text-right leading-16">
            {" "}
            Find the <br  />
            <span className="text-green-400 "> Tutors </span>
          </p>
          <RotatingCards/>
          <p className="max-w-[20rem] hidden md:block text-left leading-16">
            {" "}
            <span className="text-green-400 "> Best </span>
            <br />
            <span className="pl-4"> in Nepal</span>{" "}
          </p>
        </div>

        <div className="">
          <p className="md:max-w-[50rem] max-w-[30rem]  mt-9">
            TutorMe is a platform designed to connect students with the right
            tutors for last-minute syllabus coverage. Whether you need
            one-to-one sessions or group discussions, we help you find online
            tutors instantly, all equipped with concise notes, crash materials,
            and extra reading resources to get you exam-ready fast.{" "}
          </p>
          <div className="flex mt-5 items-center justify-center gap-8">
            <Button
              onClick={() => setIsVideoOpen(true)}
              className=" min-w-[15rem] bg-transparent py-6 border-1 border-black hover:bg-green-200 hover:border-green-200 rounded-full text-black "
            >
              Watch Video
              <PlayCircle size={15} />
            </Button>
            <Button className="bg-green-400 min-w-[15rem] py-6 rounded-full text-white">
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
