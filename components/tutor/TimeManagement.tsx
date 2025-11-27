'use client'

import api from "@/hooks/axios";
import Radio from "@/component/reusable/Radio";
import { useGlobalCourseStore } from "@/store/useGlobalCourseStore";
import { useState } from "react";
import toast from "react-hot-toast";

const TimeManagement = () => {
  const course = useGlobalCourseStore(state => state.course);
  const setCourse = useGlobalCourseStore(state => state.setCourse);

  const [time, setTime] = useState({
    isQueryClassAvailable: false,
    endDate: "",
    startDate: "",
    frequency: "",
    classDuration: ""
  });

  const handleChange = (field: string, value: string | boolean) => {
    setTime(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const courseId = course?.id;
      if (!courseId) {
        toast.error("Course ID not found");
        return;
      }

      const res = await api.post(`/course/time/${courseId}`, time);
      toast.success("Time configuration saved!");
      setCourse(res.data.data)

      console.log("Response:", res.data);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  

  return (
    <div className="w-full bg-white mx-auto">
      <form
        className="space-y-6"
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Radio Section */}
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-medium">
            Are you willing to give Live Class for Queries?
          </label>
          <Radio
            name="liveClass"
            value={time.isQueryClassAvailable ? "yes" : "no"}
            onChange={(val) =>
              handleChange("isQueryClassAvailable", val === "yes")
            }
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium">
              How Frequent will you take the Class?
            </label>
            <select
              value={time.frequency}
              onChange={e => handleChange("frequency", e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:border-emerald-500"
            >
              <option value="">Select Frequency of Class</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-Weekly</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Select Time</label>
            <select
              value={time.classDuration}
              onChange={e => handleChange("classDuration", e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:border-emerald-500"
            >
              <option value="">Select Class Duration</option>
              <option value="30min">30 Minutes</option>
              <option value="1hr">1 Hour</option>
              <option value="2hr">2 Hours</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium">Start Date</label>
            <input
              type="date"
              value={time.startDate}
              onChange={e => handleChange("startDate", e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">End Date</label>
            <input
              type="date"
              value={time.endDate}
              onChange={e => handleChange("endDate", e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            className="flex-1 bg-teal-500 text-white py-4 px-8 rounded-lg font-medium hover:bg-teal-600 transition-colors"
          >
            Save Draft
          </button>
          <button
            type="button"
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-4 px-8 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Send for Approval
          </button>
        </div>
      </form>
    </div>
  );
};

export default TimeManagement;
