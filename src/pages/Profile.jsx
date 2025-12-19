import logo from "../assets/Airbnb_Logo.png";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useToken, useAccount } from "../stores/account-store";
import {
  InfoForm,
  PasswordForm,
  WithdrawForm,
} from "../components/profile.jsx";
import {
  updateAccountProfile,
  updateAccountPassword,
  deleteAccount,
} from "../util/DatabaseUtil.jsx";

export default function Profile() {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);

  const { clearToken } = useToken();
  const { account, clearAccount, setAccount } = useAccount();

  const [activeTab, setActiveTab] = useState("info");
  // info | password | withdraw

  const TAB_TITLE = {
    info: "회원 정보",
    password: "비밀번호",
    withdraw: "계정 탈퇴",
  };

  const { token } = useToken();
  const handleUpdateProfile = async (data) => {
    const res = await updateAccountProfile(account.id, data, token);

    if (res.success) {
      alert("회원 정보가 수정되었습니다.");
      setAccount({
        ...account,
        ...data,
      });
    } else {
      alert(res.message || "수정 실패");
    }
  };
  const handleChangePassword = async (data) => {
    const payload = {
      oldPw: data.oldPw,
      newPw: data.newPw,
      newPwConfirm: data.newPwConfirm,
    };

    const res = await updateAccountPassword(account.id, payload, token);

    if (res.success) {
      alert("비밀번호가 변경되었습니다.");
    } else {
      alert(res.message || "비밀번호 변경 실패");
    }
  };

  const handleWithdraw = async () => {
    const res = await deleteAccount(account.id, token);

    if (res.success) {
      alert("탈퇴 처리되었습니다.");
      clearToken();
      clearAccount();
      navigate("/");
    } else {
      alert(res.message || "탈퇴 실패");
    }
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
            {/* 프로필 원형 (메뉴 X) */}
            <div
              className="  w-8 h-8 rounded-full bg-neutral-800
      text-white flex items-center justify-center
      text-xs font-bold cursor-pointer
      hover:ring-2 hover:ring-black/20 transition"
            >
              {account?.name?.charAt(0)}
            </div>
            {/* 햄버거 (메뉴 O) */}
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

            {/* 메뉴 */}
            {openMenu && (
              <>
                {/* 바깥 클릭 닫기 */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenMenu(false)}
                />

                {/* 메뉴 박스 */}
                <div className="absolute top-12 right-0 md:right-0 w-[200px] bg-white rounded-md shadow-xl border z-50">
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
      <main className="mt-[120px] max-w-[1350px] mx-auto px-6">
        <section className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
          {/* ================= 왼쪽: 프로필 사이드 ================= */}
          <aside className="hidden lg:block">
            <h2 className="text-2xl font-bold mb-6 mt-5">프로필</h2>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("info")}
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold
      ${
        activeTab === "info"
          ? "bg-neutral-100"
          : "hover:bg-neutral-100 text-neutral-700"
      }`}
              >
                회원 정보 수정
              </button>

              <button
                onClick={() => setActiveTab("password")}
                className={`w-full text-left px-4 py-3 rounded-lg
      ${
        activeTab === "password"
          ? "bg-neutral-100 font-semibold"
          : "hover:bg-neutral-100 text-neutral-700"
      }`}
              >
                비밀번호 변경
              </button>

              <button
                onClick={() => setActiveTab("withdraw")}
                className={`w-full text-left px-4 py-3 rounded-lg
      ${
        activeTab === "withdraw"
          ? "bg-neutral-100 font-semibold text-red-600"
          : "hover:bg-neutral-100 text-neutral-700"
      }`}
              >
                계정 탈퇴
              </button>
            </nav>
          </aside>

          {/* ================= 오른쪽: 콘텐츠 ================= */}
          <div>
            {/* 상단 타이틀 */}
            <div className="flex justify-between items-start mb-8">
              <h1 className="text-xl font-semibold mt-5">
                {TAB_TITLE[activeTab]}
              </h1>
            </div>

            {/* 카드 영역 */}
            <div className="max-w-[900px]">
              <div className="bg-white border rounded-xl p-10">
                {activeTab === "info" && (
                  <InfoForm onSubmit={handleUpdateProfile} account={account} />
                )}
                {activeTab === "password" && (
                  <PasswordForm onSubmit={handleChangePassword} />
                )}

                {activeTab === "withdraw" && (
                  <WithdrawForm onSubmit={handleWithdraw} />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
