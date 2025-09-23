"use client";

import CourseManagement from "@/components/student/CourseManagement";
import AddTutorPopup from "@/components/admin/AddTutor";
import TutorManagement from "@/components/admin/ManageTutorTable";
import AddCourse from "@/components/tutor/AddCourse";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { checkKhaltiPayment, checkKhaltiPaymentForLoadBalance } from "@/hooks/khalti";
import StudentWallet from "@/components/student/StudentWallet";
import { useAuthStore } from "@/store/useAuthStore";

const page = () => {
  const Router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const searchParams = useSearchParams();

  const pidx = searchParams.get("pidx");

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (pidx && user) {
      console.log(pidx, "Calling");
      checkKhaltiPaymentForLoadBalance({
        id: user?.id ,
        pidx,
      });
    }
  }, [pidx,user]);
  return (
    <section className="flex py-10 pl-4 flex-col gap-y-9">
      <div>
        <StudentWallet />
      </div>
      {isPopupOpen && <AddCourse onClose={() => setIsPopupOpen(false)} />}
    </section>
  );
};

export default page;
