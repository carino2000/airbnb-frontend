import {
  createImages,
  deleteAccommodation,
  updateAccommodation,
} from "@/util/DatabaseUtil";
import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router";

import { Trash2, Plus, Image as ImageIcon } from "lucide-react";

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

/* ================= 사이드 네비 ================= */
export function EditorSideNav({ active, onChange, accommodation }) {
  const itemBase =
    "w-full text-left rounded-2xl border bg-white transition shadow-sm hover:shadow-md";
  const activeCls = "border-neutral-900 ring-1 ring-neutral-900/10";
  const normalCls = "border-neutral-200 hover:border-neutral-300";

  const images = Array.isArray(accommodation?.images)
    ? accommodation.images
    : [];
  const cover = images[0]?.uri
    ? `http://192.168.0.17:8080${images[0].uri}`
    : null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mt-10 mb-5">리스팅 에디터</h2>

      {/* 포토 투어  (큰 카드) */}
      <button
        onClick={() => onChange("images")}
        className={`${itemBase} ${active === "images" ? activeCls : normalCls}`}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">포토 투어</p>
              <p className="text-xs text-neutral-500 mt-1">사진 관리</p>
            </div>
          </div>

          <div className="mt-4">
            {/* 썸네일 */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
              {cover ? (
                <img
                  src={cover}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <ImageIcon className="w-7 h-7" />
                </div>
              )}
            </div>
          </div>
        </div>
      </button>

      {/* 나머지 섹션들 */}
      <NavItem
        active={active === "basic"}
        onClick={() => onChange("basic")}
        title="기본 정보"
        desc="이름, 설명, 주소"
      />
      <NavItem
        active={active === "room"}
        onClick={() => onChange("room")}
        title=" 정보"
        desc="침실, 침대, 욕실"
      />
      <NavItem
        active={active === "price"}
        onClick={() => onChange("price")}
        title="요금"
        desc="1박 요금, 추가 요금"
      />
      <NavItem
        active={active === "tags"}
        onClick={() => onChange("tags")}
        title="태그"
        desc="태그 정보 수정"
      />
      <NavItem
        active={active === "amenities"}
        onClick={() => onChange("amenities")}
        title="편의시설"
        desc="편의시설 정보 수정"
      />
    </div>
  );
}

function NavItem({ active, onClick, title, desc }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left p-4 rounded-2xl border bg-white transition shadow-sm hover:shadow-md",
        active
          ? "border-neutral-900 ring-1 ring-neutral-900/10"
          : "border-neutral-200 hover:border-neutral-300",
      ].join(" ")}
    >
      <p className="font-semibold">{title}</p>
      <p className="text-xs text-neutral-500 mt-1">{desc}</p>
    </button>
  );
}

/* ================= 메인 콘텐츠 ================= */
export function ListingEditorContent({
  active,
  accommodation,
  accommodationId,
  token,
}) {
  const navigate = useNavigate();

  const [basic, setBasic] = useState({
    name: "",
    description: "",
    address: "",
  });
  const [roomState, setRoomState] = useState({
    maxCapacity: 0,
    bedroom: 0,
    bed: 0,
    bathroom: 0,
  });
  const [price, setPrice] = useState({ price: 0, extraRate: 0 });

  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [newImages, setNewImages] = useState([]);
  const [images, setImages] = useState([]);
  const [deleteImageId, setDeleteImageId] = useState([]);
  const fileInputRef = useRef(null);

  /** 파일 선택 */
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const next = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    // 최신 업로드가 위로
    setNewImages((prev) => [...next, ...prev]);
  };

  /** 새 사진 삭제 */
  const removeNewImage = (idx) => {
    setNewImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  /** 기존 사진 삭제 */
  function removeImage(idx) {
    setDeleteImageId((old) => [...old, images[idx].id]);
    setImages((old) => old.filter((_, i) => i !== idx));
  }

  const tags = [
    "조용한 주변 환경",
    "독특함",
    "가족이 지내기에 적합",
    "세련됨",
    "도심부에 위치",
    "넓은 공간",
    "깨끗한 숙소",
    "신속한 응답",
    "편리한 대중교통",
    "가성비 좋은 숙소",
    "역 근처",
    "편안한 침대",
    "바다 근처",
    "관광지 근처",
    "공항 근처",
    "오션뷰",
    "아늑한 분위기",
    "사진과 동일함",
    "TV/프로젝터 있음",
    "맛있는 조식",
  ];

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

  const toggleTags = (label) => {
    setSelectedTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const toggleAmenity = (id) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (!accommodation) return;

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
    setSelectedTags(
      Array.isArray(accommodation.tags)
        ? accommodation.tags.map((t) => t.tag)
        : []
    );
    setSelectedAmenities(
      Array.isArray(accommodation.amenities)
        ? accommodation.amenities.map((a) => a.amenity)
        : []
    );
    setImages(Array.isArray(accommodation.images) ? accommodation.images : []);
  }, [accommodation]);

  async function editSubmitHandle() {
    const data = {
      ...basic,
      ...roomState,
      ...price,
      tags: selectedTags,
      amenities: selectedAmenities,
      deleteImageId,
    };

    const files = newImages.map((x) => x.file);

    const obj = await updateAccommodation(data, accommodationId, token);
    if (!obj.success) {
      alert("숙소 정보 수정 오류!");
      navigate("/hosting/listings");
      return;
    }

    if (files.length > 0) {
      const resp = await createImages(accommodationId, files, token);
      if (!resp.success) {
        alert("이미지 수정 오류!");
        navigate("/hosting/listings");
        return;
      }
    }

    alert("정상 처리되었습니다!");
    navigate(`/hosting/listing/${accommodationId}/edit`);
  }

  function deleteSubmitHandle() {
    if (!window.confirm("정말 숙소 정보를 삭제하시겠습니까?")) return;

    deleteAccommodation(accommodationId, token).then((obj) => {
      if (obj.success) window.alert("정상 처리되었습니다");
      else window.alert("숙소 삭제 오류!");
      navigate("/hosting/listings");
    });
  }

  // HostingEdit에서 dispatch 이벤트 쓰고 있으니 그대로 연결
  useEffect(() => {
    const onEdit = () => editSubmitHandle();
    const onDelete = () => deleteSubmitHandle();
    window.addEventListener("submit-edit", onEdit);
    window.addEventListener("submit-delete", onDelete);
    return () => {
      window.removeEventListener("submit-edit", onEdit);
      window.removeEventListener("submit-delete", onDelete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    basic,
    roomState,
    price,
    selectedTags,
    selectedAmenities,
    newImages,
    images,
    deleteImageId,
  ]);

  const existingCount = images.length;
  const newCount = newImages.length;

  const allPreviewCards = useMemo(() => {
    const newOnes = newImages.map((img, idx) => ({
      key: `new-${idx}`,
      src: img.preview,
      kind: "new",
      idx,
    }));
    const existOnes = images.map((img, idx) => ({
      key: `old-${img.id ?? idx}`,
      src: `http://192.168.0.17:8080${img.uri}`,
      kind: "old",
      idx,
    }));
    return [...newOnes, ...existOnes];
  }, [newImages, images]);

  return (
    <div className="max-w-[980px] mx-auto">
      {/* 배경 고정 */}
      <div className="h-full">
        {/* 내용만 스크롤 */}
        <div className="max-h-screen p-10">
          {active === "basic" && (
            <SectionWrapper title="기본 정보">
              <Input
                label="숙소 이름"
                value={basic.name}
                maxLength={50}
                onChange={(e) => setBasic({ ...basic, name: e.target.value })}
              />

              <Textarea
                label="숙소 설명"
                value={basic.description}
                maxLength={500}
                onChange={(e) =>
                  setBasic({ ...basic, description: e.target.value })
                }
              />

              <Input
                label="주소"
                value={basic.address}
                onChange={(e) =>
                  setBasic({ ...basic, address: e.target.value })
                }
              />
            </SectionWrapper>
          )}

          {active === "room" && (
            <SectionWrapper title="객실 정보">
              <Counter
                label="최대 인원"
                value={roomState.maxCapacity}
                min={0}
                onChange={(v) => setRoomState({ ...roomState, maxCapacity: v })}
              />
              <Counter
                label="침실 수"
                value={roomState.bedroom}
                min={0}
                onChange={(v) => setRoomState({ ...roomState, bedroom: v })}
              />
              <Counter
                label="침대 수"
                value={roomState.bed}
                min={0}
                onChange={(v) => setRoomState({ ...roomState, bed: v })}
              />
              <Counter
                label="욕실 수"
                value={roomState.bathroom}
                min={0}
                onChange={(v) => setRoomState({ ...roomState, bathroom: v })}
              />
            </SectionWrapper>
          )}

          {active === "price" && (
            <SectionWrapper title="요금">
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
                onChange={(e) =>
                  setPrice({ ...price, extraRate: e.target.value })
                }
              />
            </SectionWrapper>
          )}

          {active === "tags" && (
            <SectionWrapper title="태그">
              <div className="flex justify-center w-full flex-wrap gap-3 my-4">
                {tags.map((tag) => {
                  const isOn = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTags(tag)}
                      className={[
                        "px-4 py-2 rounded-full text-sm border transition",
                        isOn
                          ? "ring-2 ring-neutral-900 border-neutral-900 font-semibold"
                          : "border-neutral-200 hover:border-neutral-900",
                      ].join(" ")}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </SectionWrapper>
          )}

          {active === "amenities" && (
            <SectionWrapper title="편의시설">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((item) => {
                  const isOn = selectedAmenities.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleAmenity(item.id)}
                      className={[
                        "h-[110px] flex flex-col items-center justify-center gap-2 rounded-2xl border transition",
                        isOn
                          ? "border-neutral-900 ring-1 ring-neutral-900/10 scale-[1.02]"
                          : "border-neutral-200 hover:border-neutral-900 active:bg-neutral-100",
                      ].join(" ")}
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
            </SectionWrapper>
          )}

          {/* 포토 투어 (스크린샷 느낌) */}
          {active === "images" && (
            <section>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">포토 투어</h2>
                  <p className="text-sm text-neutral-500 mt-2">
                    게스트가 수정된 포토 투어를 볼 수 있습니다.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center"
                    aria-label="사진 추가"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFiles}
                />

                {/* 카드 그리드 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {allPreviewCards.map((card) => (
                    <PhotoCard
                      key={card.key}
                      src={card.src}
                      label="사진"
                      onDelete={() => {
                        if (card.kind === "new") removeNewImage(card.idx);
                        else removeImage(card.idx);
                      }}
                    />
                  ))}

                  {/* “추가 사진” 카드 느낌 */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-3xl border border-neutral-200 bg-white hover:bg-neutral-50 transition overflow-hidden"
                  >
                    {/* 사진 카드랑 동일한 비율 */}
                    <div className="relative aspect-4/3 flex flex-col items-center justify-center gap-3 bg-neutral-50">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center">
                        <Plus className="w-6 h-6" />
                      </div>

                      <div className="text-center">
                        <p className="font-semibold">추가 사진</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          현재 {existingCount + newCount}장
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= 공통 컴포넌트 ================= */
export function SectionWrapper({ title, children }) {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-6">{title}</h3>
      <div className="p-8 space-y-10">{children}</div>
    </section>
  );
}

export function Input({ label, value = "", maxLength, ...props }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        {maxLength && (
          <span className="text-xs text-neutral-500">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <input
        {...props}
        value={value}
        maxLength={maxLength}
        className="w-full border border-neutral-200 rounded-xl px-4 py-3 mt-2
                   focus:outline-none focus:ring-2 focus:ring-neutral-300"
      />
    </div>
  );
}

export function Textarea({ label, value = "", maxLength, ...props }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        {maxLength && (
          <span className="text-xs text-neutral-500">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        {...props}
        value={value}
        maxLength={maxLength}
        rows={5}
        className="w-full h-60 border border-neutral-200 rounded-xl px-4 py-3 mt-2
                   resize-none focus:outline-none focus:ring-2 focus:ring-neutral-300"
      />
    </div>
  );
}

export function Counter({ label, value = 1, min = 1, max, onChange }) {
  const decrease = () => onChange?.(Math.max(min, value - 1));
  const increase = () => onChange?.(max ? Math.min(max, value + 1) : value + 1);

  return (
    <div className="flex justify-between items-center">
      <span className="font-medium">{label}</span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrease}
          disabled={value <= min}
          className="w-9 h-9 border border-neutral-200 rounded-full disabled:opacity-40"
        >
          -
        </button>

        <span className="min-w-[24px] text-center">{value}</span>

        <button
          type="button"
          onClick={increase}
          disabled={max !== undefined && value >= max}
          className="w-9 h-9 border border-neutral-200 rounded-full disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

/* ================= 포토 카드 ================= */
/*  삭제 버튼: 바로 보이게 + 우하단 고정(점메뉴/토글 없음) */
function PhotoCard({ src, onDelete }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
      <div className="relative aspect-[4/3]">
        <img src={src} alt="" className="w-full h-full object-cover" />

        <button
          type="button"
          onClick={onDelete}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/70 border border-neutral-200 shadow flex items-center justify-center hover:bg-white"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
