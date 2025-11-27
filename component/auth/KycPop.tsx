"use client";

import { useEffect, useReducer, useState } from "react";
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
import { toast } from "react-hot-toast";
import { ToastBar } from "react-hot-toast";
import api from "@/hooks/axios";
import { useAuthStore } from "@/store/useAuthStore";
import Radio from "@/component/reusable/Radio";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  languages: string[];
  bankName: string;
  bankAccount: string;
  confirmAccount: string;
  chequeImage: File | null;
  qualification: string;
  graduationPlace: string;
  designation: string;
  experienceYears: string;
  currentlyWorking: string;
  workplace: string;
  graduationYear:string;
  gradesTaught: string;
  identificationCert: File | null;
  qualificationCert: File | null;
  experienceLetter: File | null;
  confirmCorrect: boolean;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  graduationYear:" ",
  location: "",
  languages: ["English", "Nepali"],
  bankName: "",
  bankAccount: "",
  confirmAccount: "",
  chequeImage: null,
  qualification: "",
  graduationPlace: "",
  designation: "",
  experienceYears: "",
  currentlyWorking: "yes",
  workplace: "",
  gradesTaught: "",
  identificationCert: null,
  qualificationCert: null,
  experienceLetter: null,
  confirmCorrect: false,
};

type Action =
  | { type: "SET_FIELD"; field: keyof FormState; value: any }
  | { type: "ADD_LANGUAGE"; language: string }
  | { type: "REMOVE_LANGUAGE"; index: number };

function formReducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "ADD_LANGUAGE":
      if (
        action.language.trim() &&
        !state.languages.includes(action.language)
      ) {
        return { ...state, languages: [...state.languages, action.language] };
      }
      return state;
    case "REMOVE_LANGUAGE":
      return {
        ...state,
        languages: state.languages.filter((_, i) => i !== action.index),
      };
    default:
      return state;
  }
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
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                isActive || isCompleted ? "bg-teal-500" : "bg-gray-300"
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div className="w-12 mx-2">
                <div className="h-[2px] w-full bg-gray-300 rounded" />
              </div>
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
  const user = useAuthStore((state) => state.user);

  const [isOpen, setIsOpen] = useState(user?.tutorProfile ? false : true);
  const [currentStep, setCurrentStep] = useState(1);
  const [languageInput, setLanguageInput] = useState("");
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [loading,setLoading]=useState(false);
  const removeLanguage = (index: number) => {
    dispatch({ type: "REMOVE_LANGUAGE", index });
  };
const setUser=useAuthStore((state)=>state.setUser);
  const handleSubmit = async () => {
    if (state.confirmAccount !== state.bankAccount) {
      toast.error("Bank account numbers do not match.");
      return;
    }
    setLoading(true);
    const formData = new FormData();

    // Basic Information
    if(user){
    formData.append("name", user.name);
    formData.append("email", state.email);
    formData.append("phoneNumber", state.phone);
     }

    formData.append("address", state.location);
    formData.append("language", JSON.stringify(state.languages));

    // Payment Details
    formData.append("bankName", state.bankName);
    formData.append("bankAccountNumber", state.bankAccount);

    // Qualification Details
    formData.append("qualifications", state.qualification);
    formData.append("graduatedFrom", state.graduationPlace);
    formData.append("jobTitle", state.designation);
    formData.append("workingExperienceYear", state.experienceYears);
    formData.append("currentlyWorking", state.currentlyWorking);
    formData.append("currentOrganization", state.workplace);
    formData.append("gradesTaught", state.gradesTaught);
    formData.append("graduatedAt", state.graduationYear);

    
    // File uploads
    if (state.chequeImage) {
      formData.append("chequeImage", state.chequeImage);
    }
    if (state.identificationCert) {
      formData.append("identificationCert", state.identificationCert);
    }
    if (state.qualificationCert) {
      formData.append("qualificationCert", state.qualificationCert);
    }
    if (state.experienceLetter) {
      formData.append("experienceLetter", state.experienceLetter);
    }
    const id = user?.id.toString();
    if(id)
    formData.append("userId",id);
  try {
     const res = await api.post(`/auth/tutor/kyc`, formData);
    console.log(res.data);
    setUser(res.data.profile)
    // Show success message
    toast.success("Form submitted successfully! ");
 
  } catch (error) {
    console.log(error)
    toast.success("Something went wrong");
    
  }finally{
    setLoading(false)
  }
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
              <Input
                placeholder="First Name"
                readOnly
                className="bg-[#F5F7F9] border-0 w-full h-11 rounded-xl"
                value={user?.name.split(" ")[0]}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "firstName",
                    value: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Last Name"

              value={user?.name.split(" ")[1]}
                readOnly
                className="bg-[#F5F7F9] border-0 w-full h-11 rounded-xl"
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "lastName",
                    value: e.target.value,
                  })
                }
              />
            </div>

            <Input
              placeholder="Email"
              className="bg-[#F5F7F9] border-0 w-full h-11 rounded-xl"
              value={user?.email}
              readOnly
              onChange={(e) =>
                
                dispatch({
                  type: "SET_FIELD",
                  field: "email",
                  value: e.target.value,
                })
              }
            />
            <Input
              placeholder="Phone number"
              className="bg-[#F5F7F9] border-0 w-full h-11 rounded-xl"
              value={user?.phoneNumber}
              readOnly
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "phone",
                  value: e.target.value,
                })
              }
            />

            <Input
              placeholder="Location"
              className="bg-[#F5F7F9] border-0 w-full h-11 rounded-xl"
              value={state.location}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "location",
                  value: e.target.value,
                })
              }
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Languages
              </label>
              <div className="border border-gray-200 bg-[#F5F7F9] rounded-xl p-2 flex flex-wrap gap-2">
                {state.languages.map((lang, index) => (
                  <LanguageTag
                    key={index}
                    language={lang}
                    onRemove={() => removeLanguage(index)}
                  />
                ))}
                <input
                  type="text"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && languageInput.trim()) {
                      e.preventDefault();
                      dispatch({
                        type: "ADD_LANGUAGE",
                        language: languageInput.trim(),
                      });
                      setLanguageInput("");
                    }
                  }}
                  placeholder="Add Language"
                  className="flex-1 border-none outline-none bg-transparent min-w-[120px]"
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
              className="bg-[#F5F7F9] border-0 w-full h-11 rounded-xl"
              value={state.bankName}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "bankName",
                  value: e.target.value,
                })
              }
            />

            <Input
              placeholder="Bank Account Number"
              className="bg-[#F5F7F9] border-0 w-full h-11 rounded-xl"
              value={state.bankAccount}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "bankAccount",
                  value: e.target.value,
                })
              }
            />

            <Input
              placeholder="Confirm Bank Account"
              className="bg-[#F5F7F9] border-0 w-full h-11 rounded-xl"
              value={state.confirmAccount}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "confirmAccount",
                  value: e.target.value,
                })
              }
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Cheque
              </label>
              <div
                className="relative w-full border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center text-center text-gray-500 cursor-pointer hover:border-teal-400 transition-colors overflow-hidden"
                onClick={() => document.getElementById("chequeInput")?.click()}
              >
                {state.chequeImage ? (
                  <>
                    <img
                      src={URL.createObjectURL(state.chequeImage)}
                      alt="Cheque Preview"
                      className="object-contain h-full w-full"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({
                          type: "SET_FIELD",
                          field: "chequeImage",
                          value: null,
                        });
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.type.startsWith("image/")) {
                      dispatch({
                        type: "SET_FIELD",
                        field: "chequeImage",
                        value: file,
                      });
                    } else {
                      toast.error("Please upload a valid image file.");
                    }
                  }}
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
                <Select
                  value={state.qualification}
                  onValueChange={(value) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "qualification",
                      value,
                    })
                  }
                >
                  <SelectTrigger className="bg-[#F5F7F9] w-full border-0 h-11 rounded-xl">
                    <SelectValue placeholder="Select Qualification" />
                  </SelectTrigger>
                  <SelectContent >
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>


             <div>
  <Label className="text-sm mb-1 text-gray-700">
    Graduation Year
  </Label>
  <Select
  
    value={state.graduationYear}
    onValueChange={(value) =>
      dispatch({
        type: "SET_FIELD",
        field: "graduationYear",
        value,
      })
    }
  >
    <SelectTrigger className="bg-[#F5F7F9] border-0 h-11 rounded-xl">
      <SelectValue placeholder="Select Year" />
    </SelectTrigger>
    <SelectContent>
      {Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2000 + i).map((year) => (
        <SelectItem key={year} value={year.toString()}>
          {year}
        </SelectItem>
      ))}
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
                  value={state.graduationPlace}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "graduationPlace",
                      value: e.target.value,
                    })
                  }
                />
              </div>

              

              <div>
                <Label className="text-sm mb-1 text-gray-700">
                  What do you do?
                </Label>
                <Input
                  placeholder="Your Designation"
                  className="bg-gray-50 border-0"
                  value={state.designation}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "designation",
                      value: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label className="text-sm mb-1 text-gray-700">
                  Work Experience?
                </Label>
                <Select
                  value={state.experienceYears}
                  onValueChange={(value) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "experienceYears",
                      value,
                    })
                  }
                >
                  <SelectTrigger className="bg-[#F5F7F9] border-0 h-11 rounded-xl">
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
                <Radio
                  name="working"
                  value={state.currentlyWorking}
                  onChange={(val) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "currentlyWorking",
                      value: val,
                    })
                  }
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                />
              </div>

              <div>
                <Label className="text-sm mb-1 text-gray-700">
                  If yes, where?
                </Label>
                <Input
                  placeholder="Workplace's Name"
                  className="bg-gray-50 border-0"
                  value={state.workplace}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "workplace",
                      value: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-span-2">
                <Label className="text-sm mb-1 text-gray-700">
                  Which grade students did you previously teach?
                </Label>
                <Select
                  value={state.gradesTaught}
                  onValueChange={(value) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "gradesTaught",
                      value,
                    })
                  }
                >
                  <SelectTrigger className="bg-[#F5F7F9] border-0 w-full h-11 rounded-xl">
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
                file={state.identificationCert}
                onFileChange={(file) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "identificationCert",
                    value: file,
                  })
                }
              />

              {/* Qualification Certificate */}
              <UploadCard
                title="Qualification Certificate"
                description="Upload your latest Marksheet"
                file={state.qualificationCert}
                onFileChange={(file) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "qualificationCert",
                    value: file,
                  })
                }
              />
            </div>

            {/* Experience Letter */}
            <UploadCard
              title="Experience Letter"
              description="Upload your Experience Letter"
              file={state.experienceLetter}
              onFileChange={(file) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "experienceLetter",
                  value: file,
                })
              }
              fullWidth
            />

            {/* Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                className="border border-black"
                id="confirm"
                checked={state.confirmCorrect}
                onCheckedChange={(checked) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "confirmCorrect",
                    value: checked,
                  })
                }
              />
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] w-full max-w-[95vw] md:max-w-[60rem] overflow-y-auto p-0 gap-0 rounded-2xl no-scrollbar">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Illustration */}
            <div className="w-full md:w-1/3 p-4 md:p-6">
              <div className="rounded-2xl h-64 md:h-full flex items-center justify-center border border-gray-200 bg-white rounded-3xl">
                <div className="relative w-[100%] h-[100%]">
                  <Image src="/static/landing/Sign Up Image.svg" alt="KYC Illustration" fill className="object-cover rounded-3xl" />
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
                  disabled={
                    (loading) ||
                    (currentStep === 4 && !state.confirmCorrect)
                  }
                  onClick={currentStep === 4 ? handleSubmit : nextStep}
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
  file,
  onFileChange,
  fullWidth = false,
}: {
  title: string;
  description: string;
  file?: File | null;
  onFileChange: (file: File | null) => void;
  fullWidth?: boolean;
}) {
  const inputId = `upload-${title.replace(/\s+/g, "-").toLowerCase()}`;
const [previewUrl, setPreviewUrl] = useState<string | null>(null);

useEffect(() => {
  if (file) {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url); // Clean up when component unmounts or file changes
    };
  } else {
    setPreviewUrl(null);
  }
}, [file]);

  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      <h3 className="mb-2 text-base font-medium">{title}</h3>
      <div
        className="rounded-lg border border-dashed border-blue-300 bg-blue-50 p-6 text-center cursor-pointer hover:border-blue-400 transition-colors relative"
        onClick={() => document.getElementById(inputId)?.click()}
      >
        {file ? (
          <>
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
            </div>
       {previewUrl && file.type.startsWith("image/") && (
  <img
    src={previewUrl}
    alt="Preview"
    className="max-h-40 mx-auto mt-2 rounded border"
  />
)}

{previewUrl && file.type === "application/pdf" && (
  <iframe
    src={previewUrl}
    title="PDF Preview"
    className="w-full h-40 mt-2 border rounded"
  />
)}

<p className="font-medium text-blue-700 mt-2">{file.name}</p>
<p className="text-xs text-blue-500">
  {(file.size / 1024 / 1024).toFixed(2)} MB
</p>


            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
              }}
              className="absolute top-2 right-2 bg-white text-red-500 rounded-full shadow p-1 hover:bg-red-100"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <div className="w-8 h-8 bg-blue-500 rounded mx-auto mb-4 flex items-center justify-center text-white">
              ↑
            </div>
            <p className="">{description}</p>
            <p className="text-xs mt-2 text-blue-500">
              SVG, PNG or JPEG (Less than 10 MB)
            </p>
          </>
        )}

        <input
          id={inputId}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error("File size should be less than 10 MB");
                return;
              }
              onFileChange(selectedFile);
            }
          }}
        />
      </div>
    </div>
  );
}
