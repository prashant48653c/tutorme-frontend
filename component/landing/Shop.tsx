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
        <div className="md:w-[50%] w-[100%] flex justify-start px-4">
          <h4 className="text-[3rem] w-full text-white text-center md:text-left gap-y-5 leading-14 font-[800] ">
            Explore <br className="md:block hidden" /> TUTOR
            <span className="text-green-400">ME</span> Shop
          </h4>
        </div>
        <div>
          <Button className="border-green-400 flex justify-around text-center border w-min-[10rem] mt-4 px-1 py-6 text-lg font-semibold pl-3 rounded-full text-white ">
            {" "}
            View Shop
            <div className="rounded-full p-3  bg-green-400">
              <ArrowUpRight color="white" size={15} />
            </div>
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
