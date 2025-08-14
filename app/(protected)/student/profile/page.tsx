import ContinueWatching from "@/component/student/ContinueWatching";
import PerformanceGauge from "@/component/student/GaugeChart";
import HoursSpentChart from "@/component/student/HourGraph";
import NotificationBar from "@/component/student/NotificationBar";
import React from "react";

const enrollment = [{ id: 1 ,status:"COMPLETED"}, { id: 1 ,status:"COMPLETED"}, { id: 12,status:"COMPLETED" }];
const StudentDashboard = () => {
  return (
    <section className="w-full">
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

<section className="flex my-3 gap-3 justify-start items-center  ">
<PerformanceGauge  />
<PerformanceGauge  />
<NotificationBar/>

</section>  
<section className="my-3">
  <HoursSpentChart/>
</section>
<section className="my-14">
  <ContinueWatching/>
</section>

    </section>
  );
};

export default StudentDashboard;
