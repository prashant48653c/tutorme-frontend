import Slider from "@/components/landing/Slider";
import Image from "next/image";
import React from "react";

const Offer = () => {
  return (
    <div className="w-full lg:h-[33rem] mt-[3rem] flex lg:flex-row h-full flex-col items-center">
      <div className="lg:mx-24 text-center lg:text-left w-full lg:w-[45%]">
        <h4 className="genera text-[3rem] sm:text-[4rem] font-extrabold leading-tight text-center sm:text-left">
  What we
  <br className="inline md:hidden" />
  <span className="text-green-400"> Offer</span>
</h4>

        <p className="mt-4 lg:max-w-[20rem] lg:text-left text-center">
          At TutorMe, we specialize in connecting students with expert tutors
          for last-minute syllabus coverage. Whether you need one-on-one
          sessions or group discussions, our platform helps you find qualified
          online tutors instantly. 
        </p>
      </div>
      <div className="bg-black  relative h-[30rem] py-6 lg:w-[60%] flex items-center  rounded-tl-[6rem]">  
        <Slider />
        <Image
          className="absolute hidden lg:block z-0 top-[1rem] right-[14.5rem]"
          src={"/static/landing/eclip.svg"}
          alt="ai-image"
          width={200}
          height={120}
        />
      </div>
    </div>
  );
};

export default Offer;
