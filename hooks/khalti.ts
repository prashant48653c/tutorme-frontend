import axios from "axios";
import api from "./axios";


interface CreditPayloadKhalti{
  amount: number;
  studentId: number;
  email?: string;
  name?: string;
  phoneNumber?: string;
}
export const initiateKhaltiPayment = async (
  courseId: number,
  courseName: string,
  stdProfileId: number,
  amount: number
) => {
  try {
    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: `http://localhost:3000/course/${courseId}`, // where Khalti will redirect
        website_url: "http://localhost:3000", // your base site
        amount: Math.round(amount * 100), // convert to paisa
        purchase_order_id: `course_${courseId}_${Date.now()}`,
        purchase_order_name: courseName || "Course",
        customer_info: {
          name: "Student Name", // replace with actual student
          email: "student@example.com",
          phone: "9800000000", // replace with actual phone
        },
        amount_breakdown: [
          {
            label: "Course Fee",
            amount: Math.round(amount * 100),
          },
        ],
      },
      {
        headers: {
          Authorization: `Key 983adb34339347d0acb5888df2537d5d`,
          "Content-Type": "application/json",
        },
      }
    );

    // Redirect user to Khalti's payment page
    if (response.data.payment_url) {
      window.location.href = response.data.payment_url;
    } else {
      console.error("Payment initiation failed", response.data);
    }
  } catch (error) {
    console.error("Error initiating Khalti payment:", error);
  }
};

export const initiateKhaltiCredit = async (
  payload: CreditPayloadKhalti
) => {
  try {
    console.log(payload)
    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: `http://localhost:3000/student/wallet`, // where Khalti will redirect
        website_url: "http://localhost:3000", // your base site
        amount: Math.round(payload.amount * 100), // convert to paisa
        purchase_order_id: `credit_${payload.studentId}_${Date.now()}`,
        purchase_order_name: `Credit ${Math.random()}`,
        customer_info: {
          name: payload.name || "Student Name",
          email: payload.email || "student@example.com",
          phone: payload.phoneNumber || "9800000000",
        },
        amount_breakdown: [
          {
            label: "Course Fee",
            amount: Math.round(payload.amount * 100),
          },
        ],
      },
      {
        headers: {
          Authorization: `Key 983adb34339347d0acb5888df2537d5d`,
          "Content-Type": "application/json",
        },
      }
    );

    // Redirect user to Khalti's payment page
    if (response.data.payment_url) {
      window.location.href = response.data.payment_url;
    } else {
      console.error("Payment initiation failed", response.data);
    }
  } catch (error) {
    console.error("Error initiating Khalti payment:", error);
  }
};

export const checkKhaltiPayment = async (data: any) => {
  try {
    const res = await api.post("/payment/credit", {
      userProfileId: +data.studentProfileId ,
      courseId: data.courseId,
      paymentMethod: "KHALTI",
      paymentId: data.pidx,
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};


export const checkKhaltiPaymentForLoadBalance = async (data: any) => {
  try {
    console.log(data,"Data in hook")
    const res = await api.post("/transaction/load-wallet", {
      id: data.id,

      paymentMethod: "KHALTI",
      paymentId: data.pidx,
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

