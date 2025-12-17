export default function GuestRow({
  title,
  desc,
  value,
  min,
  onChange,
  disabled,
  disableIncrease,
  maxCapacity,
}) {
  return (
    <div className="py-2 border-b last:border-none">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm mb-1">{title}</p>
          <p className="text-xs text-neutral-400">{desc}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={value <= min || disabled}
            onClick={() => onChange(value - 1)}
            className={`w-8 h-8 rounded-full border text-lg
              ${
                value <= min || disabled
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:border-black"
              }`}
          >
            −
          </button>

          <span className="w-4 text-center">{value}</span>

          <button
            disabled={disabled || disableIncrease}
            onClick={() => onChange(value + 1)}
            className={`w-8 h-8 rounded-full border text-lg
              ${
                disabled || disableIncrease
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:border-black"
              }`}
          >
            +
          </button>
        </div>
      </div>

      {/* ✅ 안내 문구 */}
      {disableIncrease && (
        <p className="text-xs text-red-500 mt-2">
          이 숙소의 최대 숙박 인원은 {maxCapacity}명입니다.
        </p>
      )}
    </div>
  );
}
