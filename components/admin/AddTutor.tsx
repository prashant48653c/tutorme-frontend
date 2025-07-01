"use client"

import type React from "react"

import { useReducer, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Upload } from "lucide-react"

interface TutorState {
  personalDetails: {
    firstName: string
    lastName: string
    email: string
    phoneNo: string
    address: string
    languages: string[]
  }
  paymentDetails: {
    bankName: string
    bankAccountNo: string
    confirmBankAccountNo: string
  }
  qualificationDetails: {
    qualification: string
    graduateFrom: string
    graduationYear: string
    currentWork: string
    workingExperience: string
    previousGrades: string
    currentlyWorking: boolean
    workplaceName: string
  }
  documents: {
    identificationCertificate: File | null
    qualificationCertificate: File | null
    experienceLetter: File | null
    accountVerification: File | null
  }
  isInformationCorrect: boolean
}

type TutorAction =
  | { type: "UPDATE_PERSONAL"; field: string; value: string }
  | { type: "ADD_LANGUAGE"; language: string }
  | { type: "REMOVE_LANGUAGE"; language: string }
  | { type: "UPDATE_PAYMENT"; field: string; value: string }
  | { type: "UPDATE_QUALIFICATION"; field: string; value: string | boolean }
  | { type: "UPDATE_DOCUMENT"; field: string; file: File | null }
  | { type: "TOGGLE_INFORMATION_CORRECT" }
  | { type: "RESET_FORM" }

const initialState: TutorState = {
  personalDetails: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    languages: [],
  },
  paymentDetails: {
    bankName: "",
    bankAccountNo: "",
    confirmBankAccountNo: "",
  },
  qualificationDetails: {
    qualification: "",
    graduateFrom: "",
    graduationYear: "",
    currentWork: "",
    workingExperience: "",
    previousGrades: "",
    currentlyWorking: false,
    workplaceName: "",
  },
  documents: {
    identificationCertificate: null,
    qualificationCertificate: null,
    experienceLetter: null,
    accountVerification: null,
  },
  isInformationCorrect: false,
}

function tutorReducer(state: TutorState, action: TutorAction): TutorState {
  switch (action.type) {
    case "UPDATE_PERSONAL":
      return {
        ...state,
        personalDetails: {
          ...state.personalDetails,
          [action.field]: action.value,
        },
      }
    case "ADD_LANGUAGE":
      return {
        ...state,
        personalDetails: {
          ...state.personalDetails,
          languages: [...state.personalDetails.languages, action.language],
        },
      }
    case "REMOVE_LANGUAGE":
      return {
        ...state,
        personalDetails: {
          ...state.personalDetails,
          languages: state.personalDetails.languages.filter((lang) => lang !== action.language),
        },
      }
    case "UPDATE_PAYMENT":
      return {
        ...state,
        paymentDetails: {
          ...state.paymentDetails,
          [action.field]: action.value,
        },
      }
    case "UPDATE_QUALIFICATION":
      return {
        ...state,
        qualificationDetails: {
          ...state.qualificationDetails,
          [action.field]: action.value,
        },
      }
    case "UPDATE_DOCUMENT":
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.field]: action.file,
        },
      }
    case "TOGGLE_INFORMATION_CORRECT":
      return {
        ...state,
        isInformationCorrect: !state.isInformationCorrect,
      }
    case "RESET_FORM":
      return initialState
    default:
      return state
  }
}

interface AddTutorPopupProps {
  onClose: () => void
}

export default function AddTutorPopup({ onClose }: AddTutorPopupProps) {
  const [state, dispatch] = useReducer(tutorReducer, initialState)
  const [newLanguage, setNewLanguage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("=== TUTOR FORM DATA ===")
    console.log("Personal Details:", state.personalDetails)
    console.log("Payment Details:", state.paymentDetails)
    console.log("Qualification Details:", state.qualificationDetails)
    console.log("Documents:", {
      identificationCertificate: state.documents.identificationCertificate?.name || "Not uploaded",
      qualificationCertificate: state.documents.qualificationCertificate?.name || "Not uploaded",
      experienceLetter: state.documents.experienceLetter?.name || "Not uploaded",
      accountVerification: state.documents.accountVerification?.name || "Not uploaded",
    })
    console.log("Information Correct:", state.isInformationCorrect)
    console.log("=== END FORM DATA ===")

    // Reset form and close popup
    dispatch({ type: "RESET_FORM" })
    onClose()
  }

  const handleFileUpload = (field: string, file: File | null) => {
    dispatch({ type: "UPDATE_DOCUMENT", field, file })
  }

  const addLanguage = () => {
    if (newLanguage.trim() && !state.personalDetails.languages.includes(newLanguage.trim())) {
      dispatch({ type: "ADD_LANGUAGE", language: newLanguage.trim() })
      setNewLanguage("")
    }
  }

  const removeLanguage = (language: string) => {
    dispatch({ type: "REMOVE_LANGUAGE", language })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add Tutor</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Details */}
          <div>
            <h3 className="text-lg font-medium mb-4">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={state.personalDetails.firstName}
                  onChange={(e) => dispatch({ type: "UPDATE_PERSONAL", field: "firstName", value: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={state.personalDetails.lastName}
                  onChange={(e) => dispatch({ type: "UPDATE_PERSONAL", field: "lastName", value: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={state.personalDetails.email}
                  onChange={(e) => dispatch({ type: "UPDATE_PERSONAL", field: "email", value: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phoneNo">Phone No.</Label>
                <Input
                  id="phoneNo"
                  value={state.personalDetails.phoneNo}
                  onChange={(e) => dispatch({ type: "UPDATE_PERSONAL", field: "phoneNo", value: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={state.personalDetails.address}
                onChange={(e) => dispatch({ type: "UPDATE_PERSONAL", field: "address", value: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Add Language</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Enter language"
                />
                <Button type="button" onClick={addLanguage}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {state.personalDetails.languages.map((lang) => (
                  <span
                    key={lang}
                    className="bg-teal-100 text-teal-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => removeLanguage(lang)}
                      className="text-teal-600 hover:text-teal-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-lg font-medium mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={state.paymentDetails.bankName}
                  onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", field: "bankName", value: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankAccountNo">Bank Account No.</Label>
                <Input
                  id="bankAccountNo"
                  value={state.paymentDetails.bankAccountNo}
                  onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", field: "bankAccountNo", value: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmBankAccountNo">Confirm Bank Account No.</Label>
                <Input
                  id="confirmBankAccountNo"
                  value={state.paymentDetails.confirmBankAccountNo}
                  onChange={(e) =>
                    dispatch({ type: "UPDATE_PAYMENT", field: "confirmBankAccountNo", value: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Qualification Details */}
          <div>
            <h3 className="text-lg font-medium mb-4">Qualification Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="qualification">Qualification</Label>
                <Select
                  onValueChange={(value) => dispatch({ type: "UPDATE_QUALIFICATION", field: "qualification", value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="graduationYear">What year did you graduate?</Label>
                <Select
                  onValueChange={(value) => dispatch({ type: "UPDATE_QUALIFICATION", field: "graduationYear", value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 30 }, (_, i) => 2024 - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="graduateFrom">Where did you Graduate From?</Label>
              <Input
                id="graduateFrom"
                value={state.qualificationDetails.graduateFrom}
                onChange={(e) =>
                  dispatch({ type: "UPDATE_QUALIFICATION", field: "graduateFrom", value: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="currentWork">What do you do?</Label>
                <Input
                  id="currentWork"
                  value={state.qualificationDetails.currentWork}
                  onChange={(e) =>
                    dispatch({ type: "UPDATE_QUALIFICATION", field: "currentWork", value: e.target.value })
                  }
                  placeholder="Your Designation"
                  required
                />
              </div>
              <div>
                <Label htmlFor="workingExperience">Working Experience</Label>
                <Select
                  onValueChange={(value) =>
                    dispatch({ type: "UPDATE_QUALIFICATION", field: "workingExperience", value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Experience in Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5+">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="previousGrades">Which grade students did you previously teach?</Label>
              <Select
                onValueChange={(value) => dispatch({ type: "UPDATE_QUALIFICATION", field: "previousGrades", value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary (1-5)</SelectItem>
                  <SelectItem value="secondary">Secondary (6-10)</SelectItem>
                  <SelectItem value="higher-secondary">Higher Secondary (11-12)</SelectItem>
                  <SelectItem value="university">University Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Label>Are you currently working?</Label>
              <div className="flex items-center space-x-4 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="currentlyWorking"
                    checked={state.qualificationDetails.currentlyWorking === true}
                    onChange={() => dispatch({ type: "UPDATE_QUALIFICATION", field: "currentlyWorking", value: true })}
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="currentlyWorking"
                    checked={state.qualificationDetails.currentlyWorking === false}
                    onChange={() => dispatch({ type: "UPDATE_QUALIFICATION", field: "currentlyWorking", value: false })}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
            {state.qualificationDetails.currentlyWorking && (
              <div>
                <Label htmlFor="workplaceName">Workplace's Name</Label>
                <Input
                  id="workplaceName"
                  value={state.qualificationDetails.workplaceName}
                  onChange={(e) =>
                    dispatch({ type: "UPDATE_QUALIFICATION", field: "workplaceName", value: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          {/* Upload Documents */}
          <div>
            <h3 className="text-lg font-medium mb-4">Upload Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "identificationCertificate", label: "Identification Certificate" },
                { key: "qualificationCertificate", label: "Qualification Certificate" },
                { key: "experienceLetter", label: "Experience Letter" },
                { key: "accountVerification", label: "For Account Verification" },
              ].map(({ key, label }) => (
                <div key={key} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">{label}</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(key, e.target.files?.[0] || null)}
                    className="hidden"
                    id={key}
                  />
                  <label htmlFor={key} className="text-xs text-blue-600 cursor-pointer hover:underline">
                    {state.documents[key as keyof typeof state.documents]?.name || "Click here to upload"}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmation */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="informationCorrect"
              checked={state.isInformationCorrect}
              onCheckedChange={() => dispatch({ type: "TOGGLE_INFORMATION_CORRECT" })}
            />
            <Label htmlFor="informationCorrect">Mark all the given Information Correct</Label>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" disabled={!state.isInformationCorrect}>
            Add Tutor
          </Button>
        </form>
      </div>
    </div>
  )
}
