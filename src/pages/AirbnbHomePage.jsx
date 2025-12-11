import logo from "../assets/Airbnb_Logo.png";
import stays from "../assets/nav-stays.png";
import experiences from "../assets/nav-experiences.png";
import services from "../assets/nav-services.png";

export default function AirbnbHomePage() {
  return (
    <>
      {/* 상단 헤더 고정 */}

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
