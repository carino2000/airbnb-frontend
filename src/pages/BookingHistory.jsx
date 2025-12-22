import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import logo from "../assets/Airbnb_Logo.png";

import { useAccount, useToken } from "../stores/account-store";
import {
  checkReservation,
  countMyReview,
  deleteReservation,
  getMyReservations,
  updateReservation,
} from "@/util/DatabaseUtil";

export default function BookingHistory() {
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    visitors: 1,
    startDate: "",
    endDate: "",
    price: 0,
    accommodationId: 0,
  });

  // ===== 추가된 상태 =====
  const [openMenu, setOpenMenu] = useState(false);
  const { account, clearAccount } = useAccount();
  const { token, clearToken } = useToken();
  const [reservations, setReservations] = useState([]);
  const [reservation, setReservation] = useState();
  const [modifiable, setModifiable] = useState(false);
  const [able, setAble] = useState(false);

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
    if (!account || !token) {
      window.alert("로그인이 필요한 페이지입니다.");
      navigate("/");
    }
  }, [account, token]);

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

  useEffect(() => {
    if (!editForm.accommodationId || !editForm.startDate || !editForm.endDate) {
      return;
    }

    const data = {
      accommodationId: editForm.accommodationId,
      accountId: account.id,
      visitors: editForm.visitors,
      startDate: editForm.startDate,
      endDate: editForm.endDate,
    };

    checkReservation(data).then((obj) => {
      if (obj.success) {
        setEditForm((old) => {
          // 가격이 같으면 업데이트 안 함 (중요)
          if (old.price === obj.totalPrice) return old;
          return { ...old, price: obj.totalPrice };
        });

        if (!obj.reservationAvailable) {
          setAble(false);
        } else {
          setAble(true);
        }
      }
    });
  }, [
    editForm.accommodationId,
    editForm.visitors,
    editForm.startDate,
    editForm.endDate,
  ]);

  function countMyReviewHandle(accountId, reservationCode) {
    countMyReview(accountId, reservationCode, token).then((obj) => {
      if (obj.success) {
        window.alert("이미 작성한 리뷰가 존재하는 예약건입니다.");
      } else {
        navigate(`/review/${reservation.code}/write`);
      }
    });
  }

  function reservationDitail(item) {
    setReservation(item);
    const now = new Date();
    const startDate = new Date(item.startDate);
    const oneWeekLater = new Date();
    oneWeekLater.setDate(now.getDate() + 7);
    const isModifiable = startDate > oneWeekLater;
    setModifiable(isModifiable);
    setEditForm((old) => ({ ...old, accommodationId: item.accommodationId }));
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
                  onClick={() => reservationDitail(item)}
                  key={item.code}
                  className="border rounded-xl p-5 flex gap-6 hover:bg-neutral-100"
                >
                  <div
                    onClick={() => navigate(`/room/${item.accommodationId}`)}
                    className="w-40 h-[100px] bg-neutral-200 rounded-md hover:cursor-pointer"
                  >
                    <img
                      className="w-full h-full rounded-xl object-cover"
                      src={`http://192.168.0.17:8080${item.imageUri}`}
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      {item.startDate} ~ {item.endDate}
                    </p>
                    <p className="font-semibold mt-2">
                      ₩{Number(item.price).toLocaleString()}
                    </p>
                  </div>
                  <div
                    onClick={() => reservationDitail(item)}
                    className="self-center px-5 py-3 border rounded-md text-sm hover:cursor-pointer hover:bg-black/10"
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
              <h3 className="font-semibold mb-5">예약 세부정보</h3>
              <p className="text-sm font-light">
                예약자 ID: <span className="font-semibold">{account.id}</span>
              </p>
              <p className="text-sm font-light">
                게스트:{" "}
                <span className="font-semibold">{reservation.visitors}</span> 명
              </p>
              <p className="text-sm font-light">
                일정:{" "}
                <span className="font-semibold">
                  {" "}
                  {reservation.startDate} ~ {reservation.endDate}{" "}
                </span>
              </p>
              <div>
                <button
                  onClick={() =>
                    countMyReviewHandle(account.id, reservation.code)
                  }
                  disabled={modifiable}
                  className={`
    w-1/3 py-2.5 rounded-md text-sm
    transition
    ${
      !modifiable
        ? "bg-black text-white hover:bg-gray-900 cursor-pointer active:scale-95"
        : "bg-gray-300 text-white cursor-not-allowed opacity-60"
    }
  `}
                >
                  리뷰 작성
                </button>
              </div>
            </div>

            <div className="border rounded-xl p-6 space-y-3">
              <h3 className="font-semibold mb-5">결제 금액</h3>
              <div className="text-sm flex justify-between">
                <span>총 결제금액</span>
                <span className="text-xl font-bold text-red-600">
                  ₩{Number(reservation.price).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>예약코드</span>
                <span className="font-bold">{reservation.code}</span>
              </div>
              <div className="flex justify-center mt-10 gap-4">
                <button
                  disabled={!modifiable}
                  onClick={() => {
                    setEditForm((old) => ({
                      ...old,
                      visitors: reservation.visitors,
                      startDate: reservation.startDate,
                      endDate: reservation.endDate,
                      price: reservation.price,
                    }));
                    setEditOpen(true);
                  }}
                  className={`
    w-1/2 py-3 rounded-md text-sm
    ${
      modifiable
        ? "bg-neutral-600 text-white hover:bg-slate-900"
        : "bg-neutral-300 cursor-not-allowed opacity-60"
    }
  `}
                >
                  예약 수정
                </button>

                <button
                  onClick={() => reservationDeleteHandle(reservation.code)}
                  disabled={!modifiable}
                  className={`
                      w-1/2 py-3 rounded-md text-sm
                      ${
                        modifiable
                          ? "bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
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
      {editOpen && (
        <>
          {/* 배경 */}
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setEditOpen(false)}
          />

          {/* 모달 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-xl p-10 space-y-5">
              <h2 className="text-xl font-bold">예약 수정</h2>

              <div className="space-y-2">
                <label className="text-xs">게스트 수</label>
                <input
                  type="number"
                  value={editForm.visitors}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      visitors: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs">시작일</label>
                <input
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, startDate: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs">종료일</label>
                <input
                  type="date"
                  value={editForm.endDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, endDate: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xl font-semibold">
                  ₩{editForm.price.toLocaleString()} 원
                </span>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditOpen(false)}
                  className="w-1/2 py-2 border rounded-md"
                >
                  취소
                </button>

                <button
                  onClick={async () => {
                    const res = await updateReservation(
                      reservation.code,
                      {
                        ...editForm,
                        visitors: Number(editForm.visitors),
                        price: Number(editForm.price),
                      },
                      token
                    );

                    if (res.success) {
                      alert("예약이 수정되었습니다");
                      setEditOpen(false);
                      setReservation({ ...reservation, ...editForm });
                      window.location.reload();
                    } else {
                      alert("해당 조건에 부합하는 객실이 존재하지 않습니다");
                    }
                  }}
                  className="w-1/2 py-2 bg-black text-white rounded-md"
                >
                  예약 수정
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
