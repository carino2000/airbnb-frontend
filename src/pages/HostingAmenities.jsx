import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import logo from "../assets/arbnb_logo-b.png";
import wifi from "../assets/noun-wifi-6113575.png";
import tv from "../assets/noun-television-6113536.png";
import kitchen from "../assets/noun-oven-6113069.png";
import shower from "../assets/noun-shower-6112759.png";
import bath from "../assets/noun-bath-6113076.png";
import parking from "../assets/noun-parking-spot-6112771.png";
import ac from "../assets/noun-air-conditioning-6112768.png";
import fire from "../assets/noun-fire-extinguisher-6112775.png";
import aid from "../assets/noun-first-aid-6113071.png";
import hair from "../assets/noun-hair-dryer-6112790.png";
import washing from "../assets/noun-washing-machine-6113545.png";
import bed from "../assets/noun-single-bed-6113298.png";
import { useAmenities } from "../stores/account-store";

const amenities = [
  { id: "wifi", label: "와이파이", icon: wifi },
  { id: "tv", label: "티비", icon: tv },
  { id: "bed", label: "침대", icon: bed },
  { id: "kitchen", label: "주방", icon: kitchen },
  { id: "shower", label: "샤워기", icon: shower },
  { id: "bath", label: "욕조", icon: bath },
  { id: "hair", label: "드라이기", icon: hair },
  { id: "washing", label: "세탁기", icon: washing },
  { id: "parking", label: "주차", icon: parking },
  { id: "ac", label: "에어컨", icon: ac },
  { id: "fire", label: "소화기", icon: fire },
  { id: "aid", label: "구급 상자", icon: aid },
];

export default function HostingAmenities() {
  const navigate = useNavigate();

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const setAmenities = useAmenities((s) => s.setAmenities);
  const clearAmenities = useAmenities((s) => s.clearAmenities);

  const toggleAmenity = (id) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  function amenitiesSubmit() {
    clearAmenities();
    setAmenities(() => [...selectedAmenities]);
    navigate("/hosting/images");
  }

  return (
    <>
      {/* 헤더 */}
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
              className="px-6 py-2 border border-neutral-400 rounded-full text-xs font-bold cursor-pointer"
              onClick={() => navigate("/")}
            >
              나가기
            </button>
          </div>
        </div>
      </header>

      <main
        className="
          min-h-[calc(100vh-185px)]
          px-6
          pt-[110px]
          pb-[120px]
          flex
          flex-col
          items-center
"
      >
        <div className="w-full max-w-[700px]">
          <h1
            className="text-2xl lg:text-[35px]
              font-bold
              leading-tight
              min-h-14
              mb-4"
          >
            숙소 편의시설 정보를 추가하세요
          </h1>
          <p className="text-neutral-600 mb-10">
            제공되는 편의시설을 모두 선택해 주세요.
          </p>

          {/* 9칸 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {amenities.map((item) => {
              const active = selectedAmenities.includes(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => toggleAmenity(item.id)}
                  className={`
                    h-[110px]
                    flex flex-col items-center justify-center gap-2
                    rounded-xl border
                    transition
          ${
            active
              ? "border-black border-3 scale-105"
              : "hover:border-black active:bg-neutral-300 active:scale-105 cursor-pointer"
          }

        `}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="fixed bottom-0 left-0 w-full h-[95px] bg-white z-40">
        <div className="grid grid-cols-3 h-1.5 w-full">
          <div className="bg-neutral-950" />
          <div className="bg-neutral-950" />
          <div className="bg-neutral-300" />
        </div>

        <div className="md:px-11 flex items-center justify-between h-[calc(100%-6px)] ">
          <button
            className="border-b-2 cursor-pointer text-sm"
            onClick={() => navigate("/hosting/stand-out")}
          >
            뒤로
          </button>
          <button
            disabled={selectedAmenities.length === 0}
            className={`
              px-8 py-3 rounded-xl text-sm font-bold cursor-pointer
    ${
      selectedAmenities.length > 0
        ? "bg-neutral-950 text-white hover:bg-neutral-950/50"
        : "bg-neutral-300 text-white cursor-not-allowed"
    }
  `}
            onClick={amenitiesSubmit}
          >
            다음
          </button>
        </div>
      </footer>
    </>
  );
}
