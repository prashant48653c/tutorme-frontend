
 'use client'
import CourseManagement from "@/component/profile/CourseManagement";
import ProductManagement from "@/component/profile/ProductManagement";
import Profile from "@/component/profile/Profile";
import QualificationView from "@/component/profile/QualificationView";
import Topbar from "@/component/reusable/Topbar";
import BioAccordion from "@/components/accordion-01";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { Inbox } from "lucide-react";
import { Onest } from "next/font/google";
import Image from "next/image";
import React from "react";


 const OnestFont=Onest({
      subsets:["latin"],
      weight:'400'
  })
  
const ProfilePage = () => {
 
  
  return (
   

      <div className={`grid mt-8 ${OnestFont.className} grid-cols-2 w-full gap-4`}>
        <div className="  h-full  pb-7 flex flex-col  p-4">
          <Profile/>

          <div className="shadow-md  mt-8 rounded-2xl px-4  ">
            <BioAccordion />
          </div>

          <div className="shadow-md  mt-8 rounded-2xl px-4  ">
            <QualificationView />
          </div>
        </div>

        <div className=" flex flex-col gap-y-8 p-0">
          <CourseManagement/>
          <ProductManagement/>

        </div>
      </div>
     
  );
};

export default ProfilePage;
