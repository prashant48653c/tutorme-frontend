"use client";
import React, { useState } from "react";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import ResourceManagement from "./ResourceManagement";
import TimeManagement from "./TimeManagement";
import OverviewManagement from "./OverviewManagement";
import { useCourseStore } from "@/store/useCourseStore";
import { stat } from "fs";
import AssignmentManagement from "./AssignmentManagement";
import { useRouter } from "next/navigation";
import api from "@/hooks/axios";
import { useGlobalCourseStore } from "@/store/useGlobalCourseStore";

type Assignment = {
  id: string;
  title: string;
  description: string;
};

const CourseTab: React.FC = () => {
  const tabs: string[] = [
    "Course Content",
    "Resources",
    "Practice Questions",
    "Assignments",
    "Class Schedule",
  ];
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("Course Content");
  const course = useCourseStore((state) => state.courseDetails);
  const chapter = useCourseStore((state) => state.chapters);
const {setCourse}=useGlobalCourseStore()
  console.log(course, chapter);
  type Qna = {
    id: number | string;
    description: string;
  };

  const [qnas, setQnas] = useState<Qna[]>([
    { id: -1, description: "Write your content here!" }, // initial state example
  ]);
  const updateQna = (id: number | string, field: keyof Qna, value: string) => {
    setQnas((prev) =>
      prev.map((qna) => (qna.id === id ? { ...qna, [field]: value } : qna))
    );
  };
  const saveDraft = async () => {
   try {
   const res=  await api.post(`course/qna/${course?.id}`, {description: qnas[0].description});
     console.log("Draft saved!");
     setCourse(res.data.data)
   } catch (error) {
     console.error("Error saving draft:", error);
   }
   }
  

  // Resources

  const renderTabContent = () => {
    switch (activeTab) {
      case "Assignments":
        return <AssignmentManagement />;

      case "Course Content":
        return <OverviewManagement />;

      case "Resources":
        return <ResourceManagement />;

      case "Practice Questions":
        return (
          <div>
            <h1 className="text-xl font-semibold ">Practice Questions</h1>
            <p className="text-primeGreen mb-6">
              Add previous year questions,image and links
            </p>
            {qnas.map((qna) => (
              <SimpleEditor
                key={qna.id}
                value={qna.description}
                onChange={(value) => updateQna(qna.id, "description", value)}
              />
            ))}
            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button onClick={saveDraft} className="flex-1 bg-teal-500 text-white py-4 px-8 rounded-lg font-medium hover:bg-teal-600 transition-colors">
                Save Draft
              </button>
              <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-4 px-8 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Send for Approval
              </button>
            </div>
          </div>
        );

      case "Class Schedule":
        return <TimeManagement />;

      default:
        return null;
    }
  };

  return (
    <div className="max-w overflow-y-scroll pb-20 mx-auto p-6 bg-gray-50 h-[90vh]">
      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-teal-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">{renderTabContent()}</div>
    </div>
  );
};

export default CourseTab;
