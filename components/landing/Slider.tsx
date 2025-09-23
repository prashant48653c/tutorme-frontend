"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Book, Box } from "lucide-react";
import { Button } from "../ui/button";

export default function Slider() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // 🚀 Auto-slide useEffect
  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000); // 3000ms = 3 seconds per slide
if (api.selectedScrollSnap() === count - 1) {
  api.scrollTo(0); // Go back to start
} else {
  api.scrollNext();
}

    return () => clearInterval(interval); // Cleanup on unmount
  }, [api]);

  return (
    <div className="mx-[3rem] z-10 w-full">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/2 ">
              <Card>
                <CardContent className="flex flex-col aspect-auto">
                  <div className="bg-green-500 w-fit rounded-4xl flex gap-3 items-center px-3 py-2">
                    <Book color="white" />
                    <Box color="white" />
                  </div>

                  <h1 className="font-extrabold my-2 text-black">
                    TUTOR<span className="text-primeGreen">ME </span>COURSE
                  </h1>

                  <p className="text-sm">
                    TutorMe course offers syllabus-specific content, expert-led
                    video sessions, downloadable notes, and revision tools — all
                    tailored for last-minute prep. Whether it’s one chapter or
                    the whole subject, you’ll find exactly what you need, right
                    when you need it.
                  </p>

                  <Button className="w-[8rem] mt-3 flex items-center px-4 text-center rounded-3xl bg-green-400">
                    Learn More <ArrowUpRight color="white" />
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-4 flex items-center justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn("h-2 w-2 rounded-full border-2", {
              "border-primary": current === index + 1,
              "border-muted": current !== index + 1,
            })}
          />
        ))}
      </div>
    </div>
  );
}
