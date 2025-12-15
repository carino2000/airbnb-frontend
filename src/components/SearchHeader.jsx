import { useRef, useState } from "react";
import logo from "../assets/Airbnb_Logo.png";
import stays from "../assets/nav-stays.png";
import experiences from "../assets/nav-experiences.png";
import services from "../assets/nav-services.png";
import { useNavigate } from "react-router";
import Login from "../pages/Login";

export default function SearchHeader({ onClose, onLogin }) {
  const navigate = useNavigate();
  const checkinRef = useRef(null);
  const checkoutRef = useRef(null);

  //
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <>
      <header
        className="fixed top-0 left-0 w-full h-40 md:h-[200px]
                       bg-neutral-100 border-b-2 z-50 border-b-neutral-200"
      >
        {/* === 상단 영역 (로고 / 메뉴 / 호스트 / 햄버거) === */}
        <div className="h-25 flex items-center px-6 md:px-10">
          <div className="flex items-center justify-between w-full gap-4">
            {/* 로고 */}
            <img
              src={logo}
              alt=""
              className="w-[100px] h-auto cursor-pointer shrink-0"
              onClick={() => {
                onClose();
                navigate("/");
              }}
            />

            {/* 중앙 메뉴 (메인 헤더와 동일) */}
            <nav className="hidden md:flex gap-5 text-sm text-gray-700 cursor-pointer whitespace-nowrap">
              <div className="flex gap-2 items-center group">
                <img
                  src={stays}
                  className="w-9 h-auto
                           group-hover:scale-110
                           transition-transform duration-200"
                />
                <p className="hidden lg:block group-hover:font-semibold">
                  숙소
                </p>
              </div>

              <div className="flex gap-2 items-center group">
                <img
                  src={experiences}
                  className="w-8 h-auto
                           group-hover:scale-110
                           transition-transform duration-200"
                />
                <p className="hidden lg:block group-hover:font-semibold">
                  체험
                </p>
              </div>

              <div className="flex gap-2 items-center group">
                <img
                  src={services}
                  className="w-8 h-auto
                           group-hover:scale-110
                           transition-transform duration-200"
                />
                <p className="hidden lg:block group-hover:font-semibold">
                  서비스
                </p>
              </div>
            </nav>

            {/* 우측 메뉴 */}
            <div className="flex gap-1 items-center shrink-0">
              <div className="hidden sm:block rounded-full px-3 py-2 hover:bg-gray-200 cursor-pointer">
                <p
                  className="text-xs font-bold whitespace-nowrap"
                  onClick={() => navigate("/hosting")}
                >
                  호스팅 하기
                </p>
              </div>

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
            </div>

            {/* 햄버거 메뉴 */}
            {openMenu && (
              <div className="absolute top-[70px] right-6 md:right-10 w-[150px] bg-white rounded-md shadow-xl border border-gray-200 z-999">
                <div
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-xs hover:font-semibold"
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/log-in");
                  }}
                >
                  로그인
                </div>
                <div
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-xs hover:font-semibold"
                  onClick={() => {
                    navigate("/sign-up");
                    setOpenMenu(false);
                  }}
                >
                  회원가입
                </div>
              </div>
            )}
          </div>
        </div>

        {/* === 검색창 영역 (메인 헤더와 동일) === */}
        <div className="w-full flex justify-center px-4 mb-4 md:mb-6">
          <div
            className="flex items-center w-full max-w-[800px]
                        md:w-[600px] lg:w-[800px]
                        bg-white shadow-md rounded-full
                        overflow-hidden border border-neutral-200"
          >
            {/* 여행지 */}
            <div
              className="flex-auto min-w-0 px-6 py-4
                          hover:bg-neutral-200
                          rounded-full cursor-pointer"
            >
              <p className="text-xs truncate whitespace-nowrap">여행지</p>
              <input
                type="text"
                placeholder="여행지 검색"
                className="w-full min-w-0 truncate
                         text-sm text-gray-600
                         bg-transparent focus:outline-none
                         placeholder:text-xs"
              />
            </div>

            <div className="w-px h-8 bg-gray-300" />

            {/* 체크인 */}
            <div
              className="flex-auto min-w-0 px-6 py-4
                       hover:bg-neutral-200
                       rounded-full cursor-pointer"
              onClick={() => checkinRef.current.showPicker()}
            >
              <p className="text-xs truncate whitespace-nowrap">체크인</p>
              <input
                ref={checkinRef}
                type="date"
                onMouseDown={(e) => e.preventDefault()}
                className="w-full min-w-0 truncate
                         text-xs text-gray-600
                         bg-transparent focus:outline-none cursor-pointer"
              />
            </div>

            <div className="w-px h-8 bg-gray-300" />

            {/* 체크아웃 */}
            <div
              className="flex-auto min-w-0 px-6 py-4
                       hover:bg-neutral-200
                       rounded-full cursor-pointer"
              onClick={() => checkoutRef.current.showPicker()}
            >
              <p className="text-xs truncate whitespace-nowrap">체크아웃</p>
              <input
                ref={checkoutRef}
                type="date"
                onMouseDown={(e) => e.preventDefault()}
                className="w-full min-w-0 truncate
                         text-xs text-gray-600
                         bg-transparent focus:outline-none cursor-pointer"
              />
            </div>

            <div className="w-px h-8 bg-gray-300" />

            {/* 여행자 + 돋보기 */}
            <div
              className="flex min-w-0 items-center px-2 py-1
                          hover:bg-neutral-200
                          rounded-full transition-all"
            >
              <div className="flex-1 min-w-0 px-4 py-3">
                <p className="text-xs truncate whitespace-nowrap">여행자</p>
                <input
                  type="number"
                  min="1"
                  placeholder="게스트 추가"
                  className="w-full truncate
                           text-sm text-gray-600
                           bg-transparent focus:outline-none
                           placeholder:text-xs"
                />
              </div>

              {/* 🔍 돋보기  */}
              <button
                className="shrink-0 bg-rose-500 text-white p-3
                               rounded-full hover:bg-rose-700 transition cursor-pointer"
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
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
