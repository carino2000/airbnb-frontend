import { useState, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useToken, useAccount } from "../stores/account-store";
import {
  getLikedAccommodationList,
  likeAccommodation,
  unlikeAccommodation,
} from "../util/DatabaseUtil";

function PopularSlider({ title, data, onCardClick, alreadyLiked = [] }) {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState(new Set());

  const { token } = useToken();
  const { account } = useAccount();

  const VISIBLE = 5;
  const CARD_PERCENT = 100 / VISIBLE;

  /* ===============================
   * ⭐ 서버 좋아요 목록으로 초기화
   * =============================== */
  useEffect(() => {
    if (!Array.isArray(alreadyLiked)) return;
    setLiked(new Set(alreadyLiked));
  }, [alreadyLiked.length]); // ✅ length만 의존

  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  const next = () => setIndex((i) => Math.min(i + 1, data.length - VISIBLE));

  /* ===============================
   * ❤️ 좋아요 토글
   * =============================== */
  const toggleLike = async (accommodationId) => {
    if (!token || !account) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    const accountId = account.id;
    let res;

    if (liked.has(accommodationId)) {
      res = await unlikeAccommodation(accommodationId, accountId, token);
    } else {
      res = await likeAccommodation(accommodationId, accountId, token);
    }

    console.log("like/unlike res:", res); // 🔍 꼭 확인
    if (!res?.success) {
      alert(res?.message || "처리 실패");
      return;
    }

    setLiked((prev) => {
      const next = new Set(prev);
      next.has(accommodationId)
        ? next.delete(accommodationId)
        : next.add(accommodationId);
      return next;
    });
  };

  const formatPrice = (price) =>
    price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <section className="mb-16">
      {/* 타이틀 + 버튼 */}
      <div className="flex justify-between items-center px-3">
        <h3 className="font-semibold text-lg sm:text-xl">{title}</h3>

        <div className="flex gap-2">
          <button
            onClick={prev}
            disabled={index === 0}
            className="w-8 h-8 flex items-center justify-center
              rounded-full border bg-white shadow
              disabled:opacity-30 hover:shadow-md hover:bg-neutral-100"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={next}
            disabled={index >= data.length - VISIBLE}
            className="w-8 h-8 flex items-center justify-center
              rounded-full border bg-white shadow
              disabled:opacity-30 hover:shadow-md hover:bg-neutral-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 슬라이드 */}
      <div className="overflow-hidden mt-3">
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${index * CARD_PERCENT}%)` }}
        >
          {data.map((one) => {
            const isLiked = liked.has(one.id);

            return (
              <div
                key={one.id}
                className="shrink-0 px-2 cursor-pointer"
                style={{ width: `${CARD_PERCENT}%` }}
                onClick={() => onCardClick(one.id)}
              >
                {/* 이미지 + 하트 */}
                <div className="relative aspect-square">
                  {one.images?.length > 0 && (
                    <img
                      src={`http://192.168.0.17:8080${one.images[0].uri}`}
                      className="w-full h-full object-cover rounded-xl"
                      alt=""
                    />
                  )}

                  <button
                    className="absolute top-4 right-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(one.id);
                    }}
                  >
                    <Heart
                      size={32}
                      className={
                        isLiked
                          ? "fill-rose-500 text-rose-500"
                          : "text-white fill-black/30"
                      }
                    />
                  </button>
                </div>

                {/* 텍스트 */}
                <div className="mt-3">
                  <div className="font-medium truncate">
                    {one.address?.split(" ")[0]}의 집
                  </div>

                  <div className="text-sm text-neutral-600">
                    ₩{formatPrice(one.price)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { PopularSlider };
