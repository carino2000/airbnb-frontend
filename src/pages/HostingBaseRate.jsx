import { useNavigate } from "react-router";
import { useState } from "react";
import logo from "../assets/arbnb_logo-b.png";
import { useAccommodation } from "../stores/account-store";

export default function HostingBaseRate() {
  const navigate = useNavigate();

  const RECOMMENDED_BASE_PRICE = 66350;
  const [basePrice, setBasePrice] = useState(RECOMMENDED_BASE_PRICE);

  const formatWon = (num) => "₩" + num.toLocaleString("ko-KR");
  const guestPrice = Math.round(basePrice * 1.14);
  const isFormValid = basePrice > 0;

  const setAccommodation = useAccommodation((s) => s.setAccommodation);

  function priceSubmit() {
    setAccommodation((old) => ({
      ...old,
      price: basePrice,
    }));
    navigate("/hosting/weekendRate");
  }

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full h-[90px] bg-white z-40">
        <div className="h-full flex items-center px-6 md:px-10">
          <div className="flex items-center justify-between w-full">
            <img
              src={logo}
              alt="logo"
              className="w-9 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <button
              className="px-6 py-2 border border-neutral-400 rounded-full text-xs font-bold"
              onClick={() => navigate("/")}
            >
              나가기
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main
        className="
          fixed
          top-[90px]
          left-0
          w-full
          h-[calc(100vh-185px)]
          flex
          justify-center
          px-6
          overflow-y-auto
        "
      >
        <div className="w-full max-w-[700px] py-12 text-left">
          {/* 타이틀 */}
          <h1 className="text-2xl lg:text-[35px] font-bold mb-4">
            주중 기본 요금을 설정하세요
          </h1>

          <p className="text-neutral-600 mb-16">
            추천 요금을 기준으로 주중 요금을 조정할 수 있습니다.
          </p>

          {/* 금액 */}
          <div className="text-7xl font-bold mb-10 text-center">
            {formatWon(basePrice)}
          </div>

          <div className="border border-neutral-300 rounded-xl p-4 max-w-[300px] mx-auto mb-20 text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-neutral-600">기본 요금</span>
              <span>{formatWon(basePrice)}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span className="text-neutral-600">게스트 서비스 수수료</span>
              <span>+ {formatWon(Math.round(basePrice * 0.14))}</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-bold">
              <span>게스트 지불 요금</span>
              <span>{formatWon(guestPrice)}</span>
            </div>
          </div>

          {/* 슬라이더 */}
          <input
            type="range"
            min={10000}
            max={300000}
            step={1000}
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
            className="w-full accent-black"
          />

          <div className="flex justify-between text-xs text-neutral-400 mt-2">
            <span>{formatWon(10000)}</span>
            <span>{formatWon(300000)}</span>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full h-[95px] bg-white z-40">
        <div className="grid grid-cols-3 h-1.5 w-full">
          <div className="bg-neutral-950" />
          <div className="bg-neutral-950" />
          <div className="bg-neutral-950" />
        </div>

        <div className="md:px-11 flex items-center justify-between h-[calc(100%-6px)]">
          <button
            className="border-b-2 cursor-pointer text-sm"
            onClick={() => navigate("/hosting/finish-setup")}
          >
            뒤로
          </button>

          <button
            disabled={!isFormValid}
            className={`
              px-8 py-3 rounded-xl text-sm font-bold
              ${
                isFormValid
                  ? "bg-neutral-950 text-white hover:bg-neutral-800"
                  : "bg-neutral-300 text-white cursor-not-allowed"
              }
            `}
            onClick={priceSubmit}
          >
            다음
          </button>
        </div>
      </footer>
    </>
  );
}
