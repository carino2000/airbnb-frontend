import logo from "../assets/Airbnb_Logo.png";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useToken, useAccount } from "../stores/account-store";
import { getDetailAccommodation } from "@/util/DatabaseUtil";
import {
  EditorSideNav,
  ListingEditorContent,
} from "@/components/LeftEditorNav";

function editSubmitHandle() {
  window.dispatchEvent(new Event("submit-edit"));
}
function deleteSubmitHandle() {
  window.dispatchEvent(new Event("submit-delete"));
}

export default function HostingEdit() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const { token, clearToken } = useToken();
  const { account, clearAccount } = useAccount();

  const [activeSection, setActiveSection] = useState("basic");
  const [accommodation, setAccommodation] = useState();
  const [newImages, setNewImages] = useState([]);
  const { accommodationId } = useParams();

  useEffect(() => {
    if (!account || !token) {
      window.alert("로그인이 필요한 페이지입니다.");
      navigate("/");
    }
  }, [account, token]);

  useEffect(() => {
    getDetailAccommodation(accommodationId).then((obj) => {
      if (obj.success) setAccommodation(obj.accommodation);
      else {
        window.alert("숙소 수정 페이지 불러오기 오류!");
        navigate("/hosting/listings");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {/* 헤더 */}
      <header className="fixed top-0 left-0 w-full h-[90px] border-b border-neutral-200 z-50 bg-white">
        <div className="h-full w-full flex items-center justify-between max-w-[1350px] mx-auto px-6">
          <img
            src={logo}
            className="w-[100px] cursor-pointer"
            onClick={() => navigate("/")}
            alt="logo"
          />

          <div className="flex gap-2 items-center relative">
            <div className="hidden sm:block rounded-full px-3 py-2 hover:bg-gray-100 cursor-pointer">
              <p
                className="text-xs font-bold whitespace-nowrap"
                onClick={() => navigate("/")}
              >
                게스트 모드로 전환
              </p>
            </div>

            <div
              className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold cursor-pointer"
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

      <div className="h-screen pt-[90px] bg-white">
        <div className="max-w-[1350px] mx-auto px-6 flex gap-10 h-[calc(100vh-90px)]">
          {/* 왼쪽 */}
          <aside className="w-[420px] shrink-0 border-r border-neutral-200 pr-6">
            <div
              className="flex-1 overflow-y-auto pr-2 editor-scroll"
              style={{ height: "calc(100vh - 90px - 140px)" }}
            >
              <EditorSideNav
                accommodation={accommodation}
                active={activeSection}
                onChange={setActiveSection}
                newImages={newImages}
                setNewImages={setNewImages}
              />
            </div>

            {/* 하단 고정 버튼 */}
            <div className="pt-5 space-y-2 bg-white sticky bottom-0">
              <button
                onClick={editSubmitHandle}
                className="w-full py-3 rounded-xl text-sm font-semibold bg-neutral-500 text-white hover:bg-black"
              >
                전체 저장
              </button>

              <button
                onClick={deleteSubmitHandle}
                className="w-full py-3 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-700"
              >
                숙소 삭제
              </button>
            </div>
          </aside>

          {/* 오른쪽 */}
          <main className="flex-1 min-w-0 h-full overflow-y-auto">
            <ListingEditorContent
              newImages={newImages}
              setNewImages={setNewImages}
              token={token}
              accommodationId={accommodationId}
              accommodation={accommodation}
              active={activeSection}
            />
          </main>
        </div>
      </div>
    </>
  );
}
