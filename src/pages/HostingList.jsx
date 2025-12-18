import logo from "../assets/Airbnb_Logo.png";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useToken, useAccount } from "../stores/account-store";
import MessageList from "./MessageList";
import { getMyHosting } from "@/util/DatabaseUtil";

export default function HostingList() {
  const navigate = useNavigate();

  // const [tab, setTab] = useState("listings"); // listings | messages
  let [searchParams, setSearchParams] = useSearchParams("?tab=listings");

  const [openMenu, setOpenMenu] = useState(false);

  const { clearToken } = useToken();
  const { account, clearAccount } = useAccount();

  const [items, setItems] = useState([]);

  const addItem = () => {
    setItems((prev) => [...prev, prev.length + 1]);
  };

  const tab = searchParams.get("tab") ?? "listings";
  // console.log(tab);
  function editHostingHandle(accommodationId) {
    navigate(`/hosting/listing/${accommodationId}/edit`);
  }

  useEffect(() => {
    getMyHosting(account.id).then((obj) => {
      if (obj.success) {
        setItems([...obj.accommodations]);
      } else {
        window.alert("숙소 가져오기 오류!");
        navigate("/");
      }
    });
  }, []);

  const MENU = [
    { label: "찜", path: "/profile/wishlists" },
    { label: "리스트", path: "/hosting/listings" },
    { label: "메시지", path: "/hosting/listings?tab=messages" },
    { label: "내 프로필", path: "/profile/edit" },
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

          {/* 탭 */}
          <div className="flex items-center gap-6">
            <button
              className={`text-sm font-semibold ${
                tab === "listings"
                  ? "text-black underline underline-offset-6"
                  : "text-neutral-500 hover:underline hover:underline-offset-6"
              }`}
              onClick={() => setSearchParams("?tab=listings")}
            >
              리스팅
            </button>
            <button
              className={`text-sm font-semibold ${
                tab === "messages"
                  ? "text-black underline underline-offset-6"
                  : "text-neutral-500 hover:underline hover:underline-offset-6"
              }`}
              onClick={() => setSearchParams("?tab=messages")}
            >
              메시지
            </button>
          </div>

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

            <div
              className="w-8 h-8 rounded-full bg-neutral-800 text-white
              flex items-center justify-center text-xs font-bold cursor-pointer"
              onClick={() => setOpenMenu((prev) => !prev)}
            >
              {account?.name?.charAt(0)}
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
      <main className="mt-[120px] max-w-[1350px] mx-auto px-6">
        {/* Wishlist와 동일한 상단 */}
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold mb-6 mt-5">
            {tab === "listings" ? "내 리스팅" : "메시지"}
          </h1>

          {tab === "listings" ? (
            <button
              onClick={() => {
                addItem();
                navigate("/hosting");
              }}
              className="flex items-center gap-2 cursor-pointer text-sm mt-7"
            >
              + 추가하기
            </button>
          ) : (
            <div className="mt-7" /> // 높이 맞춤용
          )}
        </div>
        {/* 콘텐츠 */}
        {tab === "listings" && (
          <div className="grid grid-cols-4 gap-4">
            {items.length === 0 ? (
              <div>리스팅 정보 없음</div>
            ) : (
              items.map((item, index) => (
                <div
                  onClick={() => editHostingHandle(item.id)}
                  key={index}
                  className="bg-green-100 rounded-lg flex items-center justify-center aspect-square"
                >
                  {item.uri && (
                    <img
                      className="w-full h-full rounded-xl object-cover"
                      src={`http://192.168.0.17:8080${item.uri}`}
                      alt=""
                    />
                  )}
                  <div className="mt-2 text-left">
                    {item.address && (
                      <div className="font-medium text-sm truncate">
                        {item.address.split(" ")[0]}의 집
                      </div>
                    )}
                    <div className="text-xs text-gray-500 truncate">
                      1월 1일 ~ 12월 31일
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      ₩{item.price}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {tab === "messages" && <MessageList />}
      </main>
    </>
  );
}
