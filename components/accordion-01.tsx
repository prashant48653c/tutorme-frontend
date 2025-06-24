'use client'
import EditBio from "@/component/profile/EditBio";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";
import { useState } from "react";

const items = [
  {
    title: "Bio",
    content:
      "Sandesh Sapkota is a seasoned UI/UX designer with over 7 years of experience in creating intuitive, user-centered designs. With a strong background in both visual design and user experience.",
  },
];

export default function BioAccordion() {
  const [openItem, setOpenItem] = useState<string | null>(null);
const [status,setStatus] = useState(false);
  const handleEdit = (index: number) => {
    console.log("Editing item:", index);
    // Your edit logic here
    setStatus(true)
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={openItem || ""}
      onValueChange={(value) => setOpenItem(value)}
      className="max-w-lg w-full "
    >
      {items.map(({ title, content }, index) => {
        const isOpen = openItem === `item-${index}`;

        return (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-green-500 text-xl [&>svg]:hidden">
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
              {content}
            </AccordionContent>
          </AccordionItem>
        );
      })}

      {
        status && (
          <div className="absolute z-10 top-40 right-72 p-2 text-xs text-gray-400">
           <EditBio/>
          </div>
        )
      }
    </Accordion>
  );
}
