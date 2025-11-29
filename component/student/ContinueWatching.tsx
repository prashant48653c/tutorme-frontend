"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import { useEffect, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type ContinueCourse = {
  title: string;
  description: string;
  completed: number;
  total: number;
  image: string;
};

type SliderConfig = {
  slidesToShow: number;
  centerMode: boolean;
  centerPadding: string;
  dots: boolean;
};

const getSliderConfig = (width: number): SliderConfig => {
  if (width < 480) {
    return {
      slidesToShow: 1,
      centerMode: false,
      centerPadding: "0px",
      dots: false,
    };
  }

  if (width < 768) {
    return {
      slidesToShow: 1,
      centerMode: true,
      centerPadding: "24px",
      dots: true,
    };
  }

  if (width < 1280) {
    return {
      slidesToShow: 2,
      centerMode: false,
      centerPadding: "0px",
      dots: true,
    };
  }

  return {
    slidesToShow: 3,
    centerMode: false,
    centerPadding: "0px",
    dots: true,
  };
};

const ContinueWatching = () => {
  const sliderRef = useRef<Slider | null>(null);
  const [sliderConfig, setSliderConfig] = useState<SliderConfig>(() => {
    if (typeof window === "undefined") {
      return getSliderConfig(375);
    }
    return getSliderConfig(window.innerWidth);
  });

  useEffect(() => {
    const handleResize = () => {
      setSliderConfig(getSliderConfig(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const data: ContinueCourse[] = [
    {
      title: 'Basics of Multimedia',
      description:
        'Advance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart.',
      completed: 9,
      total: 20,
      image: '/static/landing/course.svg',
    },
    {
      title: 'Fundamental of Torque',
      description:
        'Advance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart.',
      completed: 12,
      total: 24,
      image: 'https://via.placeholder.com/480x320?text=Fundamental+of+Torque',
    },
    {
      title: 'Advanced Numerics',
      description:
        'Advance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart.',
      completed: 4,
      total: 12,
      image: 'https://via.placeholder.com/480x320?text=Advanced+Numerics',
    },
    {
      title: 'Motion Graphics Essentials',
      description:
        'Advance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart.',
      completed: 3,
      total: 10,
      image: 'https://via.placeholder.com/480x320?text=Motion+Graphics',
    },
  ];

  const settings = {
    dots: sliderConfig.dots,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: sliderConfig.slidesToShow,
    slidesToScroll: 1,
    centerMode: sliderConfig.centerMode,
    centerPadding: sliderConfig.centerPadding,
  };

  return (
    <section className="w-full px-4 py-6 sm:px-6 lg:px-0">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-gray-900">
          Continue Watching
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous course"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100"
            onClick={() => sliderRef.current?.slickPrev()}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next course"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100"
            onClick={() => sliderRef.current?.slickNext()}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <Slider
        ref={(instance) => {
          sliderRef.current = instance;
        }}
        {...settings}
      >
        {data.map((item) => {
          const progress = Math.min(
            100,
            Math.round((item.completed / item.total) * 100)
          );

          return (
            <div key={item.title} className="px-3">
              <article className="flex h-full flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm">
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 px-6 pb-6 pt-5">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="mb-2 text-sm font-medium text-gray-500">
                      <span className="text-gray-900">{`${
                        item.completed < 10
                          ? `0${item.completed}`
                          : item.completed
                      }/${
                        item.total < 10 ? `0${item.total}` : item.total
                      }`}</span>{' '}
                      Chapters
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0EE0C4] to-[#11B6F0] transition-all"
                        style={{ width: `${progress}%` }}
                        aria-valuenow={progress}
                      />
                    </div>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </Slider>
    </section>
  );
};

export default ContinueWatching;
