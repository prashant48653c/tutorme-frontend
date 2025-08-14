"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const HoursSpentChart = () => {
  const data = [
    { date: "2024-09-01", studyhr: 25, testhr: 15 },
    { date: "2024-10-01", studyhr: 30, testhr: 20 },
    { date: "2024-11-01", studyhr: 35, testhr: 18 },
    { date: "2024-12-01", studyhr: 28, testhr: 22 },
    { date: "2025-01-01", studyhr: 32, testhr: 25 },
    { date: "2025-02-01", studyhr: 27, testhr: 15 },
    { date: "2025-03-01", studyhr: 40, testhr: 20 },
    { date: "2025-04-01", studyhr: 20, testhr: 10 },
    { date: "2025-05-01", studyhr: 45, testhr: 30 },
    { date: "2025-06-01", studyhr: 35, testhr: 25 },
    { date: "2025-07-01", studyhr: 50, testhr: 35 },
    { date: "2025-08-01", studyhr: 45, testhr: 30 },
  ];

  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const last12Data = sortedData.slice(Math.max(sortedData.length - 12, 0));

  const chartData = last12Data.map((item) => ({
    month: new Date(item.date).toLocaleString("default", { month: "short" }),
    Study: item.studyhr,
    "Online Test": item.testhr,
  }));

  return (
    <div  style={{ width: "80%", height: 400 }}>
      <h3 className="my-10 mx-3">Hours Spent</h3>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `${value} Hr`} />

          <Tooltip />
          <Legend />
          <Bar
            dataKey="Study"
            stackId="a"
            fill="#09C4AE"
           
          />
          <Bar
            dataKey="Online Test"
            stackId="a"
            fill="#88CFC5"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HoursSpentChart;
