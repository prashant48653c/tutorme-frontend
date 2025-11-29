"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/hooks/axios";
import { checkKhaltiPayment } from "@/hooks/khalti";
import { useAuthStore } from "@/store/useAuthStore";

export default function CourseInterface() {
  const params = useParams();
  const id = params?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      const res = await api.get(`/course/${id}`);
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

  useEffect(() => {
    if (pidx && user?.studentProfile?.id) {
      checkKhaltiPayment({
        studentProfileId: user?.studentProfile?.id,
        courseId: id,
        pidx,
      });
    }
  }, [pidx, user, id]);

  const SubHeadingCard = ({
    subHeading,
    index,
  }: {
    subHeading: any;
    index: number;
  }) => (
    <div className="ml-12 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-200 to-teal-100 flex items-center justify-center flex-shrink-0">
        <Play
          onClick={() => router.push(`/student/course/${id}/active`)}
          className="w-4 h-4 text-white drop-shadow"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">Subheading {index + 1}</p>
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {subHeading.title}
        </h4>
        {subHeading.duration && (
          <div className="flex items-center gap-1 text-xs text-teal-500 mt-1">
            <Clock className="w-3 h-3" />
            <span>{subHeading.duration}</span>
          </div>
        )}
      </div>
      {subHeading.hasExternalLink && (
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </Button>
      )}
    </div>
  );

  const ChapterCard = ({
    chapter,
    depth = 0,
  }: {
    chapter: any;
    depth?: number;
  }) => {
    const hasSubChapters =
      depth === 0 && chapter.subChapters && chapter.subChapters.length > 0;
    const hasSubHeadings =
      depth === 1 && chapter.subHeadings && chapter.subHeadings.length > 0;
    const isOpen =
      depth === 0 ? openChapters[chapter.id] : openSubChapters[chapter.id];
    const toggle =
      depth === 0
        ? () => toggleChapter(chapter.id)
        : () => toggleSubChapter(chapter.id);
    const durationLabel = chapter.duration
      ? `${chapter.duration} ${chapter.durationUnit || ""}`
      : null;

    return (
      <div className={`${depth > 0 ? "ml-6" : ""} space-y-2`}>
        <div
          className={`flex items-center gap-3 rounded-2xl border border-gray-100 ${
            depth === 0 ? "bg-gray-50" : "bg-white"
          } p-4 shadow-sm`}
        >
          <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-teal-100 to-white">
            <Image
              src={
                chapter.thumbnail ||
                data?.thumbnail ||
                "/static/landing/course.svg"
              }
              alt={chapter.title || "Chapter"}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">
              {depth === 0 ? "Chapter" : "Subchapter"} {chapter.id}
            </p>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
              {chapter.title}
            </h3>
            {durationLabel && (
              <div className="flex items-center gap-1 text-xs font-semibold text-teal-500 mt-1">
                <Clock className="w-3 h-3" />
                <span>{durationLabel}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {chapter.hasExternalLink && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-teal-50"
              >
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </Button>
            )}
            {chapter.isLocked && <Lock className="w-4 h-4 text-gray-400" />}
            {(hasSubChapters || hasSubHeadings) && (
              <button
                onClick={toggle}
                className="flex items-center justify-center h-8 w-8 rounded-full border border-teal-100 text-teal-500 hover:bg-teal-50 transition"
              >
                {isOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {hasSubChapters && isOpen && (
          <div className="space-y-3">
            {chapter.subChapters.map((subChapter: any) => (
              <ChapterCard
                key={`sub-${subChapter.id}`}
                chapter={subChapter}
                depth={1}
              />
            ))}
          </div>
        )}

        {hasSubHeadings && isOpen && (
          <div className="space-y-2">
            {chapter.subHeadings.map((subHeading: any, index: number) => (
              <SubHeadingCard
                key={`subheading-${subHeading.id || index}`}
                subHeading={subHeading}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return "Loading";
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-gray-100 bg-white p-4 md:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3]">
              <Image
                src={data?.thumbnail || "/static/landing/course.svg"}
                alt="Course Thumbnail"
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
                <Image
                  src={
                    data?.tutor?.user?.profilePicture ||
                    "/static/landing/course.svg"
                  }
                  alt={data?.tutor?.user?.name || "Tutor"}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">
                    {data?.tutor?.user?.name || "Tutor"}
                  </span>
                  <CheckCircle className="w-4 h-4 text-teal-500" />
                </div>
                <span className="text-sm text-gray-500">
                  {data?.tutor?.jobTitle || "Instructor"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {data?.title}
                </h1>
                <span className="text-lg font-semibold text-teal-500">
                  NRs. {data?.price || data?.amount || data?.cost || "�"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-gray-600">5.0 (120+)</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed max-h-[10rem] overflow-y-auto pr-1">
              {data?.description ||
                "Apply your new skills to real-world projects using the latest industry tools & techniques. Get job-ready for high-growth fields."}
            </p>

            <div className="flex flex-wrap gap-2">
              {data?.tags?.map((item: string, i: number) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="bg-teal-50 text-teal-600 border-teal-200"
                >
                  {item}
                </Badge>
              ))}
            </div>



            <Button
              onClick={() => handleEnroll(data?.id)}
              className="bg-teal-500 w-full hover:bg-teal-600 text-white font-semibold"
            >
              Enroll Course
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-500" />
                <span>{data?.chapters?.length || 0} Chapters</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-500" />
                <span>{data?.courseDepth || "Intermediate"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-500" />
                <span>
                  {data?.duration || 0} {data?.durationUnit || "minutes"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="chapters" className="w-full">
        <TabsList className="grid w-full grid-cols-5 rounded-2xl border border-gray-100 bg-white shadow-sm p-1">
          <TabsTrigger
            value="chapters"
            className="rounded-xl data-[state=active]:bg-teal-50 data-[state=active]:text-teal-600 data-[state=active]:shadow-sm"
          >
            All Chapters ({data?.chapters?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="rounded-xl data-[state=active]:bg-teal-50 data-[state=active]:text-teal-600 data-[state=active]:shadow-sm"
          >
            Resources
          </TabsTrigger>
          <TabsTrigger
            value="assignments"
            className="rounded-xl data-[state=active]:bg-teal-50 data-[state=active]:text-teal-600 data-[state=active]:shadow-sm"
          >
            Assignments
          </TabsTrigger>
          <TabsTrigger
            value="questions"
            className="rounded-xl data-[state=active]:bg-teal-50 data-[state=active]:text-teal-600 data-[state=active]:shadow-sm"
          >
            Past Questions
          </TabsTrigger>
          <TabsTrigger
            value="classes"
            className="rounded-xl data-[state=active]:bg-teal-50 data-[state=active]:text-teal-600 data-[state=active]:shadow-sm"
          >
            Classes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chapters" className="mt-4">
          <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-3 md:p-4 space-y-3">
            {data?.chapters?.length ? (
              data.chapters.map((chapter: any) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))
            ) : (
              <p className="text-gray-500 text-sm px-2">No chapters found.</p>
            )}
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
