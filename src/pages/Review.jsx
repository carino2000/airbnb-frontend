import logo from "../assets/Airbnb_Logo.png";
import { useState, useEffect, useRef, use } from "react";
import { useNavigate, useParams } from "react-router";
import { useToken, useAccount } from "../stores/account-store";

import SearchHeader from "../components/SearchHeader";
import SearchOverlay from "../components/SearchOverlay";
import SearchBarMini from "../components/SearchBarMini";
import GuestRow from "../components/GuestRow";
import camera from "../assets/free-icon-camera-5904494.png";
import {
  createReview,
  getDetailAccommodation,
  getReservation,
} from "@/util/DatabaseUtil";

export default function Review() {
  const { account, clearAccount } = useAccount();
  const { token, clearToken } = useToken();

  const navigate = useNavigate();

  const [expandSearch, setExpandSearch] = useState(false);

  const bookingRef = useRef(null);
  const roomTitleRef = useRef(null);
  const reviewRef = useRef(null);

  const [openMenu, setOpenMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const checkinRef = useRef(null);
  const checkoutRef = useRef(null);

  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");

  const [guestOpen, setGuestOpen] = useState(false);

  const [rating, setRating] = useState(0); // 선택된 별점 (1~5)
  const [hoverRating, setHoverRating] = useState(0); // hover 미리보기

  const [desc, setDesc] = useState("");
  const MAX_LEN = 1000;

  const [reservation, setReservation] = useState();
  const [accommodation, setAccommodation] = useState();

  const { param } = useParams();

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

  useEffect(() => {
    countMyReview(account.id, reservationCode, token).then((obj) => {
      if (obj.success) {
        window.alert("이미 리뷰를 작성한 숙소입니다!");
        navigate("/profile/bookings");
      }
    });
  }, []);

  useEffect(() => {
    if (!account || !token) {
      window.alert("로그인이 필요한 페이지입니다.");
      navigate("/");
    } else if (param === account.id) {
      window.alert("올바른 접근이 아닙니다");
      navigate("/");
    }
  }, [account, token]);

  useEffect(() => {
    // 스크롤 막기
    document.body.style.overflow = "hidden";

    return () => {
      // 페이지 나갈 때 원래대로 복구
      document.body.style.overflow = "auto";
    };
  }, []);
  const { reservationCode } = useParams();

  useEffect(() => {
    getReservation(reservationCode, token).then((obj) => {
      if (obj.success) {
        setReservation({ ...obj.data });
        getDetailAccommodation(obj.data.accommodationId).then((acc) => {
          if (acc.success) {
            setAccommodation({ ...acc.accommodation });
          } else {
            window.alert("숙소 정보 불러오기 오류!");
            navigate("/");
          }
        });
      } else {
        window.alert("예약 조회 오류!");
        navigate("/");
      }
    });
  }, []);

  function confirmReview() {
    const data = {
      accommodationId: accommodation.id,
      accountId: account.id,
      rating: rating,
      content: desc,
    };
    createReview(data, token, reservationCode).then((obj) => {
      if (obj.success) {
        window.alert("리뷰 등록이 정상 처리되었습니다!");
        navigate("/");
      } else {
        window.alert("리뷰 등록 오류!");
        navigate("/");
      }
    });
  }

  return (
    <>
      {/* ===== 헤더 ===== */}
      <header className="fixed top-0 left-0 w-full h-[90px] border-b border-neutral-200 z-50 bg-white">
        <div className="h-full w-full flex items-center justify-between max-w-[1200px] mx-auto px-6">
          {/* 로고 */}
          <img
            src={logo}
            className="w-[100px] cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* 검색창 */}
          <SearchBarMini onClick={() => setExpandSearch(true)} />

          {/* 우측 메뉴 */}
          <div className="flex gap-2 items-center shrink-0 relative">
            {/* 호스팅 하기 (유지) */}
            <div className="hidden sm:block rounded-full px-3 py-2 hover:bg-gray-200 cursor-pointer">
              <p
                className="text-xs font-bold whitespace-nowrap"
                onClick={() => navigate("/hosting")}
              >
                호스팅 하기
              </p>
            </div>

            {/* ✅ 로그인 시 프로필 원형 (김) */}
            {account && (
              <div
                className="
            w-8 h-8
            rounded-full
            bg-neutral-800
            text-white
            flex items-center justify-center
            text-xs font-bold
            cursor-pointer
          "
              >
                {account.name?.charAt(0)}
              </div>
            )}

            {/* 햄버거 버튼 */}
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

            {/* 햄버거 메뉴 (기존 그대로 사용 가능) */}
            {openMenu && (
              <>
                {/* ⬇바깥 클릭 감지용 오버레이 */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenMenu(false)}
                />

                {/* 메뉴*/}
                <div className="absolute top-[70px] right-6 md:right-10 w-[200px] bg-white rounded-md shadow-xl border z-50">
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

                  {token &&
                    MENU.map((group) => (
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

                  {token && (
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
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {expandSearch && (
        <SearchOverlay onClose={() => setExpandSearch(false)}>
          <SearchHeader onClose={() => setExpandSearch(false)} />
        </SearchOverlay>
      )}

      <main className="mt-[130px] flex justify-center px-6">
        <div className="w-full max-w-[1200px]">
          {/* 페이지 타이틀 */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-semibold text-2xl">리뷰쓰기</h1>
            <button
              className="text-sm text-gray-500 hover:underline"
              onClick={() => navigate(-1)}
            >
              취소
            </button>
          </div>

          {/* 안내 박스 */}
          <div className="bg-gray-100 text-sm text-gray-600 p-4 rounded-md mb-5 leading-relaxed">
            작성해 주시는 후기는 큰 힘이 됩니다.
            <br />
            고객님의 격려와 지적에 보답하겠습니다.
          </div>

          {/* 정보 */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-30  h-30 bg-gray-200 rounded-md">
              {accommodation && (
                <img
                  className="w-full h-full rounded-xl object-cover"
                  src={`http://192.168.0.17:8080${accommodation.images[0].uri}`}
                  alt=""
                />
              )}
            </div>
            <div>
              <p className="font-medium">
                {accommodation && accommodation.name}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {reservation && reservation.price}원
              </p>
            </div>
          </div>

          {/* 별점 */}
          <section className="mb-7">
            <p className="font-semibold mb-2">
              숙소 만족도 <span className="text-rose-500">*</span>
            </p>
            <div className="flex gap-2 text-3xl text-gray-300 flex-col">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={
                        star <= (hoverRating || rating)
                          ? "#f43f5e" // rose-500
                          : "none"
                      }
                      stroke={
                        star <= (hoverRating || rating) ? "#f43f5e" : "#d1d5db" // gray-300
                      }
                      strokeWidth="1.5"
                      className="w-10 h-10 transition-colors"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                      />
                    </svg>
                  </button>
                ))}
              </div>
              {/* <p className="text-sm text-gray-500 mt-2">
                선택한 별점: {rating}점
              </p> */}
            </div>
          </section>

          {/* 리뷰 텍스트 */}
          <div className="mb-10">
            <p className="font-semibold mb-2">숙소 후기 (선택)</p>

            <div className="relative">
              <textarea
                maxLength={MAX_LEN}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="숙소 후기를 남겨주세요."
                className="
        w-full h-[180px]
        border border-neutral-300 rounded-xl
        p-4 text-sm resize-none
        focus:outline-none focus:border-black
      "
              />

              {/* 글자 수 */}
              <span
                className={`
        absolute bottom-3 right-4
        text-sm text-neutral-500
        transition-transform duration-150
      `}
              >
                {desc.length}/{MAX_LEN}
              </span>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full max-w-[1200px] mx-auto pb-20">
        <div
          className={`
      text-sm
      rounded-md
      h-[70px]
      flex items-center justify-center
      font-semibold
      transition-colors
      ${
        rating === 0
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-black text-white cursor-pointer"
      }
    `}
        >
          <button
            onClick={confirmReview}
            disabled={rating === 0}
            className="w-full h-full px-6 py-2 cursor-pointer"
          >
            확인
          </button>
        </div>
      </footer>

      {/* ================= 로그인 모달 ================= */}
      {showLogin && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999"
          onClick={() => setShowLogin(false)} // 배경 클릭 닫기
        >
          <div
            className="bg-white w-96 p-8 rounded-md shadow-xl"
            onClick={(e) => e.stopPropagation()} // 모달 클릭 시 닫힘 방지
          >
            <h2 className="text-base font-semibold mb-6 text-left">로그인</h2>

            <input
              type="text"
              placeholder="아이디"
              className="border border-gray-400 w-full p-2.5 rounded-md mb-3 placeholder:text-xs text-sm"
            />

            <input
              type="password"
              placeholder="비밀번호"
              className="border border-gray-400 w-full p-2.5 rounded-md mb-4 placeholder:text-xs text-sm"
            />

            <button className="w-full bg-rose-600 text-white p-3 rounded-md text-sm hover:bg-rose-700 transition">
              로그인
            </button>

            <button
              onClick={() => setShowLogin(false)}
              className="w-full mt-3 text-gray-600 text-sm hover:underline"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
