'use client';
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
import api from "@/hooks/axios";
import { useQuery } from "@tanstack/react-query";

export default function TutorProfile({id}:{id:string}) {

  const fetchTutor=async()=>{
try {
  const iud=22;
  const res=await api.get(`/tutor/${id}`);
  console.log(res)
  return res.data.data
} catch (error) {
  console.log(error)
   throw error; 
}
  }

  const {data:tutorData,isLoading,refetch}=useQuery({
    queryKey:["tutorData"],
    queryFn:fetchTutor,
    
  })
  if(isLoading){
    return "Loading"
  }
  console.log(tutorData)
  const session=tutorData.tutorProfile.sessions[0];
  return (
   <section className="w-full flex flex-col gap-5">
    <Card className="w-full p-0 pt-8 mb-10 ">


      <CardContent className="px-6 w-full ">
        
        <div className="flex    w-full   gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0 ">
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
          <div className="   w-full">
            <div className="flex  items-center justify-end gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                  {tutorData.name}
                  </h1>
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                </div>

                <p className="text-teal-600 font-medium mb-3">                  {tutorData.tutorProfile.jobTitle}
</p>

                <p className="text-gray-600 max-w-[80%] text-sm mb-4 leading-relaxed">
                                   {tutorData.bio}

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
                  <div className="text-2xl mb-3 text-gray-600">
                    {tutorData.tutorProfile.rating}
                  </div>
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
              <span>{tutorData.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-teal-500" />
              <span>{tutorData.tutorProfile.address}</span>
            </div>
          </div>

          {/* Education & Company */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <GraduationCap className="w-4 h-4 capitalize text-teal-500" />
              <span className="capitalize">{tutorData.tutorProfile.qualifications}, {tutorData.tutorProfile.graduatedFrom}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4 text-teal-500" />
              <span>{tutorData.tutorProfile.currentOrganization || "None"}</span>
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
              <span>{tutorData.tutorProfile.language.join(", ")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="w-full p-0 pt-8 mb-10 ">
      <CardContent className="px-6">
        <div className="flex w-full ">
        

          {/* Profile Info */}
          <div className="flex   w-full">
            <div className="flex items-center w-full   justify-between">
              <div className="">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Get Personal Tutoring
                  </h1>
                   
                </div>

                <p className="text-teal-600 font-medium mb-3">{"AI/ML"}</p>
                <p className="text-gray-700 font-medium mb-3">234 Sessions Completed</p>

                <p className="text-gray-600 max-w-[90%] text-sm mb-4 leading-relaxed">
                 {session.description}
                </p>
              </div>

              {/* Rating & Actions */}
              <div className="flex flex-col items-center">
<div className="flex  justify-center items-center md:items-end gap-4">
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
                 
                </div>
                </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3 font-semibold text-gray-900">Rs {session.price}</div>
                    <div className="text-sm text-green-400 mb-3 ">Per Hour</div>
                 
                  </div>
</div>
              
                   <Button className="bg-teal-500 text-center
                      w-[20rem] hover:bg-teal-600 text-white px-6">
                    Request a Session
                  </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex text-gray-500  text-sm justify-between flex-col items-start my-3">
          <p className="text-sm text-green-400 mb-2">Mostly available on:</p>
          {
            session.duration.map((slot:{day: string, startTime: string, endTime: string},index:number)=>{
              return (
                <p key={index}> <span>{slot.day} - </span> {slot.startTime} to {slot.endTime} </p>
              )
            })
          }
         

         
        </div>
      </CardContent>
    </Card>
   </section>
  );
}
