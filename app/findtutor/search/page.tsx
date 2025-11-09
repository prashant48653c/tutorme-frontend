"use client";
import { Button } from "@/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import api from "@/hooks/axios";
import { Course } from "@/types/course";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ArrowRight, Search, Star } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useTutorFilter } from "@/store/useTutorFilter"; // Adjust path as needed
import { useRouter } from "next/navigation";
import Navbar from "@/component/reusable/Navbar";
import { TutorSidebar } from "@/components/tutor/TutorSidebar";
import TutorCard from "@/components/tutor/TutorCard";

type PaginatedTutors = {
  data: any[]; // Replace 'any' with your Tutor type
  hasMore: boolean;
};

const TutorPage = () => {
  const { searchQuery, setSearchQuery, getAllFilters } = useTutorFilter();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const router = useRouter();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // Reduced debounce time to 500ms

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchTutors: any = async ({ pageParam = 1 }): Promise<any> => {
    const filters = getAllFilters();
    console.log("Fetching tutors with filters:", filters);
    console.log("Page:", pageParam);

    // Create request body with filters and search
    const requestBody = {
      page: 2,
      limit: 15,
      tags: filters.course,
      max: filters.priceRange.max,
      min: filters.priceRange.min,

      language: filters.language,
      rating: filters.rating,
      title: debouncedSearchQuery || "",
    };

    const res = await api.get(`/tutor`, {
      params: requestBody,
    });

    return res.data.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    error,
  } = useInfiniteQuery<any>({
    queryKey: ["tutorsCount", debouncedSearchQuery, getAllFilters()],
    queryFn: fetchTutors,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    refetch();
  }, [debouncedSearchQuery, refetch]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("Sentinel visible, fetching next page...");
          fetchNextPage();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the sentinel is visible
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTutorSelect = (id: number) => {
    router.push(`/findtutor/${id}`);
  };

  if (error) {
    return (
      <main className="w-full gap-4 px-8">
        <Navbar />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error loading tutors
            </h2>
            <p className="text-gray-600 mb-4">
              {error.message || "Something went wrong"}
            </p>
            <Button
              onClick={() => refetch()}
              className="bg-teal-500 hover:bg-teal-600"
            >
              Try Again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  console.log(data);

  return (
    <main className="w-full gap-4 px-8">
      <Navbar />

      <section className="md:flex-row flex-col flex  items-center gap-16 mb-10">
        <h2 className="font-bold text-2xl min-w-fit">
          TUTORME <span className="text-primeGreen">TUTORS</span>
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
        <Button
          className="md:hidden block"
          onClick={() => setMobileSidebar(!mobileSidebar)}
        >
          Filter
        </Button>
      </section>

      <div className="flex min-h-[90vh]">
        <div className={`${mobileSidebar ? "block" : "hidden"} md:block `}>
          <TutorSidebar />
        </div>
        <SidebarInset className="w-full md:w-full">
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Courses
            </h2>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.pages.map((page, pageIndex) =>
                    page?.map((tutor: any, tutorIndex: number) => (
                      <div
                        onClick={() => handleTutorSelect(tutor.id)}
                        key={`${pageIndex}-${tutorIndex}`}
                      >
                        <TutorCard tutor={tutor} />
                      </div>
                    ))
                  )}
                </div>

                {data?.pages[0]?.data?.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tutors found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your search or filters to find tutors.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        // You might want to clear filters here too
                      }}
                      variant="outline"
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </>
            )}
            <div ref={observerRef} className="h-10" />
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

export default TutorPage;
