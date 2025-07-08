"use client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  ArrowUp,
  GripVertical,
  Pen,
  PlusSquare,
  Trash,
  Upload,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import CourseContentEditor from "./EditChapter";
import { useCourseStore } from "@/store/useCourseStore";
import { useRouter } from "next/navigation";

export type SubHeading = {
  subHeadId: string;
  subHeadName: string;
};

export type SubTitle = {
  subId: string;
  subName: string;
  subHeading: SubHeading[];
};

export type Chapter = {
  chapterId: string;
  chapterName: string;
  subTitles: SubTitle[];
};

const initialChapters: Chapter[] = [
  {
    chapterId: "chapter-1",
    chapterName: "Physical Chemistry",
    subTitles: [
      {
        subId: "sub-1",
        subName: "Mole Concept",
        subHeading: [
          { subHeadId: "subHead-1", subHeadName: "Mole Principles" },
          { subHeadId: "subHead-2", subHeadName: "Definition" },
        ],
      },
      {
        subId: "sub-2",
        subName: "Laws of Chemistry",
        subHeading: [
          { subHeadId: "subHead-3", subHeadName: "Law of Conservation" },
          { subHeadId: "subHead-4", subHeadName: "Law of Degradation" },
        ],
      },
    ],
  },
  {
    chapterId: "chapter-2",
    chapterName: "Organic Chemistry",
    subTitles: [
      {
        subId: "sub-3",
        subName: "HydroCompound Concept",
        subHeading: [
          { subHeadId: "subHead-5", subHeadName: "Hydrocarbon Types" },
          { subHeadId: "subHead-6", subHeadName: "Structure" },
        ],
      },
    ],
  },
];

const AddCourse = ({ onClose }: { onClose: () => void }) => {
  const [categories, setCategories] = useState<Chapter[]>(initialChapters);
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});
  const [openSubTitles, setOpenSubTitles] = useState<Record<string, boolean>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const setCourse = useCourseStore((state) => state.setCourse);

  const saveDraft = async () => {
    if (!categories || categories.length === 0) {
      console.warn("No categories to save");
      return;
    }
    console.log("first");
    try {
      setIsSaving(true);
      setCourse(categories);
      router.push("/tutor/mycourse/draft");
    } catch (error) {
      console.error("Failed to save draft:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteChapter = (e: React.MouseEvent, chapter: Chapter) => {
    e.stopPropagation();

    if (!chapter?.chapterId) {
      console.warn("Invalid chapter for deletion");
      return;
    }

    const chapterId = chapter.chapterId;
    setCategories((prev) => {
      if (!prev || !Array.isArray(prev)) return [];
      return prev.filter((ch) => ch?.chapterId !== chapterId);
    });
  };

  const addChapter = () => {
    if (!categories || !Array.isArray(categories)) {
      console.warn("Invalid categories state");
      return;
    }

    const newChapterId = `chapter-${Date.now()}`;
    const newChapter: Chapter = {
      chapterId: newChapterId,
      chapterName: `New Chapter ${categories.length + 1}`,
      subTitles: [],
    };

    setCategories((prev) => {
      if (!prev || !Array.isArray(prev)) return [newChapter];
      return [...prev, newChapter];
    });
  };

  const addSubTitle = (chapterId: string) => {
    if (!chapterId) {
      console.warn("Invalid chapter ID for adding subtitle");
      return;
    }

    setCategories((prev) => {
      if (!prev || !Array.isArray(prev)) return [];

      return prev.map((chapter) => {
        if (!chapter || chapter.chapterId !== chapterId) return chapter;

        const newSubId = `sub-${Date.now()}`;
        const newSubTitle: SubTitle = {
          subId: newSubId,
          subName: "New Sub-Title",
          subHeading: [],
        };

        return {
          ...chapter,
          subTitles: [...(chapter.subTitles || []), newSubTitle],
        };
      });
    });
  };

  const addSubHeading = (subId: string) => {
    if (!subId) {
      console.warn("Invalid sub ID for adding subheading");
      return;
    }

    setCategories((prev) => {
      if (!prev || !Array.isArray(prev)) return [];

      return prev.map((chapter) => {
        if (!chapter) return chapter;

        return {
          ...chapter,
          subTitles: (chapter.subTitles || []).map((sub) => {
            if (!sub || sub.subId !== subId) return sub;

            const newSubHeadId = `subHead-${Date.now()}`;
            const newSubHeading: SubHeading = {
              subHeadId: newSubHeadId,
              subHeadName: "New Sub-Heading",
            };

            return {
              ...sub,
              subHeading: [...(sub.subHeading || []), newSubHeading],
            };
          }),
        };
      });
    });
  };

  const deleteSubTitle = (subId: string) => {
    if (!subId) {
      console.warn("Invalid sub ID for deletion");
      return;
    }

    setCategories((prev) => {
      if (!prev || !Array.isArray(prev)) return [];

      return prev.map((chapter) => {
        if (!chapter) return chapter;

        return {
          ...chapter,
          subTitles: (chapter.subTitles || []).filter(
            (sub) => sub?.subId !== subId
          ),
        };
      });
    });
  };

  const deleteSubHeading = (subHeadId: string) => {
    if (!subHeadId) {
      console.warn("Invalid subhead ID for deletion");
      return;
    }

    setCategories((prev) => {
      if (!prev || !Array.isArray(prev)) return [];

      return prev.map((chapter) => {
        if (!chapter) return chapter;

        return {
          ...chapter,
          subTitles: (chapter.subTitles || []).map((sub) => {
            if (!sub) return sub;

            return {
              ...sub,
              subHeading: (sub.subHeading || []).filter(
                (head) => head?.subHeadId !== subHeadId
              ),
            };
          }),
        };
      });
    });
  };

  const toggleChapter = (chapterId: string) => {
    if (!chapterId) return;
    setOpenChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  const toggleSubTitle = (subId: string) => {
    if (!subId) return;
    setOpenSubTitles((prev) => ({ ...prev, [subId]: !prev[subId] }));
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination || !source) return;

    try {
      setIsLoading(true);
      const updated = [...(categories || [])];

      if (type === "chapter") {
        if (source.index >= updated.length || destination.index < 0) return;
        const [moved] = updated.splice(source.index, 1);
        if (moved) {
          updated.splice(destination.index, 0, moved);
          setCategories(updated);
        }
      }

      if (type === "subTitle") {
        const chapterIndex = updated.findIndex(
          (c) => c?.chapterId === source.droppableId
        );
        if (chapterIndex === -1 || !updated[chapterIndex]) return;

        const subTitles = Array.from(updated[chapterIndex].subTitles || []);
        if (source.index >= subTitles.length || destination.index < 0) return;

        const [moved] = subTitles.splice(source.index, 1);
        if (moved) {
          subTitles.splice(destination.index, 0, moved);
          updated[chapterIndex].subTitles = subTitles;
          setCategories(updated);
        }
      }

      if (type === "subHeading") {
        for (const chapter of updated) {
          if (!chapter) continue;

          for (const subtitle of chapter.subTitles || []) {
            if (!subtitle || subtitle.subId !== source.droppableId) continue;

            const items = Array.from(subtitle.subHeading || []);
            if (source.index >= items.length || destination.index < 0) break;

            const [moved] = items.splice(source.index, 1);
            if (moved) {
              items.splice(destination.index, 0, moved);
              subtitle.subHeading = items;
            }
            break;
          }
        }
        setCategories(updated);
      }
    } catch (error) {
      console.error("Error during drag and drop:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Handle empty categories
  if (!categories || !Array.isArray(categories)) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <p>Error: Unable to load course data</p>
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add Tutor</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-2 px-6 py-4">
          <h4 className="text-2xl">Add Course</h4>
          <p className="text-primeGreen">Draft your course outlook</p>
        </div>

        <form className="flex flex-col gap-6 px-6 pb-6">
          {/* First Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="courseName">Course Name</Label>
              <Input
                id="courseName"
                className="outline-0 border border-gray-400 rounded-md"
                type="text"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <Label htmlFor="durationNumber">Duration Number</Label>
                <Select>
                  <SelectTrigger className="outline-0 border border-gray-400 rounded-md">
                    <SelectValue placeholder="Select no." />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i + 1} value={`${i + 1}`}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <Label htmlFor="durationUnit">Duration Unit</Label>
                <Select>
                  <SelectTrigger className="outline-0 border border-gray-400 rounded-md">
                    <SelectValue placeholder="Select Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="courseDescription">Course Description</Label>
            <Textarea id="courseDescription" rows={10} />
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Student Target */}
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-lg">Student Target</h4>
              <div className="flex flex-col gap-3">
                <div className="w-full">
                  <Select>
                    <SelectTrigger className="outline-0 w-full border border-gray-400 rounded-md">
                      <SelectValue placeholder="Select University" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tu">Tribhuvan University</SelectItem>
                      <SelectItem value="pu">Pokhara University</SelectItem>
                      <SelectItem value="ku">Kathmandu University</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select>
                    <SelectTrigger className="outline-0 w-full border border-gray-400 rounded-md">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bict">BICTE</SelectItem>
                      <SelectItem value="bca">BCA</SelectItem>
                      <SelectItem value="bit">BIT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select>
                    <SelectTrigger className="outline-0 w-full border border-gray-400 rounded-md">
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(8)].map((_, i) => (
                        <SelectItem key={i + 1} value={`sem-${i + 1}`}>
                          Semester {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Course Depth */}
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-lg">Course Depth</h4>
              <RadioGroup
                defaultValue="beginner"
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner">Beginner</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced">Advanced</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Upload Thumbnail */}
          <div className="w-full">
            <Label htmlFor="thumbnail" className="pb-3">
              Course Thumbnail Image
            </Label>
            <div className="flex w-full min-w-full p-6 rounded-xl items-center border border-gray-400 flex-col gap-1">
              <Upload />
              <h6>Upload your course image</h6>
              <p className="text-blue-500 text-xs">
                SVG, PNG or JPEG (Less than 10 MB)
              </p>
            </div>
          </div>

          {/* Course Structure */}
          <section className="py-4">
            <h5 className="font-semibold text-md">Course Structure</h5>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="chapters" type="chapter">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {categories.map((chapter, chapterIndex) => {
                      if (!chapter) return null;

                      return (
                        <Draggable
                          key={chapter.chapterId}
                          draggableId={chapter.chapterId}
                          index={chapterIndex}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="border p-2 my-2 bg-white"
                            >
                              <div
                                className="w-full justify-between flex gap-1 items-center bg-gray-200 rounded-sm p-2"
                                {...provided.dragHandleProps}
                              >
                                <div className="flex gap-1 items-center">
                                  <GripVertical />
                                  <Input
                                    placeholder={
                                      chapter.chapterName ||
                                      `Chapter ${chapterIndex + 1}`
                                    }
                                    className="text-sm"
                                  />
                                </div>
                                <div className="flex items-center gap-3">
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addSubTitle(chapter.chapterId);
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="flex cursor-pointer text-sm border border-gray-400 items-center gap-2 p-2 rounded-sm"
                                  >
                                    <PlusSquare size={15} />
                                    Add Sub-Chapter
                                  </div>
                                  <Pen size={15} />
                                  <Trash
                                    onClick={(e) => deleteChapter(e, chapter)}
                                    size={15}
                                    color="red"
                                    className="cursor-pointer"
                                  />
                                  <ArrowUp
                                    size={15}
                                    className={`cursor-pointer transition-transform ${
                                      openChapters[chapter.chapterId]
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleChapter(chapter.chapterId);
                                    }}
                                  />
                                </div>
                              </div>

                              {openChapters[chapter.chapterId] && (
                                <Droppable
                                  droppableId={chapter.chapterId}
                                  type="subTitle"
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className="ml-4"
                                    >
                                      {(chapter.subTitles || []).map(
                                        (sub, subIndex) => {
                                          if (!sub) return null;

                                          return (
                                            <Draggable
                                              key={sub.subId}
                                              draggableId={sub.subId}
                                              index={subIndex}
                                            >
                                              {(provided) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  className="border p-2 my-2 bg-gray-100 py-4 flex flex-col justify-center rounded"
                                                >
                                                  <div
                                                    className="flex items-center justify-between"
                                                    {...provided.dragHandleProps}
                                                  >
                                                    <div className="flex gap-1 items-center">
                                                      <GripVertical />
                                                      <h2 className="text-sm">
                                                        {sub.subName ||
                                                          "Unnamed Sub-Title"}
                                                      </h2>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                      <div
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          addSubHeading(
                                                            sub.subId
                                                          );
                                                        }}
                                                        className="flex cursor-pointer text-sm border border-gray-400 items-center gap-2 p-1 rounded-sm"
                                                      >
                                                        <PlusSquare size={15} />
                                                        Add Sub-Heading
                                                      </div>
                                                      <Pen size={15} />
                                                      <Trash
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          deleteSubTitle(
                                                            sub.subId
                                                          );
                                                        }}
                                                        size={15}
                                                        color="red"
                                                        className="cursor-pointer"
                                                      />
                                                      <ArrowUp
                                                        size={15}
                                                        className={`cursor-pointer transition-transform ${
                                                          openSubTitles[
                                                            sub.subId
                                                          ]
                                                            ? "rotate-180"
                                                            : ""
                                                        }`}
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          toggleSubTitle(
                                                            sub.subId
                                                          );
                                                        }}
                                                        onMouseDown={(e) =>
                                                          e.stopPropagation()
                                                        }
                                                      />
                                                    </div>
                                                  </div>

                                                  {/* Subheadings */}
                                                  {openSubTitles[sub.subId] && (
                                                    <Droppable
                                                      droppableId={sub.subId}
                                                      type="subHeading"
                                                    >
                                                      {(provided) => (
                                                        <ul
                                                          className="ml-4 my-3 list-disc"
                                                          ref={
                                                            provided.innerRef
                                                          }
                                                          {...provided.droppableProps}
                                                        >
                                                          {(
                                                            sub.subHeading || []
                                                          ).map(
                                                            (sh, shIndex) => {
                                                              if (!sh)
                                                                return null;

                                                              return (
                                                                <Draggable
                                                                  key={
                                                                    sh.subHeadId
                                                                  }
                                                                  draggableId={
                                                                    sh.subHeadId
                                                                  }
                                                                  index={
                                                                    shIndex
                                                                  }
                                                                >
                                                                  {(
                                                                    provided
                                                                  ) => (
                                                                    <li
                                                                      ref={
                                                                        provided.innerRef
                                                                      }
                                                                      {...provided.draggableProps}
                                                                      {...provided.dragHandleProps}
                                                                      className="py-2 pl-2 my-1 bg-white list-none border-b"
                                                                    >
                                                                      <div className="flex items-center justify-between">
                                                                        <div className="flex gap-1 items-center">
                                                                          <GripVertical />
                                                                          <h2 className="text-sm">
                                                                            {sh.subHeadName ||
                                                                              "Unnamed Sub-Heading"}
                                                                          </h2>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                          <Pen
                                                                            size={
                                                                              15
                                                                            }
                                                                          />
                                                                          <Trash
                                                                            onClick={(
                                                                              e
                                                                            ) => {
                                                                              e.stopPropagation();
                                                                              deleteSubHeading(
                                                                                sh.subHeadId
                                                                              );
                                                                            }}
                                                                            size={
                                                                              15
                                                                            }
                                                                            color="red"
                                                                            className="cursor-pointer"
                                                                          />
                                                                        </div>
                                                                      </div>
                                                                    </li>
                                                                  )}
                                                                </Draggable>
                                                              );
                                                            }
                                                          )}
                                                          {provided.placeholder}
                                                        </ul>
                                                      )}
                                                    </Droppable>
                                                  )}
                                                </div>
                                              )}
                                            </Draggable>
                                          );
                                        }
                                      )}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              )}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </section>

          <div className="flex flex-col gap-3">
            <Button
              onClick={(e) => {
                e.preventDefault();
                addChapter();
              }}
              variant="ghost"
              className="border border-green-400"
              disabled={isLoading}
            >
              <PlusSquare />
              Add New Chapter
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();

                saveDraft();
              }}
              className="bg-primeGreen"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
          </div>
        </form>
      </div>

      {/* <CourseContentEditor /> */}
    </div>
  );
};

export default AddCourse;
