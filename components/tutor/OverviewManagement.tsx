
// components/AddCourse.tsx
"use client"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { ArrowUp, GripVertical, Pen, PlusSquare, Trash, Upload, UploadIcon, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
import { useRouter } from "next/navigation"
import { useCourseStore } from "@/store/useCourseStore"
import Image from "next/image"
import { useRef, useState } from "react"
import api from "@/hooks/axios"
import { useAuthStore } from "@/store/useAuthStore"
import { toast } from "sonner"

const OverviewManagement = () => {
const router = useRouter()
const inputRef = useRef<HTMLInputElement>(null);
const [preview, setPreview] = useState<string | null>(null);
const [thumbnail,setThumbnail]=useState<File>();
const handleClick = () => {
inputRef.current?.click();
};

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (!file) return;
setThumbnail(file);
// Optional: upload the file to server
try {
const reader = new FileReader();
reader.onloadend = () => {
setPreview(reader.result as string);
};
reader.readAsDataURL(file);

} catch (error) {
console.error("Upload failed:", error);
}
};
const user=useAuthStore(state=>state.user)
const handleCourseUpload=async()=>{
try {

// Course basic datas
const formdata=new FormData();
formdata.append("title", courseDetails.title || "");
formdata.append("description", courseDetails.description || "");
formdata.append("duration", courseDetails.duration );
formdata.append("targetSem", courseDetails.targetSem || "");
formdata.append("targetUniversity", courseDetails.targetUniversity || "");
formdata.append("targetCourse", courseDetails.targetCourse || "");
formdata.append("courseDepth", courseDetails.courseDepth || "");

formdata.append("price","0.00");
if(thumbnail)
formdata.append("thumbnail",thumbnail);
formdata.append("tutorProfileId",user?.tutorProfile.id)
//Chapter data
const chapterDatas = chapters?.map((chap) => ({
title: chap.title,
subChapters: chap.subChapters?.map((sub) => ({
title: sub.title,
subHeadings: sub.subHeadings?.map((sh) => ({
title: sh.title,
})),
})),
}));
formdata.append("chapters",JSON.stringify(chapterDatas))



const res=await api.post("/course",formdata);
console.log(res)
toast.success("Course has been saved!")
} catch (error) {
console.log(error)
toast.success("Something went wrong!")

}
}

// Get everything from the store
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
saveDraft:saveMyDraft
} = useCourseStore()

// Save draft function
const saveDraft = async () => {
if (!chapters || chapters.length === 0) {
console.warn("No chapters to save")
return
}

try {
setSaving(true)
// saveMyDraft();
handleCourseUpload()
console.log("Saving course:", { courseDetails, chapters })
// router.push("/tutor/mycourse/draft")
} catch (error) {
console.error("Failed to save draft:", error)
} finally {
setSaving(false)
}
}




// Handle drag and drop
const handleDragEnd = (result: DropResult) => {
if (!result.destination) return

const { source, destination, type } = result

setLoading(true)

if (type === "chapter") {
reorderChapters(source.index, destination.index)
} else if (type === "subTitle") {
reordersubChapters(source.droppableId, source.index, destination.index)
} else if (type === "subHeading") {
reorderSubHeadings(source.droppableId, source.index, destination.index)
}

setLoading(false)
}
console.log(chapters)

if (isLoading) {
return (
<div>
Loading
</div>
)
}

return (
<div className=" w-full bg-opacity-50 flex items-center justify-start p-4 z-50">
<div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-y-auto">


<div className="flex flex-col gap-1 px-6 py-4">
<h4 className="text-2xl">Course Outlook</h4>
<p className="text-green-600">Draft your course outlook</p>
</div>

<div className="flex flex-col gap-6 px-6 pb-6">
{/* Course Details Form */}
<div className="grid grid-cols-2 gap-4">
<div className="flex flex-col gap-1">
  <Label htmlFor="courseName">Course Name</Label>
  <Input
    id="courseName"
    className="outline-0 border border-gray-400 rounded-md"
    type="text"
    value={courseDetails?.title}
    onChange={(e) => updateCourseDetails({ title: e.target.value })}
  />
</div>

<div className="flex gap-2">
  <div className="flex flex-col gap-1 flex-1">
    <Label htmlFor="durationNumber">Duration Number</Label>
    <Select
      value={courseDetails.duration.toString() ? courseDetails.duration.toString() : "1"}

      onValueChange={(value) => updateCourseDetails({ duration: value })}
    >
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
    <Select
      value={courseDetails?.durationUnit}
      onValueChange={(value) => updateCourseDetails({ durationUnit: value })}
    >
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

{/* Course Description */}
<div className="flex flex-col gap-2">
<Label htmlFor="courseDescription">Course Description</Label>
<Textarea
  id="courseDescription"
  rows={10}
  value={courseDetails?.description}
  onChange={(e) => updateCourseDetails({ description: e.target.value })}
/>
</div>

{/* Student Target & Course Depth */}
<div className="grid grid-cols-2 gap-6">
<div className="flex flex-col gap-4">
  <h4 className="font-semibold text-lg">Student Target</h4>
  <div className="flex flex-col gap-3">
    <Select
      value={courseDetails?.targetUniversity}
      onValueChange={(value) => updateCourseDetails({ targetUniversity: value })}
    >
      <SelectTrigger className="outline-0 w-full border border-gray-400 rounded-md">
        <SelectValue placeholder="Select University" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="tu">Tribhuvan University</SelectItem>
        <SelectItem value="pu">Pokhara University</SelectItem>
        <SelectItem value="ku">Kathmandu University</SelectItem>
      </SelectContent>
    </Select>
    <Select
      value={courseDetails?.targetCourse}
      onValueChange={(value) => updateCourseDetails({ targetCourse: value })}
    >
      <SelectTrigger className="outline-0 w-full border border-gray-400 rounded-md">
        <SelectValue placeholder="Select Course" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="bict">BICTE</SelectItem>
        <SelectItem value="bca">BCA</SelectItem>
        <SelectItem value="bit">BIT</SelectItem>
      </SelectContent>
    </Select>
    <Select
      value={courseDetails?.targetSem}
      onValueChange={(value) => updateCourseDetails({ targetSem: value })}
    >
      <SelectTrigger className="outline-0 w-full border border-gray-400 rounded-md">
        <SelectValue placeholder="Select Semester" />
      </SelectTrigger>
      <SelectContent>
        {[...Array(8)]?.map((_, i) => (
          <SelectItem key={i + 1} value={`sem-${i + 1}`}>
            Semester {i + 1}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
</div>

<div className="flex flex-col gap-4">
  <h4 className="font-semibold text-lg">Course Depth</h4>
  <RadioGroup
    value={courseDetails?.courseDepth}
    onValueChange={(value) => updateCourseDetails({ courseDepth: value })}
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

{/* Thumbnail Upload */}
<div className="w-full">
<label htmlFor="thumbnail" className="pb-3 block font-medium">
Course Thumbnail Image
</label>

<div
className="flex w-full min-w-full p-6 rounded-xl items-center border border-gray-400 flex-col gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100"
onClick={handleClick}
>
{preview ? (
<Image
src={preview}
alt="Thumbnail preview"
width={200}
height={120}
className="rounded-md object-cover"
/>
) : (
<>
<UploadIcon />
<h6>Upload your course image</h6>
<p className="text-blue-500 text-xs">
  SVG, PNG or JPEG (Less than 10 MB)
</p>
</>
)}

<input
type="file"
accept=".png,.jpg,.jpeg,.svg"
ref={inputRef}
onChange={handleFileChange}
className="hidden"
/>
</div>
</div>

{/* Course Structure */}
<section className="py-4">
<h5 className="font-semibold text-md">Course Structure</h5>
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="chapters" type="chapter">
    {(provided) => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {chapters?.map((chapter, chapterIndex) => (
          <Draggable key={chapter.id} draggableId={chapter.id.toString()} index={chapterIndex}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.draggableProps} className="border p-2 my-2 bg-white">
                <div className="w-full justify-between flex gap-1 items-center bg-gray-200 rounded-sm p-2" {...provided.dragHandleProps}>
                  <div className="flex gap-1 items-center">
                    <GripVertical />
                    <Input
                      placeholder={chapter.title || `Chapter ${chapterIndex + 1}`}
                      className="text-sm"
                      value={chapter.title}
                      onChange={(e) => updatetitle(chapter.id.toString(), e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        addSubTitle(chapter.id.toString())
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="flex cursor-pointer text-sm border border-gray-400 items-center gap-2 p-2 rounded-sm"
                    >
                      <PlusSquare size={15} />
                      Add Sub-Chapter
                    </div>
                    <Pen onClick={()=>router.push("/tutor/mycourse/draft")} size={15} />
                    <Trash
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteChapter(chapter.id.toString())
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
                        e.stopPropagation()
                        toggleChapter(chapter.id.toString())
                      }}
                    />
                  </div>
                </div>

                {openChapters[chapter.id] && (
                  <Droppable droppableId={chapter.id.toString()} type="subTitle">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="ml-4">
                        {chapter.subChapters?.map((sub, subIndex) => (
                          <Draggable key={sub.id.toString()} draggableId={sub.id.toString()} index={subIndex}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} className="border p-2 my-2 bg-gray-100 py-4 flex flex-col justify-center rounded">
                                <div className="flex items-center justify-between" {...provided.dragHandleProps}>
                                  <div className="flex gap-1 items-center">
                                    <GripVertical />
                                    <Input
                                      placeholder={sub.title || `Subchapter ${subIndex + 1}`}
                                      className="text-sm"
                                      value={sub.title}
                                      onChange={(e) => updateSubTitleName(sub.id.toString(), e.target.value)}
                                    />
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        addSubHeading(sub.id.toString())
                                      }}
                                      className="flex cursor-pointer text-sm border border-gray-400 items-center gap-2 p-1 rounded-sm"
                                    >
                                      <PlusSquare size={15} />
                                      Add Sub-Heading
                                    </div>
                                    <Pen onClick={()=>router.push("/tutor/mycourse/draft")} size={15} />
                                    <Trash
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        deleteSubTitle(sub.id.toString())
                                      }}
                                      size={15}
                                      color="red"
                                      className="cursor-pointer"
                                    />
                                    <ArrowUp
                                      size={15}
                                      className={`cursor-pointer transition-transform ${
                                        opensubChapters[sub.id.toString()] ? "rotate-180" : ""
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleSubTitle(sub.id.toString())
                                      }}
                                      onMouseDown={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                </div>

                                {opensubChapters[sub.id.toString()] && (
                                  <Droppable droppableId={sub.id.toString()} type="subHeading">
                                    {(provided) => (
                                      <ul className="ml-4 my-3 list-disc" ref={provided.innerRef} {...provided.droppableProps}>
                                        {sub.subHeadings?.map((sh, shIndex) => (
                                          <Draggable key={sh.id.toString()} draggableId={sh.id.toString()} index={shIndex}>
                                            {(provided) => (
                                              <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="py-2 pl-2 my-1 bg-white list-none border-b">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex gap-1 items-center">
                                                    <GripVertical />
                                                    <Input
                                                      placeholder={sh.title || `Subheading ${shIndex + 1}`}
                                                      className="text-sm"
                                                      value={sh.title}
                                                      onChange={(e) => updateSubHeadingName(sh.id.toString(), e.target.value)}
                                                    />
                                                  </div>
                                                  <div className="flex items-center gap-3">
                                                    <Pen onClick={()=>router.push("/tutor/mycourse/draft")} size={15} />
                                                    <Trash
                                                      onClick={(e) => {
                                                        e.stopPropagation()
                                                        deleteSubHeading(sh.id.toString())
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

{/* Action Buttons */}
<div className="flex flex-col gap-3">
<Button
  onClick={(e) => {
    e.preventDefault()
    addChapter()
  }}
  variant="ghost"
  className="border border-green-400"
  disabled={isLoading}
>
  <PlusSquare />
  Add New Chapter
</Button>

</div>
</div>
</div>
</div>
)
}

export default OverviewManagement