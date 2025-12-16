import { useNavigate } from "react-router";
import logo from "../assets/arbnb_logo-b.png";
import stays1 from "../assets/listing information.png";
import stays2 from "../assets/room photos.png";
import stays3 from "../assets/room registration.png";
import { useAccommodation } from "../stores/account-store";
import { useEffect } from "react";

export default function Hosting() {
  const navigate = useNavigate();
  const clearAccommodation = useAccommodation((s) => s.clearAccommodation);

  return (
    <>
      <header className="top-0 left-0 w-full h-40 md:h-[90px]">
        <div className="h-full flex items-center px-6 md:px-10">
          <div className="flex items-center justify-between w-full">
            {/* 왼쪽 로고 */}
            <img
              src={logo}
              alt="logo"
              className="w-9 cursor-pointer"
              onClick={() => navigate("/")}
            />

            {/* 오른쪽 나가기 */}
            <button
              className="px-6 py-2 border border-neutral-400 rounded-full text-xs font-bold hover:cursor-pointer"
              onClick={() => navigate("/")}
            >
              나가기
            </button>
          </div>
        </div>
      </header>

      <main className="px-30">
        {/* 모바일에서는 1컬럼, lg 이상에서 4컬럼 */}
        <div className="min-h-[calc(100vh-200px)] grid grid-cols-1 lg:grid-cols-4 gap-12 px-6 lg:px-16">
          {/* 왼쪽 큰 영역 */}
          {/* ✅ 수정: lg에서만 col-span-2 */}
          <div className="lg:col-span-2 flex items-center">
            <h1 className="text-3xl lg:text-[40px] font-bold leading-tight">
              간단하게 에어비앤비
              <br />
              호스팅을 시작할 수<br />
              있습니다
            </h1>
          </div>

          {/* 오른쪽 단계 영역 */}
          {/* lg에서만 col-span-2 */}
          <div className="lg:col-span-2 flex flex-col justify-center gap-10">
            {/* STEP 1 */}
            <div className="flex items-start gap-4 border-b border-b-neutral-400 pb-6">
              <span className="font-semibold text-xl">1</span>
              <div className="flex-1">
                <p className="font-semibold text-xl mb-2">
                  숙소 정보를 알려주세요
                </p>
                <p className="text-sm text-neutral-700">
                  숙소 위치와 숙박 가능 인원 등 기본 정보를 알려주세요.
                </p>
              </div>

              <img
                src={stays1}
                alt=""
                className="hidden lg:block w-28 shrink-0"
              />
            </div>

            {/* STEP 2 */}
            <div className="flex items-start gap-4 border-b border-b-neutral-400 pb-6">
              <span className="font-semibold text-xl">2</span>
              <div className="flex-1">
                <p className="font-semibold text-xl mb-2">
                  숙소를 돋보이게 하세요
                </p>
                <p className="text-sm text-neutral-700">
                  사진을 5장 이상 제출하고 제목과 설명을 추가해주시면 <br />{" "}
                  숙소가 돋보일 수 있도록 도와드릴게요.
                </p>
              </div>

              <img
                src={stays2}
                alt=""
                className="hidden lg:block w-28 shrink-0"
              />
            </div>

            {/* STEP 3 */}
            <div className="flex items-start gap-4">
              <span className="font-semibold text-xl">3</span>

              <div className="flex-1">
                <p className="font-semibold text-xl mb-2">등록을 완료하세요</p>
                <p className="text-sm text-neutral-700">
                  호스팅 초기에 적용할 요금을 설정하고, 세부정보를 인증한 <br />{" "}
                  다음 리스팅을 게시하세요.
                </p>
              </div>

              <img
                src={stays3}
                alt=""
                className="hidden lg:block w-28 shrink-0"
              />
            </div>
          </div>
        </div>
      </main>
      <footer className="md:px-11 flex items-center justify-end md:h-[95px]  border-t-6 border-t-neutral-300">
        <button
          className=" px-8 py-3 bg-rose-500 rounded-xl text-sm text-white font-bold hover:cursor-pointer hover:bg-rose-700"
          onClick={() => navigate("/hosting/accommodation")}
        >
          시작하기
        </button>
      </footer>
    </>
  );
}
