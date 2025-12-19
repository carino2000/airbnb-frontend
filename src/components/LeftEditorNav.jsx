import {
  deleteAccommodation,
  getDetailAccommodation,
  updateAccommodation,
} from "@/util/DatabaseUtil";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

/* ================= 사이드 네비 ================= */
export function EditorSideNav({ active, onChange, accommodation }) {
  const itemBase = "w-full text-left p-4 rounded-xl border transition";
  const activeCls = "bg-neutral-100 border-neutral-300";
  const normalCls = "hover:bg-neutral-50";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">리스팅 에디터</h2>

      <button
        onClick={() => onChange("basic")}
        className={`${itemBase} ${active === "basic" ? activeCls : normalCls}
         min-h-[300px]
    flex flex-col
    `}
      >
        <p className="font-semibold bg">기본 정보</p>
        <p className="text-xs text-neutral-500">이름, 설명, 주소</p>
        {accommodation && (
          <img
            className="w-full h-full rounded-xl object-cover p-3"
            src={`http://192.168.0.17:8080${accommodation.images[0].uri}`}
            alt=""
          />
        )}
      </button>

      <button
        onClick={() => onChange("room")}
        className={`${itemBase} ${active === "room" ? activeCls : normalCls}`}
      >
        <p className="font-semibold">객실 정보</p>
        <p className="text-xs text-neutral-500">침실, 침대, 욕실</p>
      </button>

      <button
        onClick={() => onChange("price")}
        className={`${itemBase} ${active === "price" ? activeCls : normalCls}`}
      >
        <p className="font-semibold">요금</p>
        <p className="text-xs text-neutral-500">1박 요금, 추가 요금</p>
      </button>
    </div>
  );
}

/* ================= 메인 콘텐츠 ================= */
export function ListingEditorContent({
  active,
  accommodation,
  accommodationId,
  token,
}) {
  const [basic, setBasic] = useState({});
  const [roomState, setRoomState] = useState({});
  const [price, setPrice] = useState({});

  useEffect(() => {
    if (accommodation) {
      setBasic({
        name: accommodation.name ?? "",
        description: accommodation.description ?? "",
        address: accommodation.address ?? "",
      });
      setRoomState({
        maxCapacity: accommodation.maxCapacity ?? 0,
        bedroom: accommodation.bedroom ?? 0,
        bed: accommodation.bed ?? 0,
        bathroom: accommodation.bathroom ?? 0,
      });
      setPrice({
        price: accommodation.price ?? 0,
        extraRate: accommodation.extraRate ?? 0,
      });
    }
  }, [accommodation]);

  function editSubmitHandle() {
    const data = {
      ...basic,
      ...roomState,
      ...price,
    };

    updateAccommodation(data, accommodationId, token).then((obj) => {
      if (obj.success) {
        window.alert("정상 처리되었습니다!");
        Navigate("/hosting/listing/28/edit");
      } else {
        window.alert("숙소 정보 수정 오류!");
        Navigate("/hosting/listings");
      }
    });
  }

  function deleteSubmitHandle() {
    if (window.confirm("정말 숙소 정보를 삭제하시겠습니까?")) {
      deleteAccommodation(accommodationId, token).then((obj) => {
        if (obj.success) {
          window.alert("정상 처리되었습니다");
        } else {
          window.alert("숙소 삭제 오류!");
        }
        Navigate("/hosting/listings");
      });
    } else {
      return;
    }
  }

  return (
    <div className="max-w-[900px]">
      {active === "basic" && (
        <SectionWrapper
          title="기본 정보"
          onSave={() => console.log("기본 정보 저장", basic)}
        >
          <Input
            label="숙소 이름"
            value={basic.name}
            onChange={(e) => setBasic({ ...basic, name: e.target.value })}
          />
          <Textarea
            label="숙소 설명"
            value={basic.description}
            onChange={(e) =>
              setBasic({ ...basic, description: e.target.value })
            }
          />
          <Input
            label="주소"
            value={basic.address}
            onChange={(e) => setBasic({ ...basic, address: e.target.value })}
          />
        </SectionWrapper>
      )}

      {active === "room" && (
        <SectionWrapper
          title="객실 정보"
          onSave={() => console.log("객실 정보 저장", roomState)}
        >
          <Counter
            label="최대 인원"
            value={roomState.maxCapacity}
            onChange={(v) => setRoomState({ ...roomState, maxCapacity: v })}
          />
          <Counter
            label="침실 수"
            value={roomState.bedroomCount}
            onChange={(v) => setRoomState({ ...roomState, bedroomCount: v })}
          />
          <Counter
            label="침대 수"
            value={roomState.bedCount}
            onChange={(v) => setRoomState({ ...roomState, bedCount: v })}
          />
          <Counter
            label="욕실 수"
            value={roomState.bathroomCount}
            onChange={(v) => setRoomState({ ...roomState, bathroomCount: v })}
          />
        </SectionWrapper>
      )}

      {active === "price" && (
        <SectionWrapper
          title="요금"
          onSave={() => console.log("요금 저장", price)}
        >
          <Input
            label="1박 요금"
            type="number"
            value={price.price}
            onChange={(e) => setPrice({ ...price, price: e.target.value })}
          />
          <Input
            label="추가 요금 비율"
            type="number"
            step="0.01"
            value={price.extraRate}
            onChange={(e) => setPrice({ ...price, extraRate: e.target.value })}
          />
        </SectionWrapper>
      )}
      <div>
        <button
          onClick={editSubmitHandle}
          className="px-6 mt-2 py-2 rounded-full text-sm font-semibold bg-neutral-800 text-white hover:bg-black"
        >
          전체 저장
        </button>
      </div>
      <div>
        <button
          onClick={deleteSubmitHandle}
          className="px-6 mt-2 py-2 rounded-full text-sm font-semibold bg-red-500 text-white hover:bg-red-600"
        >
          숙소 삭제
        </button>
      </div>
    </div>
  );
}

/* ================= 공통 컴포넌트 ================= */
export function SectionWrapper({ title, children, onSave, disabled }) {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-6">{title}</h3>

      <div className="border rounded-2xl p-8 space-y-6 bg-white">
        {children}

        <div className="pt-6 flex justify-end border-t">
          <button
            onClick={onSave}
            disabled={disabled}
            className={`
              px-6 py-2 rounded-full text-sm font-semibold
              ${
                disabled
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-neutral-900 text-white hover:bg-black"
              }
            `}
          >
            저장
          </button>
        </div>
      </div>
    </section>
  );
}

export function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-300"
      />
    </div>
  );
}

export function Textarea({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        rows={5}
        {...props}
        className="w-full border rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-300"
      />
    </div>
  );
}

export function Counter({ label, value = 1, min = 1, max, onChange }) {
  const decrease = () => {
    const next = Math.max(min, value - 1);
    onChange?.(next);
  };

  const increase = () => {
    const next = max ? Math.min(max, value + 1) : value + 1;
    onChange?.(next);
  };

  return (
    <div className="flex justify-between items-center">
      <span className="font-medium">{label}</span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrease}
          disabled={value <= min}
          className="w-8 h-8 border rounded-full disabled:opacity-40"
        >
          -
        </button>

        <span>{value}</span>

        <button
          type="button"
          onClick={increase}
          disabled={max !== undefined && value >= max}
          className="w-8 h-8 border rounded-full disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}
