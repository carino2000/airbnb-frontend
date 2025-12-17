import logo from "../assets/Airbnb_Logo.png";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useToken, useAccount } from "../stores/account-store";

export default function Wishlist() {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);

  const { account, clearAccount } = useAccount();
  const { clearToken } = useToken();

  const items = [1, 2, 3, 4];

  const addItem = () => {};

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

          {/* 우측 메뉴 */}
          <div className="flex gap-2 items-center shrink-0 relative">
            {/* 게스트 모드 전환 */}
            <div className="hidden sm:block rounded-full px-3 py-2 hover:bg-gray-200 cursor-pointer">
              <p
                className="text-xs font-bold whitespace-nowrap"
                onClick={() => navigate("/")}
              >
                호스트 모드로 전환
              </p>
            </div>

            {/* 프로필 원형 */}
            <div
              className="
                w-8 h-8 rounded-full bg-neutral-800 text-white
                flex items-center justify-center text-xs font-bold cursor-pointer
              "
              onClick={() => setOpenMenu((prev) => !prev)}
            >
              {account?.name?.charAt(0)}
            </div>

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

            {/* 햄버거 메뉴 */}
            {openMenu && (
              <div className="absolute top-[48px] right-0 w-[150px] bg-white rounded-md shadow-xl z-50">
                <div
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-xs"
                  onClick={() => {
                    navigate("/profile/edit");
                    setOpenMenu(false);
                  }}
                >
                  프로필 수정
                </div>

                <div
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-xs  text-red-500"
                  onClick={() => {
                    clearToken();
                    clearAccount();
                    navigate("/");
                  }}
                >
                  로그아웃
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= 본문 ================= */}
      <main className="mt-[120px] max-w-[1350px] mx-auto px-6">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold mb-6 mt-5 ">위시리스트</h1>
          <button
            onClick={() => {
              addItem();
              navigate("/");
            }}
            className="flex items-centr gap-2 cursor-pointer text-sm mt-7"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke="currentColor"
              className="W-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            추가하기
          </button>
        </div>
        <div className="rounded-xl">
          <div className="grid grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item}
                className="bg-green-100 rounded-lg flex items-center justify-center aspect-square"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer></footer>
    </>
  );
}
