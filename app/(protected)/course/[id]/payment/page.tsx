"use client";
import React, { useState, useEffect } from "react";
import { Star, BookOpen, BarChart3, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/hooks/axios";
import { initiateKhaltiPayment } from "@/hooks/khalti";
import { useAuthStore } from "@/store/useAuthStore";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

export default function CourseCheckout() {
  const params = useParams();
  const id = params.id;
  
  const discountAmount = 250;
  const [paymentOption, setPaymentOption] = useState<"esewa" | "khalti">("khalti");
  const [promoCode, setPromoCode] = useState("");
  const user = useAuthStore((state) => state.user);

  const { data, isLoading, error } = useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      const res = await api.get(`/course/${id}`);
      console.log(res);
      return res.data.data;
    },
  });

  // eSewa form state
  const [esewaFormData, setEsewaFormData] = useState({
    amount: "",
    tax_amount: "0",
    total_amount: "",
    transaction_uuid: "",
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: "",
    failure_url: "",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    secret: "8gBm/:&EnhH.1/q",
  });

  // Generate signature function
  const generateSignature = (
    total_amount: string,
    transaction_uuid: string,
    product_code: string,
    secret: string
  ) => {
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    const hashedSignature = CryptoJS.enc.Base64.stringify(hash);
    return hashedSignature;
  };

  // Update eSewa form data when course data loads
  useEffect(() => {
    if (data && typeof window !== 'undefined') {
      const finalAmount = (data.price - discountAmount).toString();
      const uuid = uuidv4();
      
      const signature = generateSignature(
        finalAmount,
        uuid,
        "EPAYTEST",
        "8gBm/:&EnhH.1/q"
      );

      setEsewaFormData({
        ...esewaFormData,
        amount: finalAmount,
        total_amount: finalAmount,
        transaction_uuid: uuid,
        signature: signature,
        success_url: `${window.location.origin}/esewa/success?studentId=${user?.studentProfile?.id || 1}&courseId=${id}&userId=${user?.id || 1}&data=`,
        failure_url: `${window.location.origin}/esewa/failure`,
      });
    }
  }, [data, discountAmount]);

  // Function to submit eSewa payment programmatically
  const submitEsewaPayment = () => {
    // Create a form element dynamically
    console.log(user?.id)
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

    // Add form fields
    const fields = {
      amount: esewaFormData.amount,
      tax_amount: esewaFormData.tax_amount,
      total_amount: esewaFormData.total_amount,
      transaction_uuid: esewaFormData.transaction_uuid,
      product_code: esewaFormData.product_code,
      product_service_charge: esewaFormData.product_service_charge,
      product_delivery_charge: esewaFormData.product_delivery_charge,
      success_url: esewaFormData.success_url,
      failure_url: esewaFormData.failure_url,
      signed_field_names: esewaFormData.signed_field_names,
      signature: esewaFormData.signature,
    };

    Object.keys(fields).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = fields[key as keyof typeof fields];
      form.appendChild(input);
    });

    // Append form to body and submit
    document.body.appendChild(form);
    form.submit();
  };

  const handlePayment = async () => {
    if (!id) {
      return;
    }
    
    const finalAmount = data.price - discountAmount;

    if (paymentOption === "esewa") {
      // Submit eSewa payment programmatically
      submitEsewaPayment();
    } else {
      await initiateKhaltiPayment(+id, data.courseName, 2, finalAmount);
    }
  };

  if (isLoading) {
    return "Loading....";
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
                  <span className="font-medium text-gray-900">Rs. {data.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Coupon Applied</span>
                  <span className="font-medium text-red-500">-{discountAmount}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Grand Total</span>
                  <span className="font-bold text-teal-500 text-lg">
                    Rs. {data.price - discountAmount}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="flex justify-center gap-6 mb-6">
                {/* eSewa */}
                <div
                  onClick={() => setPaymentOption("esewa")}
                  className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer 
                    ${paymentOption === "esewa" ? "ring-4 ring-green-400" : "bg-green-100"}`}
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">e</span>
                  </div>
                </div>

                {/* Khalti */}
                <div
                  onClick={() => setPaymentOption("khalti")}
                  className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer 
                    ${paymentOption === "khalti" ? "ring-4 ring-purple-400" : "bg-purple-100"}`}
                >
                  <span className="text-purple-600 text-sm font-bold">khalti</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handlePayment}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg text-lg"
              >
                Check Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}