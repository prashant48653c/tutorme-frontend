"use client";
import { Button } from "@/button";
import { CourseFilterSidebar } from "@/components/tutor/CourseSidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import api from "@/hooks/axios";
import { Course } from "@/types/course";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ArrowRight, Search, Star } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useFilterStore } from "@/store/useCourseFilter"; // Adjust path as needed
import { useRouter } from "next/navigation";

type PaginatedCourses = {
  data: Course[];
  hasMore: boolean;
};

const CoursePage = () => {
  const { searchQuery, setSearchQuery, getAllFilters } = useFilterStore();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
const router=useRouter()
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchCourses = async ({ pageParam = 1 }): Promise<PaginatedCourses> => {
    const filters = getAllFilters();
    console.log("Runn")
    console.log(pageParam)
    // Create request body with filters and search
    const requestBody = {
      page: pageParam,
      limit: 6,
      categories: filters.categories,
      targetSem: filters.targetSem,
      language: filters.language,
      courseDepth: filters.courseDepth,
      duration: filters.duration,
      searchQuery: debouncedSearchQuery
    };

   const res = await api.get(`/course`, {
  params: requestBody
});

    return res.data.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery<PaginatedCourses, Error>({
    queryKey: ["coursesCount", debouncedSearchQuery, getAllFilters()],
    queryFn: fetchCourses,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [debouncedSearchQuery, refetch]);

  console.log();

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 10;

      if (bottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEnroll=(id:number)=>{
router.push(`/course/${id}`)
  }

  return (
    <main className="w-full gap-4 p-8">
      <section className="flex items-center gap-16 mb-10">
        <h2 className="font-bold text-2xl min-w-fit ">
          TUTORME <span className="text-green-500">COURSES</span>
        </h2>
        <div className="flex w-full items-center border rounded-lg bg-[#F5F7F9] p-2 gap-2 justify-start">
          <Search size={18} />
          <input
            className="border-0 min-w-[20rem] outline-0 hover:outline-0 bg-transparent"
            placeholder="Search.."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </section>
      <div className="flex min-h-[90vh]">
        <div className="w-[22%]">
          <CourseFilterSidebar />
        </div>
        <SidebarInset className=" w-[75%]">
          <section className=" flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.pages.map((page) =>
                page?.data.map((course: Course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden p-0 hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <Image
                        src={course.thumbnail || "/placeholder.svg"}
                        alt={course?.title || "Course Image"}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      {/* {course?.badge && (
                        <Badge className="absolute top-3 right-3 bg-teal-500 text-white">
                          {course.badge}
                        </Badge>
                      )} */}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between gap-1 mb-3">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= Math.floor(4)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}

                          <span className="text-sm text-gray-600">
                            {/* {course.rating} ({course.reviews}) */}
                            2 (20 reviews)
                          </span>
                        </div>
                        <div className="">
                          <span className="text-xs font-bold text-gray-900">
                            Nrs {course.price}
                          </span>
                        </div>
                      </div>

                      <div className="my-2 flex items-center justify-between text-xs">
                        <p>{course.chapters?.length} Chapters</p>
                        <p>{course.duration} minutes</p>
                      </div>
                      <Button onClick={() => handleEnroll(course?.id)} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                        Enroll Course
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              </div>
            )}
          </section>
        </SidebarInset>
      </div>
    </main>
  );
};

export default CoursePage;