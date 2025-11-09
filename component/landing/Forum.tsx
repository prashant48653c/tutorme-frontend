import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import React from "react";
import Comments from "./Comments";

const Forum = () => {
  return (
    <div className="w-full bg-[#F2F7FF] mt-20 py-20 flex flex-col">
      <div className="flex flex-col md:flex-row mx-6 md:mx-16 mb-5 justify-around gap-10">
        <div className="md:w-[40%] flex justify-start px-4">
          <h4 className="text-[3rem] text-left leading-[3.5rem] font-extrabold">
            <span className="titleFont">TUTOR</span>
            <span className="titleFont text-green-400">ME</span>
            <br />
            <span className="font-hove">Forum</span>
          </h4>
        </div>

        <div className="md:w-[90%]">
          <p className="text-gray-700 leading-relaxed">
            Join our TutorMe Forum to discuss, share, and learn with peers and experts.
            Whether you have questions, need advice, or want to help others, our community
            is here to support your learning journey.
          </p>
          <Button className="group bg-green-400 w-fit mt-4 px-7 py-5 rounded-full text-white hover:!bg-gray-900 transition">
            View Forum Discussion
            <span className="icon-hover-rotate">
              <ArrowUpRight size={15} />
            </span>
          </Button>
        </div>
      </div>

      <div>
        <Comments />
      </div>
    </div>
  );
};

export default Forum;