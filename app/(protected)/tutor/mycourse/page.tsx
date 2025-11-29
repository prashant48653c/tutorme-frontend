'use client'

import CourseManagement from "@/components/tutor/CourseManagement";  
import AddTutorPopup from "@/components/admin/AddTutor";
import TutorManagement from "@/components/admin/ManageTutorTable";
import AddCourse from "@/components/tutor/AddCourse";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const page = () => {
      const [isPopupOpen,setIsPopupOpen]=useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

  const refetchCourses = () => {
    setRefreshKey(prev => prev + 1);  
  };
  return (
   <section className="flex py-10 pl-4 flex-col gap-y-9">
      <div className="flex  items-center justify-between">
        <h4 className="uppercase text-xl font-bold">My Courses</h4>
        <div>
          <Button onClick={() => setIsPopupOpen(true)}  className="bg-primeGreen rounded-full px-9">Add Course</Button>
        </div>
      </div>
      
       <div>
        <CourseManagement refetchKey={refreshKey} />
      </div>
            {isPopupOpen && <AddCourse refetch={refetchCourses} onClose={() => setIsPopupOpen(false)} />}

    </section>
  )
}

export default page