"use client";
import { Button } from "@/button";
import { SidebarInset } from "@/components/ui/sidebar";
import api from "@/hooks/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTutorFilter } from "@/store/useTutorFilter"; // Adjust path as needed
import { useRouter } from "next/navigation";
import Navbar from "@/component/reusable/Navbar";
import { TutorSidebar } from "@/components/tutor/TutorSidebar";
import TutorCard from "@/components/tutor/TutorCard";
import Footer from "@/component/reusable/Footer";

type PaginatedTutors = {
  data: any[]; // Replace 'any' with your Tutor type
  hasMore: boolean;
};

const TutorPage = () => {
  const {
    searchQuery,
    setSearchQuery,
    course,
    priceRange,
    language,
    rating,
  } = useTutorFilter();
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

  const filtersSnapshot = useMemo(
    () => ({
      course,
      priceRange,
      language,
      rating,
    }),
    [course, priceRange, language, rating]
  );

  const fetchTutors: any = useCallback(
    async ({ pageParam = 1 }): Promise<any> => {
      const requestBody = {
        page: pageParam,
        limit: 15,
        tags: filtersSnapshot.course,
        max: filtersSnapshot.priceRange.max,
        min: filtersSnapshot.priceRange.min,
        language: filtersSnapshot.language,
        rating: filtersSnapshot.rating,
        title: debouncedSearchQuery || "",
      };

      const res = await api.get(`/tutor`, {
        params: requestBody,
      });

      return res.data.data;
    },
    [debouncedSearchQuery, filtersSnapshot]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    error,
  } = useInfiniteQuery<any>({
    queryKey: ["tutorsCount", debouncedSearchQuery, filtersSnapshot],
    queryFn: fetchTutors,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
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
    setMobileSidebar(false);
    router.push(`/findtutor/${id}`);
  };

  if (error) {
    return (
      <main className="w-full">
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

  return (<>
    <main className="w-full gap-4 px-8">
      <Navbar />

      <section className="md:flex-row flex-col flex  items-center gap-16 mb-10">
        <h2 className="titleFont font-bold text-2xl min-w-fit">
          TUTORME <span className="text-primeGreen">TUTORS</span>
        </h2>
        <div className="flex w-full items-center border rounded-3xl bg-[#F5F7F9] p-2 gap-2 justify-start">
          <Search size={18} />
          <input
            className="border-0 min-w-[20rem] outline-0 hover:outline-0 bg-transparent"
            placeholder="Search.."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Button
          className="hidden sm:hidden lg:hidden md:hidden block bg-amber-800"
          onClick={(e) => {
            e.stopPropagation();
            setMobileSidebar((prev) => !prev);
          }}
        style ={{ backgroundColor: '#09C4AE' , display:'none'}
      }
        >
          Filter
        </Button>
      </section>

      <div className="flex min-h-[90vh]">
        <div className="relative">
          <TutorSidebar
            mobileOpen={mobileSidebar}
            onMobileOpenChange={(open) => setMobileSidebar(open)}
          />
        </div>
        <SidebarInset
          className="w-full md:w-full"
          onClick={(e) => {
            if (mobileSidebar && e.target === e.currentTarget) {
              setMobileSidebar(false);
            }
          }}
        >
          <section className="flex flex-col gap-6">
            {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Courses
            </h2> */}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTutorSelect(tutor.id);
                        }}
                        key={`${pageIndex}-${tutorIndex}`}
                        className="cursor-pointer"
                      >
                        <TutorCard tutor={tutor} />
                      </div>
                    ))
                  )}
                </div>

                {data?.pages.flatMap(page => page).length === 0 && (
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
    <Footer/>
    </>
  );
};

export default TutorPage;
