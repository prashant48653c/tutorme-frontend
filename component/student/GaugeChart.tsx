'use client'
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const PerformanceGauge = () => {
  // Sample courses data - you can modify this
  const [courses] = useState([
    { id: 1, name: "React Fundamentals", status: "COMPLETED" },
    { id: 2, name: "JavaScript Advanced", status: "IN_PROGRESS" },
    { id: 3, name: "Node.js Basics", status: "NOT_STARTED" },
    { id: 4, name: "Database Design", status: "NOT_STARTED" }
  ]);

  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [period, setPeriod] = useState("Monthly");

  // Calculate completion percentage
  const completedCourses = courses.filter(course => course.status === "COMPLETED").length;
  const totalCourses = courses.length;
  const completionPercentage = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

  // Animate the progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(completionPercentage);
    }, 500);
    return () => clearTimeout(timer);
  }, [completionPercentage]);

  // Convert percentage to angle (gauge goes from approximately -135 to 135 degrees)
  const angle = -135 + (animatedProgress / 100) * 270;
  
  return (
    <div className="bg-white px-4 py-5 sm:p-6 rounded-2xl w-full max-w-md shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Performance</h2>
        <div className="relative">
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border">
            {period}
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-2.5 h-2.5 bg-teal-400 rounded-full"></div>
        <span className="text-sm text-gray-600">Completed Courses</span>
      </div>

      {/* Gauge */}
      <div className="relative flex flex-col items-center mb-6">
        <div className="relative w-full max-w-xs sm:max-w-sm aspect-[7/4]">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 220 130"
            className="absolute inset-0 h-full w-full"
          >
            {/* Outer light background arc */}
            <path
              d="M 35 110 A 75 75 0 1 1 185 110"
              fill="none"
              stroke="#f0fdf4"
              strokeWidth="20"
              strokeLinecap="round"
            />
            
            {/* Main background arc */}
            <path
              d="M 40 108 A 70 70 0 1 1 180 108"
              fill="none"
              stroke="#e6fffa"
              strokeWidth="12"
              strokeLinecap="round"
            />
            
            {/* Progress arc */}
            <path
              d={`M 40 108 A 70 70 0 ${animatedProgress > 50 ? 1 : 0} 1 ${
                110 + 70 * Math.cos((-135 + (animatedProgress / 100) * 270) * Math.PI / 180)
              } ${
                108 + 70 * Math.sin((-135 + (animatedProgress / 100) * 270) * Math.PI / 180)
              }`}
              fill="none"
              stroke="#14b8a6"
              strokeWidth="12"
              strokeLinecap="round"
              style={{
                transition: 'all 1.5s ease-out'
              }}
            />
            
            {/* Center white circle */}
            <circle
              cx="110"
              cy="108"
              r="12"
              fill="white"
              stroke="white"
              strokeWidth="2"
            />
            
            {/* Inner teal circle */}
            <circle
              cx="110"
              cy="108"
              r="8"
              fill="#14b8a6"
            />
            
            {/* Needle */}
            <line
              x1="110"
              y1="108"
              x2={110 + 55 * Math.cos((angle * Math.PI) / 180)}
              y2={108 + 55 * Math.sin((angle * Math.PI) / 180)}
              stroke="#1f2937"
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                transition: 'all 1.5s ease-out'
              }}
            />
          </svg>
        </div>
      </div>

      {/* Score */}
      <div className="text-center">
        <span className="text-sm text-gray-500">Score: </span>
        <span className="text-base font-medium text-gray-900">
          {completedCourses}/{totalCourses}
        </span>
      </div>
    </div>
  );
};

export default PerformanceGauge;
