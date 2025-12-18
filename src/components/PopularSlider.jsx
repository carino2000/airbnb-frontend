import { useState } from "react";
import { Heart } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PopularSlider({ title, data, onCardClick }) {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState(new Set());

  const VISIBLE = 4;
  const CARD_PERCENT = 100 / VISIBLE;

  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  const next = () => setIndex((i) => Math.min(i + 1, data.length - VISIBLE));

  const toggleLike = (id) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const formatPrice = (price) =>
    price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <section className="mb-16">
      {/* 타이틀 + 버튼 */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg sm:text-xl">{title}</h3>

        <div className="flex gap-2">
          <button
            onClick={prev}
            disabled={index === 0}
            className="w-8 h-8 flex items-center justify-center
             rounded-full border bg-white shadow
             disabled:opacity-30 hover:shadow-md
             hover:bg-neutral-100"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={next}
            disabled={index >= data.length - VISIBLE}
            className="w-8 h-8 flex items-center justify-center
             rounded-full border bg-white shadow
             disabled:opacity-30 hover:shadow-md
                 hover:bg-neutral-100"
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
          {data.map((one) => (
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
                  className="absolute top-5 right-5 "
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(one.id);
                  }}
                >
                  <Heart
                    size={33}
                    className={
                      liked.has(one.id)
                        ? "fill-rose-500 text-rose-500"
                        : "text-white fill-black/20"
                    }
                  />
                </button>
              </div>

              {/* 텍스트 */}
              <div className="mt-3 space-y-1">
                <div className="font-medium truncate">
                  {one.address?.split(" ")[0]}의 집
                </div>
                <div className="text-xs text-neutral-500">
                  1월 1일 ~ 12월 31일
                </div>
                <div className="text-xs text-neutral-500">
                  ₩{formatPrice(one.price)} · 평점 5.0
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { PopularSlider };
