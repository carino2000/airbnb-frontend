import { useNavigate } from "react-router";
import { useState } from "react";
import logo from "../assets/arbnb_logo-b.png";
import { useAccommodation } from "../stores/account-store";

export default function HostingLocation() {
  const navigate = useNavigate();

  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [road, setRoad] = useState("");
  const [detail, setDetail] = useState("");
  const [zipcode, setZipcode] = useState("");

  const isFormValid = province.trim() && city.trim() && road.trim();
  const setAccommodation = useAccommodation((s) => s.setAccommodation);

  function locationSubmit() {
    const location = "";
    setAccommodation((old) => ({
      ...old,
      address: location,
    }));
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
        <div className="w-full max-w-[700px] py-12">
          {/* 타이틀 */}
          <div className="mb-14">
            <h1 className="text-2xl lg:text-[35px] font-bold leading-tight mb-4">
              숙소 위치는 어디인가요?
            </h1>
            <p className="text-neutral-700 leading-relaxed">
              주소는 게스트의 예약이 확정된 이후에 공개됩니다.
            </p>
          </div>

          {/* 주소 입력 */}
          <div className="border border-neutral-300 rounded-xl overflow-hidden text-sm">
            <div className="px-4 py-3 border-b">
              <p className="text-neutral-500 mb-2 text-xs">국가/지역</p>
              <p className="font-medium text-base">한국 · KR</p>
            </div>

            <div className="px-4 py-3 border-b">
              <p className="text-neutral-500 mb-2 text-xs">도/특별·광역시</p>
              <input
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full outline-none font-medium text-base"
              />
            </div>

            <div className="px-4 py-3 border-b">
              <p className="text-neutral-500 mb-2 text-xs">시/군/구</p>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full outline-none font-medium text-base"
              />
            </div>

            <div className="px-4 py-3 border-b">
              <p className="text-neutral-500 mb-2 text-xs">도로명 주소</p>
              <input
                value={road}
                onChange={(e) => setRoad(e.target.value)}
                className="w-full outline-none font-medium text-base"
              />
            </div>

            <div className="px-4 py-3 border-b">
              <p className="text-neutral-500 mb-2 text-xs">
                아파트 동/호수, 건물명 (해당하는 경우)
              </p>
              <input
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="w-full outline-none font-medium text-base"
              />
            </div>

            <div className="px-4 py-3">
              <p className="text-neutral-500 mb-2 text-xs">
                우편번호 (해당하는 경우)
              </p>
              <input
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                className="w-full outline-none font-medium text-base"
              />
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full h-[95px] bg-white z-40">
        <div className="grid grid-cols-3 h-1.5 w-full">
          <div className="bg-neutral-950" />
          <div className="bg-neutral-300" />
          <div className="bg-neutral-300" />
        </div>

        <div className="md:px-11 flex items-center justify-between h-[calc(100%-6px)]">
          <button
            className="border-b-2 cursor-pointer text-sm"
            onClick={() => navigate("/hosting/accommodation/structure")}
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
            onClick={() => {
              locationSubmit();
              navigate("/hosting/accommodation/floor-plan");
            }}
          >
            다음
          </button>
        </div>
      </footer>
    </>
  );
}
