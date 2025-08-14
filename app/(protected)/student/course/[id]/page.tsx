"use client";

import { Button } from "@/button";
import Course from "@/component/landing/Course";
import CourseProductList from "@/component/landing/findtutor/ProductCourses";
import Footer from "@/component/reusable/Footer";
import CourseInterface from "@/components/course/CourseDetail";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Badge, Search, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const courses = [
  {
    id: 1,
    title: "Introduction to Basics",
    description:
      "This course is designed to provide students with basic principles of biology. We will be studying about the cell and its composition.",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.5,
    reviews: 120,
    price: 1200,
    students: "2.5k",
    badge: null,
  },
  {
    id: 2,
    title: "Introduction to Basics",
    description:
      "This course is designed to provide students with basic principles of biology. We will be studying about the cell and its composition.",
    image: "/static/landing/course.svg",

    rating: 4.8,
    reviews: 89,
    price: 1500,
    students: "1.8k",
    badge: null,
  },
  {
    id: 3,
    title: "Introduction to Basics",
    description:
      "This course is designed to provide students with basic principles of biology. We will be studying about the cell and its composition.",
    image: "/static/landing/course.svg",

    rating: 4.6,
    reviews: 156,
    price: 1800,
    students: "3.2k",
    badge: "Free",
  },
  {
    id: 3,
    title: "Introduction to Basics",
    description:
      "This course is designed to provide students with basic principles of biology. We will be studying about the cell and its composition.",
    image: "/static/landing/course.svg",

    rating: 4.6,
    reviews: 156,
    price: 1800,
    students: "3.2k",
    badge: "Free",
  },
];

const CourseDetailPage = () => {
  const router = useRouter();
  const handleEnroll = (id: number) => {
    router.push(`/course/${id}`);
  };
  return (
    <>
      <main className="w-full h-full  ">
      

        <CourseInterface />
     
      </main>
     
    </>
  );
};

export default CourseDetailPage;
