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
import RichTextExample from "./TextEditor.jsx";
import api from "@/hooks/axios";
import toast from "react-hot-toast";

export const CourseContentEditor = () => {
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

  const handleUpload = async () => {
    if (!videoFile || !subtitleFile) {
      toast.error("Please upload both video and subtitle.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("subtitle", subtitleFile);
    formData.append("title", selectedItem?.title ?? "");
    formData.append("description", "Yo");
    formData.append("courseId", courseDetails?.id?.toString() ?? "");

    formData.append("type", selectedItem?.type ?? "");

    try {
      const res = await api.patch(
        `/course/chapter/${selectedItem?.id}`,
        formData
      );
      console.log("Upload success:", res.data);
      toast.success("Course has been updated!");
      setSelectedItem(null);
      setVideoFile(null);
      setSubtitleFile(null);
    } catch (error) {
      toast.error("Course wasn't updated!");

      console.error("Upload failed:", error);
    }
  };

  const handleSaveDraft = async () => {};

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
          <div className="flex flex-col items-start ">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="chapters" type="chapter">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {chapters?.map((chapter, chapterIndex) => (
                      <Draggable
                        key={chapter.id}
                        draggableId={chapter.id.toString()}
                        index={chapterIndex}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="border p-2 my-2 bg-white"
                          >
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
                              {...provided.dragHandleProps}
                            >
                              <div className="flex gap-1 items-center">
                                <GripVertical />
                                <Input
                                  placeholder={
                                    chapter.title ||
                                    `Chapter ${chapterIndex + 1}`
                                  }
                                  className="text-sm"
                                  value={chapter.title}
                                  onChange={(e) =>
                                    updatetitle(
                                      chapter.id.toString(),
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="flex items-center gap-3">
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addSubTitle(chapter.id.toString());
                                  }}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  className="flex cursor-pointer text-xs border border-gray-400 items-center  gap-2 p-2 rounded-sm"
                                >
                                  <PlusSquare size={15} />
                                </div>
                                <Pen size={15} />
                                <Trash
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChapter(chapter.id.toString());
                                  }}
                                  size={15}
                                  color="red"
                                  className="cursor-pointer"
                                />
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

                            {openChapters[chapter.id] && (
                              <Droppable
                                droppableId={chapter.id.toString()}
                                type="subTitle"
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="ml-4"
                                  >
                                    {chapter.subChapters?.map(
                                      (sub, subIndex) => (
                                        <Draggable
                                          key={sub.id.toString()}
                                          draggableId={sub.id.toString()}
                                          index={subIndex}
                                        >
                                          {(provided) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
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
                                                {...provided.dragHandleProps}
                                              >
                                                <div className="flex gap-1 items-center">
                                                  <GripVertical />
                                                  <Input
                                                    placeholder={
                                                      sub.title ||
                                                      `Subchapter ${
                                                        subIndex + 1
                                                      }`
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
                                                      addSubHeading(
                                                        sub.id.toString()
                                                      );
                                                    }}
                                                    className="flex cursor-pointer text-sm border border-gray-400 items-center gap-2 p-1 rounded-sm"
                                                  >
                                                    <PlusSquare size={15} />
                                                  </div>
                                                  <Pen size={15} />
                                                  <Trash
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      deleteSubTitle(
                                                        sub.id.toString()
                                                      );
                                                    }}
                                                    size={15}
                                                    color="red"
                                                    className="cursor-pointer"
                                                  />
                                                  <ArrowUp
                                                    size={15}
                                                    className={`cursor-pointer transition-transform ${
                                                      opensubChapters[
                                                        sub.id.toString()
                                                      ]
                                                        ? "rotate-180"
                                                        : ""
                                                    }`}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      toggleSubTitle(
                                                        sub.id.toString()
                                                      );
                                                    }}
                                                    onMouseDown={(e) =>
                                                      e.stopPropagation()
                                                    }
                                                  />
                                                </div>
                                              </div>

                                              {opensubChapters[
                                                sub.id.toString()
                                              ] && (
                                                <Droppable
                                                  droppableId={sub.id.toString()}
                                                  type="subHeading"
                                                >
                                                  {(provided) => (
                                                    <ul
                                                      className="ml-4 my-3 list-disc"
                                                      ref={provided.innerRef}
                                                      {...provided.droppableProps}
                                                    >
                                                      {sub.subHeadings?.map(
                                                        (sh, shIndex) => (
                                                          <Draggable
                                                            key={sh.id.toString()}
                                                            draggableId={sh.id.toString()}
                                                            index={shIndex}
                                                          >
                                                            {(provided) => (
                                                              <li
                                                                ref={
                                                                  provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="py-2 pl-2 my-1 bg-white list-none border-b"
                                                              >
                                                                <div
                                                                  onClick={(
                                                                    e
                                                                  ) =>
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
                                                                    <GripVertical />
                                                                    <Input
                                                                      placeholder={
                                                                        sh.title ||
                                                                        `Subheading ${
                                                                          shIndex +
                                                                          1
                                                                        }`
                                                                      }
                                                                      className="text-sm"
                                                                      value={
                                                                        sh.title
                                                                      }
                                                                      onChange={(
                                                                        e
                                                                      ) =>
                                                                        updateSubHeadingName(
                                                                          sh.id.toString(),
                                                                          e
                                                                            .target
                                                                            .value
                                                                        )
                                                                      }
                                                                    />
                                                                  </div>
                                                                  <div className="flex items-center gap-3">
                                                                    <Pen
                                                                      size={15}
                                                                    />
                                                                    <Trash
                                                                      onClick={(
                                                                        e
                                                                      ) => {
                                                                        e.stopPropagation();
                                                                        deleteSubHeading(
                                                                          sh.id.toString()
                                                                        );
                                                                      }}
                                                                      size={15}
                                                                      color="red"
                                                                      className="cursor-pointer"
                                                                    />
                                                                  </div>
                                                                </div>
                                                              </li>
                                                            )}
                                                          </Draggable>
                                                        )
                                                      )}
                                                      {provided.placeholder}
                                                    </ul>
                                                  )}
                                                </Droppable>
                                              )}
                                            </div>
                                          )}
                                        </Draggable>
                                      )
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-4 space-y-3">
            <Button
              onClick={(e) => {
                e.preventDefault();
                addChapter();
              }}
              className="border py-2 bg-transparent text-black hover:bg-green-200 w-full border-green-400"
              disabled={isLoading}
            >
              <PlusSquare className="text-green-400 mr-2" size={16} />
            </Button>

            <Button
              onClick={handleSaveDraft}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Draft"}
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
        <div className="flex-1 p-6 mb-28 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Video Upload */}
            <div>
              <h3 className="text-lg font-medium mb-3">Content Video</h3>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
                onClick={() => videoInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {videoFile ? videoFile.name : "Upload your Content Video"}
                </p>
                <p className="text-sm text-blue-500">
                  mp4 or mov (less than 2GB)
                </p>
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/mp4,video/mov"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>
            </div>

            {/* Subtitle Upload */}
            <div>
              <h3 className="text-lg font-medium mb-3">Content Subtitle</h3>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
                onClick={() => subtitleInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {subtitleFile
                    ? subtitleFile.name
                    : "Upload your Content Subtitle"}
                </p>
                <p className="text-sm text-blue-500">SRT (less than 1MB)</p>
                <input
                  type="file"
                  ref={subtitleInputRef}
                  accept=".srt"
                  onChange={(e) => setSubtitleFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>
            </div>
            <div className="w-full h-[15rem]">
              <textarea
                className="w-full h-full p-2 text-gray-700 border rounded resize-none 
               focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Write your description"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleUpload}
                className="flex-1 bg-teal-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-600"
              >
                Save Draft
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50">
                Send for Approval
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentEditor;
