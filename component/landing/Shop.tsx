import ShopSlider from "@/components/landing/ShopSlider";
import Slider from "@/components/landing/Slider";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import React from "react";

const Shop = () => {
  return (
    <div className=" bg-black rounded-br-[7rem] pt-16 pb-8 mb-5">
      <div className="flex md:flex-row  flex-col px-[5rem] items-center justify-between ">
        <div className="md:w-[50%] w-full flex justify-start px-4">
  <h4 className="text-[2.5rem] sm:text-[3rem] w-full text-white text-center md:text-left leading-[3.5rem] font-extrabold">
    <span className="titleText">Explore </span>
    <br className="md:block hidden" />
    <span className="titleText">TUTOR</span>
    <span className="titleText text-green-400">ME </span>
    <span className="titleText">Shop</span>
  </h4>
</div>
        <div>
          <Button className="group hover:!bg-gray-900 transition border-green-400 flex items-center justify-between border min-w-[10rem] mt-4 px-4 py-6 text-lg font-semibold rounded-full text-white">
  <span>View Shop</span>
  <span className="icon-hover-rotate">
  <div className="rounded-full p-3 bg-green-400">
    
      <ArrowUpRight color="white" size={15} />
      </div>
    </span>
  
</Button>
        </div>
      </div>

      <div className="flex px-[5rem] md:flex-row flex-col items-center justify-between ">
        <div className="w-[40%] md:block hidden p-7">
          <Image
            className=""
            src={"/static/landing/cir.svg"}
            alt="ai-image"
            width={300}
            height={220}
          />
        </div>
        <div className="md:w-[50%] w-[100%] ">
          <p className="text-xl text-white my-3 font-bold">
            Join TutorMe as an instructor and connect with learners who need
            quick, effective guidance.{" "}
          </p>
          <p className="text-gray-400">
            From overcoming challenges to achieving incredible milestones, these
            narratives highlight their career paths, the impact of their
            education, and how they are making a difference. Browse through
            crash notes, quick revision guides, practice tests, session bundles,
            and more, handpicked to match your syllabus and timeline. Whether
            it’s exam night or just a stressful week, our resources are built to
            help you study smart, stay calm, and succeed faster.
          </p>
        </div>
      </div>
      <div className="w-full flex justify-between ">
        <ShopSlider />
      </div>
      
    </div>
  );
};

export default Shop;
