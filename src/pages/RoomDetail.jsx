import logo from "../assets/Airbnb_Logo.png";
import { ko } from "date-fns/locale";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useToken,
  useAccount,
  useAccommodation,
  useRoom,
} from "../stores/account-store";
import { Star, Heart } from "lucide-react";

import {
  getLikedAccommodationList,
  likeAccommodation,
  unlikeAccommodation,
} from "../util/DatabaseUtil";

// 반드시 추가 (Lucide Icons)
import {
  Moon,
  Sparkles,
  Users,
  Home,
  Building2,
  Maximize,
  CheckCircle,
  Zap,
  Train,
  DollarSign,
  Waves,
  MapPin,
  Plane,
  Camera,
  Coffee,
} from "lucide-react";
// 태그별 아이콘 매핑
const TAG_ICON_MAP = {
  "조용한 주변 환경": Moon,
  독특함: Sparkles,
  "가족이 지내기에 적합": Users,
  세련됨: Home,
  "도심부에 위치": Building2,
  "넓은 공간": Maximize,
  "깨끗한 숙소": CheckCircle,
  "신속한 응답": Zap,
  "편리한 대중교통": Train,
  "가성비 좋은 숙소": DollarSign,
  "역 근처": Train,
  "편안한 침대": BedDouble,
  "바다 근처": Waves,
  "관광지 근처": MapPin,
  "공항 근처": Plane,
  오션뷰: Waves,
  "아늑한 분위기": Moon,
  "사진과 동일함": Camera,
  "TV/프로젝터 있음": Tv,
  "맛있는 조식": Coffee,
};
import {
  Wifi,
  Tv,
  BedDouble,
  Utensils,
  ShowerHead,
  Bath,
  ParkingCircle,
  Wind,
  Flame,
  HeartPulse,
  WashingMachine,
} from "lucide-react";

const AMENITY_ICON_MAP = {
  wifi: Wifi,
  tv: Tv,
  bed: BedDouble,
  kitchen: Utensils,
  shower: ShowerHead,
  bath: Bath,
  parking: ParkingCircle,
  ac: Wind,
  fire: Flame,
  aid: HeartPulse,
  washing: WashingMachine,
};

const AMENITY_LABEL_MAP = {
  wifi: "와이파이",
  tv: "티비",
  bed: "침대",
  kitchen: "주방",
  shower: "샤워기",
  bath: "욕조",
  parking: "주차",
  ac: "에어컨",
  fire: "소화기",
  aid: "구급 상자",
  washing: "세탁기",
};

import SearchHeader from "../components/SearchHeader";
import SearchOverlay from "../components/SearchOverlay";
import SearchBarMini from "../components/SearchBarMini";
import GuestRow from "../components/GuestRow";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  checkReservation,
  createReservation,
  getAccommodationReview,
  getDetailAccommodation,
} from "../util/DatabaseUtil";
import { useTags } from "../stores/account-store";

export default function RoomDetail() {
  const { token, setToken, clearToken } = useToken();
  const { account, setAccount, clearAccount } = useAccount();
  useEffect(() => {
    if (account == null) {
      alert("로그인이 필요한 기능입니다");
      navigate("/log-in");
    }
  }, [account]);

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

  const [guests, setGuests] = useState({
    adult: 1,
    child: 0,
    infant: 0,
    pet: 0,
  });

  const [isLiked, setIsLiked] = useState(false);
  // 1. 먼저 room 가져오기
  const { room, setRoom } = useRoom();

  // 2. 안전하게 기본값 처리
  const maxCapacity = room?.maxCapacity ?? 0;

  // 3. 파생 값 계산
 
  const [blockedDays, setBlockDays] = useState([]);
  const [openCal, setOpenCal] = useState(false);
   const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });

  const totalGuests = guests.adult + guests.child;
  const isMaxReached = totalGuests >= maxCapacity;

  const { accommodationId } = useParams();

  // 설명 더보기 모달
  const [openDescription, setOpenDescription] = useState(false);
  const [reservation, setReservation] = useState({
    message: "",
    reservationAvailable: true,
    totalPrice: room.price,
  });

  const [review, setReview] = useState([]);
  const selectedTags = useTags((s) => s.tags);

  // ================= 예약 카드 스크롤 =================

  useEffect(() => {
    const onScroll = () => {
      if (!bookingRef.current || !roomTitleRef.current || !reviewRef.current)
        return;

      const titleRect = roomTitleRef.current.getBoundingClientRect();
      const reviewRect = reviewRef.current.getBoundingClientRect();
      const cardHeight = bookingRef.current.offsetHeight;

      const TOP_MIN = Math.max(titleRect.top, 130);
      const TOP_MAX = reviewRect.top - cardHeight - 20;

      const SPEED = 0.08;
      const rawMove = titleRect.top - TOP_MIN;
      const nextTop = TOP_MIN + rawMove * SPEED;

      const clampedTop = Math.min(Math.max(nextTop, TOP_MIN), TOP_MAX);

      bookingRef.current.style.top = `${clampedTop}px`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  // ===============================================

  useEffect(() => {
    getAccommodationReview(accommodationId).then((obj) => {
      if (obj.success) {
        setReview([...obj.review]);
      } else {
        window.alert("리뷰 가져오기 오류!");
      }
    });
  }, []);

  useEffect(() => {
    getDetailAccommodation(accommodationId).then((obj) => {
      if (obj.success) {
        setRoom({ ...obj.accommodation });
        setBlockDays([...obj.accommodation.reservedDate]);
        setReservation({ totalPrice: obj.accommodation.price });
      } else {
        window.alert("숙소 상세정보 불러오기 오류!");
        navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    const data = {
      accommodationId: accommodationId,
      accountId: account.id,
      visitors: guests.adult + guests.child,
      startDate: checkin,
      endDate: checkout,
    };
    checkReservation(data).then((obj) => {
      if (obj.success) {
        setReservation(() => ({ ...obj }));
        if (!obj.reservationAvailable) {
          window.alert("해당 일자는 예약 불가한 일자입니다");
          setDateRange(undefined);
          setCheckin("");
          setCheckout("");
        }
      }
    });
  }, [checkin, checkout, guests]);

  function confirmReservation() {
    const data = {
      accommodationId: accommodationId,
      accountId: account.id,
      visitors: guests.adult + guests.child,
      startDate: checkin,
      endDate: checkout,
      price: reservation.totalPrice,
    };
    createReservation(data, token).then((obj) => {
      if (obj.success) {
        window.alert("예약이 확정되었습니다!");
        navigate("/");
      } else {
        window.alert("예약 진행중 오류 발생!");
      }
    });
  }

  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };
  // 찜
  useEffect(() => {
    if (!token || !account) return;

    getLikedAccommodationList(account.id, token).then((res) => {
      if (res?.success && Array.isArray(res.accommodationId)) {
        setIsLiked(res.accommodationId.includes(Number(accommodationId)));
      }
    });
  }, [token, account, accommodationId]);
  const toggleLike = async () => {
    if (!token || !account) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    const res = isLiked
      ? await unlikeAccommodation(accommodationId, account.id, token)
      : await likeAccommodation(accommodationId, account.id, token);

    if (!res?.success) {
      alert(res?.message || "처리 실패");
      return;
    }

    setIsLiked((prev) => !prev);
  };

  const MENU = [
    { label: "찜", path: "/profile/wishlists" },
    { label: "리스트", path: "/hosting/listings" },
    { label: "메시지", path: "/hosting/listings?tab=messages" },
    { label: "내 프로필", path: "/profile" },
  ];

  return (
    <>
      {/* ================= 헤더 ================= */}
      <header className="fixed top-0 left-0 w-full h-[90px] border-b border-neutral-200 z-50 bg-white">
        <div className="h-full w-full flex items-center justify-between max-w-[1350px] mx-auto px-6">
          {/* 로고 */}
          <img
            src={logo}
            className="w-[100px] cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* 검색창 */}
          <SearchBarMini onClick={() => setExpandSearch(true)} />

          {/* 우측 영역 */}
          <div className="flex items-center gap-2 relative shrink-0">
            {/* 로그인 O → 호스팅하기 */}
            {token && account && (
              <div
                className="hidden sm:block rounded-full px-3 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => navigate("/hosting")}
              >
                <p className="text-xs font-bold whitespace-nowrap">
                  호스팅하기
                </p>
              </div>
            )}

            {/* 로그인 O → 프로필 원형 */}
            {token && account && (
              <div className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center text-xs font-bold">
                {account.name?.charAt(0)}
              </div>
            )}

            {/* 햄버거 */}
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

            {/* ================= 메뉴 ================= */}
            {openMenu && (
              <>
                {/* 바깥 클릭 감지용 오버레이 */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenMenu(false)}
                />

                {/* 메뉴 박스 */}
                <div className="absolute top-12 right-0 w-[180px] bg-white rounded-md shadow-xl border border-gray-200 z-50">
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
                      {MENU.map((item) => (
                        <div
                          key={item.path}
                          className="px-4 py-3 hover:bg-gray-100 text-xs cursor-pointer"
                          onClick={() => {
                            navigate(item.path);
                            setOpenMenu(false);
                          }}
                        >
                          {item.label}
                        </div>
                      ))}
                      <div className="border-t" />
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
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ================= 검색 오버레이 ================= */}
      {expandSearch && (
        <SearchOverlay onClose={() => setExpandSearch(false)}>
          <SearchHeader onClose={() => setExpandSearch(false)} />
        </SearchOverlay>
      )}

      <main className="mt-[130px] max-w-[1200px] mx-auto px-6">
        {/*  사진  */}
        <section className="mb-12">
          <div className="flex justify-between mb-6">
            <h2 className="font-semibold text-2xl">{room.name}</h2>
            <div className="flex items-center gap-1 cursor-pointer">
              <button
                onClick={toggleLike}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Heart
                  size={22}
                  className={
                    isLiked ? "fill-rose-500 text-rose-500" : "text-gray-500"
                  }
                />
                <span className="text-sm font-medium">찜</span>
              </button>
            </div>
          </div>

          <div className="w-full h-[480px] grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden">
            <div className="col-span-2 row-span-2 bg-gray-200">
              {room.images.length > 0 && (
                <img
                  className="w-full h-full rounded-xl object-cover"
                  src={`http://192.168.0.17:8080${room.images[0].uri}`}
                  alt=""
                />
              )}
            </div>
            <div className="bg-gray-200">
              {room.images.length > 1 && (
                <img
                  className="w-full h-full rounded-xl object-cover"
                  src={`http://192.168.0.17:8080${room.images[1].uri}`}
                  alt=""
                />
              )}
            </div>
            <div className="bg-gray-200">
              {room.images.length > 2 && (
                <img
                  className="w-full h-full rounded-xl object-cover"
                  src={`http://192.168.0.17:8080${room.images[2].uri}`}
                  alt=""
                />
              )}
            </div>
            <div className="bg-gray-200">
              {room.images.length > 3 && (
                <img
                  className="w-full h-full rounded-xl object-cover"
                  src={`http://192.168.0.17:8080${room.images[3].uri}`}
                  alt=""
                />
              )}
            </div>
            <div className="bg-gray-200 relative">
              {room.images.length > 4 && (
                <img
                  className="w-full h-full rounded-xl object-cover"
                  src={`http://192.168.0.17:8080${room.images[4].uri}`}
                  alt=""
                />
              )}
              <button className="absolute bottom-3 right-3 bg-white text-sm px-3 py-1.5 rounded-md shadow">
                사진 모두 보기
              </button>
            </div>
          </div>
        </section>

        {/* 2컬럼 */}
        <section className="grid grid-cols-[1fr_360px] gap-16 items-start">
          <div className="space-y-10">
            <section>
              <h3 ref={roomTitleRef} className="text-2xl font-semibold">
                {room.address.split(" ")[0]}의 집
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                최대 인원 {room.maxCapacity}명 · 침실 {room.bedroom} · 침대{" "}
                {room.bed}개 · 욕실 {room.bathroom}
              </p>

              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="font-semibold">⭐ 4.93</span>
                <span className="text-gray-500">후기 · {review.length}개</span>
                <span className="px-2 py-1 border rounded-full text-xs">
                  게스트 선호
                </span>
              </div>
            </section>
            {/* 태그 */}
            <section className="grid grid-cols-2 gap-y-4 text-sm border-t border-t-neutral-300 pt-6">
              {room.tags.length === 0 ? (
                <p className="col-span-2 text-gray-400 text-sm">
                  등록된 숙소 태그가 없습니다.
                </p>
              ) : (
                room.tags.map((item) => {
                  const tag = item.tag; // 서버에서 내려온 실제 태그명
                  const Icon = TAG_ICON_MAP[tag];

                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      {Icon && (
                        <Icon className="w-5 h-5 text-gray-700 shrink-0" />
                      )}
                      <span className="text-sm">{tag}</span>
                    </div>
                  );
                })
              )}
            </section>

            <section className="flex items-center gap-4 border-t border-t-neutral-300 pt-6">
              <div className="w-12 h-12 rounded-full bg-gray-300" />
              <div>
                <p className="font-medium">
                  호스트:{" "}
                  <span className="font-bold">
                    {room.hostId} <span className="font-medium">님</span>
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  슈퍼호스트 · 호스팅 경력 3년
                </p>
              </div>
            </section>

            <section className="border-t border-t-neutral-300 pt-6">
              <p className="text-sm leading-7 text-neutral-700 line-clamp-5">
                {room.description}
              </p>
              <button
                className="mt-10 underline text-sm font-semibold"
                onClick={() => setOpenDescription(true)}
              >
                더 보기
              </button>
            </section>
          </div>

          <aside />
        </section>

        {/*  전체 폭 영역  */}
        {/*후기 */}
        <section ref={reviewRef} className="mt-30">
          <h2 className="text-2xl font-bold mb-7">후기</h2>

          {/* 후기 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 bg-amber-100">
            {review.length > 0 &&
              review.map((item) => (
                <div
                  key={item.id}
                  className="space-y-3 h-[250px] flex flex-col"
                >
                  {/* 상단: 프로필 + 이름 */}
                  <div className="flex items-center gap-3">
                    {/* 프로필 이미지 (없으면 기본 원형) */}
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                      {item.accountId.charAt(0)}
                    </div>

                    <div>
                      <p className="leading-relaxed line-clamp-4 text-sm">
                        {item.accountId}
                      </p>
                    </div>
                  </div>

                  {/* 별점 + 날짜 */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-4 h-4 ${
                            n <= item.rating
                              ? "fill-black text-black"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <span className="text-gray-400">·</span>
                    <span className="text-gray-400">
                      {item.writeAt?.slice(0, 10)}
                    </span>
                  </div>

                  {/* 후기 내용 */}
                  <p className="leading-relaxed line-clamp-4 text-sm ">
                    {item.content}
                  </p>
                </div>
              ))}
          </div>

          {/* 하단 버튼 */}
          {/* <div className="mt-10">
            <button className="px-6 py-2 border rounded-full text-sm font-semibold hover:bg-gray-100">
              후기 {review.length}개 모두 보기
            </button>
          </div> */}
        </section>
        {/*편의시설 */}
        <section className="pt-20">
          <h2 className="text-2xl font-bold mb-7">숙소 편의시설</h2>

          <div className="grid grid-cols-3 gap-y-7 bg-amber-200 py-2">
            {room.amenities.map((item) => {
              const Icon = AMENITY_ICON_MAP[item.amenity];
              const label = AMENITY_LABEL_MAP[item.amenity];

              if (!Icon || !label) return null;

              return (
                <div key={item.id} className="flex items-center gap-3">
                  <Icon className="w-7 h-7 text-gray-700" />
                  <span className="text-base">{label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="pt-20">
          <h2 className="text-2xl font-bold mb-7">체크인 날짜 선택</h2>
          <div className="h-[420px] bg-gray-200 rounded-md w-full" />
        </section>
      </main>
      <footer>
        <div className="h-[420px] mt-40 bg-gray-200 rounded-md w-full" />
      </footer>

      {/* ================= 예약 카드 ================= */}
      <div
        ref={bookingRef}
        className="
              fixed
              right-[calc((100vw-1200px)/2+24px)]
              w-[360px]
              bg-white
              rounded-2xl
              p-6
              shadow-[0_6px_20px_rgba(0,0,0,0.12)]
              transition-[top]
              duration-100
              ease-linear
              z-40
            "
      >
        {/* 안내 박스 */}
        <div className="flex items-start gap-3 bg-rose-50 rounded-xl p-4 mb-5">
          <span className="text-rose-500 text-xl">💎</span>
          <p className="text-gray-700 leading-snug text-xs">
            <span className="font-semibold">흔치 않은 기회!</span>
            <br />이 숙소는 보통 예약이 가득 차 있습니다
          </p>
        </div>

        {/* 가격 */}
        <div className="mb-5">
          <span className="text-3xl font-bold">
            ₩{reservation.totalPrice?.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500"> · 1박</span>
        </div>

        <div>
          {/* 날짜 선택 박스 */}
          <div className="rounded-xl text-sm mb-2 relative">
            <div className="grid grid-cols-2">
              {/* 체크인 */}
              <div
                className="p-3 hover:bg-neutral-100 cursor-pointer"
                onClick={() => setOpenCal(true)}
              >
                <p className="text-[11px] text-gray-500 font-semibold">
                  체크인
                </p>
                <p className="font-medium">
                  {checkin ? checkin + "." : "날짜 선택"}
                </p>
                <input
                  ref={checkinRef}
                  type="date"
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="absolute opacity-0 pointer-events-none"
                />
              </div>

              {/* 체크아웃 */}
              <div
                className="p-3 hover:bg-neutral-100 cursor-pointer"
                onClick={() => setOpenCal(true)}
              >
                <p className="text-[11px] text-gray-500 font-semibold">
                  체크아웃
                </p>
                <p className="font-medium">
                  {checkout ? checkout + "." : "날짜 선택"}
                </p>
                <input
                  ref={checkoutRef}
                  type="date"
                  value={checkout}
                  disabled={blockedDays}
                  onChange={(e) => setCheckout(e.target.value)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="absolute opacity-0 pointer-events-none"
                />
              </div>
            </div>
            {/* 아래로 펼쳐지는 달력 영역 */}
            {openCal && (
              <>
                {/* ✅ [추가] 바탕화면 클릭 감지용 오버레이 */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenCal(false)} // 바탕화면 클릭 시 닫힘
                />

                {/* 달력 본체 */}
                <div className="absolute -left-50 top-full mt-2 z-50 max-w-[calc(100vw-24px)]">
                  <div
                    className="rounded-xl border bg-white shadow-xl p-3"
                    onClick={(e) => e.stopPropagation()} // 달력 클릭은 닫히지 않게
                  >
                    <Calendar
                      locale={ko}
                      mode="range"
                      disabled={blockedDays.map((d) => new Date(d))}
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      numberOfMonths={2}
                      onSelect={setDateRange}
                      className="rounded-lg"
                    />

                    <div className="mt-3 flex items-center justify-end border-t pt-3 gap-5">
                      <button
                        onClick={() => {
                          setDateRange(undefined);
                          setCheckin("");
                          setCheckout("");
                        }}
                        className="text-sm text-gray-500 hover:text-black"
                      >
                        초기화
                      </button>

                      <button
                        onClick={() => {
                          setCheckin(format(dateRange.from, "yyyy-MM-dd"));
                          setCheckout(format(dateRange.to, "yyyy-MM-dd"));
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
          </div>

          {/* 인원 영역 wrapper */}
          <div className="relative">
            {/* 인원 버튼 */}
            <div
              className="flex items-center justify-between p-3 hover:bg-neutral-100 cursor-pointer"
              onClick={() => setGuestOpen((prev) => !prev)}
            >
              <div>
                <p className="text-[11px] text-gray-500 font-semibold">인원</p>
                <p className="font-medium text-sm">게스트 {totalGuests}명</p>
              </div>
              <span className="text-gray-500">⌄</span>
            </div>
          </div>

          {/* 게스트 패널 (형제 요소!) */}
          {guestOpen && (
            <>
              {/* ===== 배경 오버레이 (화면 클릭 시 닫힘) ===== */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setGuestOpen(false)}
              />

              {/* ===== 게스트 패널 ===== */}
              <div className="absolute left-6 w-78  bg-white rounded-2xl shadow-lg border p-6 z-50">
                <GuestRow
                  title="성인"
                  desc="13세 이상"
                  value={guests.adult}
                  min={1}
                  onChange={(v) => setGuests({ ...guests, adult: v })}
                  disableIncrease={isMaxReached}
                  maxCapacity={room.maxCapacity}
                />
                <GuestRow
                  title="어린이"
                  desc="2~12세"
                  value={guests.child}
                  min={0}
                  onChange={(v) => setGuests({ ...guests, child: v })}
                  disableIncrease={isMaxReached}
                  maxCapacity={room.maxCapacity}
                />

                <GuestRow
                  title="유아"
                  desc="2세 미만"
                  value={guests.infant}
                  min={0}
                  onChange={(v) => setGuests({ ...guests, infant: v })}
                />
                <GuestRow
                  title="반려동물"
                  desc="보조동물을 동반하시나요?"
                  value={guests.pet}
                  min={0}
                  disabled
                  onChange={() => {}}
                />
                <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                  이 숙소의 최대 숙박 인원은 1명(유아 제외)입니다. 반려동물
                  동반은 허용되지 않습니다.
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="font-semibold text-sm underline"
                    onClick={() => setGuestOpen(false)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 예약 버튼 */}
        <button
          onClick={confirmReservation}
          className="w-full h-10 mt-4 rounded-full bg-rose-500 text-white font-medium text-sm hover:bg-rose-700 cursor-pointer"
          disabled={!reservation.reservationAvailable}
        >
          예약하기
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          예약 확정 전에는 요금이 청구되지 않습니다.
        </p>
      </div>
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
      {/* ================= 숙소 설명 모달 ================= */}
      {openDescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 배경 */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenDescription(false)}
          />

          {/* 모달 박스 */}
          <div className="relative bg-white w-full max-w-[600px] max-h-[80vh] rounded-xl p-6 overflow-y-auto">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold">숙소 설명</h2>
              <button
                className="text-xl font-bold"
                onClick={() => setOpenDescription(false)}
              >
                ✕
              </button>
            </div>

            {/* 전체 설명 */}
            <p className="text-sm leading-6 text-gray-700 whitespace-pre-line">
              {room.description}
              {"\n"}⭐️합정역(2호선,6호선)에서 도보7분 거리에 위치하여 어디로든
              이동이 편리합니다.
              {"\n"}⭐️최고의 가성비를 자랑하는 프라이빗 숙소입니다.
              {"\n"}⭐️숙소 근처에 홍대 메인거리가 있어 버스킹, 맛집, 쇼핑,
              놀거리, 볼거리가 다양합니다.
              {"\n"}⭐️여성외국인전용 쉐어하우스 입니다. (Women only)
            </p>
          </div>
        </div>
      )}
    </>
  );
}
