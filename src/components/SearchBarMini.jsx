import stays from "../assets/nav-stays.png";
export default function SearchBarMini({ onClick }) {
  return (
    <div
      className="flex items-center bg-white shadow-sm rounded-full
                 border border-neutral-200 overflow-hidden cursor-pointer
                 h-12 hover:shadow-md"
      onClick={onClick}
    >
      <div className="px-4 py-2 text-xs font-bold flex items-center gap-2">
        <img src={stays} alt="" className="h-10" />
        어디든지
      </div>

      <div className="w-px h-6 bg-gray-200"></div>

      <div className="px-4 py-2 text-xs font-bold">언제든 일주일</div>

      <div className="w-px h-6 bg-gray-200"></div>

      <div className="flex items-center px-4 py-2  ">
        <p className="hover:font-bold text-xs font-bold">게스트 추가</p>

        {/* 🔍 메인 헤더와 동일 */}
        <button className="bg-rose-500 text-white p-2 rounded-full ml-2 hover:bg-rose-700 transition cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0
                 A7.5 7.5 0 1 0 5.196 5.196
                 a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
