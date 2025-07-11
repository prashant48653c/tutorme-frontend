"use client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ArrowUp, GripVertical, Pen, PlusSquare, Trash, Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useReducer, createContext, useContext } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { useRouter } from "next/navigation";

// Types
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

export type CourseDetails = {
  courseName: string;
  durationNumber: string;
  durationUnit: string;
  courseDescription: string;
  university: string;
  course: string;
  semester: string;
  level: string;
  thumbnail: File | null;
};

export type CourseState = {
  courseDetails: CourseDetails;
  chapters: Chapter[];
  openChapters: Record<string, boolean>;
  openSubTitles: Record<string, boolean>;
  isLoading: boolean;
  isSaving: boolean;
};

// Initial state
const initialState: CourseState = {
  courseDetails: {
    courseName: "",
    durationNumber: "",
    durationUnit: "",
    courseDescription: "",
    university: "",
    course: "",
    semester: "",
    level: "beginner",
    thumbnail: null,
  },
  chapters: [],
  openChapters: {},
  openSubTitles: {},
  isLoading: false,
  isSaving: false,
};

// Action types
type CourseAction = 
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "UPDATE_COURSE_DETAILS"; payload: Partial<CourseDetails> }
  | { type: "SET_CHAPTERS"; payload: Chapter[] }
  | { type: "ADD_CHAPTER" }
  | { type: "DELETE_CHAPTER"; payload: string }
  | { type: "ADD_SUBTITLE"; payload: string }
  | { type: "DELETE_SUBTITLE"; payload: string }
  | { type: "ADD_SUBHEADING"; payload: string }
  | { type: "DELETE_SUBHEADING"; payload: string }
  | { type: "TOGGLE_CHAPTER"; payload: string }
  | { type: "TOGGLE_SUBTITLE"; payload: string }
  | { type: "DRAG_END"; payload: DropResult }
  | { type: "UPDATE_CHAPTER_NAME"; payload: { chapterId: string; name: string } }
  | { type: "UPDATE_SUBTITLE_NAME"; payload: { subId: string; name: string } }
  | { type: "UPDATE_SUBHEADING_NAME"; payload: { subHeadId: string; name: string } };

// Reducer
const courseReducer = (state: CourseState, action: CourseAction): CourseState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    
    case "SET_SAVING":
      return { ...state, isSaving: action.payload };
    
    case "UPDATE_COURSE_DETAILS":
      return { ...state, courseDetails: { ...state.courseDetails, ...action.payload } };
    
    case "SET_CHAPTERS":
      return { ...state, chapters: action.payload };
    
    case "ADD_CHAPTER":
      const newChapterId = `chapter-${Date.now()}`;
      const newChapter: Chapter = {
        chapterId: newChapterId,
        chapterName: `New Chapter ${state.chapters.length + 1}`,
        subTitles: [],
      };
      return { ...state, chapters: [...state.chapters, newChapter] };
    
    case "DELETE_CHAPTER":
      return {
        ...state,
        chapters: state.chapters.filter(ch => ch.chapterId !== action.payload),
      };
    
    case "ADD_SUBTITLE":
      const newSubId = `sub-${Date.now()}`;
      const newSubTitle: SubTitle = {
        subId: newSubId,
        subName: "New Sub-Title",
        subHeading: [],
      };
      return {
        ...state,
        chapters: state.chapters.map(chapter =>
          chapter.chapterId === action.payload
            ? { ...chapter, subTitles: [...chapter.subTitles, newSubTitle] }
            : chapter
        ),
      };
    
    case "DELETE_SUBTITLE":
      return {
        ...state,
        chapters: state.chapters.map(chapter => ({
          ...chapter,
          subTitles: chapter.subTitles.filter(sub => sub.subId !== action.payload),
        })),
      };
    
    case "ADD_SUBHEADING":
      const newSubHeadId = `subHead-${Date.now()}`;
      const newSubHeading: SubHeading = {
        subHeadId: newSubHeadId,
        subHeadName: "New Sub-Heading",
      };
      return {
        ...state,
        chapters: state.chapters.map(chapter => ({
          ...chapter,
          subTitles: chapter.subTitles.map(sub =>
            sub.subId === action.payload
              ? { ...sub, subHeading: [...sub.subHeading, newSubHeading] }
              : sub
          ),
        })),
      };
    
    case "DELETE_SUBHEADING":
      return {
        ...state,
        chapters: state.chapters.map(chapter => ({
          ...chapter,
          subTitles: chapter.subTitles.map(sub => ({
            ...sub,
            subHeading: sub.subHeading.filter(head => head.subHeadId !== action.payload),
          })),
        })),
      };
    
    case "TOGGLE_CHAPTER":
      return {
        ...state,
        openChapters: { ...state.openChapters, [action.payload]: !state.openChapters[action.payload] },
      };
    
    case "TOGGLE_SUBTITLE":
      return {
        ...state,
        openSubTitles: { ...state.openSubTitles, [action.payload]: !state.openSubTitles[action.payload] },
      };

    case "UPDATE_CHAPTER_NAME":
      return {
        ...state,
        chapters: state.chapters.map(chapter =>
          chapter.chapterId === action.payload.chapterId
            ? { ...chapter, chapterName: action.payload.name }
            : chapter
        ),
      };

    case "UPDATE_SUBTITLE_NAME":
      return {
        ...state,
        chapters: state.chapters.map(chapter => ({
          ...chapter,
          subTitles: chapter.subTitles.map(sub =>
            sub.subId === action.payload.subId
              ? { ...sub, subName: action.payload.name }
              : sub
          ),
        })),
      };

    case "UPDATE_SUBHEADING_NAME":
      return {
        ...state,
        chapters: state.chapters.map(chapter => ({
          ...chapter,
          subTitles: chapter.subTitles.map(sub => ({
            ...sub,
            subHeading: sub.subHeading.map(head =>
              head.subHeadId === action.payload.subHeadId
                ? { ...head, subHeadName: action.payload.name }
                : head
            ),
          })),
        })),
      };
    
    case "DRAG_END":
      const { source, destination, type } = action.payload;
      if (!destination || !source) return state;
      
      const updated = [...state.chapters];
      
      if (type === "chapter") {
        const [moved] = updated.splice(source.index, 1);
        updated.splice(destination.index, 0, moved);
        return { ...state, chapters: updated };
      }
      
      if (type === "subTitle") {
        const chapterIndex = updated.findIndex(c => c.chapterId === source.droppableId);
        if (chapterIndex === -1) return state;
        
        const subTitles = [...updated[chapterIndex].subTitles];
        const [moved] = subTitles.splice(source.index, 1);
        subTitles.splice(destination.index, 0, moved);
        updated[chapterIndex].subTitles = subTitles;
        return { ...state, chapters: updated };
      }
      
      if (type === "subHeading") {
        for (const chapter of updated) {
          for (const subtitle of chapter.subTitles) {
            if (subtitle.subId === source.droppableId) {
              const items = [...subtitle.subHeading];
              const [moved] = items.splice(source.index, 1);
              items.splice(destination.index, 0, moved);
              subtitle.subHeading = items;
              break;
            }
          }
        }
        return { ...state, chapters: updated };
      }
      
      return state;
    
    default:
      return state;
  }
};

// Context
const CourseContext = createContext<{
  state: CourseState;
  dispatch: React.Dispatch<CourseAction>;
} | null>(null);

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within CourseProvider");
  }
  return context;
};

// Provider component
export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(courseReducer, initialState);
  
  return (
    <CourseContext.Provider value={{ state, dispatch }}>
      {children}
    </CourseContext.Provider>
  );
};

// Main component
const AddCourse = ({ onClose }: { onClose: () => void }) => {
  const { state, dispatch } = useCourse();
  const router = useRouter();

  const saveDraft = async () => {
    if (!state.chapters || state.chapters.length === 0) {
      console.warn("No chapters to save");
      return;
    }
    
    try {
      dispatch({ type: "SET_SAVING", payload: true });
      // setCourse(state.chapters); // Replace with your store logic
      router.push("/tutor/mycourse/draft");
    } catch (error) {
      console.error("Failed to save draft:", error);
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  };

  const handleDragEnd = (result: DropResult) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "DRAG_END", payload: result });
    dispatch({ type: "SET_LOADING", payload: false });
  };

  if (state.isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add Tutor</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        <div className="flex flex-col gap-2 px-6 py-4">
          <h4 className="text-2xl">Add Course</h4>
          <p className="text-primeGreen">Draft your course outlook</p>
        </div>

        <div className="flex flex-col gap-6 px-6 pb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="courseName">Course Name</Label>
              <Input id="courseName" className="outline-0 border border-gray-400 rounded-md" type="text" value={state.courseDetails.courseName} onChange={(e) => dispatch({ type: "UPDATE_COURSE_DETAILS", payload: { courseName: e.target.value } })} />
            </div>

            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <Label htmlFor="durationNumber">Duration Number</Label>
                <Select value={state.courseDetails.durationNumber} onValueChange={(value) => dispatch({ type: "UPDATE_COURSE_DETAILS", payload: { durationNumber: value } })}>
                  <SelectTrigger className="outline-0 border border-gray-400 rounded-md"><SelectValue placeholder="Select no." /></SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i + 1} value={`${i + 1}`}>{i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <Label htmlFor="durationUnit">Duration Unit</Label>
                <Select value={state.courseDetails.durationUnit} onValueChange={(value) => dispatch({ type: "UPDATE_COURSE_DETAILS", payload: { durationUnit: value } })}>
                  <SelectTrigger className="outline-0 border border-gray-400 rounded-md"><SelectValue placeholder="Select Duration" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="courseDescription">Course Description</Label>
            <Textarea id="courseDescription" rows={10} value={state.courseDetails.courseDescription} onChange={(e) => dispatch({ type: "UPDATE_COURSE_DETAILS", payload: { courseDescription: e.target.value } })} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-lg">Student Target</h4>
              <div className="flex flex-col gap-3">
                <Select value={state.courseDetails.university} onValueChange={(value) => dispatch({ type: "UPDATE_COURSE_DETAILS", payload: { university: value } })}>
                  <SelectTrigger className="outline-0 w-full border border-gray-400 rounded-md"><SelectValue placeholder="Select University" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tu">Tribhuvan University</SelectItem>
                    <SelectItem value="pu">Pokhara University</SelectItem>
                    <SelectItem value="ku">Kathmandu University</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={state.courseDetails.course} onValueChange={(value) => dispatch({ type: "UPDATE_COURSE_DETAILS", payload: { course: value } })}>
                  <SelectTrigger className="outline-0 w-full border border-gray-400 rounded-md"><SelectValue placeholder="Select Course" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bict">BICTE</SelectItem>
                    <SelectItem value="bca">BCA</SelectItem>
                    <SelectItem value="bit">BIT</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={state.courseDetails.semester} onValueChange={(value) => dispatch({ type: "UPDATE_COURSE_DETAILS", payload: { semester: value } })}>
                  <SelectTrigger className="outline-0 w-full border border-gray-400 rounded-md"><SelectValue placeholder="Select Semester" /></SelectTrigger>
                  <SelectContent>
                    {[...Array(8)].map((_, i) => (
                      <SelectItem key={i + 1} value={`sem-${i + 1}`}>Semester {i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-lg">Course Depth</h4>
              <RadioGroup value={state.courseDetails.level} onValueChange={(value) => dispatch({ type: "UPDATE_COURSE_DETAILS", payload: { level: value } })} className="flex flex-col gap-6">
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

          <div className="w-full">
            <Label htmlFor="thumbnail" className="pb-3">Course Thumbnail Image</Label>
            <div className="flex w-full min-w-full p-6 rounded-xl items-center border border-gray-400 flex-col gap-1">
              <Upload />
              <h6>Upload your course image</h6>
              <p className="text-blue-500 text-xs">SVG, PNG or JPEG (Less than 10 MB)</p>
            </div>
          </div>

          <section className="py-4">
            <h5 className="font-semibold text-md">Course Structure</h5>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="chapters" type="chapter">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {state.chapters.map((chapter, chapterIndex) => (
                      <Draggable key={chapter.chapterId} draggableId={chapter.chapterId} index={chapterIndex}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} className="border p-2 my-2 bg-white">
                            <div className="w-full justify-between flex gap-1 items-center bg-gray-200 rounded-sm p-2" {...provided.dragHandleProps}>
                              <div className="flex gap-1 items-center">
                                <GripVertical />
                                <Input placeholder={chapter.chapterName || `Chapter ${chapterIndex + 1}`} className="text-sm" value={chapter.chapterName} onChange={(e) => dispatch({ type: "UPDATE_CHAPTER_NAME", payload: { chapterId: chapter.chapterId, name: e.target.value } })} />
                              </div>
                              <div className="flex items-center gap-3">
                                <div onClick={(e) => { e.stopPropagation(); dispatch({ type: "ADD_SUBTITLE", payload: chapter.chapterId }); }} onMouseDown={(e) => e.stopPropagation()} className="flex cursor-pointer text-sm border border-gray-400 items-center gap-2 p-2 rounded-sm">
                                  <PlusSquare size={15} />Add Sub-Chapter
                                </div>
                                <Pen size={15} />
                                <Trash onClick={(e) => { e.stopPropagation(); dispatch({ type: "DELETE_CHAPTER", payload: chapter.chapterId }); }} size={15} color="red" className="cursor-pointer" />
                                <ArrowUp size={15} className={`cursor-pointer transition-transform ${state.openChapters[chapter.chapterId] ? "rotate-180" : ""}`} onClick={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_CHAPTER", payload: chapter.chapterId }); }} />
                              </div>
                            </div>

                            {state.openChapters[chapter.chapterId] && (
                              <Droppable droppableId={chapter.chapterId} type="subTitle">
                                {(provided) => (
                                  <div ref={provided.innerRef} {...provided.droppableProps} className="ml-4">
                                    {chapter.subTitles.map((sub, subIndex) => (
                                      <Draggable key={sub.subId} draggableId={sub.subId} index={subIndex}>
                                        {(provided) => (
                                          <div ref={provided.innerRef} {...provided.draggableProps} className="border p-2 my-2 bg-gray-100 py-4 flex flex-col justify-center rounded">
                                            <div className="flex items-center justify-between" {...provided.dragHandleProps}>
                                              <div className="flex gap-1 items-center">
                                                <GripVertical />
                                                <Input placeholder={sub.subName || `Subchapter ${subIndex + 1}`} className="text-sm" value={sub.subName} onChange={(e) => dispatch({ type: "UPDATE_SUBTITLE_NAME", payload: { subId: sub.subId, name: e.target.value } })} />
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <div onClick={(e) => { e.stopPropagation(); dispatch({ type: "ADD_SUBHEADING", payload: sub.subId }); }} className="flex cursor-pointer text-sm border border-gray-400 items-center gap-2 p-1 rounded-sm">
                                                  <PlusSquare size={15} />Add Sub-Heading
                                                </div>
                                                <Pen size={15} />
                                                <Trash onClick={(e) => { e.stopPropagation(); dispatch({ type: "DELETE_SUBTITLE", payload: sub.subId }); }} size={15} color="red" className="cursor-pointer" />
                                                <ArrowUp size={15} className={`cursor-pointer transition-transform ${state.openSubTitles[sub.subId] ? "rotate-180" : ""}`} onClick={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_SUBTITLE", payload: sub.subId }); }} onMouseDown={(e) => e.stopPropagation()} />
                                              </div>
                                            </div>

                                            {state.openSubTitles[sub.subId] && (
                                              <Droppable droppableId={sub.subId} type="subHeading">
                                                {(provided) => (
                                                  <ul className="ml-4 my-3 list-disc" ref={provided.innerRef} {...provided.droppableProps}>
                                                    {sub.subHeading.map((sh, shIndex) => (
                                                      <Draggable key={sh.subHeadId} draggableId={sh.subHeadId} index={shIndex}>
                                                        {(provided) => (
                                                          <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="py-2 pl-2 my-1 bg-white list-none border-b">
                                                            <div className="flex items-center justify-between">
                                                              <div className="flex gap-1 items-center">
                                                                <GripVertical />
                                                                <Input placeholder={sh.subHeadName || `Subheading ${shIndex + 1}`} className="text-sm" value={sh.subHeadName} onChange={(e) => dispatch({ type: "UPDATE_SUBHEADING_NAME", payload: { subHeadId: sh.subHeadId, name: e.target.value } })} />
                                                              </div>
                                                              <div className="flex items-center gap-3">
                                                                <Pen size={15} />
                                                                <Trash onClick={(e) => { e.stopPropagation(); dispatch({ type: "DELETE_SUBHEADING", payload: sh.subHeadId }); }} size={15} color="red" className="cursor-pointer" />
                                                              </div>
                                                            </div>
                                                          </li>
                                                        )}
                                                      </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                  </ul>
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
          </section>

          <div className="flex flex-col gap-3">
            <Button onClick={(e) => { e.preventDefault(); dispatch({ type: "ADD_CHAPTER" }); }} variant="ghost" className="border border-green-400" disabled={state.isLoading}>
              <PlusSquare />Add New Chapter
            </Button>
            <Button onClick={(e) => { e.preventDefault(); saveDraft(); }} className="bg-primeGreen" disabled={state.isSaving}>
              {state.isSaving ? "Saving..." : "Save Draft"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap your component with the provider
const AddCourseWithProvider = ({ onClose }: { onClose: () => void }) => {
  return (
    <CourseProvider>
      <AddCourse onClose={onClose} />
    </CourseProvider>
  );
};

export default AddCourseWithProvider;