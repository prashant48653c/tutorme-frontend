import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function TutorCard({tutor}:{tutor:any}) {
  return (
   <Card className="w-[18rem] sm:w-[10rem] md:w-[15rem] lg:w-[18rem]  rounded-2xl overflow-hidden border-0 shadow-none !important ">
  {/* Profile Image Section */}
  <div className="relative">
    
<div className="absolute bottom-[-50%] left-0 w-full h-full overflow-visible cardcolor z-[0] transform -translate-y-1/6 rounded-3xl" />
    <div className="aspect-[4/5] scale-90 relative overflow-hidden z-[1]">
      <Image
        src={tutor?.image || "/static/landing/course.svg"}
        alt={tutor?.name}
        fill
        className="object-cover rounded-3xl"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority
      />
    </div>

    {/* Price Tag */}
    <div className="absolute top-10 right-10 sm:top-10 sm:right-10 bg-teal-400 text-white px-3 py-1 rounded-md text-xs sm:text-sm font-medium z-[2]">
      {tutor?.tutorProfile?.price}/hr
    </div>
  </div>

  {/* Card Content */}
  <div className="px-6 text-center z-[2] font-hove">
    {/* Star Rating */}
    <div className="flex items-center justify-center gap-1 ">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400 " />
      ))}
      <span className="text-gray-600 text-sm ml-1">(25)</span>
    </div>

    {/* Name */}
    <h2 className="text-xl sm:text-2xl font-hove font-bold text-gray-700 mb-1 ">{tutor?.name}</h2>

    {/* Specialization */}
    <p className="text-gray-600 font-semibold text-sm sm:text-base">
      {tutor?.tutorProfile?.jobTitle}
    </p>
  </div>
</Card>

  )
}
