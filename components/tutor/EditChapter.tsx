"use client";
import React, { useState, useReducer } from "react";
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

import { useCourseStore } from "@/store/useCourseStore";
import { useRouter } from "next/navigation";

// Types
interface SubHeading {
subHeadId: string;
subHeadName: string;
}

interface SubTitle {
subId: string;
subName: string;
subHeading: SubHeading[];
}

interface Chapter {
chapterId: string;
chapterName: string;
subTitles: SubTitle[];
}

interface State {
chapters: Chapter[];
openChapters: Record<string, boolean>;
openSubTitles: Record<string, boolean>;
selectedItem: string | null;
sidebarCollapsed: boolean;
}

type Action =
| { type: "TOGGLE_CHAPTER"; payload: string }
| { type: "TOGGLE_SUBTITLE"; payload: string }
| { type: "ADD_CHAPTER" }
| { type: "ADD_SUBTITLE"; payload: string }
| { type: "ADD_SUBHEADING"; payload: { subId: string } }
| { type: "SELECT_ITEM"; payload: string }
| { type: "TOGGLE_SIDEBAR" };

// Sample data
const initialChapters: Chapter[] = [
{
chapterId: "chapter-1",
chapterName: "Chapter 1 Title",
subTitles: [
{
subId: "sub-1",
subName: "Chapter 1 Sub-Title",
subHeading: [
{ subHeadId: "subHead-1", subHeadName: "Chapter 1 Sub-head" },
],
},
],
},
{
chapterId: "chapter-2",
chapterName: "Chapter 2 Title",
subTitles: [],
},
{
chapterId: "chapter-3",
chapterName: "Chapter 3 Title",
subTitles: [
{
subId: "sub-3",
subName: "Chapter 3 Sub-Title",
subHeading: [
{ subHeadId: "subHead-3", subHeadName: "Chapter 3 Sub-Head" },
],
},
],
},
{
chapterId: "chapter-4",
chapterName: "Chapter 4 Title",
subTitles: [],
},
];

const reducer = (state: State, action: Action): State => {
switch (action.type) {
case "TOGGLE_CHAPTER":
return {
...state,
openChapters: {
...state.openChapters,
[action.payload]: !state.openChapters[action.payload],
},
};

case "TOGGLE_SUBTITLE":
return {
...state,
openSubTitles: {
...state.openSubTitles,
[action.payload]: !state.openSubTitles[action.payload],
},
};

case "ADD_CHAPTER": {
const newChapterId = `chapter-${Date.now()}`;
const newChapter: Chapter = {
chapterId: newChapterId,
chapterName: `Chapter ${state.chapters.length + 1} Title`,
subTitles: [],
};
return {
...state,
chapters: [...state.chapters, newChapter],
openChapters: { ...state.openChapters, [newChapterId]: true },
};
}

case "ADD_SUBTITLE": {
const newSubId = `sub-${Date.now()}`;
const newSubTitle: SubTitle = {
subId: newSubId,
subName: `New Sub-Title`,
subHeading: [],
};
return {
...state,
chapters: state.chapters.map((chapter) =>
chapter.chapterId === action.payload
? { ...chapter, subTitles: [...chapter.subTitles, newSubTitle] }
: chapter
),
openSubTitles: { ...state.openSubTitles, [newSubId]: true },
};
}

case "ADD_SUBHEADING": {
const newSubHeadId = `subHead-${Date.now()}`;
const newSubHeading: SubHeading = {
subHeadId: newSubHeadId,
subHeadName: `New Sub-Heading`,
};
return {
...state,
chapters: state.chapters.map((chapter) => ({
...chapter,
subTitles: chapter.subTitles.map((subTitle) =>
subTitle.subId === action.payload.subId
? {
...subTitle,
subHeading: [...subTitle.subHeading, newSubHeading],
}
: subTitle
),
})),
};
}

case "SELECT_ITEM":
return {
...state,
selectedItem: action.payload,
};

case "TOGGLE_SIDEBAR":
return {
...state,
sidebarCollapsed: !state.sidebarCollapsed,
};

default:
return state;
}
};

export const CourseContentEditor = () => {
const [state, dispatch] = useReducer(reducer, {
chapters: initialChapters,
openChapters: { "chapter-1": true, "chapter-3": true },
openSubTitles: { "sub-1": false, "sub-3": false },
selectedItem: "sub-1",
sidebarCollapsed: false,
});
const courses: Chapter[] = useCourseStore((state) => state.course);
const [categories, setCategories] = useState(courses);
const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});
const [openSubTitles, setOpenSubTitles] = useState<Record<string, boolean>>(
{}
);
const router = useRouter();
const setCourse = useCourseStore((state) => state.setCourse);

const saveDraft = () => {
setCourse(categories);
router.push("/mycourse/draft");
};
const deleteChapter = (e: any, chapter: any) => {
e.stopPropagation();
const chapterId = chapter.chapterId;
console.log(chapterId);
setCategories((prev) =>
prev.filter((chapter) => chapter.chapterId !== chapterId)
);
};

const addChapter = () => {
const newChapterId = `chapter-${categories.length + 1}`;

const newChapter = {
chapterId: newChapterId,
chapterName: `New Chapter ${categories.length + 1}`,
subTitles: [],
};

setCategories((prev) => [...prev, newChapter]);
};
const addSubTitle = (chapterId: string) => {
console.log("first");
setCategories((prev) =>
prev.map((chapter) => {
if (chapter.chapterId === chapterId) {
const newSubId = `sub-${Date.now()}`;
const newSubTitle = {
subId: newSubId,
subName: "New Sub-Title",
subHeading: [],
};
return {
...chapter,
subTitles: [...chapter.subTitles, newSubTitle],
};
}
return chapter;
})
);
};

const addSubHeading = (subId: string) => {
setCategories((prev) =>
prev.map((chapter) => ({
...chapter,
subTitles: chapter.subTitles.map((sub) => {
if (sub.subId === subId) {
const newSubHeadId = `subHead-${Date.now()}`;
const newSubHeading = {
subHeadId: newSubHeadId,
subHeadName: "New Sub-Heading",
};
return {
...sub,
subHeading: [...sub.subHeading, newSubHeading],
};
}
return sub;
}),
}))
);
};

const deleteSubTitle = (subId: string) => {
setCategories((prev) =>
prev.map((chapter) => ({
...chapter,
subTitles: chapter.subTitles.filter((sub) => sub.subId !== subId),
}))
);
};

const deleteSubHeading = (subHeadId: string) => {
setCategories((prev) =>
prev.map((chapter) => ({
...chapter,
subTitles: chapter.subTitles.map((sub) => ({
...sub,
subHeading: sub.subHeading.filter(
(head) => head.subHeadId !== subHeadId
),
})),
}))
);
};

const toggleChapter = (chapterId: string) => {
setOpenChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
};
console.log(categories);
const toggleSubTitle = (subId: string) => {
setOpenSubTitles((prev) => ({ ...prev, [subId]: !prev[subId] }));
};

const handleDragEnd = (result: DropResult) => {
const { source, destination, type } = result;

if (!destination) return;

const updated = [...categories];

if (type === "chapter") {
const [moved] = updated.splice(source.index, 1);
updated.splice(destination.index, 0, moved);
setCategories(updated);
}

if (type === "subTitle") {
const chapterIndex = updated.findIndex(
(c) => c.chapterId === source.droppableId
);
const subTitles = Array.from(updated[chapterIndex].subTitles);
const [moved] = subTitles.splice(source.index, 1);
subTitles.splice(destination.index, 0, moved);
updated[chapterIndex].subTitles = subTitles;
setCategories(updated);
}

if (type === "subHeading") {
for (const chapter of updated) {
for (const subtitle of chapter.subTitles) {
if (subtitle.subId === source.droppableId) {
const items = Array.from(subtitle.subHeading);
const [moved] = items.splice(source.index, 1);
items.splice(destination.index, 0, moved);
subtitle.subHeading = items;
break;
}
}
}
setCategories(updated);
}
};

const getSelectedContent = () => {
for (const chapter of state.chapters) {
for (const subtitle of chapter.subTitles) {
if (subtitle.subId === state.selectedItem) {
return {
type: "subtitle",
title: subtitle.subName,
chapterName: chapter.chapterName,
};
}
for (const subhead of subtitle.subHeading) {
if (subhead.subHeadId === state.selectedItem) {
return {
type: "subheading",
title: subhead.subHeadName,
chapterName: chapter.chapterName,
};
}
}
}
}
return null;
};

const selectedContent = getSelectedContent();

return (
<div className="flex h-screen bg-gray-50">
{/* Sidebar */}
<div
className={`bg-white border-r border-gray-200 transition-all duration-300 ${
state.sidebarCollapsed ? "w-0 overflow-hidden" : "w-80"
}`}
>
<section className="py-4">
<h5 className="font-semibold text-md">Course Structure</h5>
<DragDropContext onDragEnd={handleDragEnd}>
<Droppable droppableId="chapters" type="chapter">
{(provided) => (
<div ref={provided.innerRef} {...provided.droppableProps}>
{categories.map((chapter, chapterIndex) => (
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
className=" text-sm"
/>
</div>
<div className="flex items-center gap-3">
<div
onClick={(e) => {
e.stopPropagation();
addSubTitle(chapter.chapterId);
}}
onMouseDown={(e) => e.stopPropagation()}
className="flex cursor-pointer text-sm border border-gray-400  items-center gap-2 p-2 rounded-sm"
>
<PlusSquare size={15} />
Add Sub-Chapter
</div>
<Pen size={15} />
<Trash
onClick={(e) => deleteChapter(e, chapter)}
size={15}
color="red"
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
{chapter.subTitles.map((sub, subIndex) => (
<Draggable
key={sub.subId}
draggableId={sub.subId}
index={subIndex}
>
{(provided) => (
<div
ref={provided.innerRef}
{...provided.draggableProps}
className="border p-2 my-2 bg-gray-100 py-4  flex flex-col justify-center rounded"
>
<div
className="flex items-center justify-between"
{...provided.dragHandleProps}
>
<div className="flex gap-1 items-center">
  <GripVertical />
  <h2 className=" text-sm">
    {sub.subName}
  </h2>
</div>
<div className="flex items-center gap-3">
  <div
    onClick={(e) => {
      e.stopPropagation();
      addSubHeading(sub.subId);
    }}
    className="flex cursor-pointer text-sm border border-gray-400  items-center gap-2 p-1 rounded-sm"
  >
    <PlusSquare size={15} />
    Add Sub-Heading
  </div>
  <Pen size={15} />
  <Trash
    onClick={(e) => {
      e.stopPropagation();
      deleteSubTitle(sub.subId);
    }}
    size={15}
    color="red"
  />
  <ArrowUp
    size={15}
    className={`cursor-pointer transition-transform ${
      openSubTitles[sub.subId]
        ? "rotate-180"
        : ""
    }`}
    onClick={(e) => {
      e.stopPropagation();
      toggleSubTitle(sub.subId);
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
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      {sub.subHeading.map(
        (sh, shIndex) => (
          <Draggable
            key={sh.subHeadId}
            draggableId={
              sh.subHeadId
            }
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
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 items-center">
                    <GripVertical />
                    <h2 className=" text-sm">
                      {
                        sh.subHeadName
                      }
                    </h2>
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
                          sh.subHeadId
                        );
                      }}
                      size={15}
                      color="red"
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
<Button
onClick={(e) => {
e.preventDefault();
addChapter();
}}
variant="ghost"
className="border border-green-400"
>
<PlusSquare />
Add New Chapter
</Button>
</div>

{/* Main Content */}
<div className="flex-1 flex flex-col">
{/* Header */}
<div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
<div className="flex items-center gap-4">
<button
onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
className="p-2 hover:bg-gray-100 rounded-lg"
>
{state.sidebarCollapsed ? (
<ChevronRight className="w-5 h-5" />
) : (
<ChevronLeft className="w-5 h-5" />
)}
</button>
<h1 className="text-xl font-semibold">
{selectedContent?.title || "Select a chapter or section"}
</h1>
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
<div className="flex-1 p-6 overflow-y-auto">
{selectedContent ? (
<div className="max-w-4xl mx-auto">
<div className="mb-6">
<span className="text-sm text-teal-600 font-medium">
Draft your Content
</span>
</div>

<div className="space-y-6">
{/* Content Video */}
<div>
<h3 className="text-lg font-medium mb-3">Content Video</h3>
<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
<Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
<p className="text-gray-600 mb-2">
Upload your Content Video
</p>
<p className="text-sm text-blue-500">
mp4 or mov (less than 2GB)
</p>
</div>
</div>

{/* Content Subtitle */}
<div>
<h3 className="text-lg font-medium mb-3">Content Subtitle</h3>
<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
<Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
<p className="text-gray-600 mb-2">
Upload your Content Subtitle
</p>
<p className="text-sm text-blue-500">SRT (less than 1MB)</p>
</div>
</div>

{/* Description */}
<div>
<h3 className="text-lg font-medium mb-3">Description</h3>
<div className="border border-gray-300 rounded-lg p-4 min-h-48">
<p className="text-blue-600 cursor-pointer">
Embed Text Editor Here
</p>
</div>
</div>
</div>

{/* Action Buttons */}
<div className="flex gap-4 mt-8">
<button className="flex-1 bg-teal-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-600">
Save Draft
</button>
<button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50">
Send for Approval
</button>
</div>
</div>
) : (
<div className="flex items-center justify-center h-full">
<div className="text-center">
<FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
<p className="text-gray-500 text-lg">
Select a chapter or section to start editing
</p>
</div>
</div>
)}
</div>
</div>
</div>
);
};

export default CourseContentEditor;
