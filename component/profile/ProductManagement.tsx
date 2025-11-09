"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

// Types
interface Course {
  id: string
  title: string
  date: string
  thumbnail: string
  status: "PUBLISHED" | "UNDERREVIEW" | "DRAFT"
}

interface DraftCourse {
  courseId: string
  title: string
  date: string
  thumbnail: string
}

// Mock API data
const mockApiCourses: Course[] = [
  {
    id: "1",
    title: "Atomic Structure",
    date: "2 June 2025",
    thumbnail: "/placeholder.svg?height=80&width=80",
    status: "UNDERREVIEW",
  },
  {
    id: "2",
    title: "Chemical Imbalance",
    date: "2 June 2025",
    thumbnail: "/placeholder.svg?height=80&width=80",
    status: "PUBLISHED",
  },
  {
    id: "3",
    title: "Organic Chemistry",
    date: "2 June 2025",
    thumbnail: "/placeholder.svg?height=80&width=80",
    status: "PUBLISHED",
  },
  {
    id: "4",
    title: "Molecular Biology",
    date: "2 June 2025",
    thumbnail: "/placeholder.svg?height=80&width=80",
    status: "PUBLISHED",
  },
  {
    id: "5",
    title: "Physics Fundamentals",
    date: "2 June 2025",
    thumbnail: "/placeholder.svg?height=80&width=80",
    status: "PUBLISHED",
  },
  {
    id: "6",
    title: "Advanced Mathematics",
    date: "2 June 2025",
    thumbnail: "/placeholder.svg?height=80&width=80",
    status: "PUBLISHED",
  },
]

// Local draft courses
const localDraftCourses: DraftCourse[] = [
  {
    courseId: "2", // This one exists in mockApiCourses
    title: "Chemical Imbalance",
    date: "2 June 2025",
    thumbnail: "/static/landing/course.svg",
  },
  {
    courseId: "7", // This one does NOT exist in mockApiCourses
    title: "Biology Basics",
    date: "2 June 2025",
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
]

type TabType = "all" | "published" | "underreview" | "draft"

export default function ProductManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [courses, setCourses] = useState<Course[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    setCourses(mockApiCourses)
  }, [])

  const getFilteredCourses = (): Course[] => {
    switch (activeTab) {
      case "all":
        return courses
      case "published":
        return courses.filter((course) => course.status === "PUBLISHED")
      case "underreview":
        return courses.filter((course) => course.status === "UNDERREVIEW")
      case "draft":
        return localDraftCourses.map((draft) => {
          const match = courses.find((c) => c.id === draft.courseId)
          return {
            id: draft.courseId,
            title: draft.title,
            date: draft.date,
            thumbnail: draft.thumbnail,
            status: match?.status ?? "DRAFT",
          }
        })
      default:
        return courses
    }
  }

  const filteredCourses = getFilteredCourses()

  const allCount = courses.length
  const publishedCount = courses.filter((c) => c.status === "PUBLISHED").length
  const underReviewCount = courses.filter((c) => c.status === "UNDERREVIEW").length
  const draftCount = localDraftCourses.length

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage)

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
    { id: "all", label: `All Courses (${allCount})` },
    { id: "published", label: `Published (${publishedCount})` },
    { id: "underreview", label: `Under Review (${underReviewCount})` },
    { id: "draft", label: `Draft (${draftCount})` },
  ]

  return (
    <div className="w-full min-h-[30rem] rounded-4xl overflow-y-auto max-w-4xl shadow-md mx-auto p-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as TabType)
              setCurrentPage(1)
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

      {/* No Course Message */}
      {paginatedCourses.length === 0 ? (
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
          <Button className="bg-green-500 text-white px-4 py-2 rounded-full">Add Course</Button>
        </div>
      ) : (
        <>
          {/* Course List */}
          <div className="space-y-1">
            {paginatedCourses.map((course) => (
              <Card key={course.id} className="bg-transparent hover:bg-gray-200 p-0 shadow-none">
                <CardContent className="px-3 py-2">
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">
                        {course.title}
                      </h3>
                      <p className="text-gray-500 text-xs">{course.date}</p>
                      {getStatusBadge(course.status)}
                    </div>
                    <Button variant="ghost" size="icon" className="text-teal-500 hover:text-teal-600">
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-white text-teal-600 border-teal-200 hover:bg-teal-50"
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={
                    currentPage === page
                      ? "bg-teal-500 text-white hover:bg-teal-600"
                      : "bg-white text-teal-600 border-teal-200 hover:bg-teal-50"
                  }
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
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
