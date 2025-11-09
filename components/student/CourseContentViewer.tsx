"use client";
import React, { useState, useReducer, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Upload,
  Plus,
  FileText,
  Video,
  Folder,
  FileImage,
} from "lucide-react";

import Plyr from "plyr-react";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ArrowUp, Pen, PlusSquare, Trash, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

import {
  Chapter,
  SubHeading,
  SubTitle,
  useCourseStore,
} from "@/store/useCourseStore";
import { useRouter } from "next/navigation";

import api from "@/hooks/axios";
import toast from "react-hot-toast";

export const CourseContentViewer = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<
    | ((Chapter | SubHeading | SubTitle) & {
        type: "chapter" | "subheading" | "subchapter";
        parentId: string;
      })
    | null
  >();
  // Get everything from the store
const fetchCourse = async () => {
const courseId = 3  ;
const res = await api.get("/course/" + courseId);
console.log(res);
updateCourseDetails(res.data.data);
console.log(courseDetails,"Updated")
 
};
  const handleSelection = (
    e: any,
    item: Chapter | SubHeading | SubTitle,
    type: "chapter" | "subheading" | "subchapter",
    parentId: string
  ) => {
    e.stopPropagation();
    setSelectedItem({ ...item, type, parentId });
    console.log(item);
  };
  const {
    courseDetails,
    chapters,
    openChapters,
    opensubChapters,
    isLoading,
    isSaving,
    setLoading,
    setSaving,
    updateCourseDetails,
    addChapter,
    deleteChapter,
    updatetitle,
    toggleChapter,
    addSubTitle,
    deleteSubTitle,
    updateSubTitleName,
    toggleSubTitle,
    addSubHeading,
    deleteSubHeading,
    updateSubHeadingName,
    reorderChapters,
    reordersubChapters,
    reorderSubHeadings,
    saveDraft: saveMyDraft,
  } = useCourseStore();

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    setLoading(true);

    if (type === "chapter") {
      reorderChapters(source.index, destination.index);
    } else if (type === "subTitle") {
      reordersubChapters(source.droppableId, source.index, destination.index);
    } else if (type === "subHeading") {
      reorderSubHeadings(source.droppableId, source.index, destination.index);
    }

    setLoading(false);
  };

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);

  

  const handleSaveDraft = async () => {};

  useEffect(() => {
    fetchCourse();
  }, []);
  return (
    <div className="flex border relative justify-end  p-1  overflow-hidden   ">
      <div
        className={`${
          sidebarCollapsed ? "w-0 invisible" : "w-[30%]"
        } border transition-all duration-300 ease-in-out overflow-x-hidden `}
      >
        <section className="py-4 overflow-y-auto pb-10 h-[30rem] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-semibold text-md">Course Structure</h5>
          </div>

          {/* Course Info */}

          {/* Drag and Drop Course Structure */}
          <div className="flex flex-col items-start">
            {chapters?.map((chapter, chapterIndex) => (
              <div key={chapter.id} className="border p-2 my-2 bg-white">
                {/* Chapter Header */}
                <div
                  onClick={(e) =>
                    handleSelection(
                      e,
                      chapter,
                      "chapter",
                      courseDetails?.id?.toString() ?? "0"
                    )
                  }
                  className="w-full justify-between flex gap-1 items-center bg-gray-200 rounded-sm p-2"
                >
                  <div className="flex gap-1 items-center">
                    <Input
                      placeholder={
                        chapter.title || `Chapter ${chapterIndex + 1}`
                      }
                      className="text-sm"
                      value={chapter.title}
                      onChange={(e) =>
                        updatetitle(chapter.id.toString(), e.target.value)
                      }
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        addSubTitle(chapter.id.toString());
                      }}
                      className="flex cursor-pointer text-xs border border-gray-400 items-center gap-2 p-2 rounded-sm"
                    >
                      <PlusSquare size={15} />
                    </div>

                    <ArrowUp
                      size={15}
                      className={`cursor-pointer transition-transform ${
                        openChapters[chapter.id] ? "rotate-180" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleChapter(chapter.id.toString());
                      }}
                    />
                  </div>
                </div>

                {/* Subchapters */}
                {openChapters[chapter.id] && (
                  <div className="ml-4">
                    {chapter.subChapters?.map((sub, subIndex) => (
                      <div
                        key={sub.id}
                        className="border p-2 my-2 bg-gray-100 py-4 flex flex-col justify-center rounded"
                      >
                        <div
                          onClick={(e) =>
                            handleSelection(
                              e,
                              sub,
                              "subchapter",
                              chapter.id.toString()
                            )
                          }
                          className="flex items-center justify-between"
                        >
                          <div className="flex gap-1 items-center">
                            <Input
                              placeholder={
                                sub.title || `Subchapter ${subIndex + 1}`
                              }
                              className="text-sm"
                              value={sub.title}
                              onChange={(e) =>
                                updateSubTitleName(
                                  sub.id.toString(),
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                addSubHeading(sub.id.toString());
                              }}
                              className="flex cursor-pointer text-sm border border-gray-400 items-center gap-2 p-1 rounded-sm"
                            >
                              <PlusSquare size={15} />
                            </div>
                            <Pen size={15} />
                            <Trash
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSubTitle(sub.id.toString());
                              }}
                              size={15}
                              color="red"
                              className="cursor-pointer"
                            />
                            <ArrowUp
                              size={15}
                              className={`cursor-pointer transition-transform ${
                                opensubChapters[sub.id.toString()]
                                  ? "rotate-180"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubTitle(sub.id.toString());
                              }}
                            />
                          </div>
                        </div>

                        {/* Subheadings */}
                        {opensubChapters[sub.id.toString()] && (
                          <ul className="ml-4 my-3 list-disc">
                            {sub.subHeadings?.map((sh, shIndex) => (
                              <li
                                key={sh.id}
                                className="py-2 pl-2 my-1 bg-white list-none border-b"
                              >
                                <div
                                  onClick={(e) =>
                                    handleSelection(
                                      e,
                                      sh,
                                      "subheading",
                                      sub.id.toString()
                                    )
                                  }
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex gap-1 items-center">
                                    <Input
                                      placeholder={
                                        sh.title || `Subheading ${shIndex + 1}`
                                      }
                                      className="text-sm"
                                      value={sh.title}
                                      onChange={(e) =>
                                        updateSubHeadingName(
                                          sh.id.toString(),
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Pen size={15} />
                                    <Trash
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSubHeading(sh.id.toString());
                                      }}
                                      size={15}
                                      color="red"
                                      className="cursor-pointer"
                                    />
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-4 space-y-3">
            <Button
              onClick={(e) => {
                e.preventDefault();
              }}
              className="border py-2 bg-transparent text-black hover:bg-green-200 w-full border-green-400"
              disabled={isLoading}
            >
              <PlusSquare className="text-green-400 mr-2" size={16} />
              Mark all as read
            </Button>
          </div>
        </section>
      </div>

      <div
        className={` overflow-auto  h-[90vh] relative flex flex-col  ${
          sidebarCollapsed ? "w-[100%] " : "w-[70%]"
        }
flex flex-col} px-1`}
      >
        <div className="absolute rounded-lg bg-black  top-[45%]">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="py-2  px-1   "
          >
            {sidebarCollapsed ? (
              <ChevronRight color="white" className="w-5 h-5" />
            ) : (
              <ChevronLeft color="white" className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-start gap-1 flex-col">
            <h1 className="text-xl font-semibold">
              {selectedItem?.title || "Select a chapter or section"}
            </h1>
            <span className="text-sm text-teal-600 font-medium">
              Draft your Content
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
              Chapter 1
            </button>
            <span className="text-gray-400">|</span>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
              Chapter 2
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Content Editor */}
        <div className="flex-1 p-6 mb-10 overflow-y-auto">
       <div className="max-w-4xl mx-auto space-y-6">
  {/* Normal HTML video */}
  <video
    className="w-full rounded-lg"
    controls
    controlsList="nodownload"
  >
    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
    <track
      kind="captions"
      label="English"
      src="/sub.vtt"
      srcLang="en"
      default
    />
    Your browser does not support the video tag.
  </video>

  <div className="w-full h-max">
    <p className="w-full h-full p-2 text-gray-700 border rounded">
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Pariatur cupiditate quo in repudiandae architecto beatae
      doloribus reprehenderit aspernatur odio quos ipsa, veritatis,
      vitae consequatur dicta dolore quia ratione voluptatibus
      laborum. Aperiam, eum sapiente deleniti dicta itaque porro illo
      optio blanditiis, delectus possimus pariatur consequuntur ea
      quia sequi iste animi, iure exercitationem mollitia asperiores!
      Quidem, id?
    </p>
  </div>

  {/* Action Buttons */}
  <div className="border-t grid grid-cols-2 gap-4 pt-4 space-y-3">
    <Button
      onClick={(e) => {
        e.preventDefault();
        addChapter();
      }}
      className="border py-5 bg-transparent text-black hover:bg-green-200 w-full border-green-400"
      disabled={isLoading}
    >
      Previous
    </Button>

    <Button
      onClick={handleSaveDraft}
      className="w-full py-5 bg-green-600 hover:bg-green-700"
      disabled={isSaving}
    >
      Next
    </Button>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default CourseContentViewer;
