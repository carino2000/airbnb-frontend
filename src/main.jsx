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
    element: <Main />, //메인 페이지
  },

  //---------------------------------------------------

  {
    path: "/room/:accommodationId",
    element: <RoomDetail />, //숙소 내부 페이지
  },

  //---------------------------------------------------

  {
    path: "/message",
    element: <MessageList />, //메시지 리스트 노출 페이지
  },
  {
    path: "/message/:reservationCode",
    element: <MessageWrite />, //예약 아이디 별 메시지 페이지
  },
  {
    path: "/review/:reservationCode/write",
    element: <Review />, //게스트 리뷰 작성 페이지
  },

  //---------------------------------------------------

  {
    path: "/sign-up",
    element: <Signup />, //회원가입
  },
  {
    path: "/log-in",
    element: <Login />, //로그인
  },

  //---------------------------------------------------

  {
    path: "/profile",
    element: <Profile />, // 프로필 확인 및 수정
  },
  {
    path: "/profile/wishlists",
    element: <Wishlist />, // 위시리스트 페이지
  },
  {
    path: "/profile/delete",
    element: <AccountDelete />, // 회원 탈퇴 (보여줄 페이지는 필요 없을수도 있음)
  },
  {
    path: "/profile/bookings",
    element: <BookingHistory />, // 회원 예약 기록 조회
  },

  //---------------------------------------------------

  {
    path: "/reservation/:reservationCode",
    element: <ReservationDetail />, //예약 기록 상세 페이지
  },

  //---------------------------------------------------

  {
    path: "/hosting/accommodation",
    element: <HostingAccommodation />, // 숙소 등록 1차
  },
  {
    path: "/hosting/amenities",
    element: <HostingAmenities />, // 숙소 등록 2차-편의시설
  },
  {
    path: "/hosting/images",
    element: <HostingImages />, // 숙소 등록 2차-이미지
  },
  {
    path: "/hosting/tags",
    element: <HostingTags />, // 숙소 등록 2차-태그
  },

  //---------------------------------------------------

  {
    path: "/hosting/listings",
    element: <HostingList />, // 내가 호스팅한 숙소 목록 노출
  },
  {
    path: "/hosting/listing/:accommodationId/edit",
    element: <HostingEdit />, // 내가 호스팅한 숙소 정보 수정
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
