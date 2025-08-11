import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import React from "react";

const Course = () => {
  return (
    <section className="flex  w-full">
 <div className="flex  w-[100%]  gap-16">
      <div className="  md:w-[55%] w-[90%]">
        <div className="w-full flex flex-col items-start mx-20 ">
          <h4 className="text-[3rem]  text-left gap-y-5 leading-14 font-[800] ">
            Our Popular <br />
            <span className="text-green-400">Course</span> Categories
          </h4>
          <p className="my-2 text-sm max-w-[29rem]">
            Porttitor cursus leo tincidunt rutrum diam eleifend quam proin sed
            in sem.
          </p>
          <div>
            <Button className="bg-green-400  min-w-[10rem] flex gap-x-2 py-4 mt-3 rounded-full text-white">
              {" "}
              Explore More
              <ArrowUpRight color={"white"} size={15} />
            </Button>
          </div>
        </div>

        <div className="flex w-full items-center  md:items-end mt-16 flex-col gap-y-3">
          {Array.from({ length: 2 }).map((item,i) => {
            return (
              <div key={i} className="w-[25rem] my-2 pb-6 rounded-2xl bg-[#FFEEE2] flex flex-col gap-y-2 p-0">
                <CardHeader className="p-0">
                  <Image
                    className="w-[25rem] rounded-t-2xl"
                    src={"/static/landing/course.svg"}
                    alt="ai-image"
                    width={400}
                    height={420}
                  />

                  <CardDescription className="p-1 px-3">
                    Bsc (Third Year)
                  </CardDescription>
                  <CardTitle className=" text-2xl px-3 font-extrabold">
                    Computer Science with Artificial Intelligence
                  </CardTitle>
                  <div className="p-1 px-3">
                    <Button className=" min-w-[6rem] bg-transparent py-4 border-1 border-black hover:bg-green-200 hover:border-green-200 rounded-full text-black ">
                      View More
                      <ArrowUpRight size={15} />
                    </Button>
                  </div>
                </CardHeader>
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:w-[35%] hidden md:block ">
        <div className="flex items-start pt-9 w-full mt-5 flex-col gap-y-3">
          {Array.from({ length: 2 }).map((item,i) => {
            return (
            <div key={i} className="w-[25rem]  my-2 pb-6 rounded-2xl bg-[#FFEEE2] flex flex-col gap-y-2 p-0">
                <CardHeader className="p-0">
                  <Image
                    className="w-[25rem] rounded-t-2xl"
                    src={"/static/landing/course.svg"}
                    alt="ai-image"
                    width={400}
                    height={420}
                  />

                  <CardDescription className="p-1 px-3">
                    Bsc (Third Year)
                  </CardDescription>
                  <CardTitle className=" text-2xl px-3 font-extrabold">
                    Computer Science with Artificial Intelligence
                  </CardTitle>
                  <div className="p-1 px-3">
                    <Button className=" min-w-[6rem] bg-transparent py-4 border-1 border-black hover:bg-green-200 hover:border-green-200 rounded-full text-black ">
                      View More
                      <ArrowUpRight size={15} />
                    </Button>
                  </div>
                </CardHeader>
              </div>
            )
          })}
        </div>
      </div>

    </div>
    </section>
   
  );
};

export default Course;
