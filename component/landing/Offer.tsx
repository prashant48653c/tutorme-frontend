import Slider from "@/components/landing/Slider";
import Image from "next/image";
import React from "react";

const Offer = () => {
  return (
    <div className="w-full h-[33rem] mt-[3rem] flex  items-center">
      <div className="mx-24 w-[45%]">
        <h4 className="text-[4rem] flex flex-col gap-y-5 leading-13 font-[800] ">
          What we <br /> <span className="text-green-400">Offer</span>
        </h4>
        <p className="mt-4 max-w-[20rem]">
          Porttitor cursus leo tincidunt rutrum diam eleifend quam proin sed in
          sem.
        </p>
      </div>
      <div className="bg-black h-[30rem] py-6 w-[60%] flex items-center  rounded-tl-[6rem]">  
        <Slider />
        <Image
          className=""
          src={"/static/landing/eclip.svg"}
          alt="ai-image"
          width={150}
          height={120}
        />
      </div>
    </div>
  );
};

export default Offer;
