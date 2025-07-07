'use client'

import CourseManagement from "@/components/tutor/CourseManagement";  
import AddTutorPopup from "@/components/admin/AddTutor";
import TutorManagement from "@/components/admin/ManageTutorTable";
import AddCourse from "@/components/tutor/AddCourse";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const page = () => {
      const [isPopupOpen,setIsPopupOpen]=useState(false);
    
  return (
   <section className="flex  pl-4 flex-col gap-y-9">
      <div className="flex  items-center justify-between">
        <h4 className="uppercase text-xl font-bold">Manage Course</h4>
        <div>
          <Button onClick={() => setIsPopupOpen(true)}  className="bg-primeGreen rounded-full px-9">Add Course</Button>
        </div>
      </div>
      
       <div>
        <CourseManagement/>
      </div>
            {isPopupOpen && <AddCourse onClose={() => setIsPopupOpen(false)} />}

    </section>
  )
}

export default page