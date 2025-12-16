import { useNavigate } from "react-router";
import { useState } from "react";
import logo from "../assets/arbnb_logo-b.png";
import CounterRow from "../components/CounterRow";
import { useAccommodation } from "../stores/account-store";

export default function HostingLocation() {
  const navigate = useNavigate();
  const setAccommodation = useAccommodation((s) => s.setAccommodation);
  const [counts, setCounts] = useState({
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  });

  const changeCount = (key, diff) => {
    setCounts((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + diff),
    }));
  };

  const isFormValid = counts.guests > 0;

  function floorPlanSubmit() {
    setAccommodation((old) => ({
      ...old,
      maxCapacity: counts.guests,
      bedroom: counts.bedrooms,
      bed: counts.beds,
      bathroom: counts.bathrooms,
    }));
    navigate("/hosting/stand-out");
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
              숙소 기본 정보를 알려주세요
            </h1>
            <p className="text-neutral-700 leading-relaxed">
              침대 유형과 같은 세부 사항은 나중에 추가하실 수 있습니다.
            </p>
          </div>

          {/* 카운터 */}
          <div className="border border-neutral-300 rounded-xl px-6">
            <CounterRow
              label="게스트"
              value={counts.guests}
              onMinus={() => changeCount("guests", -1)}
              onPlus={() => changeCount("guests", 1)}
            />

            <CounterRow
              label="침실"
              value={counts.bedrooms}
              onMinus={() => changeCount("bedrooms", -1)}
              onPlus={() => changeCount("bedrooms", 1)}
            />

            <CounterRow
              label="침대"
              value={counts.beds}
              onMinus={() => changeCount("beds", -1)}
              onPlus={() => changeCount("beds", 1)}
            />

            <CounterRow
              label="욕실"
              value={counts.bathrooms}
              onMinus={() => changeCount("bathrooms", -1)}
              onPlus={() => changeCount("bathrooms", 1)}
            />
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
            onClick={() => navigate("/hosting/accommodation/location")}
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
            onClick={floorPlanSubmit}
          >
            다음
          </button>
        </div>
      </footer>
    </>
  );
}
