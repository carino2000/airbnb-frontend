import logo from "../assets/Airbnb_Logo.png";
import stays from "../assets/nav-stays.png";
import experiences from "../assets/nav-experiences.png";
import services from "../assets/nav-services.png";

export default function AirbnbHomePage() {
  return (
    <>
      {/* 상단 헤더 고정 */}
      <header className="fixed top-0 left-0 w-full h-[200px] bg-neutral-100 border-b-2 z-50 border-b-neutral-200">
        <div className="h-25 flex items-center px-10">
          <div className="flex items-center justify-between w-full">
            {/* 로고 */}
            <div>
              <img
                src={logo}
                alt=""
                className="w-[100px] h-auto cursor-pointer"
              />
            </div>

            {/* 메뉴 */}
            <nav className="flex gap-9 text-sm font-m text-gray-700 cursor-pointer">
              {/* 숙소 */}
              <div className="flex gap-3 items-center group cursor-pointer">
                <img
                  src={stays}
                  alt=""
                  className="w-11 h-auto transition-transform duration-200 group-hover:scale-125"
                />
                <p className="group-hover:font-semibold">숙소</p>
              </div>

              {/* 체험 */}
              <div className="flex gap-3 items-center group cursor-pointer">
                <img
                  src={experiences}
                  alt=""
                  className="w-9 h-auto transition-transform duration-200 group-hover:scale-125"
                />
                <p className="group-hover:font-semibold">체험</p>
              </div>

              {/* 서비스 */}
              <div className="flex gap-3 items-center group cursor-pointer">
                <img
                  src={services}
                  alt=""
                  className="w-9 h-auto transition-transform duration-200 group-hover:scale-125"
                />
                <p className="group-hover:font-semibold">서비스</p>
              </div>
            </nav>

            {/* 우측 메뉴 */}
            <div className="flex gap-3 items-center">
              <div className="rounded-full px-3 py-2 hover:bg-gray-200 cursor-pointer">
                <p className="text-xs font-bold">호스팅 하기</p>
              </div>
              <div className="text-smcursor-pointer rounded-full px-2 py-2 bg-gray-100 hover:bg-gray-200">
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
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 검색창 */}
        <div className="w-full flex justify-center mb-6">
          <div className="flex items-center w-[900px] bg-white shadow-md rounded-full overflow-hidden border border-gray-200">
            {/* 여행지 */}
            <div className="flex-2 px-6 py-4 cursor-pointer hover:bg-neutral-200 hover:rounded-full transition-all">
              <p className="text-xs font-normal">여행지</p>
              <input
                type="text"
                placeholder="여행지 검색"
                className="w-full text-sm text-gray-600 focus:outline-none bg-transparent"
              />
            </div>

            <div className="w-px h-8 bg-gray-300"></div>

            {/* 체크인 */}
            <div className="flex-1 px-6 py-4 cursor-pointer hover:bg-neutral-200 hover:rounded-full transition-all">
              <p className="text-xs font-normal">체크인</p>
              <input
                type="date"
                className="text-sm text-gray-600 focus:outline-none bg-transparent"
              />
            </div>

            <div className="w-px h-8 bg-gray-300"></div>

            {/* 체크아웃 */}
            <div className="flex-1 px-6 py-4 cursor-pointer hover:bg-neutral-200 hover:rounded-full transition-all">
              <p className="text-xs font-normal">체크아웃</p>
              <input
                type="date"
                className="text-sm text-gray-600 focus:outline-none bg-transparent"
              />
            </div>

            <div className="w-px h-8 bg-gray-300"></div>

            {/* 인원수 + 검색 버튼 */}
            <div className="flex items-center px-2 py-1 hover:bg-neutral-200 hover:rounded-full transition-all">
              <div className="flex-1 px-4 py-3 cursor-pointer">
                <p className="text-xs font-normal">여행자</p>
                <input
                  type="number"
                  min="1"
                  placeholder="게스트 추가"
                  className="w-full text-sm text-gray-600 focus:outline-none bg-transparent"
                />
              </div>

              <button className="bg-rose-500 text-white p-3 rounded-full ml-2 mr-3 hover:bg-rose-700 transition cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="size-6"
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
        </div>
      </header>

      {/* 본문 */}
      <main className="mt-[250px] px-10">
        <div>
          {/* 서브타이틑 + 버튼*/}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-xl">부산 인기 숙소</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="3"
                stroke="currentColor"
                class="size-3"
                className="w-4 h-4 ml-2 translate-y-0.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
            {/* 버튼 */}
            <div className="flex gap-3">
              <div className="rounded-full bg-neutral-200 px-2 py-2 text-neutral-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                    className="w-4 h-4"
                  />
                </svg>
              </div>
              <div className="rounded-full bg-neutral-200 px-2 py-2  text-neutral-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    className="w-4 h-4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {/* 썸네일 목록 */}
        <div className="grid grid-cols-7 grid-rows-5 gap-4 mt-7">
          <div>
            <div className="row-span-2 aspect-square rounded-lg border flex items-center justify-center">
              1
            </div>
            <div>
              <div className="border">서울의 집</div>
              <div>
                1월 30일 ~ 2월 1일 ₩205,000 · 2박 , · 평점 5.0점(5점 만점) 5.0
              </div>
            </div>
          </div>
          <div className="row-span-2 aspect-square rounded-lg border flex items-center justify-center">
            2
          </div>
          <div className="row-span-2 aspect-square rounded-lg border flex items-center justify-center">
            3
          </div>
          <div className="row-span-2 aspect-square rounded-lg border flex items-center justify-center">
            4
          </div>
          <div className="row-span-2 aspect-square rounded-lg border flex items-center justify-center">
            5
          </div>
          <div className="row-span-2 aspect-square rounded-lg border flex items-center justify-center">
            6
          </div>
          <div className="row-span-2 aspect-square rounded-lg border flex items-center justify-center">
            7
          </div>
        </div>
      </main>
    </>
  );
}
