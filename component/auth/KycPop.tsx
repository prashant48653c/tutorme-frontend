"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                isActive || isCompleted ? "bg-teal-500" : "bg-gray-300"
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div className="w-12 h-0.5 bg-gray-300 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface LanguageTagProps {
  language: string;
  onRemove: () => void;
}

function LanguageTag({ language, onRemove }: LanguageTagProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-teal-500 text-teal-500 rounded-full text-sm">
      {language}
      <button
        onClick={onRemove}
        className="hover:bg-teal-50 rounded-full p-0.5"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function KYCVerificationModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [languages, setLanguages] = useState(["English", "Nepali"]);
  const [chequeImage, setChequeImage] = useState(null);

  const handleChequeUpload = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setChequeImage(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      // Step 1
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Personal Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="First Name" className="bg-gray-50 border-0" />
              <Input placeholder="Last Name" className="bg-gray-50 border-0" />
            </div>

            <Input placeholder="Email" className="bg-gray-50 border-0 w-full" />
            <Input
              placeholder="Phone Number"
              className="bg-gray-50 border-0 w-full"
            />
            <Input
              placeholder="Location"
              className="bg-gray-50 border-0 w-full"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Languages
              </label>
              <div className="border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2">
                {languages.map((lang, index) => (
                  <LanguageTag
                    key={index}
                    language={lang}
                    onRemove={() => removeLanguage(index)}
                  />
                ))}
                <input
                  type="text"
                  placeholder="Type language and press Enter"
                  className="flex-grow min-w-[150px] p-1 outline-none text-sm"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && languageInput.trim()) {
                      e.preventDefault();
                      addLanguage();
                    }
                  }}
                />
              </div>
            </div>
          </div>
        );

      // Step 2
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Payment Details
            </h3>

            <Input
              placeholder="Bank Name"
              className="bg-gray-50 border-0 w-full"
            />
            <Input
              placeholder="Bank Account Number"
              className="bg-gray-50 border-0 w-full"
            />
            <Input
              placeholder="Confirm Bank Account Number"
              className="bg-gray-50 border-0 w-full"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Cheque
              </label>
              <div
                className="relative w-full border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center text-center text-gray-500 cursor-pointer hover:border-teal-400 transition-colors overflow-hidden"
                onClick={() => document.getElementById("chequeInput")?.click()}
              >
                {chequeImage ? (
                  <>
                    <img
                      src={URL.createObjectURL(chequeImage)}
                      alt="Cheque Preview"
                      className="object-contain h-full w-full"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChequeImage(null);
                      }}
                      className="absolute top-2 right-2 bg-white text-red-500 rounded-full shadow p-1 hover:bg-red-100"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <UploadCloud size={32} className="mb-2" />
                    <span className="text-sm">Upload your cheque image</span>
                  </>
                )}

                <input
                  id="chequeInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChequeUpload}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Qualification Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm mb-1 text-gray-700">
                  Qualification
                </Label>
                <Select>
                  <SelectTrigger className="bg-gray-50  w-full border-0">
                    <SelectValue placeholder="Select Qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelors">Bachelor’s Degree</SelectItem>
                    <SelectItem value="masters">Master’s Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm mb-1 text-gray-700">
                  Where did you Graduate From?
                </Label>

                <Input
                  placeholder="Your institution's name"
                  className="bg-gray-50 border-0"
                />
              </div>

              <div>
                <Label className="text-sm mb-1 text-gray-700">
                  What do you do?
                </Label>

                <Input
                  placeholder="Your Designation"
                  className="bg-gray-50 border-0"
                />
              </div>

              <div>
                <Label className="text-sm mb-1 text-gray-700">
                  Work Experience?
                </Label>
                <Select>
                  <SelectTrigger className="bg-gray-50 border-0">
                    <SelectValue placeholder="Experience in Years" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(41)].map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i} {i === 1 ? "year" : "years"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-start gap-6">
                <Label className="text-sm  text-gray-700">
                  Are you currently working?
                </Label>

                <div className="flex items-center w-full gap-4">
                  <label className="flex items-center gap-1 text-sm text-gray-800">
                    <input
                      type="radio"
                      name="working"
                      value="yes"
                      className="accent-teal-500"
                      defaultChecked
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-1 text-sm text-gray-800">
                    <input
                      type="radio"
                      name="working"
                      value="no"
                      className="accent-teal-500"
                    />
                    No
                  </label>
                </div>
              </div>
              <div>
                <Label className="text-sm mb-1 text-gray-700">
                  If yes, where?
                </Label>
                <Input
                  placeholder="Workplace’s Name"
                  className="bg-gray-50 border-0"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-sm mb-1 text-gray-700">
                  Which grade students did you previously teach?
                </Label>

                <Select>
                  <SelectTrigger className="bg-gray-50 border-0 w-full">
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary (1st–5th)</SelectItem>
                    <SelectItem value="middle">Middle (6th–8th)</SelectItem>
                    <SelectItem value="high">High School (9th–12th)</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
         <div className="space-y-6">
      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identification Certificate */}
        <UploadCard
          title="Identification Certificate"
          description="Upload your Citizenship"
        />

        {/* Qualification Certificate */}
        <UploadCard
          title="Qualification Certificate"
          description="Upload your latest Marksheet"
        />
      </div>

      {/* Experience Letter */}
      <UploadCard
        title="Experience Letter"
        description="Upload your Experience Letter"
        fullWidth
      />

      {/* Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox className="border border-black" id="confirm" />
        <Label htmlFor="confirm" className="text-sm">
          Mark all the given Information Correct
        </Label>
      </div>
    </div>
        );
      default:
        return null;
    }
  };

  const [languageInput, setLanguageInput] = useState("");

  const addLanguage = () => {
    const trimmed = languageInput.trim();
    if (trimmed && !languages.includes(trimmed)) {
      setLanguages([...languages, trimmed]);
    }
    setLanguageInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Button onClick={() => setIsOpen(true)} className="mb-4">
        Open KYC Verification
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] w-full max-w-[95vw] md:max-w-[60rem] overflow-y-auto p-0 gap-0">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Illustration */}
            <div className="w-full md:w-1/3 p-4 md:p-6">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-6 h-64 md:h-full flex items-center justify-center border-2 border-blue-300">
                <div className="relative w-full h-full max-h-64 md:max-h-full">
                  <Image
                    src="/static/landing/hero1.svg"
                    alt="KYC Verification Illustration"
                    height={400}
                    width={300}
                    className="object-contain mx-auto"
                  />
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full md:w-2/3 p-4 md:p-8">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  KYC Verification
                </h2>
                <p className="text-teal-500 font-medium">
                  {"Let's get you Verified."}
                </p>
              </div>

              <StepIndicator currentStep={currentStep} totalSteps={4} />

              <div className="mb-6 md:mb-8">{renderStepContent()}</div>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="w-full sm:w-auto px-6"
                >
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                   
                  className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 px-6"
                >
                  {currentStep === 4 ? "Submit" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


 

function UploadCard({
  title,
  description,
  fullWidth = false,
}: {
  title: string
  description: string
  fullWidth?: boolean
}) {
  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      <h3 className="mb-2 text-base font-medium">{title}</h3>
      <div className="rounded-lg border border-dashed border-blue-300 bg-blue-50 p-6 text-center">
       <Image src={"/static/icons/upload.svg"} alt="Upload Icon" width={30} height={30} className="mx-auto mb-4" />
        <p className="">{description}</p>
        <p className="text-xs mt-2 text-blue-500">
          SVG, PNG or JPEG (Less than 10 MB)
        </p>
      </div>
    </div>
  )
}
