"use client";

import CourseManagement from "@/components/student/CourseManagement";
import AddTutorPopup from "@/components/admin/AddTutor";
import TutorManagement from "@/components/admin/ManageTutorTable";
import AddCourse from "@/components/tutor/AddCourse";
import { Button } from "@/components/ui/button";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

const page = () => {
  const Router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const data = getUserData(user?.id as number);

  return (
    <section className="flex py-10 pl-4 flex-col gap-y-9">
      <div className="flex  items-center justify-between">
        <h4 className="uppercase text-xl font-bold">My courses</h4>
        <div>
          <Button className="rounded-full bg-teal-500 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-teal-600">
          My Courses
        </Button>
        </div>
      </div>

      <div>
        <CourseManagement />
      </div>
    </section>
  );
};

export default page;
