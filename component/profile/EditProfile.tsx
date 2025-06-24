"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function EditProfileForm() {
  const [languages, setLanguages] = useState(["English", "Nepali"])

  const handleRemoveLanguage = (lang: string) => {
    setLanguages(languages.filter((l) => l !== lang))
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

      <form className="space-y-5">
        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" defaultValue="Sandesh" />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" defaultValue="Sapkota" />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="readonly@email.com" readOnly />
          </div>
          <div>
            <Label htmlFor="phone">Phone No.</Label>
            <Input id="phone" type="tel" defaultValue="9865474121" />
          </div>
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" defaultValue="Baneshwor" />
        </div>

        {/* Designation */}
        <div>
          <Label htmlFor="designation">What do you do?</Label>
          <Input id="designation" defaultValue="UI/UX Designer" />
        </div>

        {/* Language */}
        <div>
          <Label htmlFor="language">Language</Label>
          <Input id="language" placeholder="Add Language" />
          <div className="flex flex-wrap gap-2 mt-2">
            {languages.map((lang) => (
              <span
                key={lang}
                className="flex items-center bg-cyan-50 border border-cyan-400 text-cyan-700 rounded-full px-3 py-1 text-sm"
              >
                {lang}
                <button
                  type="button"
                  onClick={() => handleRemoveLanguage(lang)}
                  className="ml-2 text-cyan-500 hover:text-cyan-700"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Workplace */}
        <div>
          <Label htmlFor="workplace">Workplace's Name</Label>
          <Input id="workplace" defaultValue="Technergy Global Pvt. Ltd." />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-green-500 text-white hover:bg-green-300" type="submit">Save</Button>
        </div>
      </form>
    </div>
  )
}
