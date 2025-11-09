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
  ExternalLinkIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { useEffect, useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/hooks/axios";
import { checkKhaltiPayment } from "@/hooks/khalti";
import { useAuthStore } from "@/store/useAuthStore";

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

  const [openChapters, setOpenChapters] = useState<any>({});
  const [openSubChapters, setOpenSubChapters] = useState<any>({});

  const toggleChapter = (id: number) => {
    setOpenChapters((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSubChapter = (id: number) => {
    setOpenSubChapters((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const router = useRouter();
  const handleEnroll = (id: number) => {
    router.push(`/course/${id}/payment`);
  };
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);

  const pidx = searchParams.get("pidx");
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    console.log(user)
    console.log(user?.studentProfile?.id,"is user profile")

    if (pidx && user?.studentProfile?.id) {
      checkKhaltiPayment({
        studentProfileId: user?.studentProfile?.id,
        courseId: id,
        pidx,
        
      });
    }
  }, [pidx,user]);
  const SubHeadingCard = ({
    subHeading,
    index,
  }: {
    subHeading: any;
    index: number;
  }) => (
    <Card className="ml-16 mt-2 border border-gray-200 hover:shadow-sm transition-shadow">
      <CardContent className="p-2">
        <div className="flex items-center gap-3">
          {/* SubHeading Thumbnail */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Play onClick={()=>router.push(`/student/course/${id}/active`)} className="w-3 h-3 text-white" />
          </div>

          {/* SubHeading Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-500">
                SubHeading {index + 1}
              </span>
            </div>
            <h4 className="text-xs font-medium text-gray-900 mb-1">
              {subHeading.title}
            </h4>
            {subHeading.duration && (
              <div className="flex items-center gap-1 text-xs text-purple-500">
                <Clock className="w-3 h-3" />
                <span>{subHeading.duration}</span>
              </div>
            )}
          </div>

          {/* SubHeading Actions */}
          <div className="flex items-center gap-2">
            {subHeading.hasExternalLink && (
              <Button variant="ghost" size="sm" className="p-1">
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ChapterCard = ({
    chapter,
    isSubChapter = false,
    parentChapterId = null,
  }: {
    chapter: any;
    isSubChapter: boolean;
    parentChapterId?: number | null;
  }) => (
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
                  ? `SubChapter ${chapter.id}`
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
            {chapter.duration && (
              <div className="flex items-center gap-1 text-sm text-teal-500">
                <Clock className="w-3 h-3" />
                <span className={isSubChapter ? "text-xs" : "text-sm"}>
                  {chapter.duration}
                </span>
              </div>
            )}
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

            {/* Toggle buttons for chapters and subchapters */}
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
            ) : isSubChapter &&
              chapter.subHeadings &&
              chapter.subHeadings.length > 0 ? (
              <button
                onClick={() => toggleSubChapter(chapter.id)}
                className="flex items-center gap-1 p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {openSubChapters[chapter.id] ? (
                  <ChevronDown className="w-4 h-4 text-teal-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-teal-500" />
                )}
              </button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return "Loading";
  }

  return (
    <section className="mx-auto ">
      {/* Course Header */}
      <section className="flex items-center gap-16 mt-3 mb-10">
        <h2 className="font-bold text-2xl min-w-fit ">{data?.title}</h2>
      </section>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Course Image */}
        <div className="h-fit">
          <Image
            src={data?.thumbnail || "/static/landing/course.svg"}
            alt="Course Thumbnail"
            width={320}
            height={192}
            className="w-full h-full rounded-xl object-cover"
          />
          <div className="flex mt-3 items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src="/static/landing/course.svg"
                alt={data?.tutor?.user?.name || "Tutor"}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-gray-900">
                  {data?.tutor?.user?.name || "Unknown Tutor"}
                </span>
                <CheckCircle className="w-4 h-4 text-teal-500" />
              </div>
              <span className="text-sm text-gray-500">
                {data?.tutor?.jobTitle || "Instructor"}
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
          </div>

          {/* Description */}
          <p
            className="text-gray-600 text-sm mb-4 leading-relaxed 
             max-h-[10rem] scrollbar-none overflow-y-auto pr-2"
          >
            {data?.description ||
              "Apply your lorem  new skills to real-world projects using the latest industry tools & techniques. Get job-ready for high-growth fields."}{" "}
            {/* <span className="text-green-400">Read more</span> */}
          </p>

          {/* Tags */}
          <div className="flex gap-2 my-3">
            {data?.tags?.map((item: string, i: number) => {
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
              onClick={() => handleEnroll(data?.id)}
              className="bg-teal-500 w-full hover:bg-teal-600 text-white px-8"
            >
              Go to course
            </Button>

            <div className="flex my-3 justify-between gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-500" />
                <span className="text-sm text-gray-600">
                  {data?.chapters?.length || 0} Chapters
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-500" />
                <span className="text-sm text-gray-600">
                  {data?.courseDepth || "Intermediate"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-500" />
                <span className="text-sm text-gray-600">
                  {data?.duration || 0} {data?.durationUnit || "hours"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs
        defaultValue="chapters"
        className="w-full border border-gray-200 p-2 rounded-2xl"
      >
        <TabsList className="grid w-full grid-cols-5 bg-gray-50">
          <TabsTrigger
            value="chapters"
            className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-teal-500"
          >
            All Chapters ({data?.chapters?.length || 0})
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
            {data?.chapters?.map((chapter: any) => (
              <div key={chapter.id}>
                {/* Main Chapter */}
                <ChapterCard chapter={chapter} isSubChapter={false} />

                {/* Subchapters */}
                {openChapters[chapter.id] &&
                  chapter.subChapters &&
                  chapter.subChapters.length > 0 && (
                    <div className="space-y-2">
                      {chapter.subChapters.map((subChapter: any) => (
                        <div key={`sub-${subChapter.id}`}>
                          <ChapterCard
                            chapter={subChapter}
                            isSubChapter={true}
                            parentChapterId={chapter.id}
                          />

                          {/* SubHeadings */}
                          {openSubChapters[subChapter.id] &&
                            subChapter.subHeadings &&
                            subChapter.subHeadings.length > 0 && (
                              <div className="space-y-1">
                                {subChapter.subHeadings.map(
                                  (subHeading: any, index: number) => (
                                    <SubHeadingCard
                                      key={`subheading-${
                                        subHeading.id || index
                                      }`}
                                      subHeading={subHeading}
                                      index={index}
                                    />
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <div className="text-center py-1">
            {data?.resource?.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {data.resource.map((item: any, i: number) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="font-medium hover:no-underline">
                      <div className="flex flex-col ">
                        <p className="text-lg font-medium">
                          Resource for Chapter {i + 1}
                        </p>
                        <p className="text-primeGreen  text-sm">1 Resource</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-3 p-3 border rounded-lg">
                        <div className="flex gap-3 items-center justify-between">
                          <div className="flex gap-3 items-center">
                            <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src="/icons/pdf.svg"
                                width={50}
                                height={50}
                                alt="resource"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-left text-primeGreen font-semibold text-xs ">
                                1 Resource
                              </p>
                              <p className="text-left text-md">{item.title}</p>

                              <p className="text-left font-semibold text-xs">
                                2 Pages
                              </p>
                            </div>
                          </div>
                          <ExternalLinkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-gray-500">Course resources not found.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <div className="text-center py-1">
            {data?.assignment?.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {data.assignment.map((item: any, i: number) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="font-medium hover:no-underline">
                      <div className="flex flex-col ">
                        <p className="text-lg font-medium">
                          Assignments for Chapter {i + 1}
                        </p>
                        <p className="text-primeGreen  text-sm">1 Resource</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-3 p-3 border rounded-lg">
                        <div className="flex gap-3 items-center justify-between">
                          <div className="flex gap-3 items-center">
                            <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src="/icons/pdf.svg"
                                width={50}
                                height={50}
                                alt="resource"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-left text-primeGreen font-semibold text-xs ">
                                1 Resource
                              </p>
                              <p className="text-left text-md">{item.title}</p>

                              <p className="text-left font-semibold text-xs">
                                2 Pages
                              </p>
                            </div>
                          </div>
                          <ExternalLinkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-gray-500">Course resources not found.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <div className="text-left py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Past Questions
            </h3>
            <div
              className="text-gray-500 max-h-[30rem] overflow-y-auto hide-scrollbar p-2 prose prose-sm"
              dangerouslySetInnerHTML={{
                __html:
                  data?.qna || "<p>Past questions will be displayed here.</p>",
              }}
            />
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
