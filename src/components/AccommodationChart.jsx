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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ================= 헤더 ================= */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            숙소 지역 통계 리포트
          </h2>

          {/* 차트 전환 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("count-bar")}
              className={`px-3 py-1 rounded-md text-sm ${
                chartType === "count-bar"
                  ? "bg-emerald-400 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              숙소 분포
            </button>

            <button
              onClick={() => setChartType("price-bar")}
              className={`px-3 py-1 rounded-md text-sm ${
                chartType === "price-bar"
                  ? "bg-blue-400 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              평균 가격
            </button>

            <button
              onClick={() => setChartType("pie")}
              className={`px-3 py-1 rounded-md text-sm ${
                chartType === "pie"
                  ? "bg-violet-400 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              파이형
            </button>
          </div>
        </div>

        {/* 소계 */}
        <div className="text-sm text-gray-600 text-center">
          전체 숙소 수 :<span className="font-semibold ml-1">{totalCount}</span>
          개
        </div>
      </div>

      {/* ================= 차트 영역 ================= */}
      <div className="flex justify-center bg-white rounded-lg shadow-sm p-6">
        {/* ================= 숙소 분포별 막대 ================= */}
        {chartType === "count-bar" && (
          <BarChart
            width={800}
            height={450}
            data={summary}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar
              dataKey="accommodationCount"
              name="숙소 수"
              barSize={36}
              isAnimationActive={true}
            >
              {summary.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )}

        {/* ================= 숙소 가격별 막대 ================= */}
        {chartType === "price-bar" && (
          <BarChart
            width={800}
            height={450}
            data={summary}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip
              formatter={(value) => `₩${Number(value).toLocaleString()}`}
            />
            <Legend />

            <Bar
              dataKey="averagePrice"
              name="평균 가격"
              barSize={36}
              isAnimationActive={true}
            >
              {summary.map((_, index) => (
                <Cell key={index} fill={COLORS[(index + 3) % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )}

        {/* ================= 파이형 ================= */}
        {chartType === "pie" && (
          <PieChart width={520} height={450}>
            <Pie
              data={summary.filter((item) => item.accommodationCount > 0)}
              dataKey="accommodationCount"
              nameKey="location"
              cx="50%"
              cy="50%"
              outerRadius={160}
              innerRadius={90}
              label
              isAnimationActive={true}
            >
              {summary.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Legend
              payload={summary.map((item, index) => ({
                value: `${item.location} (${item.accommodationCount})`,
                type: "square",
                id: index,
                fill: COLORS[index % COLORS.length],
              }))}
            />
          </PieChart>
        )}
      </div>
    </div>
  );
}
