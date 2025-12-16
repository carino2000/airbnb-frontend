import { useState, useRef } from "react";

import logo from "../assets/Airbnb_Logo.png";
import stays from "../assets/nav-stays.png";
import experiences from "../assets/nav-experiences.png";
import services from "../assets/nav-services.png";
import { loginCheck, searchAccommodation } from "../util/DatabaseUtil";

import { useAccount, useToken } from "../stores/account-store";
import { useNavigate } from "react-router";

export default function Main() {
  const navigate = useNavigate();

  const { token, setToken, clearToken } = useToken();
  const { account, setAccount, clearAccount } = useAccount();

  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [index, setIndex] = useState(0);
  const checkinRef = useRef(null);
  const checkoutRef = useRef(null);

  const [openMenu, setOpenMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [item, setItem] = useState([]);

  const items = [1, 2, 3, 4, 5, 6, 7, 8];
  const VISIBLE = 7;
  const CARD_PERCENT = 100 / VISIBLE;

  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  const next = () => setIndex((i) => Math.min(i + 1, items.length - VISIBLE));

  const [guestOpen, setGuestOpen] = useState(false);
  const [guests, setGuests] = useState({
    adult: 1,
    child: 0,
    infant: 0,
    pet: 0,
  });

  const totalGuests = guests.adult + guests.child;

  function handleModalLogin() {
    loginCheck(loginId, loginPw).then((obj) => {
      if (!obj.success) {
        setLoginError(true);
      } else {
        // ✅ 여기!!!!!
        setToken(obj.token);
        setAccount(obj.data);
        setShowLogin(false); // 모달 닫기
        setLoginError(false);
      }
    });
  }

  function searchHandle(evt) {
    evt.preventDefault();
    const data = {
      destination: evt.target.destination.value,
      checkInDate: checkinRef.current.value,
      checkOutDate: checkoutRef.current.value,
      guests: evt.target.visitor.value,
    };
    searchAccommodation(data).then((obj) => {
      console.log(obj.accommodations[0].name);
      setItem([...obj.accommodations]);
    });
  }

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
                    호스팅 하기
                  </button>

                  {/* 원형 프로필 */}
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold cursor-pointer">
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
                {/* ⬇️ 바깥 클릭 감지용 오버레이 */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenMenu(false)}
                />

                {/* ⬇️ 기존 메뉴 (그대로) */}
                <div className="absolute top-[70px] right-6 md:right-10 w-[180px] bg-white rounded-md shadow-xl border border-gray-200 z-50">
                  {!token && (
                    <>
                      <div
                        className="px-4 py-3 hover:bg-gray-100 text-xs cursor-pointer"
                        onClick={() => {
                          setShowLogin(true);
                          setOpenMenu(false);
                        }}
                      >
                        로그인
                      </div>
                      <div
                        className="px-4 py-3 hover:bg-gray-100 text-xs cursor-pointer"
                        onClick={() => {
                          navigate("/sign-up");
                          setOpenMenu(false);
                        }}
                      >
                        회원가입
                      </div>
                    </>
                  )}

                  {token && (
                    <>
                      {["찜", "리스트", "메시지", "내 프로필"].map((v) => (
                        <div
                          key={v}
                          className="px-4 py-3 hover:bg-gray-100 text-xs cursor-pointer"
                        >
                          {v}
                        </div>
                      ))}
                      <div
                        className="px-4 py-3 hover:bg-gray-100 text-xs text-red-500 cursor-pointer"
                        onClick={() => {
                          clearToken();
                          clearAccount();
                          setOpenMenu(false);
                        }}
                      >
                        로그아웃
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 검색창 */}
        <form
          onSubmit={searchHandle}
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

      {/* 본문 */}
      <main className="mt-[250px] w-5/6 mx-auto lg:px-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <h3 className="font-semibold text-lg sm:text-xl">부산 인기 숙소</h3>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3"
              stroke="currentColor"
              className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 translate-y-0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>

          {/* 슬라이드 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={prev}
              disabled={index === 0}
              className="rounded-full bg-neutral-200 px-2 py-2 text-neutral-400 disabled:opacity-30 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            <button
              onClick={next}
              disabled={index === items.length - VISIBLE}
              className="rounded-full bg-neutral-200 px-2 py-2 text-neutral-400 disabled:opacity-30 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 슬라이드 */}
        <div className="overflow-hidden mt-3 cursor-pointer">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${index * CARD_PERCENT}%)` }}
          >
            {item.map((one) => (
              <div
                key={one.id}
                className="shrink-0 px-1.5"
                style={{ width: `${CARD_PERCENT}%` }}
                onClick={() => navigate(`/room/${one.id}`)}
              >
                <div className="aspect-square rounded-lg border flex items-center justify-center">
                  {one.images.length !== 0 && (
                    <img
                      className="w-full h-full rounded-lg"
                      src={`http://192.168.0.17:8080${one.images[0].uri}`}
                      alt=""
                    />
                  )}
                </div>

                <div className="mt-2 text-left">
                  <div className="font-medium text-sm truncate">
                    서울의 집 {1}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    1월 30일 ~ 2월 1일
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    ₩205,000 · 평점 5.0
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 로그인 모달 */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999">
          <div className="bg-white w-96 p-8 rounded-md shadow-xl">
            <h2 className="text-base font-semibold mb-6 text-left">로그인</h2>

            <input
              type="text"
              placeholder="아이디"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="border border-gray-400 w-full p-2.5 rounded-md mb-3 placeholder:text-xs text-sm"
            />

            <input
              type="password"
              placeholder="비밀번호"
              value={loginPw}
              onChange={(e) => setLoginPw(e.target.value)}
              className="border border-gray-400 w-full p-2.5 rounded-md mb-3 placeholder:text-xs text-sm"
            />

            {loginError && (
              <p className="text-red-500 text-xs mt-4">
                아이디 또는 비밀번호가 일치하지 않습니다.
              </p>
            )}
            <button
              className="w-full bg-rose-600 text-white p-3 rounded-md text-sm hover:bg-rose-700 transition cursor-pointer"
              onClick={handleModalLogin}
            >
              로그인
            </button>

            <button
              onClick={() => setShowLogin(false)}
              className="w-full mt-3 text-gray-600 text-sm hover:underline cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
