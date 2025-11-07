import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import React from "react";
import Comments from "./Comments";

const Forum = () => {
  return (
    <div className="w-full bg-[#F2F7FF] mt-20 py-20 flex flex-col">
      <div className="flex md:flex-row flex-col mx-16 mb-5 justify-around">
        <div className="w-[40%] flex justify-start md:px-4">
          <h4 className="genera text-[3rem]  text-left gap-y-5 leading-14 font-[800] ">
            TUTOR
            <span className="text-green-400">ME</span>
            <br /> Forum
          </h4>
        </div>

        <div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit
            eveniet nostrum quaerat est, quibusdam{" "}
          </p>
          <Button className="bg-green-400 w-fit mt-4 px-7 py-5 rounded-full text-white">
            {" "}
            View Forum Discussion
            <ArrowUpRight size={15} />
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
