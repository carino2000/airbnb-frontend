import { useNavigate } from "react-router";
import logo from "../assets/arbnb_logo-b.png";
import step2 from "../assets/step2.mp4";

export default function HostingStandOut() {
  const navigate = useNavigate();

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full h-[90px] bg-white z-40">
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

      {/* MAIN */}
      <main
        className="
          fixed
          top-[90px]
          left-0
          w-full
          h-[calc(100vh-185px)]
          flex
          items-center
          justify-center
          pt-12
          px-6
        "
      >
        <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-4 gap-12 px-6 lg:px-16">
          {/* 왼쪽 텍스트 */}
          <div className="lg:col-span-2 flex flex-col justify-center max-w-[520px]">
            <span className="text-sm font-bold mb-2">2단계</span>

            <h1 className="text-3xl lg:text-[40px] font-bold leading-tight mb-6">
              숙소의 매력을 <br />
              돋보이게 하세요.
            </h1>

            <p className="text-neutral-700 leading-relaxed max-w-[520px]">
              이 단계에서는 숙소에 갖춰진 편의시설과 사진 5장 이상을 추가한 후
              <br />
              숙소 이름과 설명을 작성하시면 됩니다.
            </p>
          </div>

          {/* 오른쪽 영상 */}
          <div className="lg:col-span-2 flex justify-center items-center">
            <video
              src={step2}
              muted
              autoPlay
              loop
              playsInline
              className="w-full max-w-[600px]"
            />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full h-[95px] bg-white z-40">
        <div className="grid grid-cols-3 h-1.5 w-full">
          <div className="bg-neutral-950" />
          <div className="bg-neutral-950" />
          <div className="bg-neutral-300" />
        </div>

        <div className="md:px-11 flex items-center justify-between h-[calc(100%-6px)]">
          <button
            className="border-b-2 cursor-pointer text-sm"
            onClick={() => navigate("/hosting/accommodation/floor-plan")}
          >
            뒤로
          </button>

          <button
            className="px-8 py-3 bg-neutral-950 rounded-xl text-sm text-white font-bold hover:bg-neutral-950/50"
            onClick={() => navigate("/hosting/amenities")}
          >
            다음
          </button>
        </div>
      </footer>
    </>
  );
}
