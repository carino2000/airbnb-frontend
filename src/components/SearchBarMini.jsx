export default function SearchBarMini({ onClick }) {
  return (
    <div
      className="flex items-center bg-white shadow-md rounded-full border border-neutral-200 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="px-6 py-3 text-xs font-medium text-gray-700">
        어디든지
      </div>
      <div className="w-px h-6 bg-gray-300"></div>
      <div className="px-6 py-3 text-xs text-gray-600">언제든 일주일</div>
      <div className="w-px h-6 bg-gray-300"></div>
      <div className="flex items-center px-6 py-3 text-xs text-gray-600">
        게스트 추가
        <button className="bg-rose-500 text-white p-2 rounded-full ml-3">
          🔍
        </button>
      </div>
    </div>
  );
}
