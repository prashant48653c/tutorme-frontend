"use client";
import { useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export default function Comments() {
  const mobileRef = useRef(null);

  const topics = [
    {
      id: 1,
      author: "Rashmi Sharma",
      date: "June 02, 2024",
      text: "I am having merge issues while pushing the codes. Can anyone help me solve this?",
      img: "/static/landing/course.svg",
      replies: 2,
      avatar: "/static/landing/hero1.svg",
    },
    {
      id: 2,
      author: "Rashmi Sharma",
      date: "June 02, 2024",
      text: "Difference between a one-tailed and two-tailed test. When to use each one and give an example with a real-world application? Also, how do I interpret the p-value correctly?",
      img: null,
      replies: 2,
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      author: "Rashmi Sharma",
      date: "June 02, 2024",
      text: "When do I use a normal distribution versus a binomial distribution in statistics?",
      img: null,
      replies: 2,
      avatar: "/placeholder.svg",
    },
    {
      id: 4,
      author: "Rashmi Sharma",
      date: "June 02, 2024",
      text: "Another thread example with image.",
      img: "/static/landing/course.svg",
      replies: 5,
      avatar: "/static/landing/hero1.svg",
    },
  ];

  const scrollBy = (dir = 1) => {
    const el = mobileRef.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * 0.85);
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      {/* DESKTOP / LARGE: 3-col grid */}
      <div className="hidden lg:grid grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          <Card className="bg-white p-0 ">
            <CardContent className="p-0">
              <div className="flex items-start px-4 pt-5 gap-3 mb-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/static/landing/hero1.svg" alt="avatar" />
                  <AvatarFallback className="bg-gray-600 text-white">
                    RS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">Rashmi Sharma</h3>
                  <p className="text-sm text-gray-500">June 02, 2024</p>
                </div>
              </div>

              <p className="text-gray-800 px-4 mb-4">
                I am having merge issues while pushing the codes. Can anyone help me solve this?
              </p>

              <div className="text-right px-4 py-2">
                <span className="text-sm text-teal-600 font-medium">2 replies</span>
              </div>

              <div>
                <Image
                  src="/static/landing/course.svg"
                  alt="illustration"
                  width={400}
                  height={250}
                  className="rounded-b-lg w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          <Card className="bg-white py-0 cursor-pointer hover:bg-green-400 transition-all group">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg" alt="avatar" />
                  <AvatarFallback className="bg-gray-600 text-white group-hover:text-white">
                    RS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-white">Rashmi Sharma</h3>
                  <p className="text-sm text-gray-500 group-hover:text-white">June 02, 2024</p>
                </div>
              </div>
              <p className="text-gray-800 mb-4 group-hover:text-white">
                Difference between a one-tailed and two-tailed test. When to use each one and give an example with a real-world application? Also, how do I interpret the p-value correctly?
              </p>
              <div className="text-right">
                <span className="text-sm text-teal-600 font-medium group-hover:text-white">2 replies</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white py-0 cursor-pointer hover:bg-green-400 transition-all group">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg" alt="avatar" />
                  <AvatarFallback className="bg-gray-600 text-white group-hover:text-white">RS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-white">Rashmi Sharma</h3>
                  <p className="text-sm text-gray-500 group-hover:text-white">June 02, 2024</p>
                </div>
              </div>
              <p className="text-gray-800 mb-4 group-hover:text-white">
                When do I use a normal distribution versus a binomial distribution in statistics?
              </p>
              <div className="text-right">
                <span className="text-sm text-teal-600 font-medium group-hover:text-white">2 replies</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 3 */}
        <div>
          <Card className="bg-white p-0">
            <CardContent className="p-0">
              <div className="mb-4">
                <Image
                  src="/static/landing/course.svg"
                  alt="illustration"
                  width={400}
                  height={250}
                  className="rounded-lg w-full object-cover"
                />
              </div>
              <div className="flex px-4 items-start gap-3 mb-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/static/landing/hero1.svg" alt="avatar" />
                  <AvatarFallback className="bg-gray-600 text-white">RS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">Rashmi Sharma</h3>
                  <p className="text-sm text-gray-500">June 02, 2024</p>
                </div>
              </div>
              <p className="text-gray-800 mb-4 px-4">
                I am having merge issues while pushing the codes. Can anyone help me solve this?
              </p>
              <div className="text-right px-4 py-2">
                <span className="text-sm text-teal-600 font-medium">2 replies</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
{/*MOBYLE SLYDAR*/}
      <div className="lg:hidden mt-6 relative">
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Previous"
            className="h-10 w-10 rounded-full bg-white/90 shadow flex items-center justify-center"
          >
            ◀
          </button>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={() => scrollBy(1)}
            aria-label="Next"
            className="h-10 w-10 rounded-full bg-white/90 shadow flex items-center justify-center"
          >
            ▶
          </button>
        </div>

        <div
          ref={mobileRef}
          className="w-full overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x px-4 py-2 space-x-4 scrollbar-hide"
        >
          <div className="flex gap-4">
            {topics.map((t) => (
              <article
                key={t.id}
                className="snap-start shrink-0 w-[85%] rounded-2xl bg-white p-0 shadow-sm"
                aria-roledescription="slide"
              >
                <div className="p-0">
                  {t.img && (
                    <div className="overflow-hidden rounded-t-2xl">
                      <Image
                        src={t.img}
                        alt={t.text}
                        width={800}
                        height={420}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}

                  <Card className="bg-white p-0">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={t.avatar} alt="avatar" />
                          <AvatarFallback className="bg-gray-600 text-white">RS</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{t.author}</h3>
                          <p className="text-sm text-gray-500">{t.date}</p>
                        </div>
                      </div>

                      <p className="text-gray-800 mb-3">{t.text}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-teal-600 font-medium">{t.replies} replies</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
