"use client";
import React, { useState } from "react";
import { Star, BookOpen, BarChart3, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/hooks/axios";

export default function CourseCheckout() {
  const params = useParams();
  const id=params.id;

  const {data,isLoading,error}=useQuery({
    queryKey:['course'],
    queryFn:async()=>{
        const res=await api.get(`/course/${id}`);
        console.log(res)
        return res.data.data
    }
})
  const [promoCode, setPromoCode] = useState("");
if(isLoading){
  return "Loading...."
}
  return (
    <main className="w-full h-full px-8 pb-4">
      <section className="flex items-center gap-16 mt-3 mb-10">
        <h2 className="font-bold text-2xl min-w-fit ">
          COURSE <span className="text-green-500">DETAILS</span>
        </h2>
        <div className="flex w-full items-center border rounded-lg bg-[#F5F7F9] p-2 gap-2 justify-start">
          <Search size={18} />
          <input
            className="border-0 min-w-[20rem] outline-0 hover:outline-0 bg-transparent"
            placeholder="Search.."
            // value={searchQuery}
            // onChange={handleSearchChange}
          />
        </div>
      </section>
      <div className="flex gap-6 p-6  min-h-screen">
        {/* Course Details Card */}
        <div className="w-[50%]">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              {/* Course Image and Title */}
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                   {data.title}
                  </h2>
                  <p className="text-sm text-teal-500 mb-2">
                    By {data.tutor.user.name}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-orange-400 text-orange-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900">5.0</span>
                <span className="text-sm text-gray-500">(120+)</span>
              </div>

              {/* Price */}
              <div className="text-right mb-4">
                <span className="text-2xl font-bold text-teal-500">
                  NRs. {data.price}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Job-ready for high-growth fields. Apply your new skills to
                real-world projects using the latest industry tools &
                techniques. Get job-ready for high-growth fields...
                <span className="text-teal-500 cursor-pointer"> Read More</span>
              </p>

              {/* Course Stats */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-500" />
                  <span className="text-sm text-gray-600">13 Chapters</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-500" />
                  <span className="text-sm text-gray-600">Intermediate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-500" />
                  <span className="text-sm text-gray-600">400 minutes</span>
                </div>
              </div>

              {/* Course Details Button */}
              <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg">
                Go to Course Details
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Billing Details Card */}
        <div className="flex-1">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              {/* Header */}
              <h2 className="text-xl font-semibold text-teal-500 mb-6">
                Billing Details
              </h2>

              {/* Promo Code Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white px-6 font-medium">
                    Apply
                  </Button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Course Price</span>
                  <span className="font-medium text-gray-900">Rs. 3500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Coupon Applied</span>
                  <span className="font-medium text-red-500">-250</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Grand Total</span>
                  <span className="font-bold text-teal-500 text-lg">
                    Rs. 3250
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="flex justify-center gap-4 mb-6">
                {/* eSewa Logo */}
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">e</span>
                  </div>
                </div>

                {/* Khalti Logo */}
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-bold">
                    khalti
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg text-lg">
                Check Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
