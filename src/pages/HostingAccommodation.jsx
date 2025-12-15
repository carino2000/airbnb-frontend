import { useNavigate } from "react-router";
import logo from "../assets/arbnb_logo-b.png";
import step1 from "../assets/step1.mp4";

export default function Hosting() {
  const navigate = useNavigate();

  return (
    <>
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

      <main className="px-30">
        <div className="min-h-[calc(100vh-200px)] grid grid-cols-1 lg:grid-cols-4 gap-12 px-6 lg:px-16">
          {/* 왼쪽 텍스트 영역 */}
          <div
            className="
              lg:col-span-2
              flex flex-col
              justify-center
              max-w-[520px]          // 텍스트 폭 제한
              pt-10                  // 위 기준선 고정 (찌부 방지)
            "
          >
            <span className="text-sm font-bold mb-2">1단계</span>

            <h1 className="text-3xl lg:text-[40px] font-bold leading-tight mb-6">
              숙소 정보를 알려주세요.
            </h1>

            <p className="text-neutral-700 leading-relaxed max-w-[520px]">
              먼저 숙소 유형을 선택하고, 게스트가 예약할 수 있는 숙소가 공간
              전체인지 개인실 또는 다인실인지 알려주세요. 그런 다음 숙소 위치와
              수용 가능 인원을 알려주세요.
            </p>
          </div>

          {/* 오른쪽 영상 */}
          <div className="lg:col-span-2 flex justify-center items-center">
            <video
              src={step1}
              muted
              autoPlay
              loop
              playsInline
              className="w-full max-w-[520px] rounded-xl" // ✅ 수정: 영상도 폭 맞춤
            />
          </div>
        </div>
      </main>

      <footer className="md:h-[95px] border-t border-neutral-300">
        {/* ✅ 수정: 진행바를 padding 영향 없이 full width로 */}
        <div className="grid grid-cols-3 h-1.5 w-full">
          <div className="bg-neutral-950" /> {/* 1단계 */}
          <div className="bg-neutral-300" />
          <div className="bg-neutral-300" />
        </div>

        {/* 기존 버튼 영역 (padding 유지) */}
        <div className="md:px-11 flex items-center justify-between h-[calc(100%-6px)]">
          <button
            className="border-b-2 hover:cursor-pointer"
            onClick={() => navigate("/hosting")}
          >
            뒤로
          </button>

          <button
            className="px-8 py-3 bg-neutral-500/50  rounded-xl text-sm text-white font-bold hover:bg-neutral-950  cursor-pointer"
            onClick={() => navigate("/hosting/accommodation/structure")}
          >
            다음
          </button>
        </div>
      </footer>
    </>
  );
}
