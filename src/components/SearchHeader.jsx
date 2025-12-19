import { useRef, useState } from "react";
import logo from "../assets/Airbnb_Logo.png";
import stays from "../assets/nav-stays.png";
import experiences from "../assets/nav-experiences.png";
import services from "../assets/nav-services.png";
import { useNavigate } from "react-router";
import Login from "../pages/Login";
import { useAccount, useToken } from "../stores/account-store";

export default function SearchHeader({ onClose, onLogin }) {
  const navigate = useNavigate();
  const checkinRef = useRef(null);
  const checkoutRef = useRef(null);

  //
  const [openMenu, setOpenMenu] = useState(false);

  const { token } = useToken();
  const { account } = useAccount();

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
  return (
    <>
      <header className="fixed top-0 left-0 w-full h-40 md:h-[200px] bg-neutral-100 border-b-2 z-50 border-b-neutral-200">
        <div className="h-25 flex items-center px-6 md:px-10">
          <div className="grid grid-cols-3 items-center w-full">
            {/* ================= 왼쪽 : 로고 ================= */}
            <div className="flex items-center">
              <img
                src={logo}
                alt=""
                className="w-[100px] h-auto cursor-pointer"
                onClick={() => navigate("/")}
              />
            </div>

            {/* ================= 가운데 : 숙소 / 체험 / 서비스 ================= */}
            <nav className="hidden md:flex justify-center gap-8 whitespace-nowrap">
              <div className="flex items-center gap-2 cursor-pointer group">
                <img
                  src={stays}
                  className="w-9 h-auto group-hover:scale-110 transition-transform duration-200"
                />
                <p className="hidden lg:block text-sm font-medium group-hover:font-semibold">
                  숙소
                </p>
              </div>

              <div className="flex items-center gap-2 cursor-pointer group">
                <img
                  src={experiences}
                  className="w-8 h-auto group-hover:scale-110 transition-transform duration-200"
                />
                <p className="hidden lg:block text-sm font-medium group-hover:font-semibold">
                  체험
                </p>
              </div>

              <div className="flex items-center gap-2 cursor-pointer group">
                <img
                  src={services}
                  className="w-8 h-auto group-hover:scale-110 transition-transform duration-200"
                />
                <p className="hidden lg:block text-sm font-medium group-hover:font-semibold">
                  서비스
                </p>
              </div>
            </nav>

            {/* ================= 오른쪽 : 상태별 메뉴 ================= */}
            <div className="flex justify-end items-center gap-3">
              {/* 로그인 상태일 때 */}
              {token && (
                <>
                  <button
                    className="hidden sm:block text-xs font-bold px-3 py-2 rounded-full hover:bg-gray-200"
                    onClick={() => navigate("/hosting")}
                  >
                    호스트 모드로 전환
                  </button>

                  {/* 원형 프로필 */}
                  <div
                    className="w-8 h-8 rounded-full bg-black flex items-center justify-center
             text-white text-xs font-bold cursor-pointer"
                    onClick={() => navigate("/profile")}
                  >
                    {account?.name?.[0]}
                  </div>
                </>
              )}

              {/* 햄버거 */}
              <div
                className="rounded-full px-1.5 py-1.5 bg-gray-200 hover:bg-gray-300 cursor-pointer"
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

            {/* ================= 햄버거 메뉴 ================= */}
            {openMenu && (
              <>
                {/*  바깥 클릭 감지용 오버레이 */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenMenu(false)}
                />
                {/* 메뉴*/}
                <div className="absolute top-[70px] right-6 md:right-10 w-[200px] bg-white rounded-md shadow-xl border z-50">
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

        {/* 검색창 */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full flex justify-center px-4 mb-4 md:mb-6"
        >
          <div className="flex items-center w-full max-w-[800px] md:w-[600px] lg:w-[800px] bg-white shadow-md rounded-full overflow-hidden border border-neutral-200">
            {/* 여행지 */}
            <div className="flex-auto min-w-0 px-6 py-4 hover:bg-neutral-200 rounded-full cursor-pointer">
              <p className="text-xs truncate whitespace-nowrap">여행지</p>
              <input
                name="destination"
                type="text"
                placeholder="여행지 검색"
                className="w-full min-w-0 truncate text-sm text-gray-600 bg-transparent focus:outline-none placeholder:text-xs"
              />
            </div>

            <div className="w-px h-8 bg-gray-300"></div>

            {/* 체크인 */}
            <div
              className="flex-auto min-w-0 px-6 py-4 hover:bg-neutral-200 rounded-full cursor-pointer"
              onClick={() => checkinRef.current.showPicker()}
            >
              <p className="text-xs truncate whitespace-nowrap">체크인</p>
              <input
                ref={checkinRef}
                type="date"
                onMouseDown={(e) => e.preventDefault()}
                className="w-full min-w-0 truncate text-xs text-gray-600 bg-transparent focus:outline-none cursor-pointer"
              />
            </div>

            <div className="w-px h-8 bg-gray-300"></div>

            {/* 체크아웃 */}
            <div
              className="flex-auto min-w-0 px-6 py-4 hover:bg-neutral-200 rounded-full cursor-pointer"
              onClick={() => checkoutRef.current.showPicker()}
            >
              <p className="text-xs truncate whitespace-nowrap">체크아웃</p>
              <input
                ref={checkoutRef}
                type="date"
                onMouseDown={(e) => e.preventDefault()}
                className="w-full min-w-0 truncate text-xs text-gray-600 bg-transparent focus:outline-none cursor-pointer"
              />
            </div>

            <div className="w-px h-8 bg-gray-300"></div>

            {/* 여행자 + 돋보기 */}
            <div className="flex min-w-0 items-center px-2 py-1 hover:bg-neutral-200 rounded-full transition-all">
              <div className="flex-1 min-w-0 px-4 py-3">
                <p className="text-xs truncate whitespace-nowrap">여행자</p>
                <input
                  name="visitor"
                  type="number"
                  min="1"
                  placeholder="게스트 추가"
                  className="w-full truncate text-sm text-gray-600 bg-transparent focus:outline-none placeholder:text-xs"
                />
              </div>

              {/* 🔍 돋보기 */}
              <button className="shrink-0 bg-rose-500 text-white p-3 rounded-full hover:bg-rose-700 transition cursor-pointer">
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
        </form>
      </header>
    </>
  );
}
