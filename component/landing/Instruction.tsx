import { Button } from "@/components/ui/button";
import { HoveFont } from "@/constant/font";
import Image from "next/image";
import React from "react";

const Instruction = () => {
  return (
    <div className="flex gap-4 my-[5rem] items-center justify-evenly">
      <div className="flex    items-center justify-end">
        <Image
                          className="w-[25rem] rounded-t-2xl"
                          src={"/static/landing/instructor.svg"}
                          alt="ai-image"
                          width={400}
                          height={420}
                        />
      </div>
      <div className="w-[40%]  ">
        <h2 className={`text-5xl leading-13 font-[800]  ${HoveFont.className}`}>
          Want to become an 
          <br />
          <span className="text-green-400">Instructor? </span>
        </h2>
        <p className="text-sm my-3 font-bold">
          Join TutorMe as an instructor and connect with learners who need
          quick, effective guidance.{" "}
        </p>
        <p>
          Set your own schedule, teach online, and share your expertise through
          one-to-one or group sessions. Whether you're a seasoned educator or a
          subject expert, this is your chance to make a real impact.
        </p>
        <div>
          <Button className="bg-green-400 min-w-[10rem] py-4 mt-3 rounded-full text-white">
            {" "}
            Apply now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Instruction;
