import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import React from "react";
import Comments from "./Comments";

const Forum = () => {
  return (
    <div className="w-full bg-[#F2F7FF] mt-20 py-20 flex flex-col">
      <div className="flex md:flex-row flex-col mx-16 mb-5 justify-around">
        <div className="w-[40%] flex justify-start md:px-4">
          <h4 className="text-[3rem]  text-left gap-y-5 leading-14 font-[800] ">
            <span className="titleFont">TUTOR</span>
            <span className="titleFont text-green-400">ME</span>
            <br /> <span className="genera">Forum</span>
          </h4>
        </div>

        <div>
          <p>
            Join our TutorMe Forum to discuss, share, and learn with peers
            and experts. Whether you have questions, need advice, or want to help
            others, our community is here to support your learning journey.
            {" "}
          </p>
          <Button className="group bg-green-400 w-fit mt-4 px-7 py-5 rounded-full text-white  hover:!bg-gray-900 transition ">
            {" "}
            View Forum Discussion
            <span className="icon-hover-rotate">
            <span className="icon-hover-rotate">
            <ArrowUpRight size={15} />
            </span>
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
