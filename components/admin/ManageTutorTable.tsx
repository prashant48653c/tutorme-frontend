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
} from "lucide-react";
import ViewTutor from "./ViewTutor";
import api from "@/hooks/axios";
import toast from "react-hot-toast";

interface Tutor {
  id: number;
  name: string;
  createdAt: string;
  status: "APPROVED" | "DISAPPROVED" | "BANNED" | "UNDERREVIEW" | "REGISTERED";
  avatar?: string;
  image?: string;
  tutorProfile: {
    status:
      | "APPROVED"
      | "DISAPPROVED"
      | "BANNED"
      | "UNDERREVIEW"
      | "REGISTERED";
    id: number;
  };
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" }); // "Jan", "Feb", etc.
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    APPROVED: {
      label: "Approved",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    DISAPPROVED: {
      label: "Disapproved",
      className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    },
    BANNED: {
      label: "Banned",
      className: "bg-red-100 text-red-800 hover:bg-red-100",
    },
    UNDERREVIEW: {
      label: "Under Review",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    REGISTERED: {
      label: "Registered",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
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
    case "registered":
      return "REGISTERED";
    case "kyc-approved":
      return "APPROVED";
    case "under-review":
      return "UNDERREVIEW";
    case "banned":
      return "BANNED";
    case "disapproved":
      return "DISAPPROVED";
    default:
      return "";
  }
};

const tabTriggerClasses =
  "flex min-w-max flex-shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-none px-4 py-2 text-xs font-medium text-gray-400 shadow-none sm:text-sm data-[state=active]:border-0 data-[state=active]:border-b-2 data-[state=active]:border-b-teal-500 data-[state=active]:bg-transparent data-[state=active]:text-black";
export default function TutorManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [currentTutor, setCurrentTutor] = useState<any>({});
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({
    all: 0,
    registered: 0,
    approved: 0,
    underReview: 0,
    banned: 0,
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
    { status: "REGISTERED", count: 0 },
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
        const status = getTabStatus(tabValue);
        const res = await api.get("/auth/tutors", {
          params: {
            limit: limit,
            page: pageNum,
            name: search || undefined,
            status: status || undefined,
            sortBy: sortBy,
          },
        });
        setTotalCount(res.data.statusCounts);
        setTutors(res.data.data || []);

        // Update pagination info
        if (res.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            page: res.data.pagination.page,
            limit: limit,
            total: res.data.pagination.total,
            totalPages: res.data.pagination.totalPages,
          }));
        }

        // Update counts from statusSummary
        if (res.data.statusSummary) {
          const statusSummary = res.data.statusSummary;
          const newCounts = {
            all: res.data.pagination.total || 0,
            registered:
              statusSummary.find((s: any) => s.status === "REGISTERED")
                ?.count || 0,
            approved:
              statusSummary.find((s: any) => s.status === "APPROVED")?.count ||
              0,
            underReview:
              statusSummary.find((s: any) => s.status === "UNDERREVIEW")
                ?.count || 0,
            banned:
              (statusSummary.find((s: any) => s.status === "BANNED")?.count ||
                0) +
              (statusSummary.find((s: any) => s.status === "DISAPPROVED")
                ?.count || 0),
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

  const updateTutorStatus = async (id: number, status: string) => {
    try {
      const res = await api.patch(`/auth/tutor/status/${id}`, {
        status: status,
      });
      console.log(res);
      fetchTutors(
        activeTab,
        1,
        pagination.limit,
        searchQuery,
        pagination.sortBy
      );

      toast.success("Tutor kyc was updated!");
    } catch (error) {
      console.log(error);
      toast.success("Failed to update Kyc!");
    }
  };
  const fetchCounts = useCallback(async () => {
    try {
      // Fetch counts from a single API call
      const res = await api.get("/auth/tutors", {
        params: { limit: 1, page: 1, status: "" },
      });

      if (res.data.statusSummary) {
        const statusSummary = res.data.statusSummary;
        setCounts({
          all: res.data.pagination.total || 0,
          registered:
            statusSummary.find((s: any) => s.status === "REGISTERED")?.count ||
            0,
          approved:
            statusSummary.find((s: any) => s.status === "APPROVED")?.count || 0,
          underReview:
            statusSummary.find((s: any) => s.status === "UNDERREVIEW")?.count ||
            0,
          banned:
            (statusSummary.find((s: any) => s.status === "BANNED")?.count ||
              0) +
            (statusSummary.find((s: any) => s.status === "DISAPPROVED")
              ?.count || 0),
        });
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  }, []);

  // Debounced search function
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
    setPagination((prev) => ({ ...prev, sortBy: sort }));
    fetchTutors(activeTab, 1, pagination.limit, searchQuery, sort);
  };

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    fetchTutors(
      activeTab,
      pagination.page,
      pagination.limit,
      searchQuery,
      pagination.sortBy
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
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
  {/* Left: Select dropdown */}
  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
    <span className="text-gray-500">Show</span>
    <select
      aria-label="Select number of tutors per page"
      className="w-15 rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:border-teal-500 focus:outline-none"
      value={pagination.limit}
      onChange={(e) => handleLimitChange(Number(e.target.value))}
    >
      {[5, 10, 15, 20, 25, 30].map((num) => (
        <option key={num} value={num}>
          {num}
        </option>
      ))}
    </select>
    <span className="text-gray-500">entries</span>
  </div>

  {/* Right: Search + Sort */}
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
    {/* Search input */}
    <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-[#F5F7F9] px-4 py-2 md:max-w-sm lg:flex-1">
      <Search size={18} className="text-gray-400" />
      <input
        aria-label="Search tutors"
        className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-gray-500"
        placeholder="Search tutors..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchQuery}
      />
    </div>

    {/* Sort button */}
    <Button
      type="button"
      variant="outline"
      onClick={() =>
        handleSortChange(pagination.sortBy === "asc" ? "desc" : "asc")
      }
      className="flex items-center justify-center gap-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 transition hover:border-teal-500 hover:text-teal-600"
    >
      <span>Sort {pagination.sortBy === "asc" ? "(A-Z)" : "(Z-A)"}</span>
      <ArrowUpAZ className="h-4 w-4" />
    </Button>
  </div>
</div>

      <div className="mx-auto w-full max-w-9xl rounded-lg bg-white shadow-sm">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="mb-20 w-full p-0 text-gray-400"
        >
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 border-b bg-[#F5F7F9] p-0 text-xs sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger
              value="all"
              className={tabTriggerClasses}
            >
              <span className="text-sm">
                All Tutors
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="registered"
              className={tabTriggerClasses}
            >
              <span>Registered</span>
              <span className="text-[11px] text-gray sm:text-xs">
                (
                {totalCount.find((item) => item.status === "REGISTERED")
                  ?.count || 0}
                )
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="kyc-approved"
              className={tabTriggerClasses}
            >
              <span>KYC Approved</span>
              <span className="text-[11px] text-gray-500 sm:text-xs">
                (
                {totalCount.find((item) => item.status === "APPROVED")
                  ?.count || 0}
                )
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="under-review"
              className={tabTriggerClasses}
            >
              <span>Under Review</span>
              <span className="text-[11px] text-gray-500 sm:text-xs">
                (
                {totalCount.find((item) => item.status === "UNDERREVIEW")
                  ?.count || 0}
                )
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="banned"
              className={tabTriggerClasses}
            >
              <span>Banned</span>
              <span className="text-[11px] text-gray-500 sm:text-xs">
                (
                {totalCount.find((item) => item.status === "BANNED")?.count ||
                  0}
                )
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="disapproved"
              className={tabTriggerClasses}
            >
              <span>Disapproved</span>
              <span className="text-[11px] text-gray-500 sm:text-xs">
                (
                {totalCount.find((item) => item.status === "DISAPPROVED")
                  ?.count || 0}
                )
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4 sm:pt-0">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading tutors...</p>
                </div>
              ) : tutors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery
                    ? `No tutors found matching "${searchQuery}"`
                    : "No tutors found"}
                </div>
              ) : (
                tutors.map((tutor) => {
                  const statusConfig = getStatusBadge(tutor.status);
                  const avatarSrc =
                    tutor.image || tutor.avatar || "/placeholder.svg";
                  return (
                    <div
                      key={tutor.id}
                      className="flex flex-col gap-4 border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left sm:space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={avatarSrc}
                            alt={tutor.name}
                          />
                          <AvatarFallback className="bg-gray-800 text-white text-xs">
                            {tutor.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-gray-900">
                            {tutor.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Joined Date: {formatDate(tutor.createdAt)}
                          </p>
                          <Badge className={`mt-1 w-full sm:w-auto ${statusConfig.className}`}>
                            {tutor?.tutorProfile?.status || "UNKNOWN"}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:w-auto sm:justify-end">
                        {activeTab == "under-review" && (
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <Button
                              onClick={() =>
                                updateTutorStatus(
                                  tutor?.tutorProfile?.id,
                                  "APPROVED"
                                )
                              }
                              className="flex w-full items-center justify-center rounded-full bg-primeGreen px-4 py-2 text-white sm:w-auto"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() =>
                                updateTutorStatus(
                                  tutor?.tutorProfile?.id,
                                  "DISAPPROVED"
                                )
                              }
                              className="flex w-full items-center justify-center rounded-full bg-gray-500 px-4 py-2 text-white sm:w-auto"
                            >
                              Disapprove
                            </Button>
                          </div>
                        )}

                        {activeTab == "banned" && (
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <Button
                              onClick={() =>
                                updateTutorStatus(
                                  tutor?.tutorProfile?.id,
                                  "APPROVED"
                                )
                              }
                              className="flex w-full items-center justify-center rounded-full bg-primeGreen px-4 py-2 text-white sm:w-auto"
                            >
                              Unban
                            </Button>
                          </div>
                        )}
                        {activeTab == "kyc-approved" && (
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <Button
                              onClick={() =>
                                updateTutorStatus(
                                  tutor?.tutorProfile?.id,
                                  "BANNED"
                                )
                              }
                              className="flex w-full items-center justify-center rounded-full bg-primeGreen px-4 py-2 text-white sm:w-auto"
                            >
                              Ban
                            </Button>
                          </div>
                        )}

                        {activeTab == "disapproved" && (
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <Button
                              onClick={() =>
                                updateTutorStatus(
                                  tutor?.tutorProfile?.id,
                                  "APPROVED"
                                )
                              }
                              className="flex w-full items-center justify-center rounded-full bg-primeGreen px-4 py-2 text-white sm:w-auto"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() =>
                                updateTutorStatus(
                                  tutor?.tutorProfile?.id,
                                  "REVIEW"
                                )
                              }
                              className="flex w-full items-center justify-center rounded-full bg-gray-500 px-4 py-2 text-white sm:w-auto"
                            >
                              Review Again
                            </Button>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0 text-teal-600 hover:bg-teal-50 hover:text-teal-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setCurrentTutor(tutor);
                            setIsViewOpen(true);
                          }}
                          size="icon"
                          className="h-9 w-9 shrink-0 text-teal-600 hover:bg-teal-50 hover:text-teal-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {isViewOpen && (
              <ViewTutor tutorProfile={currentTutor} onClose={onClose} />
            )}

            {/* Pagination */}
            {tutors.length > 0 && (
              <div className="mt-6 flex flex-col gap-4 border-t border-gray-200 p-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-center text-sm text-gray-600 sm:text-left">
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
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-teal-300 bg-transparent text-teal-600 hover:bg-teal-50"
                    onClick={handlePreviousPage}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  {/* Page numbers */}
                  <div className="flex flex-wrap items-center justify-center gap-1">
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
                    className="border-teal-300 bg-transparent text-teal-600 hover:bg-teal-50"
                    onClick={handleNextPage}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
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
