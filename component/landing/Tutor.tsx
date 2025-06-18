import { Button } from "@/components/ui/button";
import { HoveFont } from "@/constant/font";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

const Tutor = () => {
  return (
    <div className="w-full mt-[30rem] flex flex-col items-center">
      <div className="w-max    my-6  text-center">
        <div
          className={`text-[4rem] flex w-full items-center justify-center leading-13 font-[800]  ${HoveFont.className}`}
        >
          <p className="max-w-[20rem] text-right leading-16">
            {" "}
            Find the <br />
            <span className="text-green-400 "> Tutors </span>
          </p>
          <div className="text-sm">
            <Image
              className=""
              src={"/static/landing/tutor.svg"}
              alt="ai-image"
              width={200}
              height={120}
            />
          </div>

          <p className="max-w-[20rem] text-left leading-16">
            {" "}
            <span className="text-green-400 "> Best </span>
            <br />
            <span className="pl-4"> in Nepal</span>{" "}
          </p>
        </div>

        <div className="">
          <p className="max-w-[50rem] mt-9">
            TutorMe is a platform designed to connect students with the right
            tutors for last-minute syllabus coverage. Whether you need
            one-to-one sessions or group discussions, we help you find online
            tutors instantly, all equipped with concise notes, crash materials,
            and extra reading resources to get you exam-ready fast.{" "}
          </p>
          <div className="flex mt-5 items-center justify-center gap-8">
            <Button className=" min-w-[15rem] py-6 border-1 border-black hover:bg-green-200 hover:border-green-200 rounded-full text-black ">
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
    </div>
  );
};

export default Tutor;
