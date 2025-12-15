export default function CounterRow({ label, value, onMinus, onPlus }) {
  return (
    <div className="flex items-center justify-between py-6 border-b last:border-b-0">
      <span className="text-base">{label}</span>

      <div className="flex items-center gap-4">
        <button
          onClick={onMinus}
          disabled={value === 0}
          className={`w-8 h-8 rounded-full border flex items-center justify-center
                     ${
                       value === 0
                         ? "opacity-30 cursor-not-allowed"
                         : "hover:border-black cursor-pointer active:bg-neutral-300 active:scale-105"
                     }
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            class="size-5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
          </svg>
        </button>

        <span className="w-4 text-center">{value}</span>

        <button
          onClick={onPlus}
          className="
    w-8 h-8 rounded-full border flex items-center justify-center
    cursor-pointer transition
    hover:border-black
    active:bg-neutral-300 active:scale-105
  "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            class="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
