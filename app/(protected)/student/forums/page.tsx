"use client";

import { useState } from "react";
import { Edit, Send, ImageIcon, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import api from "@/hooks/axios";
import { createPost, usePosts } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/button";
import { cn } from "@/lib/utils";


interface Post {
  description: string;
  pictures: string[];
  tags:string;
  createdAt:string;
  studentProfile:any;

}
const ForumPage = () => {
  const user = useAuthStore((state) => state.user);
  const [description, setDescription] = useState("");
  const [flair, setFlair] = useState<"Question" | "Thoughts" | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posts, setPosts] = useState<
    { description: string; flair: string; createdAt: string; image?: string }[]
  >([]);
const [isFollowing, setIsFollowing] = useState( false)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !flair) {
      alert("Please add a description and select a flair.");
      return;
    }

    const newPost = {
      description,
      flair,
      createdAt: new Date().toLocaleString(),
      image: imagePreview || undefined,
    };
    const formData = new FormData();

    formData.append("description", description);
    formData.append("tag", flair);
    const id=user?.studentProfile.id;
    formData.append("profileId", String(id));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const data = await createPost(formData);
    console.log(data);
    refetch();
    setDescription("");
    setFlair(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const { data: responsePosts, refetch, isPending } = usePosts();
  console.log(responsePosts);
  if(isPending){
    return <div>Loading...</div>
  }
  return (
    <section className="flex gap-3 justify-start w-full">
      {/* Main Form Section */}
      <section className="w-[75%] ">
        <form
          onSubmit={handleSubmit}
          className="w-full p-5 border rounded-3xl shadow-2xs"
        >
          {/* Input with Send Button */}
          <div className="w-full flex gap-2 p-4 items-center relative">
            <Image
              src={"/static/landing/course.svg"}
              width={80}
              height={80}
              alt="profile"
              className="rounded-full w-12 h-12 object-cover"
            />

            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 rounded-2xl outline-none border-0 bg-[#F5F7F9] py-2 px-4 pr-10"
              placeholder="Want to ask or share?"
            />

            {/* Up Arrow Button */}
            <button
              type="submit"
              className="absolute right-8 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
            >
              <Send size={16} />
            </button>
          </div>

          {/* Image Attachment */}
          <div className="flex items-center gap-3 px-4 pb-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-blue-600">
              <ImageIcon size={18} />
              <span>Attach Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative w-fit mt-2 ml-4">
              <img
                src={imagePreview}
                alt="preview"
                className="max-h-40 rounded-lg border"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <hr />

          {/* Flair Selection */}
          <div className="flex items-center text-sm gap-6 py-3 justify-center">
            <button
              type="button"
              onClick={() => setFlair("Question")}
              className={`flex gap-2 items-center px-3 py-1 rounded-2xl border ${
                flair === "Question" ? "bg-blue-100 border-blue-500" : ""
              }`}
            >
              <Edit size={16} />
              <p>Ask a Question</p>
            </button>

            <button
              type="button"
              onClick={() => setFlair("Thoughts")}
              className={`flex gap-2 items-center px-3 py-1 rounded-2xl border ${
                flair === "Thoughts" ? "bg-green-100 border-green-500" : ""
              }`}
            >
              <Edit size={16} />
              <p>Share your Thoughts</p>
            </button>
          </div>
        </form>

        {/* Posts Feed */}
        <div className="mt-6 space-y-4">
          {responsePosts.map((post:Post, index:number) => (
            <div
              key={index}
              className="border p-4 rounded-2xl shadow-sm bg-white"
            >
             <div className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.studentProfile.user.image || "/placeholder.svg"} />
              <AvatarFallback>{post.studentProfile.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{post.studentProfile.user.name}</h3>
              <p className="text-xs text-gray-500">{post.createdAt}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFollowing(!isFollowing)}
            className={cn(
              "text-xs font-medium",
              isFollowing ? "text-gray-600 hover:text-gray-800" : "text-cyan-500 hover:text-cyan-600",
            )}
          >
            {isFollowing ? "Following" : "+ Follow"}
          </Button>
        </div>
      </div>
              <p className="mt-2 text-gray-800">{post.description}</p>

              {post.pictures && (
                <img
                  src={post.pictures[0]}
                  alt="post attachment"
                  className="mt-3 rounded-lg max-h-60 border"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Sidebar */}
      <aside className="w-[25%]">hi</aside>
    </section>
  );
};

export default ForumPage;
