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
          <Button onClick={() => setIsPopupOpen(true)}  className="bg-primeGreen rounded-full px-9">Add Tutor</Button>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <span>Show</span>
          <select
            className=" border-gray-600 py-1 rounded-xs border"
            defaultValue="5"
          >
            {[5, 10, 15, 20, 25, 30].map((num) => (
              <option className="p-0" key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>

          <div className="flex items-center border rounded-lg bg-[#F5F7F9] p-2 gap-2 justify-center">
          <Search size={18} />
          <input
            className="border-0 min-w-[20rem] outline-0 hover:outline-0"
            placeholder="Search.."
          />
        </div>

        <div className="flex gap-3">
          Sort By (A-Z)
          <ArrowUpAZ />
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
