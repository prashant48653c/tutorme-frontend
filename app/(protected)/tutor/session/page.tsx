'use client'

import CourseManagement from "@/components/tutor/CourseManagement";  
import AddTutorPopup from "@/components/admin/AddTutor";
import TutorManagement from "@/components/admin/ManageTutorTable";
import AddCourse from "@/components/tutor/AddCourse";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SessionManagement from "@/components/tutor/session/SessionManagement";
import SessionSetupModal from "@/components/tutor/session/AddSession";

const page = () => {
      const [isPopupOpen,setIsPopupOpen]=useState(false);
    
  return (
   <section className="flex my-10  pl-4 flex-col gap-y-9">
      <div className="flex  items-center justify-between">
        <h4 className="uppercase text-xl font-bold">Manage Session</h4>
        <div>
          <Button onClick={() => setIsPopupOpen(true)}  className="bg-primeGreen rounded-full px-9">Add Availabiliy</Button>
        </div>
      </div>
      
       <div className="">
        <SessionManagement/>
      </div>
            {isPopupOpen && <SessionSetupModal  />}

    </section>
  )
}

export default page