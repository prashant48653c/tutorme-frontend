import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function TutorCard({tutor}:{tutor:any}) {
  return (
    <Card className="w-[18rem] bg-white rounded-2xl overflow-hidden  border-0">
      {/* Profile Image Section */}
      <div className="relative">
        <div className="aspect-[4/5] relative">
          <Image
            src={tutor?.image || "/static/landing/course.svg"}
            alt="Chris Watson - AI & ML Specialist"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-md text-sm font-medium">
          {tutor?.tutorProfile?.price}/hr
        </div>
      </div>

      {/* Card Content */}
      <div className="px-6 text-center">
        {/* Star Rating */}
        <div className="flex items-center justify-center gap-1 ">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-gray-600 text-sm ml-1">(25)</span>
        </div>

        {/* Name */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{tutor?.name}</h2>

        {/* Specialization */}
        <p className="text-gray-600 font-semibold text-base">{tutor?.tutorProfile?.jobTitle}</p>
      </div>
    </Card>
  )
}
