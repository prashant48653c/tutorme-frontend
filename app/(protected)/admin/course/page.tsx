'use client'
import AddTutorPopup from "@/components/admin/AddTutor";
import CourseManagement from "@/components/admin/CourseManagement";
import TutorManagement from "@/components/admin/ManageTutorTable";
import { Button } from "@/components/ui/button";
import { ArrowUpAZ, Filter, Search } from "lucide-react";
import React, { useState } from "react";

const AdminDashboard = () => {
  const [isPopupOpen,setIsPopupOpen]=useState(false);

  return (
    <section className="flex  pl-4 flex-col gap-y-9">
      <div className="flex  items-center justify-between">
        <h4 className="uppercase text-xl font-bold">Manage Courses</h4>
         
      </div>
      
       <div>
        <CourseManagement/>
      </div>

    </section>
  );
};

export default AdminDashboard;
