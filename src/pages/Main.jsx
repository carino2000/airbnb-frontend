import { useState, useRef, useEffect } from "react";

import logo from "../assets/Airbnb_Logo.png";
import stays from "../assets/nav-stays.png";
import experiences from "../assets/nav-experiences.png";
import services from "../assets/nav-services.png";
import { loginCheck, searchAccommodation } from "../util/DatabaseUtil";

import { useAccount, useRoom, useToken } from "../stores/account-store";
import { useNavigate } from "react-router";
import { PopularSlider } from "../components/PopularSlider";
import { getLikedAccommodationList } from "../util/DatabaseUtil";
import { Calendar } from "@/components/ui/calendar";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import AccommodationLocationReportPage from "@/components/accommodationChart";

export default function Main() {
  const navigate = useNavigate();

  const { token, setToken, clearToken } = useToken();
  const { account, setAccount, clearAccount } = useAccount();

  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginError, setLoginError] = useState(false);

  const checkinRef = useRef(null);
  const checkoutRef = useRef(null);

  const [openMenu, setOpenMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [item, setItem] = useState([]);
  const [likedIdx, setLikedIdx] = useState([]);
  const [openCal, setOpenCal] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });
  const clearRoom = useRoom((s) => s.clearRoom);

  // ===== 유틸 =====
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

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

  function handleModalLogin() {
    loginCheck(loginId, loginPw).then((obj) => {
      if (!obj.success) {
        setLoginError(true);
      } else {
        // 여기!!!!!
        setToken(obj.token);
        setAccount(obj.data);
        setShowLogin(false); // 모달 닫기
        setLoginError(false);
      }
    });
  }

  function searchHandle(evt) {
    evt.preventDefault();
    console.log(evt.target.visitor.value);
    const data = {
      destination: evt.target.destination.value,
      checkInDate: checkinRef.current.value,
      checkOutDate: checkoutRef.current.value,
      guests: evt.target.visitor.value,
    };

    evt.target.destination.value = "";
    checkinRef.current.value = "";
    checkoutRef.current.value = "";
    evt.target.visitor.value = 0;

    searchAccommodation(data).then((obj) => {
      setItem([...obj.accommodations]);
      if ([...obj.accommodations].length === 0) {
        window.alert("해당 조건에 대응하는 검색 결과가 없습니다");
        window.location.reload();
      }
    });
  }

  useEffect(() => {
    clearRoom();
    const data = {
      destination: "",
      checkInDate: "",
      checkOutDate: "",
      guests: "",
    };
    searchAccommodation(data).then((obj) => {
      setItem([...obj.accommodations]);
    });
  }, []);

  //  서버 좋아요 목록 불러오기
  useEffect(() => {
    if (!token || !account) {
      setLikedIdx([]); // 로그아웃 시 초기화
      return;
    }

    const accountId = account.id;
    getLikedAccommodationList(accountId, token).then((res) => {
      if (res?.success && Array.isArray(res.accommodationId)) {
        setLikedIdx([...res.accommodationId]); // ID 배열임
      } else {
        setLikedIdx([]);
      }
    });
  }, [token, account]);

  function reloadingPage() {
    window.location.reload();
    navigate("/");
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
                onClick={reloadingPage}
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
                    onClick={() => navigate("/hosting/listings")}
                  >
                    호스트 모드로 전환
                  </button>

                  {/* 원형 프로필 */}
                  <div
                    className="w-8 h-8 rounded-full bg-neutral-800
      text-white flex items-center justify-center
      text-xs font-bold cursor-pointer
      hover:ring-2 hover:ring-black/20 transition"
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
                {/* ⬇바깥 클릭 감지용 오버레이 */}
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
          onSubmit={searchHandle}
          className="w-full flex justify-center px-4 mb-4 md:mb-6"
        >
          <div className="relative flex items-center w-full max-w-[800px] md:w-[600px] lg:w-[800px] bg-white shadow-md rounded-full border border-neutral-200">
            {/* 아래로 펼쳐지는 달력 영역 */}
            {openCal && (
              <>
                {/*  바탕화면 클릭 감지용 오버레이 */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenCal(false)} // 바탕화면 클릭 시 닫힘
                />

                {/* 달력 본체 */}
                <div className="absolute left-35 top-13 mt-2 z-50 max-w-[calc(100vw-24px)]">
                  <div
                    className="rounded-xl border bg-white shadow-xl p-3"
                    onClick={(e) => e.stopPropagation()} // 달력 클릭은 닫히지 않게
                  >
                    <Calendar
                      locale={ko}
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      numberOfMonths={2}
                      onSelect={setDateRange}
                      className="rounded-lg"
                    />

                    <div className="mt-3 flex items-center justify-end border-t pt-3 gap-5">
                      <button
                        onClick={() => {
                          setDateRange(null);
                        }}
                        className="text-sm text-gray-500 hover:text-black"
                      >
                        초기화
                      </button>

                      <button
                        onClick={() => {
                          setOpenCal(false);
                        }}
                        className={[
                          "text-sm font-medium",
                          dateRange?.from && dateRange?.to
                            ? "text-black hover:underline"
                            : "text-gray-300 cursor-not-allowed",
                        ].join(" ")}
                      >
                        적용
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

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
              onClick={() => setOpenCal(true)}
            >
              <p className="text-xs truncate whitespace-nowrap">체크인</p>
              <input
                ref={checkinRef}
                type="text"
                placeholder="연도-월-일"
                defaultValue={
                  dateRange.from && format(dateRange.from, "yyyy-MM-dd")
                }
                onMouseDown={(e) => e.preventDefault()}
                className="w-full min-w-0 truncate text-xs text-gray-600 bg-transparent focus:outline-none cursor-pointer"
              />
            </div>

            <div className="w-px h-8 bg-gray-300"></div>

            {/* 체크아웃 */}
            <div
              className="flex-auto min-w-0 px-6 py-4 hover:bg-neutral-200 rounded-full cursor-pointer"
              onClick={() => setOpenCal(true)}
            >
              <p className="text-xs truncate whitespace-nowrap">체크아웃</p>
              <input
                ref={checkoutRef}
                type="text"
                placeholder="연도-월-일"
                defaultValue={
                  dateRange.to && format(dateRange.to, "yyyy-MM-dd")
                }
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
        {chunkArray(item, 8).map((group, idx) => (
          <PopularSlider
            key={idx}
            title="인기 숙소"
            data={group}
            alreadyLiked={likedIdx}
            onToggleLike={(id, liked) => {
              setLikedIdx((prev) =>
                liked ? [...prev, id] : prev.filter((v) => v !== id)
              );
            }}
            onCardClick={(id) => navigate(`/room/${id}`)}
          />
        ))}
      </main>
      <footer className=" border-t-2 border-neutral-200 mt-4 w-full bg-neutral-100">
        <div className="mx-auto px-16 py-14">
          {/* 상단 링크 영역 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-gray-700">
            {/* 에어비앤비 지원 */}
            <div>
              <h4 className="font-semibold mb-4">에어비앤비 지원</h4>
              <ul className="space-y-2">
                <li className="hover:underline cursor-pointer">도움말 센터</li>
                <li className="hover:underline cursor-pointer">
                  안전 문제 관련 도움받기
                </li>
                <li className="hover:underline cursor-pointer">에어커버</li>
                <li className="hover:underline cursor-pointer">차별 반대</li>
                <li className="hover:underline cursor-pointer">장애인 지원</li>
                <li className="hover:underline cursor-pointer">
                  예약 취소 옵션
                </li>
                <li className="hover:underline cursor-pointer">
                  이웃 민원 신고
                </li>
              </ul>
            </div>

            {/* 호스팅 */}
            <div>
              <h4 className="font-semibold mb-4">호스팅</h4>
              <ul className="space-y-2">
                <li className="hover:underline cursor-pointer">
                  당신의 공간을 에어비앤비하세요
                </li>
                <li className="hover:underline cursor-pointer">
                  에어비앤비에서 체험 호스팅하기
                </li>
                <li className="hover:underline cursor-pointer">
                  에어비앤비에서 서비스 호스팅하기
                </li>
                <li className="hover:underline cursor-pointer">
                  호스트를 위한 에어커버
                </li>
                <li className="hover:underline cursor-pointer">호스팅 자료</li>
                <li className="hover:underline cursor-pointer">
                  커뮤니티 포럼
                </li>
                <li className="hover:underline cursor-pointer">
                  책임감 있는 호스팅
                </li>
              </ul>
            </div>

            {/* 에어비앤비 */}
            <div>
              <h4 className="font-semibold mb-4">에어비앤비</h4>
              <ul className="space-y-2">
                <li className="hover:underline cursor-pointer">
                  2025 여름 업데이트
                </li>
                <li className="hover:underline cursor-pointer">뉴스룸</li>
                <li className="hover:underline cursor-pointer">채용정보</li>
                <li className="hover:underline cursor-pointer">투자자 정보</li>
                <li className="hover:underline cursor-pointer">
                  Airbnb.org 긴급 숙소
                </li>
              </ul>
            </div>
          </div>

          {/* 하단 바 */}
          <div className="mt-12 pt-6 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
            <div className="flex flex-wrap gap-2">
              <span>© 2025 Airbnb, Inc.</span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">
                개인정보 처리방침
              </span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">쿠키 정책</span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">이용약관</span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">
                한국의 변경된 환불 정책
              </span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">
                회사 세부정보
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span>한국어 (KR)</span>
              <span>₩ KRW</span>
            </div>
          </div>
        </div>
      </footer>

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
              className="border border-gray-400 w-full p-2.5 rounded-md mb-2 placeholder:text-xs text-sm"
            />

            {loginError && (
              <p className="text-red-500 text-xs mt-1 mb-2">
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
