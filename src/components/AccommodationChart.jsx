import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAccommodationStatsInfo } from "@/util/DatabaseUtil";

/** ================= 색상 팔레트 ================= */
const COLORS = [
  "#34D399", // emerald
  "#60A5FA", // blue
  "#FBBF24", // amber
  "#F87171", // red
  "#A78BFA", // violet
  "#2DD4BF", // teal
  "#FB7185", // rose
  "#4ADE80", // green
  "#38BDF8", // sky
  "#FACC15", // yellow
  "#C084FC", // purple
  "#64748B", // slate
];

export default function AccommodationStatisticsPage() {
  /** ================= 상태 ================= */
  const [chartType, setChartType] = useState("count-bar");
  // count-bar | price-bar | pie

  const [summary, setSummary] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  /** ================= 데이터 로딩 ================= */
  useEffect(() => {
    getAccommodationStatsInfo().then((obj) => {
      if (obj?.success) {
        setSummary(obj.accommodationStatisticalInfoList ?? []);
        setTotalCount(obj.totalCount ?? 0);
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-[180px_1fr] gap-6 bg-white rounded-lg shadow-sm p-6">
      {/* ===== 왼쪽: 차트 선택 ===== */}
      <div className="space-y-3 border-r pr-4">
        <button
          onClick={() => setChartType("count-bar")}
          className={`w-full px-3 py-2 rounded-md text-sm text-left ${
            chartType === "count-bar"
              ? "bg-emerald-400 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          숙소 분포
        </button>

        <button
          onClick={() => setChartType("price-bar")}
          className={`w-full px-3 py-2 rounded-md text-sm text-left ${
            chartType === "price-bar"
              ? "bg-blue-400 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          평균 가격
        </button>

        <button
          onClick={() => setChartType("pie")}
          className={`w-full px-3 py-2 rounded-md text-sm text-left ${
            chartType === "pie"
              ? "bg-violet-400 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          파이형
        </button>
      </div>

      {/* ===== 오른쪽: 차트 ===== */}
      <div className="flex justify-center overflow-x-auto">
        {chartType === "count-bar" && (
          <BarChart width={820} height={430} data={summary}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="accommodationCount" name="숙소 수" barSize={36}>
              {summary.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )}

        {chartType === "price-bar" && (
          <BarChart width={820} height={430} data={summary}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip formatter={(v) => `₩${Number(v).toLocaleString()}`} />
            <Legend />
            <Bar dataKey="averagePrice" name="평균 가격" barSize={36}>
              {summary.map((_, index) => (
                <Cell key={index} fill={COLORS[(index + 3) % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )}

        {chartType === "pie" && (
          <PieChart width={520} height={430}>
            <Pie
              data={summary.filter((i) => i.accommodationCount > 0)}
              dataKey="accommodationCount"
              nameKey="location"
              innerRadius={90}
              outerRadius={160}
              label
            >
              {summary.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        )}
      </div>
    </div>
  );
}
