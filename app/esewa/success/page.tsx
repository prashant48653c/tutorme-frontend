'use client'
import api from "@/hooks/axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const params = useSearchParams();
  const router = useRouter();

  const courseId = params.get("courseId");
  const studentId = params.get("studentId");
  const encodedDataRaw = params.get("data");

let encodedData = encodedDataRaw;

// Fix Esewa bug: sometimes it adds "?data=" as a prefix
if (encodedDataRaw?.startsWith("?data=")) {
  encodedData = encodedDataRaw.replace("?data=", "");
}

console.log("fixed data:", encodedData);


  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    if (!encodedData) return;

    const verifyPayment = async () => {
      try {
        const decoded = JSON.parse(atob(encodedData));

        const res = await api.post("/transaction/esewa-buy", {
          courseId,
          studentId,
          userId: params.get("userId"),
          transaction_uuid: decoded.transaction_uuid,
          total_amount: decoded.total_amount,
          product_code: decoded.product_code,
        });

        console.log("Backend Response:", res.data);

        if (res.data.status == "COMPLETE") {
          setPaymentVerified(true);
        }
      } catch (err) {
        console.error("Payment verify error:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [encodedData]);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-xl p-10 rounded-xl text-center w-[450px]">
        {loading ? (
          <div>
            <h1 className="text-xl font-semibold">Verifying Payment...</h1>
            <p className="text-gray-600 mt-2">Please wait a moment</p>
          </div>
        ) : paymentVerified ? (
          <>
            <h1 className="text-2xl font-bold text-green-600">Payment Successful 🎉</h1>
            <p className="text-gray-700 mt-3">
              Your course has been added to your account.
            </p>

            <button
              onClick={() => router.push("http://localhost:3000/student/profile")}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Go to Your Courses
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-600">Payment Failed ❌</h1>
            <p className="text-gray-700 mt-3">Please contact support.</p>
          </>
        )}
      </div>
    </div>
  );
}
