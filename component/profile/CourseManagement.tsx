"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import api from "@/hooks/axios"
import { useAuthStore } from "@/store/useAuthStore"

interface Course {
  id: string
  title: string
  updatedAt: string
  thumbnail: string
  courseStatus: "PUBLISHED" | "UNDERREVIEW" | "DRAFT" | "REJECTED"
}

type TabType = "all" | "published" | "underreview" | "draft" | "rejected"

const getTabStatus = (tab: TabType) => {
  switch (tab) {
    case "all":
      return ""
    case "published":
      return "PUBLISHED"
    case "underreview":
      return "UNDERREVIEW"
    case "draft":
      return "DRAFT"
    case "rejected":
      return "REJECTED"
    default:
      return ""
  }
}

export default function CourseManagement() {
  const user = useAuthStore((state) => state.user)
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [counts, setCounts] = useState({
    all: 0,
    published: 0,
    underReview: 0,
    draft: 0,
    rejected: 0,
  })

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalPages: 0,
    total: 0,
  })

  const fetchCourses = useCallback(
    async (tab: TabType, page = 1, limit = 5) => {
      setLoading(true)
      try {
        const tutorId = user?.tutorProfile?.id
        const status = getTabStatus(tab)

        const res = await api.get(`/course/mycourse/${tutorId}`, {
          params: {
            limit,
            page,
            status: status || undefined,
          },
        })

        setCourses(res.data.data.data || [])
        if (res.data.data.pagination) {
          setPagination({
            page: res.data.data.pagination.page,
            limit,
            total: res.data.data.pagination.total,
            totalPages: res.data.data.pagination.totalPages,
          })
        }
 
        if (res.data.data.statusCounts) {
          const statusSummary = res.data.data.statusCounts
          console.log(statusSummary)
          setCounts({
            all: statusSummary.find((s: any) => s.status === "ALL")?.count || 0,
            published:
              statusSummary.find((s: any) => s.status === "PUBLISHED")?.count ||
              0,
            underReview:
              statusSummary.find((s: any) => s.status === "UNDERREVIEW")
                ?.count || 0,
            draft:
              statusSummary.find((s: any) => s.status === "DRAFT")?.count ||
              0,
            rejected:
              statusSummary.find((s: any) => s.status === "REJECTED")
                ?.count || 0,
          })
        }
      } catch (err) {
        console.error(err)
        setCourses([])
      } finally {
        setLoading(false)
      }
    },
    [user]
  )

  useEffect(() => {
    fetchCourses(activeTab, pagination.page, pagination.limit)
  }, [activeTab, pagination.page, pagination.limit, fetchCourses])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <p className="text-xs text-blue-800">Published</p>
      case "UNDERREVIEW":
        return <p className="text-xs text-orange-800">Under Review</p>
      case "DRAFT":
        return <p className="text-xs text-gray-600">Draft</p>
     
      default:
        return <p className="text-xs">{status}</p>
    }
  }

  const tabs = [
    { id: "all", label: `All (${counts.all})` },
    { id: "published", label: `Published (${counts.published})` },
    { id: "underreview", label: `Under Review (${counts.underReview})` },
    { id: "draft", label: `Draft (${counts.draft})` },
   
  ]

  return (
    <div className="w-full min-h-[30rem] rounded-2xl max-w-4xl shadow-md mx-auto p-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as TabType)
              setPagination((prev) => ({ ...prev, page: 1 }))
            }}
            className={`text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loader */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading courses...</p>
        </div>
      )
      :

      courses.length === 0 ? (
        <div className="text-center py-10">
          <Image
            src="/static/icons/file.svg"
            alt="No courses"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <p className="text-gray-700 font-medium">No course available</p>
          <p className="text-gray-500 mb-4">Start adding courses</p>
          <Button className="bg-green-500 text-white px-4 py-2 rounded-full">
            Add Course
          </Button>
        </div>
      ) : (
        <>
          {/* Course List */}
          <div className="space-y-1">
            {courses.map((course) => (
              <Card key={course.id} className="bg-transparent p-0 shadow-none">
                <CardContent className="px-3 hover:bg-gray-200 py-2">
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={course.thumbnail || "/static/landing/course.svg"}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">
                        {course.title}
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {new Date(course.updatedAt).toDateString()}
                      </p>
                      {getStatusBadge(course.courseStatus)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-teal-500 hover:text-teal-600"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(prev.page - 1, 1),
                  }))
                }
                disabled={pagination.page === 1}
                className="bg-white text-teal-600 border-teal-200 hover:bg-teal-50"
              >
                Previous
              </Button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={pagination.page === page ? "default" : "outline"}
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: page }))
                    }
                    className={
                      pagination.page === page
                        ? "bg-teal-500 text-white hover:bg-teal-600"
                        : "bg-white text-teal-600 border-teal-200 hover:bg-teal-50"
                    }
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(prev.page + 1, pagination.totalPages),
                  }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="bg-white text-teal-600 border-teal-200 hover:bg-teal-50"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
