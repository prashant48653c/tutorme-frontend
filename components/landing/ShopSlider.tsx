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
import { ArrowUpRight, Book, BookA, Box } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Badge } from "../ui/badge";

export default function ShopSlider() {
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

  return (
    <div className="z-10 w-full   h-[30rem] justify-center flex flex-col ">
      <Carousel setApi={setApi} className="w-full h-[30rem]  ">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="lg:basis-1/4 basis-1/2 overflow-visible bg-black">
              <Card className="p-0 bg-black group relative border-none shadow-none">
                <CardContent className="flex p-0 mt-9 relative flex-col">
                  <div className="transition-transform duration-300 group-hover:-translate-y-8 relative z-0">
                    <Badge className="rounded-full absolute p-1 px-2 bg-amber-200 text-black top-4 left-2 z-10">
                      <BookA />
                      Books
                    </Badge>
                    <Image
                      src="/static/landing/shop.svg"
                      alt="Signup Illustration"
                      width={400}
                      height={400}
                      className="object-contain bg-black"
                    />
                  </div>
                  <div className="px-2 py-1 absolute bottom-0 left-0 w-full bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <h3 className="text-white text-lg font-bold">
                      Bsc. First Year (Physics)
                    </h3>
                    <p className="text-gray-400 text-xs">
                      NPR 822/-{" "}
                      <span className="text-sm font-semibold">NPR 4822/-</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Removed CarouselPrevious and CarouselNext */}
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
