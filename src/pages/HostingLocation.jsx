import { useNavigate } from "react-router";
import { useState } from "react";
import logo from "../assets/arbnb_logo-b.png";

export default function HostingLocation() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

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

      {/* 메인 */}
      <main
        className="
          min-h-[calc(100vh-200px)]
          flex
          justify-center
          px-6
          pt-28 md:pt-10
        "
      >
        <div className="w-full">
          {/* 타이틀 */}
          <div className="max-w-[520px] mb-14 mx-auto">
            <h1 className="text-2xl lg:text-[35px] font-bold leading-tight mb-4 text-left">
              숙소 위치는 어디인가요?
            </h1>
            <p className="text-neutral-700 leading-relaxed text-left">
              주소는 게스트의 예약이 확정된 이후에 공개됩니다.
            </p>
          </div>

          {/* 콘텐츠 */}
          <div className="grid grid-cols-1 gap-12 items-start border">
            {/* 왼쪽 - 입력 */}
            <div className="flex flex-col gap-5 max-w-[520px] mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="주소를 입력하세요"
                  className="
                    w-full h-12
                    border border-neutral-400
                    rounded-xl
                    pl-4 pr-12
                    text-sm
                    focus:outline-none
                    focus:border-black
                  "
                />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.35-4.35m0 0a7.5 7.5 0 1 0-10.6 0a7.5 7.5 0 0 0 10.6 0Z"
                  />
                </svg>
              </div>

              <div className="h-80 bg-neutral-200 rounded-xl flex items-center justify-center text-sm text-neutral-500">
                지도 영역
              </div>
            </div>

            {/* 오른쪽 여백 */}
            <div />
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="md:h-[95px] border-t border-neutral-300">
        <div className="grid grid-cols-3 h-1.5 w-full">
          <div className="bg-neutral-950" />
          <div className="bg-neutral-300" />
          <div className="bg-neutral-300" />
        </div>

        <div className="md:px-11 flex items-center justify-between h-[calc(100%-6px)]">
          <button
            className="border-b-2"
            onClick={() => navigate("/hosting/accommodation/structure")}
          >
            뒤로
          </button>

          <button
            disabled={!address.trim()}
            className={`
              px-8 py-3 rounded-xl text-sm font-bold
              ${
                address.trim()
                  ? "bg-neutral-950 text-white hover:bg-neutral-800"
                  : "bg-neutral-300 text-white cursor-not-allowed"
              }
            `}
            onClick={() => navigate("/hosting/accommodation")}
          >
            다음
          </button>
        </div>
      </footer>
    </>
  );
}
