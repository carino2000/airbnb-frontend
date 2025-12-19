import logo from "../assets/Airbnb_Logo.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useToken, useAccount } from "../stores/account-store";
import { getMyHosting } from "@/util/DatabaseUtil";
import {
  EditorSideNav,
  ListingEditorContent,
} from "@/components/LeftEditorNav";

export default function HostingEdit() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const { clearToken } = useToken();
  const { account, clearAccount } = useAccount();

  // ✅ 탭 상태
  const [activeSection, setActiveSection] = useState("basic"); // basic | room | price

  // (지금 edit 페이지에서 list 데이터 안 쓰면 이 부분은 제거해도 됨)
  useEffect(() => {
    if (!account?.id) return;
    getMyHosting(account.id).catch(() => {});
  }, [account?.id]);

  const MENU = [
    { label: "찜", path: "/profile/wishlists" },
    { label: "리스트", path: "/hosting/listings" },
    { label: "메시지", path: "/hosting/listings?tab=messages" },
    { label: "내 프로필", path: "/profile" },
  ];

  return (
    <>
      {/* 헤더 */}
      <header className="fixed top-0 left-0 w-full h-[90px] border-b border-neutral-200 z-50 bg-white">
        <div className="h-full w-full flex items-center justify-between max-w-[1350px] mx-auto px-6">
          <img
            src={logo}
            className="w-[100px] cursor-pointer"
            onClick={() => navigate("/")}
          />

          <div className="flex gap-2 items-center relative">
            <div className="hidden sm:block rounded-full px-3 py-2 hover:bg-gray-200 cursor-pointer">
              <p
                className="text-xs font-bold whitespace-nowrap"
                onClick={() => navigate("/")}
              >
                게스트 모드로 전환
              </p>
            </div>

            <div
              className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center text-xs font-bold cursor-pointer"
              onClick={() => setOpenMenu((prev) => !prev)}
            >
              {account?.name?.charAt(0) ?? "?"}
            </div>

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
      <div className="pt-[90px]">
        <div className="max-w-[1350px] mx-auto px-6 py-10 flex gap-10">
          {/* 왼쪽 */}
          <aside className="w-[400px] shrink-0">
            <EditorSideNav active={activeSection} onChange={setActiveSection} />
          </aside>

          {/* 오른쪽 */}
          <main className="flex-1 min-w-0">
            <ListingEditorContent active={activeSection} />
            {/* 또는 여기 자리에 <MessageList /> */}
          </main>
        </div>
      </div>
    </>
  );
}
