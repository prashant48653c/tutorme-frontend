'use client';

import { Button } from "@/button";
import Course from "@/component/landing/Course";
import CourseProductList from "@/component/landing/findtutor/ProductCourses";
import Footer from "@/component/reusable/Footer";
import CourseInterface from "@/components/course/CourseDetail";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Badge, Search, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";



const courses = [
  {
    id: 1,
    title: "Introduction to Basics",
    description:
      "This course is designed to provide students with basic principles of biology. We will be studying about the cell and its composition.",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.5,
    reviews: 120,
    price: 1200,
    students: "2.5k",
    badge: null,
  },
  {
    id: 2,
    title: "Introduction to Basics",
    description:
      "This course is designed to provide students with basic principles of biology. We will be studying about the cell and its composition.",
        image: "/static/landing/course.svg",

    rating: 4.8,
    reviews: 89,
    price: 1500,
    students: "1.8k",
    badge: null,
  },
  {
    id: 3,
    title: "Introduction to Basics",
    description:
      "This course is designed to provide students with basic principles of biology. We will be studying about the cell and its composition.",
       image: "/static/landing/course.svg",

    rating: 4.6,
    reviews: 156,
    price: 1800,
    students: "3.2k",
    badge: "Free",
  },
    {
    id: 3,
    title: "Introduction to Basics",
    description:
      "This course is designed to provide students with basic principles of biology. We will be studying about the cell and its composition.",
       image: "/static/landing/course.svg",

    rating: 4.6,
    reviews: 156,
    price: 1800,
    students: "3.2k",
    badge: "Free",
  },
]


const CourseDetailPage = () => {
    const router=useRouter()
     const handleEnroll=(id:number)=>{
router.push(`/course/${id}`)
  }
  return (
    <>
    <main className="w-full h-full px-8 pb-4">
  <section className="flex items-center gap-16 mt-3 mb-10">
        <h2 className="font-bold text-2xl min-w-fit ">
          COURSE <span className="text-green-500">DETAILS</span>
        </h2>
        <div className="flex w-full items-center border rounded-lg bg-[#F5F7F9] p-2 gap-2 justify-start">
          <Search size={18} />
          <input
            className="border-0 min-w-[20rem] outline-0 hover:outline-0 bg-transparent"
            placeholder="Search.."
            // value={searchQuery}
            // onChange={handleSearchChange}
          />
        </div>
      </section>

      <CourseInterface/>
              <section>
                <div className="flex justify-between mb-4">
   <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Courses</h2>
   View All
                </div>
     
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden p-0 hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                {course.badge && (
                  <Badge className="absolute top-3 right-3 bg-teal-500 text-white">{course.badge}</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{course.description}</p>

                <div className="flex items-center justify-between gap-1 mb-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= Math.floor(course.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  
                  <span className="text-sm text-gray-600">
                    {course.rating} ({course.reviews})
                  </span>
                  </div>
                   <div className="">
                  <span className="text-xs font-bold text-gray-900">Nrs {course.price}</span>
                </div>
                </div>

                    <div className="my-2 flex items-center justify-between text-xs">
                        <p>12 Chapters</p>
                        <p>400 minutes</p>
                    </div>
                <Button onClick={() => handleEnroll(course.id)} className="w-full bg-teal-500 hover:bg-teal-600 text-white">Enroll Course</Button>
              </CardContent>
            </Card>
          ))}

        
        
        </div>
      </section>
    </main>
      <Footer/>


    </>
  )
}

export default CourseDetailPage