import ContinueWatching from "@/component/student/ContinueWatching";
import PerformanceGauge from "@/component/student/GaugeChart";
import HoursSpentChart from "@/component/student/HourGraph";
import NotificationBar from "@/component/student/NotificationBar";
import React from "react";

const enrollment = [{ id: 1 ,status:"COMPLETED"}, { id: 1 ,status:"COMPLETED"}, { id: 12,status:"COMPLETED" }];
const StudentDashboard = () => {
  return (
    <section className="w-full space-y-6 md:space-y-8 lg:space-y-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {enrollment.map((item: { id: number }) => (
          <div
            key={item.id}
            className="w-full h-40 flex flex-col items-center justify-center text-center text-white rounded-2xl bg-gradient-to-b from-[#88CFC5] to-[#09C4AE] shadow-lg transition-transform duration-200 hover:scale-105"
          >
            <h4 className="text-5xl font-extrabold leading-none">{item.id}</h4>
            <p className="text-lg font-medium mt-1">Total Courses</p>
          </div>
        ))}
      </div>

      <section className="grid grid-cols-1 gap-4 min-w-0 xl:grid-cols-3">
        <div className="min-w-0">
          <PerformanceGauge />
        </div>
        <div className="min-w-0">
          <PerformanceGauge />
        </div>
        <div className="min-w-0">
          <NotificationBar />
        </div>
      </section>

      <section className="min-w-0">
        <HoursSpentChart/>
      </section>

      <section className="min-w-0 pb-4 lg:pb-10">
        <ContinueWatching/>
      </section>
    </section>
  );
};

export default StudentDashboard;
