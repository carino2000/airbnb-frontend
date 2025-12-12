import logo from "../assets/Airbnb_Logo.png";
import stays from "../assets/nav-stays.png";
import experiences from "../assets/nav-experiences.png";
import services from "../assets/nav-services.png";

import { useState, useRef } from "react";
import { useNavigate } from "react-router";

import SearchHeader from "../components/SearchHeader";
import SearchOverlay from "../components/SearchOverlay";
import SearchBarMini from "../components/SearchBarMini";

export default function RoomDetail() {
  const [openMenu, setOpenMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [expandSearch, setExpandSearch] = useState(false);

  const checkinRef = useRef(null);
  const checkoutRef = useRef(null);

  const navigate = useNavigate();

  return (
    <>
      {/* 상단 헤더 */}
      <header className="fixed top-0 left-0 w-full h-[120px] border-b z-50 bg-white">
        <div className="h-full flex items-center justify-between px-10">
          {/* 로고 */}
          <img src={logo} className="w-[100px] cursor-pointer" />

          {/* 작은 검색바 (클릭하면 모달 열림) */}
          <SearchBarMini onClick={() => setExpandSearch(true)} />

          {/* 우측 메뉴 */}
          <div className="flex items-center gap-3">
            <div className="text-xs font-bold">호스팅 하기</div>

            <div
              className="rounded-full bg-gray-100 p-2 cursor-pointer"
              onClick={() => setOpenMenu(!openMenu)}
            >
              {/* 햄버거 아이콘 */}
            </div>
          </div>
        </div>
      </header>

      {/* === 모달 영역 === */}
      <SearchOverlay open={expandSearch} onClose={() => setExpandSearch(false)}>
        <SearchHeader />
      </SearchOverlay>
    </>
  );
}
