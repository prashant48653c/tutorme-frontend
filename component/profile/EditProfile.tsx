"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import api from "@/hooks/axios";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

interface FormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  designation?: string;
  languages: string[];
  workplace?: string;
}

export default function EditProfileForm() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [formData, setFormData] = useState<FormData>({
    firstName: user?.name?.split(" ")[0] ?? "",
    lastName: user?.name?.split(" ")[1] ?? "",
    email: user?.email ?? "",
    phone: user?.phoneNumber ?? "",
    address: user?.tutorProfile?.address ?? "",
    designation: user?.tutorProfile?.jobTitle ?? "",
    languages: user?.tutorProfile?.language ?? [],
    workplace: user?.tutorProfile?.currentOrganization ?? "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddLanguage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newLang = e.currentTarget.value.trim();
      if (!formData.languages.includes(newLang)) {
        setFormData((prev) => ({
          ...prev,
          languages: [...prev.languages, newLang],
        }));
      }
      e.currentTarget.value = "";
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: `${formData.firstName} ${formData.lastName}`,
      bio: user?.bio ?? "",
      address: formData.address,
      jobTitle: formData.designation,
      currentOrganization: formData.workplace,
      language: JSON.stringify(formData.languages),
    };

    try {
      const id = user?.id;
      const res = await api.patch(`/auth/profile/${id}`, payload );
      setUser(res.data.user);
      toast.success("Update successful");
    } catch (err) {
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} readOnly />
          </div>
          <div>
            <Label htmlFor="phone">Phone No.</Label>
            <Input id="phone" value={formData.phone} readOnly />
          </div>
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        {/* Designation */}
        <div>
          <Label htmlFor="designation">What do you do?</Label>
          <Input
            id="designation"
            value={formData.designation}
            onChange={handleInputChange}
          />
        </div>

        {/* Language */}
        <div>
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            placeholder="Add Language and press Enter"
            onKeyDown={handleAddLanguage}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.languages.length === 0 ? (
              <span className="text-gray-500 text-sm">None</span>
            ) : (
              formData.languages.map((lang) => (
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
              ))
            )}
          </div>
        </div>

        {/* Workplace */}
        <div>
          <Label htmlFor="workplace">Workplace's Name</Label>
          <Input
            id="workplace"
            value={formData.workplace}
            onChange={handleInputChange}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button
            className="bg-green-500 text-white hover:bg-green-300"
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
