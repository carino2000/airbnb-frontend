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

/**
 * ===============================
 * 더미 데이터 (전국 단위 숙소 위치)
 * ===============================
 * - 광역시/특별시 제외
 * - 서울, 인천, 제주 포함
 */
const DUMMY_LOCATION_SUMMARY = [
  { location: "서울", count: 42 },
  { location: "인천", count: 18 },
  { location: "경기", count: 67 },
  { location: "강원", count: 21 },
  { location: "충북", count: 14 },
  { location: "충남", count: 19 },
  { location: "전북", count: 16 },
  { location: "전남", count: 23 },
  { location: "경북", count: 25 },
  { location: "경남", count: 28 },
  { location: "제주", count: 34 },
];

/** 파이 차트 색상 */
const COLORS = [
  "#2ECC71",
  "#27AE60",
  "#1ABC9C",
  "#16A085",
  "#48C9B0",
  "#0E6655",
  "#58D68D",
  "#28B463",
  "#82E0AA",
  "#73C6B6",
  "#117A65",
];

export default function AccommodationLocationReportPage() {
  /** ================= 상태 ================= */
  const [chartType, setChartType] = useState("bar");
  const [summary, setSummary] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  /** ================= 데이터 로딩 (더미) ================= */
  useEffect(() => {
    setSummary(DUMMY_LOCATION_SUMMARY);

    const total = DUMMY_LOCATION_SUMMARY.reduce(
      (acc, cur) => acc + cur.count,
      0
    );
    setTotalCount(total);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* ================= 헤더 ================= */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            숙소 지역 분포 통계
          </h2>

          {/* 차트 타입 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("bar")}
              className={`px-3 py-1 rounded-md text-sm ${
                chartType === "bar"
                  ? "bg-emerald-400 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              막대형
            </button>

            <button
              onClick={() => setChartType("pie")}
              className={`px-3 py-1 rounded-md text-sm ${
                chartType === "pie"
                  ? "bg-emerald-400 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              파이형
            </button>
          </div>
        </div>

        {/* 소계 */}
        <div className="text-sm text-gray-600 text-center">
          전체 숙소 수 : <span className="font-semibold">{totalCount}</span>개
        </div>
      </div>

      {/* ================= 차트 영역 ================= */}
      <div className="flex justify-center">
        {chartType === "bar" ? (
          <BarChart
            width={700}
            height={420}
            data={summary}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="count"
              name="숙소 수"
              fill="#34D399"
              barSize={40}
              isAnimationActive={true}
            />
          </BarChart>
        ) : (
          <PieChart width={500} height={420}>
            <Pie
              data={summary}
              dataKey="count"
              nameKey="location"
              cx="50%"
              cy="50%"
              outerRadius={140}
              innerRadius={80}
              label
              isAnimationActive={true}
            >
              {summary.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Legend
              payload={summary.map((item, index) => ({
                value: `${item.location} (${item.count})`,
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
