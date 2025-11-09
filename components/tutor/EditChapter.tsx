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
Divide,
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
import { useGlobalCourseStore } from "@/store/useGlobalCourseStore";

export const CourseContentEditor = () => {
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
const router = useRouter();




async function getVideoThumbnail(videoUrl:string, seekTo = 1.0) {
return new Promise((resolve, reject) => {
const video = document.createElement("video");
video.src = videoUrl;
video.crossOrigin = "anonymous"; // needed if the video is from another domain
video.load();

video.addEventListener("loadeddata", () => {
video.currentTime = seekTo;
});

video.addEventListener("seeked", () => {
const canvas = document.createElement("canvas");
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

const ctx:any = canvas.getContext("2d");
ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

const imageUrl = canvas.toDataURL("image/png");
resolve(imageUrl);
});

video.addEventListener("error", (e) => reject(e));
});
}

const [description,setDescription]=useState<string>("")
const [selectedItem, setSelectedItem] = useState<
| ((Chapter | SubHeading | SubTitle) & {
type: "chapter" | "subheading" | "subchapter";
parentId: string;
})
| null
>();
// Get everything from the store

const handleSelection =async (
e: any,
item: Chapter | SubHeading | SubTitle | any,
type: "chapter" | "subheading" | "subchapter",
parentId: string
) => {
e.stopPropagation();
setSelectedItem({ ...item, type, parentId });
setSubtitleFile(null);
const thumbnails:any = await getVideoThumbnail(item.video);
console.log(item)
setThumbnail(thumbnails)
setVideoFile(null);
setDescription(item.description || "")
console.log(parentId);
};

const deleteSection=async(id:number,type:string)=>{
try {
const res = await api.delete(`/course/chapter/${id}?type=${type}`);
console.log("Delete success:", res.data);
toast.success("Section has been deleted!");
await fetchCourse();
} catch (error) {
toast.error("Section wasn't deleted!");
console.error("Delete failed:", error);
}
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
const [thumbnail, setThumbnail] = useState<string | null>(null);
const [loading, setLoadingState] = useState(false);
const [subtitleFile, setSubtitleFile] = useState<File | null>(null);
const videoInputRef = useRef<HTMLInputElement>(null);
const subtitleInputRef = useRef<HTMLInputElement>(null);
const { course, setCourse } = useGlobalCourseStore();

const fetchCourse = async () => {
const courseId = courseDetails?.id;
const res = await api.get("/course/" + courseId);
console.log(res);
updateCourseDetails(res.data.data);
console.log(courseDetails,"Updated")
 
};

const handleUpload = async () => {
console.log(selectedItem?.video, selectedItem?.subtitle);

const videoSource = videoFile || selectedItem?.video;
const subtitleSource = subtitleFile || selectedItem?.subtitle;

const isValidVideo =
videoSource instanceof File || typeof videoSource === "string";
const isValidSubtitle =
subtitleSource instanceof File || typeof subtitleSource === "string";

if (!isValidVideo || !isValidSubtitle) {
toast.error("Both video and subtitle must be provided (file or URL).");
return;
}

setLoadingState(true);

try {
const formData = new FormData();

// Append video and subtitle — either File or string
formData.append("video", videoSource);
formData.append("subtitle", subtitleSource);

formData.append("title", selectedItem?.title ?? "");
formData.append("description", description);
formData.append("courseId", courseDetails?.id?.toString() ?? "");
formData.append("parentId", selectedItem?.parentId ?? "");
formData.append("type", selectedItem?.type ?? "");

const res = await api.patch(
`/course/chapter/${selectedItem?.id}`,
formData
);

console.log("Upload success:", res.data);
toast.success("Course has been updated!");

// Reset state
await fetchCourse();
setSelectedItem(null);
setVideoFile(null);
setSubtitleFile(null);
} catch (error) {
console.error("Upload failed:", error);
toast.error("Course wasn't updated!");
} finally {
setLoadingState(false);
}
};

const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (!file) return;

setVideoFile(file);

const video = document.createElement("video");
video.preload = "metadata";
video.src = URL.createObjectURL(file);
video.crossOrigin = "anonymous";
video.muted = true;
video.playsInline = true;

// Wait for metadata to load (we get duration & dimensions)
video.onloadedmetadata = () => {
// Seek to 1 second (or 0 if shorter)
const seekTime = Math.min(1, video.duration / 2);
video.currentTime = seekTime;
};

// Once we have the frame we want, draw it to canvas
video.onseeked = () => {
const canvas = document.createElement("canvas");
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
if (ctx) {
ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}
const imageUrl = canvas.toDataURL("image/png");
setThumbnail(imageUrl);

// Clean up
URL.revokeObjectURL(video.src);
};
};

useEffect(() => {
  (async () => {await fetchCourse();})();
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
deleteSection(chapter.id,"chapter")
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
            deleteSection(sub.id,"subchapter")
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
                              deleteSection(sh.id,"subheading")
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
{selectedItem == null ? (
<div className="flex-1 flex flex-col items-center justify-center text-center p-4">
<Video className="w-16 h-16 text-gray-400 mb-4" />
<h2 className="text-xl font-semibold mb-2">No Content Selected</h2>
<p className="text-gray-600">
Please select a chapter or section from the sidebar to edit its
content.
</p>
</div>
) : (
<div className="flex-1 p-6 mb-28 overflow-y-auto">
<div className="max-w-4xl mx-auto space-y-6">
{/* Video Upload */}
<div>
<h3 className="text-lg font-medium mb-3">Content Video</h3>
<div
className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
onClick={() => videoInputRef.current?.click()}
>
{(thumbnail) ? (
<img
src={thumbnail as string}
alt="Video thumbnail"
className="mx-auto rounded-lg bg-gray-300 max-h-48 object-cover mb-4"
/>
) :
(
<Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
)}

<p className="text-gray-600 mb-2">
{videoFile ? videoFile.name : "Upload your Content Video"}
</p>
<p className="text-sm text-blue-500">
mp4 or mov (less than 2GB)
</p>

<input
type="file"
ref={videoInputRef}
accept="video/mp4,video/quicktime"
onChange={handleVideoChange}
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
<p className="text-gray-600 mb-2">
{subtitleFile ? (
<>
<FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
{subtitleFile.name}
</>
) : (
<>
<Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
"Upload your Content Subtitle"
</>
)}
</p>
<p className="text-sm text-blue-500">SRT (less than 1MB)</p>
<input
type="file"
ref={subtitleInputRef}
accept=".srt"
onChange={(e) =>
setSubtitleFile(e.target.files?.[0] || null)
}
className="hidden"
/>
</div>
</div>
<div className="w-full h-[15rem]">
<textarea
className="w-full h-full p-2 text-gray-700 border rounded resize-none 
focus:outline-none focus:ring-2 focus:ring-green-400"
placeholder="Write your description"
onChange={(e)=>setDescription(e.target.value)}
value={description}
/>
</div>

{/* Action Buttons */}
<div className="flex gap-4 mt-8">
<button
onClick={handleUpload}
className="flex-1 bg-teal-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-600"
>
{loading ? "Saving..." : "Save Draft"}
</button>
<button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50">
Send for Approval
</button>
</div>
</div>
</div>
)}
{/* Content Editor */}
</div>
</div>
);
};

export default CourseContentEditor;
