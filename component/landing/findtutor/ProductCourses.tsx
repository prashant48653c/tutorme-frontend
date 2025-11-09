import Image from "next/image"
import { Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
]

const products = [
  {
    id: 1,
    title: "Introduction to Basics",
    rating: 4.5,
    reviews: 120,
    price: 1200,
        image: "/static/landing/course.svg",

  },
  {
    id: 2,
    title: "Introduction to Basics",
    rating: 4.8,
    reviews: 89,
    price: 1500,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Introduction to Basics",
    rating: 4.6,
    reviews: 156,
    price: 1800,
    image: "/static/landing/course.svg",
  },
]

export default function CourseProductList() {
  return (
    <div className="w-full mb-5 max-w-6xl mx-auto space-y-12">
      {/* Featured Courses Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Courses</h2>
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
                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">Enroll Course</Button>
              </CardContent>
            </Card>
          ))}

          {/* Explore More Card */}
          <Card className="bg-gradient-to-br from-teal-400 to-teal-600 text-white overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center">
              <h3 className="text-xl font-bold mb-2">Explore more</h3>
              <h4 className="text-2xl font-bold mb-4">Courses</h4>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <ArrowRight className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow p-0">
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{product.title}</h3>

                <div className="flex items-center justify-between gap-1 mb-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                  </div>
                   <div className="">
                  <span className="text-xs font-bold text-gray-900">Nrs {product.price}</span>
                </div>
                </div>

               

                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">Buy Now</Button>
              </CardContent>
            </Card>
          ))}

          {/* Explore More Card */}
          <Card className="bg-gradient-to-br from-teal-400 to-teal-600 text-white overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center">
              <h3 className="text-xl font-bold mb-2">Explore more</h3>
              <h4 className="text-2xl font-bold mb-4">Products</h4>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <ArrowRight className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
