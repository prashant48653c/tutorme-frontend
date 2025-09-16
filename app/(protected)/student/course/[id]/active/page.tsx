'use client'

import CourseContentViewer from "@/components/student/CourseContentViewer"
import { usePathname } from "next/navigation"

const ActiveCourseSection = () => {
    const params=usePathname() //  /student/course/39/active
    const courseId=(params.split("/course/")[1].split("/")[0])
  return (
    <div>
        <CourseContentViewer/>
    </div>
  )
}

export default ActiveCourseSection