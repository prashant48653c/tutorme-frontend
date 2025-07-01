"use client";

import EditBio from "@/component/profile/EditBio";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import EditProfileForm from "./EditProfile";
import AddQualificationModal from "./AddQualification";
import { useAuthStore } from "@/store/useAuthStore";
import { EducationType } from "@/types/auth";

export default function QualificationView() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [status, setStatus] = useState(false);
  const user = useAuthStore((state) => state.user);
  console.log(user);
  const education = user?.tutorProfile?.education;

  const handleEdit = (index: number) => {
    console.log("Editing item:", index);
    setStatus(true);
  };

  const handleDelete = (index: number) => {
    toast.success("Deleted Successfully");
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={openItem || ""}
      onValueChange={(value) => setOpenItem(value)}
      className="max-w-lg w-full"
    >
      {education?.map((edu: EducationType, index: number) => {
        const isOpen = openItem === `item-${index}`;

        return (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-primeGreen text-xl [&>svg]:hidden">
              <div className="flex w-full justify-between items-center gap-2">
                <span>Education</span>
                <div className="flex items-center gap-5">
                  <Plus
                    size={18}
                    className="text-primeGreen cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(index);
                    }}
                  />
                  {isOpen ? (
                    <ArrowUp size={18} className="text-primeGreen" />
                  ) : (
                    <ArrowDown size={18} className="text-primeGreen" />
                  )}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="text-gray-500 justify-center text-sm flex flex-col gap-4">
              <div className="flex justify-between items-center border-b pb-2">
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
                      handleEdit(index);
                    }}
                  />
                  <Trash
                    size={18}
                    className="text-primeGreen cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}

      {status && (
        <div className="absolute z-10 left-1/2 top-40 transform -translate-x-1/2 p-2 text-xs text-gray-400">
          <AddQualificationModal />
        </div>
      )}
    </Accordion>
  );
}
