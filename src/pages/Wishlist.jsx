import logo from "../assets/Airbnb_Logo.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useToken, useAccount } from "../stores/account-store";
import { getLikedAccommodationList } from "@/util/DatabaseUtil";

export default function Wishlist() {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const [accommodation, setAccommodation] = useState([]);

  const { account, clearAccount } = useAccount();
  const { token, clearToken } = useToken();

  const MENU = [
    { label: "찜", path: "/profile/wishlists" },
    { label: "리스트", path: "/hosting/listings" },
    { label: "메시지", path: "/hosting/listings?tab=messages" },
    { label: "내 프로필", path: "/profile" },
  ];

  /** ================= 유틸 함수 ================= */
  const formatPrice = (price) => {
    if (!price) return "0";
    return price.toLocaleString();
  };

  const onCardClick = (accommodationId) => {
    navigate(`/room/${accommodationId}`);
  };

  /** ================= 데이터 로딩 ================= */
  useEffect(() => {
    if (!account?.id || !token) return;
    getLikedAccommodationList(account.id, token).then((obj) => {
      if (obj?.success) {
        console.log(obj);
        setAccommodation(obj.accommodations);
      } else {
        window.alert("좋아요 목록 불러오기 오류");
        setAccommodation([]);
      }
    });
  }, [account?.id, token]);

  return (
    <>
      {/* ================= 헤더 ================= */}
      <header className="fixed top-0 left-0 w-full h-[90px] border-b border-neutral-200 z-50 bg-white">
        <div className="h-full w-full flex items-center justify-between max-w-[1350px] mx-auto px-6">
          {/* 로고 */}
          <img
            src={logo}
            alt="logo"
            className="w-[100px] cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* 우측 메뉴 */}
          <div className="flex gap-2 items-center shrink-0 relative">
            <div className="hidden sm:block rounded-full px-3 py-2 hover:bg-gray-200 cursor-pointer">
              <p
                className="text-xs font-bold whitespace-nowrap"
                onClick={() => navigate("/")}
              >
                호스트 모드로 전환
              </p>
            </div>

            {/* 프로필 */}
            <div className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center text-xs font-bold">
              {account?.name?.charAt(0) ?? "?"}
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
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </div>

            {/* 메뉴 */}
            {openMenu && (
              <>
                {/* 바깥 클릭 닫기 */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenMenu(false)}
                />

                <div className="absolute top-12 right-0 w-[180px] bg-white rounded-md shadow-xl border border-gray-200 z-50">
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
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ================= 본문 ================= */}
      <main className="mt-[120px] max-w-[1350px] mx-auto px-6 pb-24">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold mb-6 mt-5">❤️ 위시리스트 </h1>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {accommodation &&
            accommodation.map((one) => (
              <div
                key={one.id}
                className="cursor-pointer"
                onClick={() => onCardClick(one.id)}
              >
                <div>
                  <img
                    src={`http://192.168.0.17:8080${one.uri}`}
                    className="w-full aspect-square object-cover rounded-xl"
                    alt=""
                  />
                </div>
                <div className="mt-3 space-y-1">
                  <div className="font-medium truncate">
                    {one.address?.split(" ")[0]}의 집
                  </div>

                  <div className="text-sm text-neutral-600 truncate">
                    ₩{formatPrice(one.price)} · 평점 5.0
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>

      <footer />
    </>
  );
}
