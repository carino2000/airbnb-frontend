import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import logo from "../assets/arbnb_logo-b.png";
import {
  useAccommodation,
  useAccount,
  useToken,
} from "../stores/account-store";

export default function HostingStructure() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);

  const account = useAccount((s) => s.account);
  const setAccommodation = useAccommodation((s) => s.setAccommodation);
  const clearAccommodation = useAccommodation((s) => s.clearAccommodation);

  useEffect(() => {
    clearAccommodation();
    setAccommodation({
      hostId: account.id,
    });
  }, []);

  return (
    <>
      {/* 헤더 */}
      <header className="top-0 left-0 w-full h-40 md:h-[90px]">
        <div className="h-full flex items-center px-6 md:px-10">
          <div className="flex items-center justify-between w-full">
            <img
              src={logo}
              alt="logo"
              className="w-9 cursor-pointer"
              onClick={() => navigate("/")}
            />

            <button
              className="px-6 py-2 border border-neutral-400 rounded-full text-xs font-bold"
              onClick={() => navigate("/")}
            >
              나가기
            </button>
          </div>
        </div>
      </header>

      {/* 메인 - 전체 화면 기준 가운데 */}
      <main
        className="
  min-h-[calc(100vh-200px)]
  flex flex-col
  px-6
  pt-28 md:pt-10 items-center
  
"
      >
        <div className="w-full max-w-[600px] ">
          <h1 className="text-2xl lg:text-[35px] font-bold leading-tight mb-25 text-left">
            다음중 숙소를 가장 잘 설명하는 것은 무엇인가요?
          </h1>
        </div>

        {/* 카드 */}
        <div className="w-full max-w-[800px] grid grid-cols-1 md:grid-cols-2 gap-8 h-60 ">
          {/* 주택 */}
          <button
            onClick={() => setSelectedType("house")}
            className={`
                w-full h-[350px]
                flex flex-col items-center justify-center gap-4
                border rounded-2xl p-8 cursor-pointer
                transition
                ${
                  selectedType === "house"
                    ? "border-black border-3"
                    : "hover:border-black"
                }
              `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10.5L12 3l9 7.5M5 10v9h5v-5h4v5h5v-9"
              />
            </svg>

            <span className="text-base font-semibold">주택</span>
          </button>

          {/* 아파트 */}
          <button
            onClick={() => setSelectedType("apartment")}
            className={`
               w-full h-[350px]
                flex flex-col items-center justify-center gap-4
                border rounded-2xl p-8 cursor-pointer
                transition
                ${
                  selectedType === "apartment"
                    ? "border-black border-3"
                    : "hover:border-black"
                }
              `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-12 h-12"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
              />
            </svg>

            <span className="text-base font-semibold">아파트</span>
          </button>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="md:h-[95px] border-t border-neutral-300">
        <div className="grid grid-cols-3 h-1.5 w-full">
          <div className="bg-neutral-950" />
          <div className="bg-neutral-300" />
          <div className="bg-neutral-300" />
        </div>

        <div className="md:px-11 flex items-center justify-between h-[calc(100%-6px)] ">
          <button
            className="border-b-2 cursor-pointer"
            onClick={() => navigate("/hosting/accommodation")}
          >
            뒤로
          </button>

          <button
            disabled={!selectedType}
            className={`
    px-8 py-3 rounded-xl text-sm font-bold
    transition-colors cursor-pointer
    ${
      selectedType
        ? "bg-neutral-950 text-white hover:bg-neutral-800"
        : "bg-neutral-300 text-white cursor-not-allowed"
    }
  `}
            onClick={() => navigate("/hosting/accommodation/location")}
          >
            다음
          </button>
        </div>
      </footer>
    </>
  );
}
