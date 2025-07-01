"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Eye, ChevronLeft, ChevronRight } from "lucide-react"

interface Tutor {
  id: number
  name: string
  joinedDate: string
  status: "approved" | "disapproved" | "banned" | "under-review" | "registered" | "kyc-approved" | "pending"
  avatar: string
}

const tutors: Tutor[] = [
  {
    id: 1,
    name: "Sandesh Sapkota",
    joinedDate: "2 Jan 2025",
    status: "approved",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Priya Sharma",
    joinedDate: "5 Jan 2025",
    status: "disapproved",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    joinedDate: "8 Jan 2025",
    status: "banned",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 4,
    name: "Anita Patel",
    joinedDate: "10 Jan 2025",
    status: "under-review",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 5,
    name: "Vikram Singh",
    joinedDate: "12 Jan 2025",
    status: "registered",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 6,
    name: "Meera Gupta",
    joinedDate: "15 Jan 2025",
    status: "kyc-approved",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 7,
    name: "Arjun Thapa",
    joinedDate: "18 Jan 2025",
    status: "pending",
    avatar: "/placeholder.svg?height=50&width=50",
  },
]

const getStatusBadge = (status: string) => {
  const statusConfig = {
    approved: { label: "Approved", className: "bg-green-100 text-green-800 hover:bg-green-100" },
    disapproved: { label: "Disapproved", className: "bg-purple-100 text-purple-800 hover:bg-purple-100" },
    banned: { label: "Banned", className: "bg-red-100 text-red-800 hover:bg-red-100" },
    "under-review": { label: "Under Review", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
    registered: { label: "Registered", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
    "kyc-approved": { label: "KYC Approved", className: "bg-green-100 text-green-800 hover:bg-green-100" },
    pending: { label: "Pending", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
  }

  return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
}

const filterTutorsByStatus = (tutors: Tutor[], status: string) => {
  switch (status) {
    case "all":
      return tutors
    case "registered":
      return tutors.filter((t) => t.status === "registered")
    case "kyc-approved":
      return tutors.filter((t) => t.status === "kyc-approved" || t.status === "approved")
    case "under-review":
      return tutors.filter((t) => t.status === "under-review")
    case "banned":
      return tutors.filter((t) => t.status === "banned" || t.status === "disapproved")
    default:
      return tutors
  }
}

export default function TutorManagement() {
  const [activeTab, setActiveTab] = useState("all")

  const allTutors = tutors.length
  const registeredCount = tutors.filter((t) => t.status === "registered").length
  const kycApprovedCount = tutors.filter((t) => t.status === "kyc-approved" || t.status === "approved").length
  const underReviewCount = tutors.filter((t) => t.status === "under-review").length
  const bannedCount = tutors.filter((t) => t.status === "banned" || t.status === "disapproved").length

  const filteredTutors = filterTutorsByStatus(tutors, activeTab)

  return (
    <div className="w-full max-w-6xl mx-auto   bg-white rounded-lg shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="  w-full p-0">
        <TabsList className="grid  bg-[#F5F7F9] w-full grid-cols-5  border-b rounded-none h-[3rem] p-0">
          <TabsTrigger
            value="all"
            className="data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:bg-transparent rounded-none pb-3"

          >
            All Tutors ({allTutors})
          </TabsTrigger>
          <TabsTrigger
            value="registered"
           className="data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:bg-transparent rounded-none pb-3"

          >
            Registered ({registeredCount})
          </TabsTrigger>
          <TabsTrigger
            value="kyc-approved"
          className="data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:bg-transparent rounded-none pb-3"

          >
            KYC Approved ({kycApprovedCount})
          </TabsTrigger>
          <TabsTrigger
            value="under-review"
           className="data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:bg-transparent rounded-none pb-3"

          >
            Under Review ({underReviewCount})
          </TabsTrigger>
          <TabsTrigger
            value="banned"
          className="data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:bg-transparent rounded-none pb-3"

          >
            Banned ({bannedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredTutors.map((tutor) => {
              const statusConfig = getStatusBadge(tutor.status)
              return (
                <div
                  key={tutor.id}
                  className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={tutor.avatar || "/placeholder.svg"} alt={tutor.name} />
                      <AvatarFallback className="bg-gray-800 text-white text-xs">
                        {tutor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                      <p className="text-sm text-gray-500">Joined Date: {tutor.joinedDate}</p>
                      <Badge className={`mt-1 ${statusConfig.className}`}>{statusConfig.label}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex p-3 items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing 1 to {filteredTutors.length} of {filteredTutors.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-teal-600 border-teal-300 hover:bg-teal-50 bg-transparent"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button variant="default" size="sm" className="bg-teal-500 hover:bg-teal-600">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-teal-600 border-teal-300 hover:bg-teal-50 bg-transparent"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
