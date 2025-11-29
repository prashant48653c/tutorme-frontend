'use client';

import Image from "next/image";
import {
  Star,
  MapPin,
  Mail,
  GraduationCap,
  Building2,
  CheckCircle,
  Languages,
  BookOpen,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/hooks/axios";
import { useQuery } from "@tanstack/react-query";
import { ParamValue } from "next/dist/server/request/params";

type TutorProfileProps = {
  id: ParamValue;
};

export default function TutorProfile({ id }: TutorProfileProps) {
  const fetchTutor = async () => {
    const res = await api.get(`/tutor/${id}`);
    return res.data.data;
  };

  const { data: tutorData, isLoading } = useQuery({
    queryKey: ["tutorData", id],
    queryFn: fetchTutor,
  });

  if (isLoading) return "Loading";
  if (!tutorData) return null;

  const rating = tutorData?.tutorProfile?.rating || 4.0;
  const followers = tutorData?.tutorProfile?.followers?.length ?? 525;
  const coursesCount = tutorData?.tutorProfile?.courses?.length ?? 4;
  const languages = tutorData?.tutorProfile?.language?.join(", ") || "English, Nepali";
  const session = tutorData?.tutorProfile?.sessions?.[0];
  const availability = session?.duration ?? [];
  const sessionTitle = session?.title || "Python/AI";
  const sessionPrice = session?.price || 300;
  const sessionDescription =
    session?.description ||
    "Python is a very popular language for Artificial Intelligence (AI) and Machine Learning (ML) development due to its clear syntax, extensive ecosystem of libraries, and strong community support.";

  return (
    <section className="w-full flex flex-col gap-6">
      {/* Profile Card */}
      <Card className="w-full border-0 shadow-[0_10px_28px_rgba(15,23,42,0.08)] rounded-[22px]">
        <CardContent className="px-5 sm:px-8 lg:px-10 py-8 w-full">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            <div className="flex items-start gap-5 sm:gap-6 flex-1">
              <div className="relative w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] rounded-full overflow-hidden border border-slate-100 shadow-sm bg-slate-100 mx-auto sm:mx-0">
                <Image
                  src="/static/landing/course.svg"
                  alt="Tutor Profile"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">{tutorData.name}</h1>
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                </div>
                <p className="text-teal-600 font-semibold text-base sm:text-lg">
                  {tutorData.tutorProfile.jobTitle}
                </p>
                <p className="text-slate-600 leading-relaxed max-w-3xl text-sm sm:text-base">
                  {tutorData.bio}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-10 pt-2 text-sm text-slate-700">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-teal-500" />
                    <span className="break-all">{tutorData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-teal-500" />
                    <span className="capitalize">{coursesCount} Courses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-teal-500" />
                    <span className="capitalize">{tutorData.tutorProfile.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Languages className="w-5 h-5 text-teal-500" />
                    <span className="capitalize">{languages}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-teal-500" />
                    <span className="capitalize">
                      {tutorData.tutorProfile.qualifications}, {tutorData.tutorProfile.graduatedFrom}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-teal-500" />
                    <span>{tutorData.tutorProfile.currentOrganization || "Technergy Global Pvt. Ltd."}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6 w-full sm:w-auto justify-center">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div className="text-xl sm:text-2xl font-semibold text-slate-800">{rating.toFixed(1)}</div>
                </div>
                <div className="text-center sm:text-right space-y-1">
                  <div className="text-2xl sm:text-3xl font-semibold text-slate-900">{followers}</div>
                  <div className="text-sm text-teal-600 font-medium">Followers</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <Button className="bg-teal-500 w-full sm:w-32 hover:bg-teal-600 text-white rounded-md font-semibold">
                  Follow
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-400 w-full sm:w-32 bg-white text-slate-700 rounded-md hover:bg-slate-100"
                >
                  Report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Card */}
      <Card className="w-full border-0 shadow-[0_10px_28px_rgba(15,23,42,0.08)] rounded-[22px]">
        <CardContent className="px-5 sm:px-8 lg:px-10 py-8 w-full">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">Get Personal Tutoring</h2>
              <p className="text-teal-600 font-semibold text-lg">{sessionTitle}</p>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <CalendarCheck className="w-5 h-5 text-teal-500" />
                <span>525 Sessions Completed</span>
              </div>
              <p className="text-slate-600 leading-relaxed max-w-3xl text-sm sm:text-base">{sessionDescription}</p>

              <div className="pt-2 space-y-2">
                <p className="text-sm text-green-500 font-semibold">Mostly Available on</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-slate-700">
                  {availability.length
                    ? availability.map(
                        (slot: { day: string; startTime: string; endTime: string }, index: number) => (
                          <p key={index} className="flex items-center gap-2">
                            <span className="font-medium">{slot.day}</span>
                            <span className="text-slate-500">
                              - {slot.startTime} to {slot.endTime}
                            </span>
                          </p>
                        )
                      )
                    : ["Sunday", "Monday", "Tuesday", "Friday"].map((day) => (
                        <p key={day} className="flex items-center gap-2">
                          <span className="font-medium">{day}</span>
                          <span className="text-slate-500">- 10:00 AM to 3:30 PM</span>
                        </p>
                      ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4 w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full sm:w-auto justify-between lg:justify-end">
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div className="text-xl sm:text-2xl font-semibold text-slate-800">{rating.toFixed(1)}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-semibold text-slate-900">Rs. {sessionPrice}</div>
                  <div className="text-sm text-teal-600 mt-1">Per Hour</div>
                </div>
              </div>

              <Button className="bg-teal-500 text-center w-full sm:w-64 hover:bg-teal-600 text-white px-8 rounded-md font-semibold">
                Request a Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
