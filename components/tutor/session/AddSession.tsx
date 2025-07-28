"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import api from "@/hooks/axios"
import { useAuthStore } from "@/store/useAuthStore"
import toast from "react-hot-toast"

interface TimeSlot {
  from: string
  to: string
}

interface DayAvailability {
  enabled: boolean
  timeSlot: TimeSlot
}

interface WeeklyAvailability {
  [key: string]: DayAvailability
}

export default function SessionSetupModal() {
  const [isOpen, setIsOpen] = useState(true)
  const [hourlyRate, setHourlyRate] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [tags, setTags] = useState("")
  const [description, setDescription] = useState("")
const user=useAuthStore((state)=>state.user)
  const [availability, setAvailability] = useState<WeeklyAvailability>({
    sunday: { enabled: false, timeSlot: { from: "07:30", to: "09:30" } },
    monday: { enabled: false, timeSlot: { from: "07:30", to: "09:30" } },
    tuesday: { enabled: false, timeSlot: { from: "07:30", to: "09:30" } },
    wednesday: { enabled: false, timeSlot: { from: "07:30", to: "09:30" } },
    thursday: { enabled: false, timeSlot: { from: "07:30", to: "09:30" } },
    friday: { enabled: false, timeSlot: { from: "07:30", to: "09:30" } },
    saturday: { enabled: false, timeSlot: { from: "07:30", to: "09:30" } },
  })

  const days = [
    { key: "sunday", label: "Sunday" },
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
  ]

  const handleSelectAllDays = () => {
    const newAvailability = { ...availability }
    const allEnabled = Object.values(availability).every((day) => day.enabled)

    Object.keys(newAvailability).forEach((day) => {
      newAvailability[day].enabled = !allEnabled
    })

    setAvailability(newAvailability)
  }

  const handleApplyToAll = () => {
    const firstEnabledDay = Object.values(availability).find((day) => day.enabled)
    if (!firstEnabledDay) return

    const newAvailability = { ...availability }
    Object.keys(newAvailability).forEach((day) => {
      if (newAvailability[day].enabled) {
        newAvailability[day].timeSlot = { ...firstEnabledDay.timeSlot }
      }
    })

    setAvailability(newAvailability)
  }

  const handleDayToggle = (day: string, enabled: boolean) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled },
    }))
  }

  const handleTimeChange = (day: string, field: "from" | "to", value: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlot: { ...prev[day].timeSlot, [field]: value },
      },
    }))
  }

  function convertTo12Hour(time24: string): string {
  const [hourStr, minute] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12 || 12; // convert 0 to 12 for midnight
  return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
}



 
  const handleFinish =async () => {
    console.log({
      hourlyRate,
      selectedLanguage,
      tags: tags.split(/[\s,]+/).filter((tag) => tag.length > 0),
      availability,
      description,
    })
const formatted = Object.entries(availability)
  .filter(([_, value]) => value.enabled)
  .map(([day, value]) => ({
    day,
    startTime: convertTo12Hour(value.timeSlot.from),
    endTime: convertTo12Hour(value.timeSlot.to),
  }));


    console.log(formatted)


    try {
      const res=await api.post("/tutor/session",{
        duration:JSON.stringify(formatted),
        price: hourlyRate,
        description,
        language: selectedLanguage,
        tutorProfileId:user?.tutorProfile?.id
      })
      console.log("Session setup successful:", res.data)
      toast.success("Session setup successful")
    } catch (error:any) {
      toast.error("Error setting up session")
      console.error("Error setting up session:", error)
      
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Set this up for Starting Online Sessions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-1">
          {/* Set Hourly Rate */}
          <div className="space-y-2">
            <Label htmlFor="hourly-rate" className="text-sm font-medium text-gray-700">
              Set Hourly Rate
            </Label>
            <Input
              id="hourly-rate"
              placeholder="Set your Session's Hourly Rate"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Select Language */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Select Language</Label>
            <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="english" id="english" />
                  <Label htmlFor="english" className="text-sm text-blue-500 cursor-pointer">
                    English
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nepali" id="nepali" />
                  <Label htmlFor="nepali" className="text-sm cursor-pointer">
                    Nepali
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="text-sm cursor-pointer">
                    Both
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Select Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
              Select Tags
            </Label>
            <div className="relative">
              <Input
                id="tags"
                placeholder="Start typing"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full"
              />
              <div className="text-xs text-blue-400 mt-1">Separate tags with space or enter key</div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">Availability</Label>

            <div className="flex gap-3">
              <Button
                onClick={handleSelectAllDays}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Select all Days
              </Button>
              <Button
                onClick={handleApplyToAll}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Apply to all
              </Button>
            </div>

            <div className="space-y-3">
              {days.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={availability[key].enabled}
                      onCheckedChange={(checked) => handleDayToggle(key, checked as boolean)}
                    />
                    <Label className="text-sm font-medium min-w-[80px]">{label}</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      value={availability[key].timeSlot.from}
                      onChange={(e) => handleTimeChange(key, "from", e.target.value)}
                      className="w-20 h-8 text-xs"
                      disabled={!availability[key].enabled}
                    />
                    <span className="text-xs text-gray-500">to</span>
                    <Input
                      type="time"
                      value={availability[key].timeSlot.to}
                      onChange={(e) => handleTimeChange(key, "to", e.target.value)}
                      className="w-20 h-8 text-xs"
                      disabled={!availability[key].enabled}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what can be expected from the sessions"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleFinish}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-md font-medium"
            >
              Finish Setting up
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 py-3 rounded-md font-medium bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
