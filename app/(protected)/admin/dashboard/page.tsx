'use client'
import AddTutorPopup from "@/components/admin/AddTutor";
import TutorManagement from "@/components/admin/ManageTutorTable";
import { Button } from "@/components/ui/button";
import { ArrowUpAZ, Filter, Search } from "lucide-react";
import React, { useState } from "react";

const AdminDashboard = () => {
  const [isPopupOpen,setIsPopupOpen]=useState(false);

  return (
    <section className="flex  pl-4 flex-col gap-y-9">
      <div className="flex  items-center justify-between">
        <h4 className="uppercase text-xl font-bold">Manage Tutors</h4>
        <div>
          <Button onClick={() => setIsPopupOpen(true)}  className="bg-primaryGreen rounded-full px-9 hover:bg-teal-400 text-white">Add Tutor</Button>
        </div>
      </div>
      
       <div>
        <TutorManagement/>
      </div>
            {isPopupOpen && <AddTutorPopup onClose={() => setIsPopupOpen(false)} />}

    </section>
  );
};

export default AdminDashboard;
