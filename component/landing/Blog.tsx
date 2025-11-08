import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import Marquee from "react-fast-marquee";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      image: "/static/landing/course.svg",
      date: "June 02, 2024",
      title: "From Panic to Prepared: A Night Before Exam Checklist",
    },
    {
      id: 2,
          image: "/static/landing/course.svg",

      date: "June 02, 2024",
      title: "How to Find the Right Tutor in Under 10 Minutes",
    },
    {
      id: 3,
           image: "/static/landing/course.svg",

      date: "June 02, 2024",
      title: "5 Last-Minute Study Hacks That Actually Work",
    },
    {
      id: 4,
           image: "/static/landing/course.svg",

      date: "June 02, 2024",
      title: "The Ultimate Guide to Online Learning Success",
    },
    {
      id: 5,
          image: "/static/landing/course.svg",

      date: "June 02, 2024",
      title: "Building Confidence Before Your Big Presentation",
    },
  ]

  return (
    <section className="py-16 pl-16 bg-gray-50">
      <div className="lg:max-w-7xl md:max-w-3xl  mx-auto">
        {/* Header */}
        <div className="flex md:flex-row flex-col pr-16 items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-hove font-extrabold text-gray-900 mb-4">
              From Our <span className="text-teal-400">Blogs</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Stay updated with the latest insights, tips, and trends from our blog.
            </p>
          </div>
          <div >
<Button className="hidden sm:flex group border-green-400 bg-white justify-around text-center border min-w-[10rem] mt-4 px-1 py-6 text-lg font-semibold pl-3 rounded-full text-black hover:bg-teal-50 transition">              {" "}
              View all Blogs
              <span className="icon-hover-rotate">
              <div className='rounded-full p-3  bg-green-400'>
                
              <ArrowUpRight color='white'  size={15}/>
              </div>
              </span>

              
          </Button>
            </div>
        </div>

        {/* Scrollable Blog Cards */}
<div className="pb-4 overflow-x-visible">
  <Marquee pauseOnHover={true} gradient={false} speed={40}>
    <div className="flex gap-6 px-6 min-w-max">
      {[...blogPosts, ...blogPosts].map((post, index) => (
        <div
          key={`${post.id}-${index}`}
          className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="relative h-48 overflow-hidden">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-3">{post.date}</p>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 line-clamp-2">{post.title}</h3>
            <Button
              variant="outline"
              className="flex items-center rounded-full gap-2 text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Read More
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </Marquee>
</div>

        {/* Mobile View All Button */}
        <div className="flex justify-center mt-8 md:hidden min-w-[200%] sm:min-w-max">
          <Button
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-teal-400 text-teal-600 hover:bg-teal-50 bg-white"
          >
            View all Blogs
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
