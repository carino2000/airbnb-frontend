import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import logo from "../assets/Airbnb_Logo.png";

import { useAccount, useToken } from "../stores/account-store";
import { deleteReservation, getMyReservations } from "@/util/DatabaseUtil";

export default function BookingHistory() {
  const navigate = useNavigate();

  // ===== 추가된 상태 =====
  const [openMenu, setOpenMenu] = useState(false);
  const { account, clearAccount } = useAccount();
  const { token, clearToken } = useToken();
  const [reservations, setReservations] = useState([]);
  const [reservation, setReservation] = useState();
  const [modifiable, setModifiable] = useState(false);

  // ===== 메뉴 더미 =====
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
    if (!account) return;
    getMyReservations(account.id, token).then((obj) => {
      if (obj.success) {
        setReservations(obj.reservations);
      } else {
        window.alert("예약 기록 불러오기 오류!");
        navigate("/");
      }
    });
  }, []);

  function reservationDitail(item) {
    setReservation(item);
    const now = new Date();
    const startDate = new Date(item.startDate);
    const oneWeekLater = new Date();
    oneWeekLater.setDate(now.getDate() + 7);
    const isModifiable = startDate > oneWeekLater;
    setModifiable(isModifiable);
    return;
  }

  function reservationDeleteHandle(code) {
    if (window.confirm("정말 예약을 취소하시겠습니까?")) {
      deleteReservation(code, token).then((obj) => {
        if (obj.success) {
          window.alert("예약이 취소되었습니다");

          setReservations((prev) => prev.filter((item) => item.code !== code));
          setReservation(null);
        }
      });
    }
  }

  return (
    <>
      {/* ================= 헤더 ================= */}
      <header className="fixed top-0 left-0 w-full h-[90px] border-b border-neutral-200 z-50 bg-white">
        <div className="h-full w-full flex items-center justify-between max-w-[1350px] mx-auto px-6">
          <img
            src={logo}
            className="w-[100px] cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* 우측 메뉴 */}
          <div className="flex gap-2 items-center relative">
            <div className="hidden sm:block rounded-full px-3 py-2 hover:bg-gray-200 cursor-pointer">
              <p
                className="text-xs font-bold whitespace-nowrap"
                onClick={() => navigate("/")}
              >
                게스트 모드로 전환
              </p>
            </div>

            {/* 프로필 원형 */}
            <div className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center text-xs font-bold">
              {account?.name?.charAt(0) ?? "U"}
            </div>

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

            {openMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenMenu(false)}
                />

                <div className="absolute top-12 right-0 w-[200px] bg-white rounded-md shadow-xl border z-50">
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
      </header>

      {/* ================= 본문 ================= */}
      <main className="mt-[120px] max-w-[1350px] mx-auto px-6 pb-24">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold mb-6 mt-5">이전 여행</h1>
        </div>
        <section
          className="
          reservation-scroll
    border rounded-xl p-4 space-y-4
    max-h-[330px]
    overflow-y-scroll
  "
        >
          {reservations &&
            reservations.map((item) => {
              return (
                <div
                  key={item.code}
                  className="border rounded-xl p-5 flex gap-6 hover:bg-neutral-50"
                >
                  <div
                    onClick={() => navigate(`/room/${item.accommodationId}`)}
                    className="w-40 h-[100px] bg-neutral-200 rounded-md hover:cursor-pointer"
                  >
                    <img
                      className="w-full h-full rounded-xl object-cover p-3"
                      src={`http://192.168.0.17:8080${item.imageUri}`}
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      {item.startDate} ~ {item.endDate}
                    </p>
                    <p className="font-semibold mt-2">₩{item.price}</p>
                  </div>
                  <div
                    onClick={() => reservationDitail(item)}
                    className="self-center px-4 py-2 border rounded-md text-sm hover:cursor-pointer hover:bg-black/5"
                  >
                    선택
                  </div>
                </div>
              );
            })}
        </section>

        {/* 하단 정보 */}
        {reservation && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="border rounded-xl p-6 space-y-3">
              <h3 className="font-semibold">예약 세부정보</h3>
              <p>예약자 ID: {account.id}</p>
              <p>게스트: {reservation.visitors}명</p>
              <p>
                일정: {reservation.startDate} ~ {reservation.endDate}
              </p>
            </div>

            <div className="border rounded-xl p-6 space-y-3">
              <h3 className="font-semibold">결제 금액</h3>
              <div className="flex justify-between">
                <span>총 결제금액</span>
                <span className="font-bold text-red-500">
                  ₩{reservation.price}
                </span>
              </div>
              <div className="flex justify-between">
                <span>예약코드</span>
                <span className="font-bold">{reservation.code}</span>
              </div>
              <div className="flex justify-center mt-10 gap-5">
                <button
                  disabled={!modifiable}
                  className={`
                      px-5 py-3 rounded-md text-sm
                      ${
                        modifiable
                          ? "bg-slate-800 text-white hover:bg-slate-900 cursor-pointer"
                          : "bg-slate-300 text-white cursor-not-allowed opacity-60"
                      }
                          `}
                >
                  예약 수정
                </button>

                <button
                  onClick={() => reservationDeleteHandle(reservation.code)}
                  disabled={!modifiable}
                  className={`
                      px-5 py-3 rounded-md text-sm
                      ${
                        modifiable
                          ? "bg-rose-500 text-white hover:bg-rose-600 cursor-pointer"
                          : "bg-rose-300 text-white cursor-not-allowed opacity-60"
                      }
                      `}
                >
                  예약 취소
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
