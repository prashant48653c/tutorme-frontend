"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"

interface AddQualificationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: QualificationData) => void
}

interface QualificationData {
  qualification: string
  graduationLocation: string
  certificate: File | null
}

export default function AddQualificationModal() {
  const [qualification, setQualification] = useState("")
  const [graduationLocation, setGraduationLocation] = useState("")
  const [certificate, setCertificate] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        setCertificate(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        setCertificate(file)
      }
    }
  }

  const validateFile = (file: File) => {
    const validTypes = ["image/svg+xml", "image/png", "image/jpeg"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
      alert("Please upload SVG, PNG or JPEG files only")
      return false
    }

    if (file.size > maxSize) {
      alert("File size must be less than 10MB")
      return false
    }

    return true
  }

  const handleSave = () => {
    if (!qualification || !graduationLocation) {
      alert("Please fill in all required fields")
      return
    }
 

    // Reset form
    setQualification("")
    setGraduationLocation("")
    setCertificate(null)
     
  }

  const handleCancel = () => {
    // Reset form
    setQualification("")
    setGraduationLocation("")
    setCertificate(null)
    
  }

  return (
    <div >
      <div className="max-w min-w-[40rem] bg-white z-10 rounded-2xl w-full p-6">
        
<div>
  <h3 className="text-2xl text-black font-semibold mb-2">Add Qualification</h3>
</div>
        <div className="space-y-6">
          {/* Qualification and Graduation Location */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Qualification</Label>
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
              <Label className="text-sm font-medium text-gray-700">Where did you Graduate From?</Label>
              <Input
                placeholder="Enter institution name"
                value={graduationLocation}
                onChange={(e) => setGraduationLocation(e.target.value)}
                className="bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Qualification Certificate</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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

              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-teal-600" />
                </div>

                {certificate ? (
                  <div className="text-center">
                    <p className="text-sm font-medium text-green-600">File uploaded successfully!</p>
                    <p className="text-xs text-gray-500">{certificate.name}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-1">Upload your Marksheet/Certificate</p>
                    <p className="text-xs text-gray-500">SVG, PNG or JPEG (Less than 10 MB)</p>
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
          <Button onClick={handleSave} className="bg-teal-500 hover:bg-teal-600 px-6">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
