"use client";

import type { ComponentProps } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartData = {
  month: string;
  study: number;
  onlineTest: number;
};

const CHART_DATA: ChartData[] = [
  { month: "Jan", study: 48, onlineTest: 22 },
  { month: "Feb", study: 36, onlineTest: 18 },
  { month: "Mar", study: 52, onlineTest: 28 },
  { month: "Apr", study: 35, onlineTest: 17 },
  { month: "May", study: 18, onlineTest: 9 },
  { month: "Jun", study: 46, onlineTest: 32 },
  { month: "Jul", study: 28, onlineTest: 15 },
  { month: "Aug", study: 44, onlineTest: 21 },
  { month: "Sep", study: 30, onlineTest: 16 },
  { month: "Oct", study: 38, onlineTest: 19 },
];

const LEGEND_ITEMS = [
  { label: "Study", color: "#15BFC7" },
  { label: "Online Test", color: "#DDF7E9" },
];

type SeriesKey = "study" | "onlineTest";

const SERIES_SWATCH: Record<SeriesKey, string> = {
  study: "linear-gradient(180deg,#50E3C2 0%,#10B0C4 100%)",
  onlineTest: "linear-gradient(180deg,#F2FFF3 0%,#CFF7E0 100%)",
};

type RectangleShapeProps = ComponentProps<typeof Rectangle> & {
  payload?: ChartData;
};

const STACK_RADIUS: [number, number, number, number] = [14, 14, 0, 0];

type TooltipItem = {
  name?: string;
  value?: number;
  color?: string;
  dataKey?: string | number;
};

type HoursTooltipProps = {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string;
};

const getSeriesStyle = (dataKey?: string | number) => {
  if (typeof dataKey === "string" && dataKey in SERIES_SWATCH) {
    return { backgroundImage: SERIES_SWATCH[dataKey as SeriesKey] };
  }
  return { backgroundColor: "#9EA7B7" };
};

const CustomTooltip = ({ active, payload, label }: HoursTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl bg-[#211B3F] px-4 py-3 text-xs text-white shadow-lg">
      <p className="mb-2 text-sm font-semibold">{label}</p>
      {payload.map((item: TooltipItem, index) => (
        <div className="flex items-center gap-3" key={`tooltip-${index}`}>
          <span
            className="h-3 w-3"
            style={getSeriesStyle(item.dataKey)}
            aria-label={item.name}
          />
          <span className="ml-auto font-medium">{item.value} Hr</span>
        </div>
      ))}
    </div>
  );
};

const StudyBarShape = (props: any) => {
  const { payload, ...rest } = props;
  const hasTopSegment =
    typeof payload?.onlineTest === "number" && payload.onlineTest > 0;
  const radius = hasTopSegment ? [0, 0, 0, 0] : STACK_RADIUS;

  return <Rectangle {...rest} radius={radius} />;
};

const HourGraph = () => {
  return (
    <section className="w-full rounded-3xl bg-white px-4 py-5 shadow-sm ring-1 ring-slate-100 sm:px-5 sm:py-6 lg:px-6">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-slate-900">Hours Spent</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
          {LEGEND_ITEMS.map((item) => (
            <div className="flex items-center gap-2" key={item.label}>
              <span
                className="h-3 w-3 rounded"
                style={{ background: item.color }}
              />
              {item.label}
            </div>
          ))}
        </div>
      </header>
      <div className="h-[260px] w-full sm:h-[300px] md:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={CHART_DATA}
            barCategoryGap="20%"
            margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#50E3C2" stopOpacity={1} />
                <stop offset="100%" stopColor="#10B0C4" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="testGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F2FFF3" stopOpacity={1} />
                <stop offset="100%" stopColor="#CFF7E0" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#ECEFF5"
              strokeDasharray="4 8"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              tick={{ fill: "#9399A9", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              domain={[0, 80]}
              ticks={[0, 20, 40, 60, 80]}
              tickFormatter={(value) => `${value} Hr`}
              tick={{ fill: "#9399A9", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(21,191,199,0.08)" }}
              content={<CustomTooltip />}
            />
            <Bar
              dataKey="study"
              name="Study"
              stackId="hours"
              fill="url(#studyGradient)"
              radius={STACK_RADIUS}
              maxBarSize={60}
              shape={StudyBarShape}
            />
            <Bar
              dataKey="onlineTest"
              name="Online Test"
              stackId="hours"
              fill="url(#testGradient)"
              radius={STACK_RADIUS}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default HourGraph;
