import { useNavigate } from "react-router";
import logo from "../assets/arbnb_logo-b.png";

export default function HostingComplete() {
  const navigate = useNavigate();

  return (
    <>
      {/* ================= 헤더 ================= */}
      <header className="fixed top-0 left-0 w-full h-40 md:h-[90px] bg-white z-40">
        <div className="h-full flex items-center px-6 md:px-10">
          <div className="flex items-center justify-between w-full">
            <img
              src={logo}
              alt="logo"
              className="w-9 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <button className="px-6 py-2 border rounded-full text-xs font-bold">
              나가기
            </button>
          </div>
        </div>
      </header>

      {/* ================= 메인 ================= */}
      <main
        className="
          min-h-[calc(100vh-185px)]
          px-6
          pt-[110px]
          pb-[120px]
          flex
          flex-col
          items-center
          justify-center
          gap-6
        "
      >
        {/* ✅ 성공 아이콘 */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="success-svg text-blue-900"
        >
          {/* 원 */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="circle"
          />

          {/* 체크 */}
          <path
            d="M38 62 L54 76 L82 44"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check"
          />
        </svg>

        <h2 className="text-xl font-bold">신청해주셔서 감사합니다.</h2>
        <p className="text-sm text-gray-500 text-center"></p>
      </main>

      {/* ================= 푸터 ================= */}
      <footer className="fixed bottom-0 left-0 w-full h-[95px] bg-white z-40" />

      {/* ================= 애니메이션 스타일 ================= */}
      <style>{`
        .circle {
          stroke-dasharray: 314;
          stroke-dashoffset: 314;
          animation: draw-circle 1s ease-out forwards;
        }

        .check {
          stroke-dasharray: 70;
          stroke-dashoffset: 70;
          animation: draw-check 0.5s ease-out forwards;
          animation-delay: 1s;
        }

        @keyframes draw-circle {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes draw-check {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </>
  );
}
