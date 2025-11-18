"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpAZ,
  Search,
  Pencil,
  Trash,
} from "lucide-react";
import ViewTutor from "../admin/ViewTutor";
import api from "@/hooks/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";

import { Chapter, Course, Enrollment } from "@/types/course";
import { useCourseStore } from "@/store/useCourseStore";
import { useGlobalCourseStore } from "@/store/useGlobalCourseStore";
import Image from "next/image";
import { checkKhaltiPayment } from "@/hooks/khalti";
import { stat } from "fs";

function formatDate(dateString: string) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" }); // "Jan", "Feb", etc.
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    ACTIVE: {
      label: "Active",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    EXPIRED: {
      label: "Expired",
      className: "bg-red-100 text-purple-800 hover:bg-purple-100",
    },
  };

  return (
    statusConfig[status as keyof typeof statusConfig] || {
      label: "UNKNOWN",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    }
  );
};

const getTabStatus = (tab: string) => {
  switch (tab) {
    case "all":
      return "";
    case "active":
      return "ACTIVE";
    case "expired":
      return "EXPIRED";

    default:
      return "";
  }
};

export default function CourseManagement() {
  const user = useAuthStore((state) => state.user);
  console.log(user)

  const [activeTab, setActiveTab] = useState("all");
  const [currentTutor, setCurrentTutor] = useState<any>({});
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [tutors, setTutors] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [counts, setCounts] = useState({
    all: 0,
    active: 0,
    expired: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    sortBy: "desc",
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const [totalCount, setTotalCount] = useState([
    { status: "ACTIVE", count: 0 },
  ]);

  const fetchTutors = useCallback(
    async (
      tabValue: string,
      pageNum: number = 1,
      limit: number = 5,
      search: string = "",
      sortBy: string
    ) => {
      setLoading(true);
      try {
        const id = user?.studentProfile?.id;
         
        console.log(id);

        const status = getTabStatus(tabValue);
        const res = await api.get(`/course/enrolled/${id}`, {
          params: {
            page: pageNum,
            name: search || undefined,
            status: status || undefined,
            sortBy,
          },
        });
        setTotalCount(res.data.data.statusCounts);
        console.log(res.data.data.statusCounts);

        const fetchedCourses = res.data.data.data || [];
        const normalizedSort =
          sortBy?.toLowerCase() === "asc" ? "asc" : "desc";
        const sortedCourses = [...fetchedCourses].sort((a, b) => {
          const titleA = a?.course?.title?.toLowerCase() || "";
          const titleB = b?.course?.title?.toLowerCase() || "";
          return normalizedSort === "asc"
            ? titleA.localeCompare(titleB)
            : titleB.localeCompare(titleA);
        });
        setTutors(sortedCourses);

        // Update paginain info
        if (res.data.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            page: res.data.data.pagination.page,
            limit: limit,
            total: res.data.data.pagination.total,
            totalPages: res.data.data.pagination.totalPages,
          }));
        }

        // Update counts fromstatsSummary
        if (res.data.statusSummary) {
          const statusSummary = res.data.statusSummary;
          const newCounts = {
            all: res.data.pagination.total || 0,
            active:
              statusSummary.find((s: any) => s.courseStatus === "ACTIVE")
                ?.count || 0,
            expired:
              statusSummary.find((s: any) => s.courseStatus === "EXPIRED")
                ?.count || 0,
          };

          setCounts(newCounts);
        }

        console.log(res.data);
      } catch (error) {
        console.error("Error fetching tutors:", error);
        setTutors([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSearch = useCallback(
    (query: string) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        setSearchQuery(query);
        setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when searching
        fetchTutors(activeTab, 1, pagination.limit, query, pagination.sortBy);
      }, 500); // 500ms debounce

      setSearchTimeout(timeout);
    },
    [activeTab, pagination.limit, fetchTutors, searchTimeout]
  );

  // Handle limit change
  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    fetchTutors(activeTab, 1, newLimit, searchQuery, pagination.sortBy);
  };
  const handleSortChange = (sort: string) => {
    setPagination((prev) => ({ ...prev, sortBy: sort, page: 1 }));
    fetchTutors(activeTab, 1, pagination.limit, searchQuery, sort);
  };

 

  useEffect(() => {
      if (!user?.studentProfile?.id) return;
    fetchTutors(
      activeTab,
      pagination.page,
      pagination.limit,
      searchQuery,
      pagination.sortBy,
    );
  }, [activeTab, pagination.page, fetchTutors]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when changing tabs
    fetchTutors(value, 1, pagination.limit, searchQuery, pagination.sortBy);
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchTutors(
      activeTab,
      newPage,
      pagination.limit,
      searchQuery,
      pagination.sortBy
    );
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      handlePageChange(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      handlePageChange(pagination.page + 1);
    }
  };

  const onClose = () => {
    setIsViewOpen(false);
  };

  const totalCoursesCount = totalCount.reduce(
    (acc, item) => acc + item.count,
    0
  );
  const activeCoursesCount =
    totalCount.find((item) => item?.status === "ACTIVE")?.count || 0;
  const expiredCoursesCount =
    totalCount.find((item) => item?.status === "EXPIRED")?.count || 0;

  const tabBaseClasses =
    "group relative flex min-w-[190px] flex-none items-center justify-center rounded-4xl border border-slate-200 bg-white px-6 py-3 text-center text-base font-semibold text-slate-600 transition-colors duration-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[state=active]:border-[3px] data-[state=active]:text-slate-900 sm:flex-1 sm:min-w-0";
  const tabAccentClasses: Record<string, string> = {
    all: "focus-visible:ring-teal-200 data-[state=active]:border-teal-400",
    active:
      "focus-visible:ring-emerald-200 data-[state=active]:border-emerald-400",
    expired:
      "focus-visible:ring-rose-200 data-[state=active]:border-rose-400",
  };

  const tabConfig = [
    {
      value: "all",
      label: "All Courses",
      count: totalCoursesCount,
      accent: tabAccentClasses.all,
    },
    {
      value: "active",
      label: "Active",
      count: activeCoursesCount,
      accent: tabAccentClasses.active,
    },
    {
      value: "expired",
      label: "Expired",
      count: expiredCoursesCount,
      accent: tabAccentClasses.expired,
    },
  ];


console.log(tutors,"Data of course")
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
          <span>Show</span>
          <select
            className="rounded border border-gray-300 bg-white px-2 py-1 text-sm"
            value={pagination.limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
          >
            {[5, 10, 15, 20, 25, 30].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:gap-4 lg:w-auto">
          <div className="flex w-full items-center gap-2 rounded-full border border-gray-200 bg-[#F5F7F9] px-4 py-2 md:max-w-sm lg:w-72">
            <Search size={18} className="text-slate-500" />
            <input
              className="w-full border-0 bg-transparent text-sm outline-none"
              placeholder="Search courses..."
              onChange={(e) => handleSearch(e.target.value)}
              defaultValue={searchQuery}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              handleSortChange(pagination.sortBy === "asc" ? "desc" : "asc")
            }
            className="flex items-center justify-center gap-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 transition hover:border-teal-500 hover:text-teal-600"
          >
            <ArrowUpAZ className="h-4 w-4" />
            Sort ({pagination.sortBy === "asc" ? "A-Z" : "Z-A"})
          </Button>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto rounded-lg shadow-sm">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full p-0"
        >
          <div className="w-full overflow-x-auto pb-1 h-fit">
            <TabsList className="flex w-max items-stretch gap-3 border-0 bg-transparent p-1 sm:w-full sm:flex-wrap">
              {tabConfig.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`${tabBaseClasses} ${tab.accent}`}
                >
                  {tab.label} ({tab.count})
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-6">
            <div
              className="
    grid gap-4
    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-3
   
    justify-items-center
    
  "
            >
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading courses...</p>
                </div>
              ) : tutors.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  {searchQuery
                    ? `No course found matching "${searchQuery}"`
                    : "No courses found"}
                </div>
              ) : (
                tutors?.map((tutor) => {
                 
                  return (
                    <div
                      onClick={() => router.push(`/student/course/${tutor?.course.id}/active`)}
                      className="border-b-4 border-b-red-500 rounded-2xl w-full max-w-[20.3rem] bg-white shadow-md transition hover:-translate-y-1"
                      key={tutor.id}
                    >
                      <div className="relative group">
                        <Image
                          src={tutor?.course?.thumbnail || ""}
                          width={300}
                          height={300}
                          className="object-fit h-[15rem] w-[20.3rem] rounded-t-2xl bg-white"
                          alt="course image"
                        />

                        {/* Hover button */}
                        <div
                          className="absolute inset-0 flex items-center justify-center 
                    bg-opacity-40 text-white font-semibold 
                 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                 "
                        >
                          <p
                            className="p-2 rounded-sm cursor-pointer text-sm font-medium 
   border-2 border-white bg-gray-500/30"
                          >
                            Extend Course
                          </p>
                        </div>
                      </div>

                      <div className="px-4 my-3 flex flex-col gap-2">
                        <h4 className="text-xl font-bold">{tutor.course.title}</h4>
                        <div className="w-full bg-gray-300 rounded-full h-1 overflow-hidden">
                          <div
                            className="bg-green-500 h-full transition-all duration-300"
                            style={{ width: `${54}%` }}
                          ></div>
                        </div>
                        <p className="text-xs w-full flex items-center justify-end text-left">
                          4/20{" "}
                          <span className="font-semibold pl-1">Chapters</span>
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {tutors.length > 0 && (
              <div className="flex p-3 items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    (pagination.page - 1) * pagination.limit + pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} entries
                  {searchQuery && (
                    <span className="ml-2 text-teal-600">
                      (filtered by "{searchQuery}")
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-teal-600 border-teal-300 hover:bg-teal-50 bg-transparent"
                    onClick={handlePreviousPage}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  {/* Page numbers */}
                  <div className="flex items-center space-x-1">
                    {/* Show first page if not currently on it and there are more than 3 pages */}
                    {pagination.page > 2 && pagination.totalPages > 3 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </Button>
                        {pagination.page > 3 && (
                          <span className="px-2">...</span>
                        )}
                      </>
                    )}

                    {/* Show previous page */}
                    {pagination.page > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                      >
                        {pagination.page - 1}
                      </Button>
                    )}

                    {/* Show current page */}
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-teal-500 hover:bg-teal-600"
                    >
                      {pagination.page}
                    </Button>

                    {/* Show next page */}
                    {pagination.page < pagination.totalPages && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                      >
                        {pagination.page + 1}
                      </Button>
                    )}

                    {/* Show last page if not currently on it and there are more than 3 pages */}
                    {pagination.page < pagination.totalPages - 1 &&
                      pagination.totalPages > 3 && (
                        <>
                          {pagination.page < pagination.totalPages - 2 && (
                            <span className="px-2">...</span>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handlePageChange(pagination.totalPages)
                            }
                          >
                            {pagination.totalPages}
                          </Button>
                        </>
                      )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-teal-600 border-teal-300 hover:bg-teal-50 bg-transparent"
                    onClick={handleNextPage}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
