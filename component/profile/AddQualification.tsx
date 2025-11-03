"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import api from "@/hooks/axios";
import { useAuthStore } from "@/store/useAuthStore";
import useEducationStore from "@/store/useEducationStore";
import { toast } from "sonner";
import Image from "next/image";
import { init } from "next/dist/compiled/webpack/webpack";

interface AddQualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: QualificationData) => void;
}

interface QualificationData {
  qualification: string;
  graduationLocation: string;
  certificate: File | null;
}

export default function AddQualificationModal({
  setStatus,
  initialData,
  refetch
}: {
  setStatus: (status: boolean) => void;
  initialData?:{qualification:string;timePeriod:string;type:string;id:number;institutionName:string,certificationUrl:string} & any;
  refetch:()=>void;

}) {
  console.log(initialData)
  const [qualification, setQualification] = useState(initialData?.qualification ||"");
  const [qualificationPeriod, setQualificationPeriod] = useState(initialData?.type||"");
  const [startRange, setStartRange] = useState(initialData?.timePeriod?.split("-")[0]||"");
  const [endRange, setendRange] = useState(initialData?.timePeriod?.split("-")[1]||"");
const [preview,setPreview]=useState(initialData?.certificationUrl)
  const [graduationLocation, setGraduationLocation] = useState(initialData?.institutionName||"");
  const [certificate, setCertificate] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
const[isLoadingUpdate,setIsLoading]=useState(false)
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setCertificate(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setCertificate(file);
        setPreview(URL.createObjectURL(file))
      }
    }
  };

  const validateFile = (file: File) => {
    const validTypes = ["image/svg+xml", "image/png", "image/jpeg"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert("Please upload SVG, PNG or JPEG files only");
      return false;
    }

    if (file.size > maxSize) {
      alert("File size must be less than 10MB");
      return false;
    }

    return true;
  };
  const user = useAuthStore((state) => state.user);
  console.log(user);

  const setEducation = useEducationStore((state) => state.setEducation);

  const handleSave = async () => {
   setIsLoading(true)
    
    const formData = new FormData();
    formData.append("qualification", qualification);
    formData.append("institutionName", graduationLocation);
   
    formData.append("certificationUrl",  certificate as any);
    formData.append("type", qualificationPeriod);
    formData.append("timePeriod", `${startRange+"-"+endRange}`);
    if(initialData.id)
    formData.append("id",initialData?.id);

    try {
      const id = user?.id;
      const res = await api.patch(`/auth/tutor/edu/${id}`, formData);
      console.log("Successfully updated:", res.data);

      // Optional: Reset form and close modal
      refetch()
      setQualification("");
      setGraduationLocation("");
      setCertificate(null);
      toast.success("Qualification changed succesfully!")
      setStatus(false)
      
    } catch (error:any) {
      console.error("Error uploading education:", error);
      toast.error(error.response.data.message || "Failed to upload qualification.");
    }finally{
      setIsLoading(false)
    }
  };

  const handleCancel = () => {
    // Reset form
    setQualification("");
    setGraduationLocation("");
    setCertificate(null);
    setStatus(false);
  };

  useEffect(()=>{
    if(initialData?.certificationUrl){
      console.log(initialData.certificationUrl)
      setPreview(initialData?.certificationUrl)
    }
  },[initialData?.certificationUrl])

  return (
    <div>
      <div className="    bg-white rounded-2xl w-full p-6">
        <div>
          <h3 className="text-2xl text-black font-semibold mb-2">
            Add Qualification
          </h3>
        </div>
        <div className="space-y-6">
          {/* Qualification and Graduation Location */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Qualification
              </Label>
              <Select value={qualification} onValueChange={setQualification}>
                <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Select Qualification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="high-school">High School</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Where did you Graduate From?
              </Label>
              <Input
                placeholder="Enter institution name"
                value={graduationLocation}
                onChange={(e) => setGraduationLocation(e.target.value)}
                className="bg-gray-50 border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Qualification
              </Label>
              <Select
                value={qualificationPeriod}
                onValueChange={setQualificationPeriod}
              >
                <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Select duration type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_TIME">Full Time</SelectItem>
                  <SelectItem value="PART_TIME">Part Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Select time range
              </Label>
              <div className="grid grid-cols-2">
                <Select value={startRange} onValueChange={setStartRange}>
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Start Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 2030 - 2000 + 1 }, (_, i) => {
                      const year = 2030 - i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Select value={endRange} onValueChange={setendRange}>
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                    <SelectValue placeholder="End Year" />
                  </SelectTrigger>
                  <SelectContent>
                     {Array.from({ length: 2030 - 2000 + 1 }, (_, i) => {
                      const year = 2030 - i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Qualification Certificate
            </Label>
            <div
              className={`border-2 border-dashed rounded-lg p-2 text-center transition-colors ${
                dragActive
                  ? "border-teal-500 bg-teal-50"
                  : certificate
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="certificate-upload"
                className="hidden"
                accept=".svg,.png,.jpg,.jpeg"
                onChange={handleFileChange}
              />

              <div className="flex flex-col items-center space-y-1">
               

                {preview ? (
                  <div className="text-center">
                  <Image src={preview} alt="preview" width={400}  height={100} className="mx-auto rounded-lg h-[120px] w-[20rem] mb-2"/>
                  </div>
                ) : (
                  <div className="text-center">
                     <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-teal-600" />
                </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Upload your Marksheet/Certificate
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG or JPEG (Less than 10 MB)
                    </p>
                  </div>
                )}

                <label
                  htmlFor="certificate-upload"
                  className="text-teal-600 text-sm font-medium cursor-pointer hover:text-teal-700"
                >
                  {certificate ? "Change file" : "Browse files"}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={handleCancel} className="px-6">
            Cancel
          </Button>
          <Button
          disabled={isLoadingUpdate}
            onClick={handleSave}
            className="bg-teal-500 hover:bg-teal-600 px-6"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
