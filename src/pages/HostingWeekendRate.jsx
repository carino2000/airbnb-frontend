import { useNavigate } from "react-router";
import { useState } from "react";
import logo from "../assets/arbnb_logo-b.png";
import {
  useAccommodation,
  useAmenities,
  useImage,
  useTags,
  useToken,
} from "../stores/account-store";
import {
  createAccommodation,
  createAmenities,
  createImages,
  createTags,
} from "../util/DatabaseUtil";

export default function HostingWeekendRate() {
  const navigate = useNavigate();

  const BASE_PRICE = useAccommodation((s) => s.accommodation.price);
  const [weekendRate, setWeekendRate] = useState(36);

  const weekendPrice = Math.round(BASE_PRICE * (1 + weekendRate / 100));
  const formatWon = (num) => "₩" + num.toLocaleString("ko-KR");

  const isFormValid = weekendRate >= 0;

  const accommodation = useAccommodation((s) => s.accommodation);
  const amenities = useAmenities((s) => s.amenities);
  const image = useImage((s) => s.image);
  const tags = useTags((s) => s.tags);
  const token = useToken((s) => s.token);

  async function registerAccommodation() {
    const payload = {
      ...accommodation,
      extraRate: weekendRate / 100,
    };

    const obj = await createAccommodation(payload, token);
    if (obj.success) {
      const imageInsert = await createImages(
        obj.accommodation.id,
        image,
        token
      );
      const tagsInsert = await createTags(obj.accommodation.id, tags, token);
      const amenitiesInsert = await createAmenities(
        obj.accommodation.id,
        amenities,
        token
      );
      if (
        !imageInsert.success ||
        !tagsInsert.success ||
        !amenitiesInsert.success
      ) {
        window.alert("숙소 사진/태그/편의시설 등록 중 오류 발생");
        navigate("/hosting");
      }
    }
    navigate("/hosting/complete");
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
            주말 요금을 설정하세요
          </h1>

          <p className="text-neutral-600 mb-16">
            금요일과 토요일에는 주말 할증을 추가하세요.
          </p>

          {/* 금액 */}
          <div className="text-7xl font-bold mb-10 text-center">
            {formatWon(weekendPrice)}
          </div>

          <div className="border border-neutral-300 rounded-xl p-4 max-w-[300px] mx-auto mb-20 text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-neutral-600">기본 요금</span>
              <span>{formatWon(weekendPrice)}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span className="text-neutral-600">게스트 서비스 수수료</span>
              <span>+ {formatWon(Math.round(weekendPrice * 0.14))}</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-bold">
              <span>게스트 지불 요금</span>
              <span>{formatWon(Math.round(weekendPrice * 1.14))}</span>
            </div>
          </div>

          {/* 주말 프리미엄 */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">주말 프리미엄</p>
              <p className="text-sm text-neutral-500">
                제안 할증률: {weekendRate}%
              </p>
            </div>

            <div className="border rounded-full px-4 py-2 text-sm font-medium">
              {weekendRate}%
            </div>
          </div>

          {/* 슬라이더 */}
          <input
            type="range"
            min={0}
            max={99}
            value={weekendRate}
            onChange={(e) => setWeekendRate(Number(e.target.value))}
            className="w-full accent-black"
          />

          <div className="flex justify-between text-xs text-neutral-400 mt-2">
            <span>0%</span>
            <span>99%</span>
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
            onClick={() => navigate("/hosting/baseRate")}
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
            onClick={registerAccommodation}
          >
            다음
          </button>
        </div>
      </footer>
    </>
  );
}
