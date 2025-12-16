import { useNavigate } from "react-router";
import Lottie from "lottie-react";
import logo from "../assets/arbnb_logo-b.png";
import successAnimation from "../assets/Successfully Done.json";

export default function HostingComplete() {
  const navigate = useNavigate();

  return (
    <>
      {/* ================= 헤더 ================= */}
      <header className="fixed top-0 left-0 w-full h-40 md:h-[90px] bg-white z-40">
        <div className="h-full flex items-center px-6 md:px-10">
          <div className="flex items-center justify-between w-full">
            <img
              src={logo}
              alt="logo"
              className="w-9 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <button
              className="px-6 py-2 border rounded-full text-xs font-bold cursor-pointer"
              onClick={() => navigate("/")}
            >
              나가기
            </button>
          </div>
        </div>
      </header>

      {/* ================= 메인 ================= */}
      <main
        className="
          h-screen
          flex
          flex-col
          items-center
          justify-center
 -translate-y-10
        "
      >
        <Lottie
          animationData={successAnimation}
          loop={true}
          className="w-[300px] h-[250px]"
        />

        <div className="text-center">
          <h2 className="text-4xl font-bold">등록이 완료되었습니다</h2>
          <p className="text-sm text-gray-500 mt-5">
            등록한 숙소는 리스트에서 확인가능합니다.
          </p>
        </div>
      </main>
    </>
  );
}
