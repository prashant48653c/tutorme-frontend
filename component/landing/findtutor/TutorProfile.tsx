import Image from "next/image";
import {
  Star,
  MapPin,
  Mail,
  GraduationCap,
  Building2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TutorProfile() {
  return (
    <Card className="w-full p-0 pt-8 mb-10 ">
      <CardContent className="px-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="relative w-[120px] h-[120px]">
              <Image
                src="/static/landing/course.svg"
                alt="Tutor Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Sandesh Sapkota
                  </h1>
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                </div>

                <p className="text-teal-600 font-medium mb-3">UI/UX Designer</p>

                <p className="text-gray-600 max-w-[80%] text-sm mb-4 leading-relaxed">
                  Creative and detail-oriented UI/UX designer with over 5 years
                  of experience in creating intuitive, user-centered designs.
                  With a strong background in both visual design and user
                  experience.
                </p>
              </div>

              {/* Rating & Actions */}
              <div className="flex justify-center items-center md:items-end gap-4">

                <div className="text-center ">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[1, 2, 3, 4].map((star) => (
                      <Star
                        key={star}
                        className="w-6 h-6 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <Star className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div className="text-2xl mb-3 text-gray-600">4.0</div>
 <div className="flex justify-center gap-2">
                  <Button className="bg-teal-500 text-center
                      w-[10rem] hover:bg-teal-600 text-white px-6">
                    Follow
                  </Button>
                </div>
                </div>
                
               


                  <div className="text-center">
                    <div className="text-3xl mb-3 font-semibold text-gray-900">525</div>
                    <div className="text-sm mb-3 text-gray-500">Followers</div>
                    <Button
                      variant="outline"
                      className="border-gray-300 text-center
                      w-[10rem] bg-transparent"
                    >
                      Report
                    </Button>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center my-5">
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-teal-500" />
              <span>sandesh@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-teal-500" />
              <span>Bangladesh</span>
            </div>
          </div>

          {/* Education & Company */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <GraduationCap className="w-4 h-4 text-teal-500" />
              <span>MSE, ABC University</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4 text-teal-500" />
              <span>Technology Global Pvt. Ltd.</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <GraduationCap className="w-4 h-4 text-teal-500" />
              <span>Technologia</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4 text-teal-500" />
              <span>Nepali, English</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
