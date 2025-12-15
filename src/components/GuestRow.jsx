export default function GuestRow({
  title,
  desc,
  value,
  min,
  onChange,
  disabled,
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-none">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
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
          disabled={disabled}
          onClick={() => onChange(value + 1)}
          className={`w-8 h-8 rounded-full border text-lg
            ${
              disabled ? "opacity-30 cursor-not-allowed" : "hover:border-black"
            }`}
        >
          +
        </button>
      </div>
    </div>
  );
}
