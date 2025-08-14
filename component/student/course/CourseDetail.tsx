"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  CheckCircle,
  BarChart3,
  Clock,
  Play,
  Lock,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/hooks/axios";

export default function CourseInterface() {
  const params = useParams();
  const id = params?.id;
  console.log(id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      const res = await api.get(`/course/${id}`);
      console.log(res);
      return res.data.data;
    },
  });
  const chapters = [
    {
      id: 1,
      title: "Fundamental of Physics",
      duration: "2 Hours",
      isLocked: false,
      hasExternalLink: false,
      subChapters: [
        {
          id: 1,
          title: "Mechanics",
          duration: "30 min",
          isLocked: false,
          hasExternalLink: false,
        },
        {
          id: 2,
          title: "Thermodynamics",
          duration: "45 min",
          isLocked: false,
          hasExternalLink: true,
        },
        {
          id: 3,
          title: "Electrodynamics",
          duration: "35 min",
          isLocked: true,
          hasExternalLink: false,
        },
      ],
    },
    {
      id: 2,
      title: "Fundamental of Optics",
      duration: "2 Hours",
      isLocked: false,
      hasExternalLink: true,
      subChapters: [
        {
          id: 4,
          title: "Ray Optics",
          duration: "40 min",
          isLocked: false,
          hasExternalLink: false,
        },
        {
          id: 5,
          title: "Wave Optics",
          duration: "50 min",
          isLocked: false,
          hasExternalLink: true,
        },
      ],
    },
    {
      id: 3,
      title: "Advanced Physics Concepts",
      duration: "1.5 Hours",
      isLocked: false,
      hasExternalLink: true,
      subChapters: [],
    },
    {
      id: 4,
      title: "Quantum Mechanics",
      duration: "3 Hours",
      isLocked: true,
      hasExternalLink: false,
      subChapters: [
        {
          id: 6,
          title: "Wave Functions",
          duration: "60 min",
          isLocked: true,
          hasExternalLink: false,
        },
        {
          id: 7,
          title: "Schrödinger Equation",
          duration: "90 min",
          isLocked: true,
          hasExternalLink: false,
        },
      ],
    },
    {
      id: 5,
      title: "Nuclear Physics",
      duration: "2.5 Hours",
      isLocked: true,
      hasExternalLink: false,
      subChapters: [],
    },
  ];

  const [openChapters, setOpenChapters] = useState<any>({});

  const toggleChapter = (id: number) => {
    setOpenChapters((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const router = useRouter();
  const handleEnroll = (id: number) => {
    router.push(`/course/${id}/payment`);
  };
  const ChapterCard = ({ chapter, isSubChapter = false }:{chapter:any,isSubChapter:boolean}) => (
    <Card
      className={`border border-gray-200 hover:shadow-sm transition-shadow ${
        isSubChapter ? "ml-8 mt-2" : ""
      }`}
    >
      <CardContent className={`${isSubChapter ? "p-3" : "p-4"}`}>
        <div className="flex items-center gap-4">
          {/* Chapter Thumbnail */}
          <div
            className={`${
              isSubChapter ? "w-12 h-12" : "w-16 h-16"
            } rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0`}
          >
            <Play
              className={`${isSubChapter ? "w-4 h-4" : "w-6 h-6"} text-white`}
            />
          </div>

          {/* Chapter Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`${
                  isSubChapter ? "text-xs" : "text-sm"
                } text-gray-500`}
              >
                {isSubChapter
                  ? `Subchapter ${chapter.id}`
                  : `Chapter ${chapter.id}`}
              </span>
            </div>
            <h3
              className={`${
                isSubChapter ? "text-sm" : "text-base"
              } font-medium text-gray-900 mb-1`}
            >
              {chapter.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-teal-500">
              <Clock className="w-3 h-3" />
              <span className={isSubChapter ? "text-xs" : "text-sm"}>
                {chapter.duration}
              </span>
            </div>
          </div>

          {/* Chapter Actions */}
          <div className="flex items-center gap-2">
            {chapter.hasExternalLink && (
              <Button variant="ghost" size="sm" className="p-2">
                <ExternalLink
                  className={`${
                    isSubChapter ? "w-3 h-3" : "w-4 h-4"
                  } text-gray-400`}
                />
              </Button>
            )}
            {chapter.isLocked ? (
              <div className="flex items-center gap-1">
                <Lock
                  className={`${
                    isSubChapter ? "w-3 h-3" : "w-4 h-4"
                  } text-gray-400`}
                />
                {!isSubChapter &&
                  chapter.subChapters &&
                  chapter.subChapters.length > 0 && (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
              </div>
            ) : (
              <>
                {!isSubChapter &&
                chapter.subChapters &&
                chapter.subChapters.length > 0 ? (
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="flex items-center gap-1 p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {openChapters[chapter.id] ? (
                      <ChevronDown className="w-4 h-4 text-teal-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-teal-500" />
                    )}
                  </button>
                ) : (
                  !isSubChapter && (
                    <ChevronDown className="w-4 h-4 text-teal-500" />
                  )
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return "Loading";
  }
  return (
    <section className="mx-auto p-6 bg-white">
      {/* Course Header */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Course Image */}
        <div className="h-fit">
          <Image
            src={data?.thumbnail || "/static/landing/course.svg"}
            alt="Fundamental of Optics Course"
            width={320}
            height={192}
            className="w-full h-full rounded-xl object-cover"
          />
          <div className="flex mt-3 items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src="/static/landing/course.svg"
                alt="Sandesh Sapkota"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-gray-900">
                  {data.tutor.user.name}
                </span>
                <CheckCircle className="w-4 h-4 text-teal-500" />
              </div>
              <span className="text-sm text-gray-500">
                {data.tutor.jobTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{data?.title}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">5.0 (120+)</span>
            </div>
            <span className="text-2xl font-bold text-teal-500">
              NRs. {data.price}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Apply your new skills to real-world projects using the latest
            industry tools & techniques. Get job-ready for high-growth fields.
            Apply your new skills to real-world projects using the latest
            industry tools & techniques. Get job-ready for high-growth fields.
            Apply your new skills to real-world projects using the latest
            industry tools & techniques. Get job-ready for high-growth fields.
            Apply your new skills to real-world projects using the latest
            industry tools & techniques. Get job-ready for high-growth fields...{" "}
            <span className="text-green-400 ">Read more</span>
          </p>

          {/* Tags */}
          <div className="flex gap-2 my-3">
            {/* <Badge variant="outline" className="bg-teal-50 text-teal-600 border-teal-200">
              {data.qualifications}
            </Badge> */}
            {data?.tags.map((item: string, i: number) => {
              return (
                <Badge
                  key={i}
                  variant="outline"
                  className="bg-teal-50 text-teal-600 border-teal-200"
                >
                  {item}
                </Badge>
              );
            })}
          </div>

          <div>
            <Button
              onClick={() => handleEnroll(data.id)}
              className="bg-teal-500 w-full hover:bg-teal-600 text-white px-8"
            >
              Enroll Course
            </Button>

            <div className="flex my-3 justify-between gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-500" />
                <span className="text-sm text-gray-600">13 Chapters</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-500" />
                <span className="text-sm text-gray-600">Intermediate</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-500" />
                <span className="text-sm text-gray-600">400 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="chapters" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-50">
          <TabsTrigger
            value="chapters"
            className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-teal-500"
          >
            All Chapters (13)
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="data-[state=active]:bg-white"
          >
            Resources
          </TabsTrigger>
          <TabsTrigger
            value="assignments"
            className="data-[state=active]:bg-white"
          >
            Assignments
          </TabsTrigger>
          <TabsTrigger
            value="questions"
            className="data-[state=active]:bg-white"
          >
            Past Questions
          </TabsTrigger>
          <TabsTrigger value="classes" className="data-[state=active]:bg-white">
            Classes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chapters" className="mt-6">
          <div className="space-y-4">
            {chapters.map((chapter) => (
              <div key={chapter.id}>
                {/* Main Chapter */}
                <ChapterCard chapter={chapter} isSubChapter={false} />

                {/* Subchapters */}
                {openChapters[chapter.id] &&
                  chapter.subChapters &&
                  chapter.subChapters.length > 0 && (
                    <div className="space-y-2">
                      {chapter.subChapters.map((subChapter) => (
                        <ChapterCard
                          key={`sub-${subChapter.id}`}
                          chapter={subChapter}
                          isSubChapter={true}
                        />
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                1
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 bg-teal-500 text-white hover:bg-teal-600"
              >
                2
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                3
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Resources
            </h3>
            <p className="text-gray-500">
              Course resources will be displayed here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Assignments
            </h3>
            <p className="text-gray-500">
              Course assignments will be displayed here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Past Questions
            </h3>
            <p className="text-gray-500">
              Past questions will be displayed here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="classes" className="mt-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Classes</h3>
            <p className="text-gray-500">
              Class information will be displayed here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
