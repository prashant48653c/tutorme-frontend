"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import api from "@/hooks/axios";
import { useAuthStore } from "@/store/useAuthStore";

export default function EditBio({setStatus}:{setStatus:(b:boolean)=>void}) {
  const [newBio, setNewBio] = useState("Your bio");
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const handleUpdate = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      console.log("Bio Update", newBio);
      const id = user?.id;
      const res = await api.patch(`/auth/profile/${id}`, { bio: newBio });
      console.log(res.data.user);
      setUser(res.data.user);
      toast.success("bio updated");
    } catch (error) {
      toast.error("Something went wrong");
    }finally{
      setStatus(false)

    }
  };
  return (
    <div className="max-w-2xl min-w-[40rem] mx-auto bg-white p-6  rounded-2xl shadow-lg">
      <h2 className="text-2xl text-gray-800 font-semibold mb-6">Edit Bio</h2>

      <form className="space-y-5">
        {/* Name */}
        <div className="grid grid-cols-1   gap-4">
          <div>
            <Textarea
              id="bio"
              onChange={(e) => setNewBio(e.target.value)}
              placeholder="Write a short bio or description..."
              className="min-h-[10rem] "
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button className="border-black" variant="outline">
            Cancel
          </Button>
          <Button
            className="bg-green-500 text-white"
            onClick={handleUpdate}
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
