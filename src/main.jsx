import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import AirbnbHomePage from "./pages/AirbnbHomePage";
import AirbnbRoomsPage from "./pages/AirbnbRoomsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AirbnbHomePage />, //메인 페이지
  },

  //---------------------------------------------------

  {
    path: "/room/:accommodationId",
    element: <AirbnbHomePage />, //숙소 내부 페이지
  },

  //---------------------------------------------------

  {
    path: "/message",
    element: <AirbnbHomePage />, //메시지 리스트 노출 페이지
  },
  {
    path: "/message/:reservationId",
    element: <AirbnbHomePage />, //예약 아이디 별 메시지 페이지
  },
  {
    path: "/review/:reservationId/write",
    element: <AirbnbHomePage />, //게스트 리뷰 작성 페이지
  },

  //---------------------------------------------------

  {
    path: "/sign-up",
    element: <AirbnbHomePage />, //회원가입
  },
  {
    path: "/log-in",
    element: <AirbnbHomePage />, //로그인
  },

  //---------------------------------------------------

  {
    path: "/profile",
    element: <AirbnbRoomsPage />, // 프로필 확인 및 수정
  },
  {
    path: "/profile/wishlists",
    element: <AirbnbRoomsPage />, // 위시리스트 페이지
  },
  {
    path: "/profile/delete",
    element: <AirbnbRoomsPage />, // 회원 탈퇴 (보여줄 페이지는 필요 없을수도 있음)
  },
  {
    path: "/profile/bookings",
    element: <AirbnbRoomsPage />, // 회원 예약 기록 조회
  },

  //---------------------------------------------------

  {
    path: "/hosting/accommodation",
    element: <AirbnbRoomsPage />, // 숙소 등록 1차
  },
  {
    path: "/hosting/amenities",
    element: <AirbnbRoomsPage />, // 숙소 등록 2차-편의시설
  },
  {
    path: "/hosting/images",
    element: <AirbnbRoomsPage />, // 숙소 등록 2차-이미지
  },
  {
    path: "/hosting/tags",
    element: <AirbnbRoomsPage />, // 숙소 등록 2차-태그
  },

  //---------------------------------------------------

  {
    path: "/hosting/listings",
    element: <AirbnbRoomsPage />, // 내가 호스팅한 숙소 목록 노출
  },
  {
    path: "/hosting/listing/:accommodationId/edit",
    element: <AirbnbRoomsPage />, // 내가 호스팅한 숙소 정보 수정
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
