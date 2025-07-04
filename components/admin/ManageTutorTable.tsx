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
  avatar: string;
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
      <div className="flex justify-between mb-4">
        <div className="flex gap-2 items-center">
          <span>Show</span>
          <select
            className="border-gray-600 py-1 px-2 rounded border"
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

        <div className="flex items-center border rounded-lg bg-[#F5F7F9] p-2 gap-2 justify-center">
          <Search size={18} />
          <input
            className="border-0 min-w-[20rem] outline-0 hover:outline-0 bg-transparent"
            placeholder="Search tutors..."
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchQuery}
          />
        </div>

        <div
          onClick={() =>
            handleSortChange(pagination.sortBy == "asc" ? "desc" : "asc")
          }
          className="flex gap-3 items-center"
        >
          <span>Sort By (A-Z)</span>
          <ArrowUpAZ />
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full p-0"
        >
          <TabsList className="grid bg-[#F5F7F9] w-full grid-cols-6 border-b rounded-none h-[3rem] p-0">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:bg-transparent rounded-none pb-3"
            >
              All Tutors
            </TabsTrigger>
            <TabsTrigger
              value="registered"
              className="data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:bg-transparent rounded-none pb-3"
            >
              Registered (
              {totalCount.find((item) => item.status === "REGISTERED")?.count ||
                0}
              )
            </TabsTrigger>
            <TabsTrigger
              value="kyc-approved"
              className="data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:bg-transparent rounded-none pb-3"
            >
              KYC Approved (
              {totalCount.find((item) => item.status === "APPROVED")?.count ||
                0}
              )
            </TabsTrigger>
            <TabsTrigger
              value="under-review"
              className="data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:bg-transparent rounded-none pb-3"
            >
              Under Review (
              {totalCount.find((item) => item.status === "UNDERREVIEW")
                ?.count || 0}
              )
            </TabsTrigger>
            <TabsTrigger
              value="banned"
              className="data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:bg-transparent rounded-none pb-3"
            >
              Banned (
              {totalCount.find((item) => item.status === "BANNED")?.count || 0})
            </TabsTrigger>
            <TabsTrigger
              value="disapproved"
              className="data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:bg-transparent rounded-none pb-3"
            >
              Disapproved (
              {totalCount.find((item) => item.status === "DISAPPROVED")
                ?.count || 0}
              )
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
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
                  return (
                    <div
                      key={tutor.id}
                      className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={tutor.avatar || "/placeholder.svg"}
                            alt={tutor.name}
                          />
                          <AvatarFallback className="bg-gray-800 text-white text-xs">
                            {tutor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {tutor.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Joined Date: {formatDate(tutor.createdAt)}
                          </p>
                          <Badge className={`mt-1 ${statusConfig.className}`}>
                            {tutor?.tutorProfile?.status || "UNKNOWN"}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex w-fit items-center space-x-2">
                        {activeTab == "under-review" && (
                          <div className="flex gap-2 items-center justify-center">
                            <Button
                              onClick={() =>
                                updateTutorStatus(
                                  tutor?.tutorProfile?.id,
                                  "APPROVED"
                                )
                              }
                              className=" text-white bg-primeGreen rounded-full flex items-center justify-center  "
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
                              className=" text-white bg-gray-500 rounded-full flex items-center justify-center  "
                            >
                              Disapprove
                            </Button>
                          </div>
                        )}

                        {activeTab == "banned" && (
                          <div className="flex gap-2 items-center justify-center">
                            <Button
                              onClick={() =>
                                updateTutorStatus(
                                  tutor?.tutorProfile?.id,
                                  "APPROVED"
                                )
                              }
                              className=" text-white bg-primeGreen rounded-full flex items-center justify-center  "
                            >
                              Unban
                            </Button>
                          </div>
                        )}
                        {activeTab == "kyc-approved" && (
                          <div className="flex gap-2 items-center justify-center">
                            <Button
                              onClick={() =>
                                updateTutorStatus(
                                  tutor?.tutorProfile?.id,
                                  "BANNED"
                                )
                              }
                              className=" text-white bg-primeGreen rounded-full flex items-center justify-center  "
                            >
                              Ban
                            </Button>
                          </div>
                        )}

                        {activeTab == "disapproved" && (
                          <div className="flex gap-2 items-center justify-center">
                            <Button
                              onClick={() =>
                                updateTutorStatus(
                                  tutor?.tutorProfile?.id,
                                  "APPROVED"
                                )
                              }
                              className=" text-white bg-primeGreen rounded-full flex items-center justify-center  "
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
                              className=" text-white bg-gray-500 rounded-full flex items-center justify-center  "
                            >
                              Review Again
                            </Button>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
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
                          className="h-8 w-8 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
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
