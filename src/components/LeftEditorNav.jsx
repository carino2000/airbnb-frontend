import { useState } from "react";

/* ================= 사이드 네비 ================= */
export function EditorSideNav({ active, onChange }) {
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
export function ListingEditorContent({ active }) {
  const [basic, setBasic] = useState({
    name: "",
    description: "",
    address: "",
  });

  const [price, setPrice] = useState({
    price: "",
    extraRate: "",
  });

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
          onSave={() => console.log("객실 정보 저장")}
        >
          <Counter label="최대 인원" />
          <Counter label="침실 수" />
          <Counter label="침대 수" />
          <Counter label="욕실 수" />
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

export function Counter({ label }) {
  const [v, setV] = useState(1);

  return (
    <div className="flex justify-between items-center">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setV((p) => Math.max(1, p - 1))}
          className="w-8 h-8 border rounded-full"
        >
          -
        </button>
        <span>{v}</span>
        <button
          type="button"
          onClick={() => setV((p) => p + 1)}
          className="w-8 h-8 border rounded-full"
        >
          +
        </button>
      </div>
    </div>
  );
}
