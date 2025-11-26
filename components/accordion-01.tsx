"use client";
import EditBio from "@/component/profile/EditBio";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import api from "@/hooks/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";

const items = [
  {
    title: "Bio",
    content:
      "Sandesh Sapkota is a seasoned UI/UX designer with over 7 years of experience in creating intuitive, user-centered designs. With a strong background in both visual design and user experience.",
  },
];

export default function BioAccordion() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [status, setStatus] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleEdit = async (index: number) => {
    console.log("Editing item:", user);

    setStatus(true);
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={openItem || ""}
      onValueChange={(value) => setOpenItem(value)}
      className=" w-full  bg-white "
    >
      {items.map(({ title, content }, index) => {
        const isOpen = openItem === `item-${index}`;

        return (
          <AccordionItem key={index} className="" value={`item-${index}`}>
            <AccordionTrigger className="text-green-500  text-xl [&>svg]:hidden">
              <div className="flex w-full justify-between items-center gap-2">
                <span>{title}</span>
                <div className="flex items-center gap-5">
                  {/* Pencil icon triggers edit function and does NOT toggle accordion */}
                  <Pencil
                    size={18}
                    className="text-green-500  cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent accordion toggle
                      handleEdit(index);
                    }}
                  />
                  {/* Arrow changes based on open state */}
                  {isOpen ? (
                    <ArrowUp size={18} className="text-green-500" />
                  ) : (
                    <ArrowDown size={18} className="text-green-500" />
                  )}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="text-gray-500 text-sm">
              {user?.bio || "New user at TutorMe"}
            </AccordionContent>
          </AccordionItem>
        );
      })}

      {status && (
        <Dialog open={status} onOpenChange={setStatus}>
          <DialogOverlay className=" " />
          <DialogContent className="bg-white  rounded-xl p-6 shadow-xl z-50 max-w-2xl w-[40rem]">
            <EditBio setStatus={setStatus} />
          </DialogContent>
        </Dialog>
      )}
    </Accordion>
  );
}
