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

const items = [
  {
    title: "Education",
    education: [
      {
        college: "Aims College of Medical",
        course: "MCE",
        time: "2018 - 2022",
        type: "Full Time",
      },
      {
        college: "Harvard University",
        course: "BCE",
        time: "2018 - 2022",
        type: "Full Time",
      },
    ],
  },
];

export default function QualificationView() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [status, setStatus] = useState(false);

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
      {items.map(({ title, education }, index) => {
        const isOpen = openItem === `item-${index}`;

        return (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-green-500 text-xl [&>svg]:hidden">
              <div className="flex w-full justify-between items-center gap-2">
                <span>{title}</span>
                <div className="flex items-center gap-5">
                  <Plus
                    size={18}
                    className="text-green-500 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(index);
                    }}
                  />
                  {isOpen ? (
                    <ArrowUp size={18} className="text-green-500" />
                  ) : (
                    <ArrowDown size={18} className="text-green-500" />
                  )}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="text-gray-500 justify-center text-sm flex flex-col gap-4">
              {education.map((edu, eduIndex) => (
                <div
                  key={eduIndex}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-semibold text-md text-black">{edu.course}</p>
                    <p className="font-semibold text-md text-black">{edu.college}</p>
                    <p>
                      {edu.time} | {edu.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-x-4">
                    <Pencil
                      size={18}
                      className="text-green-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(eduIndex);
                      }}
                    />
                    <Trash
                      size={18}
                      className="text-green-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(eduIndex);
                      }}
                    />
                  </div>
                </div>
              ))}
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
