import { useNavigate } from "react-router";
import logo from "../assets/Airbnb_Logo.png";
import { useState, useEffect } from "react";
import { useAccount, useToken } from "../stores/account-store";
import AccommodationLocationReportPage from "@/components/accommodationChart";
import { getAccommodationStatsInfo } from "@/util/DatabaseUtil";

export default function Report() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const { account } = useAccount();
  const { clearToken, clearAccount } = useToken();

  const MENU = [
    {
      section: "예약",
      items: [
        { label: "숙소 예약", path: "/profile/bookings" },
        { label: "찜", path: "/profile/wishlists" },
      ],
    },
    {
      section: "활동",
      items: [
        { label: "리스트", path: "/hosting/listings" },
        { label: "메시지", path: "/hosting/listings?tab=messages" },
      ],
    },
    {
      section: "계정",
      items: [
        { label: "프로필", path: "/profile" },
        { label: "리포트", path: "/report" },
      ],
    },
  ];

  // ===== 통계 데이터 =====
  const [summary, setSummary] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    getAccommodationStatsInfo().then((res) => {
      if (res?.success) {
        setSummary(res.accommodationStatisticalInfoList ?? []);
        setTotalCount(res.totalCount ?? 0);
      }
    });
  }, []);

  const topLocation =
    summary.length > 0
      ? summary.reduce((a, b) =>
          b.accommodationCount > a.accommodationCount ? b : a
        )
      : null;

  const maxAvgPriceLocation =
    summary.length > 0
      ? summary.reduce((a, b) => (b.averagePrice > a.averagePrice ? b : a))
      : null;

  return (
    <>
      {/* ================= 헤더 ================= */}
      <header className="fixed top-0 left-0 w-full h-[90px] border-b border-neutral-200 z-50 bg-white">
        <div className="h-full w-full flex items-center justify-between max-w-[1350px] mx-auto px-6">
          <img
            src={logo}
            className="w-[100px] cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* 우측 메뉴 */}
          <div className="flex gap-2 items-center relative">
            <div className="hidden sm:block rounded-full px-3 py-2 hover:bg-gray-200 cursor-pointer">
              <p
                className="text-xs font-bold whitespace-nowrap"
                onClick={() => navigate("/")}
              >
                게스트 모드로 전환
              </p>
            </div>
            {/* 프로필 원형 (메뉴 X) */}
            <div
              className="w-8 h-8 rounded-full bg-neutral-800 text-white
              flex items-center justify-center text-xs font-bold"
            >
              {account?.name?.charAt(0)}
            </div>
            {/* 햄버거 (메뉴 O) */}
            <div
              className="rounded-full px-2 py-2 bg-gray-100 hover:bg-gray-200 cursor-pointer"
              onClick={() => setOpenMenu((prev) => !prev)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </div>

            {/* 메뉴 */}
            {openMenu && (
              <>
                {/* 바깥 클릭 닫기 */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenMenu(false)}
                />

                {/* 메뉴 박스 */}
                <div className="absolute top-12 right-0 md:right-0 w-[200px] bg-white rounded-md shadow-xl border z-50">
                  {MENU.map((group) => (
                    <div key={group.section}>
                      <p className="px-4 pt-3 pb-1 text-[11px] text-neutral-400">
                        {group.section}
                      </p>

                      {group.items.map((item) => (
                        <div
                          key={item.path}
                          className="px-4 py-2 hover:bg-gray-100 text-xs cursor-pointer"
                          onClick={() => {
                            navigate(item.path);
                            setOpenMenu(false);
                          }}
                        >
                          {item.label}
                        </div>
                      ))}

                      <div className="border-t my-1" />
                    </div>
                  ))}

                  <div
                    className="px-4 py-3 hover:bg-gray-100 text-xs text-red-500 cursor-pointer"
                    onClick={() => {
                      clearToken();
                      clearAccount();
                      setOpenMenu(false);
                      navigate("/");
                    }}
                  >
                    로그아웃
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ================= 본문 ================= */}
      <main className="w-full bg-neutral-50 pt-[90px]">
        <div className="max-w-[1350px] mx-auto px-6 py-10 space-y-5">
          {/* 제목 */}
          <section>
            <h1 className="text-2xl font-bold">리포트</h1>
            <p className="text-sm text-gray-500">
              숙소 지역별 통계 및 가격 분석
            </p>
          </section>

          {/* ===== 요약 카드 3칸 ===== */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {/* 전체 숙소 수 */}
            <div className="bg-white rounded-lg border px-4 py-3 h-fit">
              <p className="text-xs text-gray-400">전체 숙소 수</p>
              <p className="text-lg font-semibold mt-1">{totalCount}개</p>
            </div>

            {/* 가장 인기 지역 */}
            <div className="bg-white rounded-lg border px-4 py-3 h-fit">
              <p className="text-xs text-gray-400">
                가장 인기 지역 : {topLocation?.accommodationCount ?? 0}개
              </p>
              <p className="text-lg font-semibold mt-1">
                {topLocation?.location ?? "-"}
              </p>
            </div>

            {/* 평균 가격 최고 지역 */}
            <div className="bg-white rounded-lg border px-4 py-3 h-fit">
              <p className="text-xs text-gray-400">
                평균 가격 최고 지역 : ₩
                {maxAvgPriceLocation?.averagePrice?.toLocaleString() ?? 0}
              </p>
              <p className="text-lg font-semibold mt-1">
                {maxAvgPriceLocation?.location ?? "-"}
              </p>
            </div>
          </section>

          {/* ===== 그래프 ===== */}
          <section className="bg-white rounded-xl border shadow-sm p-8">
            <AccommodationLocationReportPage />
          </section>
        </div>
      </main>
    </>
  );
}
