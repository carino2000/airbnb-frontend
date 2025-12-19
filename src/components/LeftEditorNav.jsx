import {
  createImages,
  deleteAccommodation,
  updateAccommodation,
} from "@/util/DatabaseUtil";
import { useEffect, useRef, useState } from "react";
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
import { useNavigate } from "react-router";

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

      <button
        onClick={() => onChange("tags")}
        className={`${itemBase} ${active === "tag" ? activeCls : normalCls}`}
      >
        <p className="font-semibold">태그</p>
        <p className="text-xs text-neutral-500">태그 정보 수정</p>
      </button>

      <button
        onClick={() => onChange("amenities")}
        className={`${itemBase} ${
          active === "amenities" ? activeCls : normalCls
        }`}
      >
        <p className="font-semibold">편의시설</p>
        <p className="text-xs text-neutral-500">편의시설 정보 수정</p>
      </button>

      <button
        onClick={() => onChange("images")}
        className={`${itemBase} ${active === "images" ? activeCls : normalCls}`}
      >
        <p className="font-semibold">숙소 이미지</p>
        <p className="text-xs text-neutral-500">숙소 이미지 수정</p>
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
  const [price, setPrice] = useState({
    price: 0,
    extraRate: 0,
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [newImages, setNewImages] = useState([]);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const [deleteImageId, setDeleteImageId] = useState([]);

  /** 파일 선택 */
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    // 최신순 (방금 업로드한 게 위)
    setNewImages((prev) => [...newImages, ...prev]);
  };

  /** 사진 삭제 */
  const removeNewImage = (idx) => {
    setNewImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  function removeImage(idx) {
    setDeleteImageId((old) => [...old, images[idx].id]);
    setImages((old) => {
      return old.filter((_, i) => i !== idx);
    });
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
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const toggleAmenity = (id) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
      setImages(
        Array.isArray(accommodation.images) ? accommodation.images : []
      );
    }
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
    console.log(data);

    const files = newImages.map((item) => item.file);

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
    if (window.confirm("정말 숙소 정보를 삭제하시겠습니까?")) {
      deleteAccommodation(accommodationId, token).then((obj) => {
        if (obj.success) {
          window.alert("정상 처리되었습니다");
        } else {
          window.alert("숙소 삭제 오류!");
        }
        navigate("/hosting/listings");
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
            value={roomState.bedroom}
            onChange={(v) => setRoomState({ ...roomState, bedroom: v })}
          />

          <Counter
            label="침대 수"
            value={roomState.bed}
            onChange={(v) => setRoomState({ ...roomState, bed: v })}
          />

          <Counter
            label="욕실 수"
            value={roomState.bathroom}
            onChange={(v) => setRoomState({ ...roomState, bathroom: v })}
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

      {active === "tags" && (
        <SectionWrapper
          title="태그"
          onSave={() => console.log("태그 정보 수정", price)}
        >
          <div className="flex justify-center w-full max-w-[700px] flex-wrap gap-3 my-10">
            {tags.map((tag) => {
              const active = selectedTags.includes(tag);

              return (
                <button
                  key={tag}
                  onClick={() => toggleTags(tag)}
                  className={`
                    px-4 py-2 rounded-full text-sm border
                    transition
                    ${
                      active
                        ? "ring-2 ring-black  font-semibold"
                        : "hover:border-black"
                    }
                  `}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </SectionWrapper>
      )}

      {active === "amenities" && (
        <SectionWrapper
          title="편의시설"
          onSave={() => console.log("편의시설 정보 수정", price)}
        >
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
        </SectionWrapper>
      )}

      {active === "images" && (
        <SectionWrapper
          title="숙소 사진"
          onSave={() => console.log("숙소 이미지 수정", price)}
        >
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">사진 수정 ({images.length})</h2>
            </div>

            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full border border-dashed rounded-xl py-6 mb-6"
            >
              사진 찾아보기
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFiles}
            />
            <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
              {newImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square">
                  <img
                    src={img.preview}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-2 right-2 bg-black/70
                                 text-white rounded-full w-7 h-7 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="my-6 h-px bg-neutral-300" />

            <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square">
                  <img
                    src={`http://192.168.0.17:8080${img.uri}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-black/70
                                 text-white rounded-full w-7 h-7 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
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
