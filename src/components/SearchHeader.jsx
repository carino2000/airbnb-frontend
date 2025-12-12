// 메인 헤더
export default function SearchHeader() {
  <div className="w-full flex justify-center mb-6">
    <div className="flex items-center w-[600px] lg:w-[800px] bg-white shadow-md rounded-full overflow-hidden border border-neutral-200">
      {/* 여행지 */}
      <div className="flex-auto min-w-[150px] px-6 py-4 hover:bg-neutral-200 rounded-full cursor-pointer">
        <p className="text-xs">여행지</p>
        <input
          type="text"
          placeholder="여행지 검색"
          className="w-full text-sm text-gray-600 bg-transparent focus:outline-none placeholder:text-xs "
        />
      </div>

      <div className="w-px h-8 bg-gray-300"></div>

      {/* 체크인 */}
      <div
        className="flex-auto min-w-[120px] px-6 py-4 hover:bg-neutral-200 rounded-full cursor-pointer"
        onClick={() => checkinRef.current.showPicker()}
      >
        <p className="text-xs">체크인</p>
        <input
          ref={checkinRef}
          type="date"
          onMouseDown={(e) => e.preventDefault()}
          className="w-full text-xs text-gray-600 bg-transparent focus:outline-none cursor-pointer"
        />
      </div>

      <div className="w-px h-8 bg-gray-300"></div>

      {/* 체크아웃 */}
      <div
        className="flex-auto min-w-[120px] px-6 py-4 hover:bg-neutral-200 rounded-full cursor-pointer"
        onClick={() => checkoutRef.current.showPicker()}
      >
        <p className="text-xs">체크아웃</p>
        <input
          ref={checkoutRef}
          type="date"
          onMouseDown={(e) => e.preventDefault()}
          className="w-full text-xs text-gray-600 bg-transparent focus:outline-none cursor-pointer"
        />
      </div>

      <div className="w-px h-8 bg-gray-300"></div>

      {/* 여행자 + 돋보기 */}
      <div className="flex min-w-[150px] items-center px-2 py-1 hover:bg-neutral-200 rounded-full transition-all">
        <div className="flex-1 px-4 py-3">
          <p className="text-xs">여행자</p>
          <input
            type="number"
            min="1"
            placeholder="게스트 추가"
            className="w-[100px] text-sm text-gray-600 bg-transparent focus:outline-none placeholder:text-xs"
          />
        </div>

        {/* 검색 돋보기 */}
        <button className="bg-rose-500 text-white p-3 rounded-full hover:bg-rose-700 transition cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>;
}
