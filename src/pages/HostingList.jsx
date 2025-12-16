import logo from "../assets/Airbnb_Logo.png";
import { useState } from "react";
import { useNavigate } from "react-router";

import SearchBarMini from "../components/SearchBarMini";
import { useToken, useAccount } from "../stores/account-store";

export default function HostingList() {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);

  const { clearToken } = useToken();
  const { account, clearAccount } = useAccount();

  return (
    <>
      {/* 헤더 */}
      <header className="fixed top-0 left-0 w-full h-[90px] border-b border-neutral-200 z-50 bg-white">
        {/* 🔥 여기만 수정됨: w-full 추가 */}
        <div className="h-full w-full flex items-center justify-between max-w-[1200px] mx-auto px-6">
          {/* 로고 */}
          <img
            src={logo}
            className="w-[100px] cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* 검색창 */}
          <SearchBarMini />

          {/* 우측 메뉴 */}
          <div className="flex gap-2 items-center shrink-0 relative">
            {/* 게스트 모드 전환 */}
            <div className="hidden sm:block rounded-full px-3 py-2 hover:bg-gray-200 cursor-pointer">
              <p
                className="text-xs font-bold whitespace-nowrap"
                onClick={() => navigate("/")}
              >
                게스트 모드로 전환
              </p>
            </div>

            {/* 프로필 원형 아이콘 (이름 첫 글자) */}
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
              <div
                className="
                  absolute top-[48px] right-0
                  w-[160px]
                  bg-white rounded-md shadow-xl
                  border border-gray-200 z-50
                "
              >
                {/* 프로필 수정 */}
                <div
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-xs font-semibold"
                  onClick={() => {
                    navigate("/profile/edit");
                    setOpenMenu(false);
                  }}
                >
                  프로필 수정
                </div>

                {/* 로그아웃 */}
                <div
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer
                             text-xs font-semibold text-red-500"
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
    </>
  );
}
