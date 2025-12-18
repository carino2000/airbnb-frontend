import { Calendar } from "@/components/ui/calendar";
import { ko } from "date-fns/locale";
import { format } from "date-fns";

export default function DateRangeCalendar({
  open,
  onClose,
  dateRange,
  setDateRange,
  blockedDays = [],
  onApply,
  onReset,
}) {
  if (!open) return null;

  return (
    <>
      {/* 배경 클릭 닫기 */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* 달력 본체 */}
      <div className="absolute top-full mt-2 z-50">
        <div
          className="rounded-xl border bg-white shadow-xl p-3"
          onClick={(e) => e.stopPropagation()}
        >
          <Calendar
            locale={ko}
            mode="range"
            numberOfMonths={2}
            selected={dateRange}
            onSelect={setDateRange}
            disabled={blockedDays.map((d) => new Date(d))}
            className="rounded-lg"
          />

          {/* 버튼 영역 */}
          <div className="mt-3 flex justify-end border-t pt-3 gap-5">
            <button
              onClick={onReset}
              className="text-sm text-gray-500 hover:text-black"
            >
              초기화
            </button>

            <button
              onClick={() => {
                if (!dateRange?.from || !dateRange?.to) return;
                onApply({
                  checkin: format(dateRange.from, "yyyy-MM-dd"),
                  checkout: format(dateRange.to, "yyyy-MM-dd"),
                });
                onClose();
              }}
              className={`text-sm font-medium ${
                dateRange?.from && dateRange?.to
                  ? "text-black hover:underline"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
