"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import AddQualificationModal from "./AddQualification";
import { useAuthStore } from "@/store/useAuthStore";
import { EducationType } from "@/types/auth";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import api from "@/hooks/axios";
import { useQuery } from "@tanstack/react-query";

export default function QualificationView() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [status, setStatus] = useState(false);
  const [selectedData,setSelectedData]=useState<EducationType>();
  const user = useAuthStore((state) => state.user);

  const fetchEducation = async () => {
    if (user?.tutorProfile?.id) {
      const res = await api.get(`/auth/tutor/edu/${user.tutorProfile.id}`);
      return res.data.data;
    }
    return [];
  };

  const {
    data: education,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userEducation", user?.tutorProfile.id],
    queryFn: fetchEducation,
    enabled: !!user?.tutorProfile?.id,
  });

  const handleEdit = (edu: any) => {
    setSelectedData(edu)
    setStatus(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await api.delete(`/auth/tutor/edu/${id}`);
      console.log(res);
      toast.success(res.data.message || "Deleted Successfully");
      refetch()
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message || "Something went wrong!");
    }
    // You could also call an API here and then refetch();
  };

  // if (isLoading) return <>Loading...</>;

  return (
    <>
      <Accordion
        type="single"
        collapsible
        value={openItem || ""}
        onValueChange={(value) => setOpenItem(value)}
        className="w-full"
      >
        <AccordionItem value="education">
          <AccordionTrigger className="text-primeGreen text-xl [&>svg]:hidden">
            <div className="flex w-full justify-between items-center gap-2">
              <span>Education</span>
              <div className="flex items-center gap-5">
                <Plus
                  size={18}
                  className="text-primeGreen cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(0); // or -1 to mean "new"
                  }}
                />
                {openItem === "education" ? (
                  <ArrowUp size={18} className="text-primeGreen" />
                ) : (
                  <ArrowDown size={18} className="text-primeGreen" />
                )}
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="text-gray-500 justify-center text-sm flex flex-col gap-4">
            {education?.length > 0 ? (
              education.map((edu: EducationType, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-semibold text-md text-black">
                      {edu.qualification}
                    </p>
                    <p className="font-semibold text-md text-black">
                      {edu.institutionName}
                    </p>
                    <p>
                      {edu.timePeriod} |{" "}
                      {edu.type === "FULL_TIME" ? "Full Time" : "Part Time"}
                    </p>
                  </div>
                  <div className="flex items-center gap-x-4">
                    <Pencil
                      size={18}
                      className="text-primeGreen cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(edu);
                      }}
                    />
                    <Trash
                      size={18}
                      className="text-primeGreen cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(edu.id);
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>No education records yet.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {status && (
        <Dialog open={status} onOpenChange={() => setStatus(false)}>
          <DialogContent className="bg-white p-0 backdrop-blur-none shadow-lg">
            <AddQualificationModal  setStatus={setStatus} initialData={selectedData} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
