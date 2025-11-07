import { Button } from "@/components/ui/button";
import {
  Card,
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
  const courses = [
    {
      subject: "BSc (Third Year)",
      heading: "Computer Science with Artificial Intelligence",
      image: "/static/landing/course.svg",
    },
    {
      subject: "BSc (First Year)",
      heading: "Data Science and Machine Learning",
      image: "/static/landing/image 25.svg",
    },
    {
      subject: "BMe (Fourth Year)",
      heading: "Quantum Theory",
      image: "/static/landing/image.svg",
    },
    {
      subject: "MSc (Second Year)",
      heading: "Cyber Security and Ethical Hacking",
      image: "/static/landing/image 25 (1).svg",
    },
  ];

  // Split into two parts
  const leftCourses = courses.slice(0, 2);
  const rightCourses = courses.slice(2, 4);

  return (
    <section className="flex w-full">
      <div className="flex w-[100%] gap-16">
        {/* Left Section */}
        <div className="md:w-[55%] w-[90%]">
          <div className="w-full flex flex-col items-start mx-20">
            <h4 className="text-[3rem] text-left gap-y-5 leading-14 font-[800]">
              Our Popular <br />
              <span className="text-green-400">Course</span> Categories
            </h4>
            <p className="my-2 text-sm max-w-[29rem]">
              Porttitor cursus leo tincidunt rutrum diam eleifend quam proin sed
              in sem.
            </p>
            <div>
              <Button className="bg-green-400 min-w-[10rem] flex gap-x-2 py-4 mt-3 rounded-full text-white">
                Explore More
                <ArrowUpRight color={"white"} size={15} />
              </Button>
            </div>
          </div>

          {/* Left course cards */}
          <div className="flex w-full items-center md:items-end mt-16 flex-col gap-y-3">
            {leftCourses.map((item, i) => (
              <div
                key={i}
                className="w-[25rem] my-2 pb-6 rounded-2xl bg-[#FFEEE2] flex flex-col gap-y-2 p-0"
              >
                <CardHeader className="p-0">
                  <Image
                    className="w-[25rem] rounded-t-2xl"
                    src={item.image}
                    alt={item.heading}
                    width={400}
                    height={420}
                  />
                  <CardDescription className="p-1 px-3">
                    {item.subject}
                  </CardDescription>
                  <CardTitle className="text-[2.25rem] leading-[2.75rem] font-bold px-3  ">
                    {item.heading}
                  </CardTitle>
                  <div className="p-1 px-3">
                    <button className="min-w-[6rem] flex justify-center items-center gap-1 p-2 px-4 border-black border    hover:bg-green-200 hover:border-green-200 rounded-full text-black">
                      View More
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                </CardHeader>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-[35%] hidden md:block">
          <div className="flex items-start pt-9 w-full mt-5 flex-col gap-y-3">
            {rightCourses.map((item, i) => (
              <div
                key={i}
                className="w-[25rem] my-2 pb-6 rounded-2xl bg-[#FFEEE2] flex flex-col gap-y-2 p-0"
              >
                <CardHeader className="p-0">
                  <Image
                    className="w-[25rem] rounded-t-2xl"
                    src={item.image}
                    alt={item.heading}
                    width={400}
                    height={420}
                  />
                  <CardDescription className="p-1 px-3">
                    {item.subject}
                  </CardDescription>
                  <CardTitle className="text-2xl px-3 font-extrabold">
                    {item.heading}
                  </CardTitle>
                  <div className="p-1 px-3">
                     <button className="min-w-[6rem] flex justify-center items-center gap-1 p-2 px-4 border-black border    hover:bg-green-200 hover:border-green-200 rounded-full text-black">
                      View More
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                </CardHeader>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Course;
