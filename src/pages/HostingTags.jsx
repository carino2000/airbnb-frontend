import { useNavigate } from "react-router";
import { useState } from "react";
import logo from "../assets/arbnb_logo-b.png";
import { useTags } from "../stores/account-store";

export default function HostingTags() {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);

  const setTags = useTags((s) => s.setTags);

  const toggleTags = (label) => {
    setSelectedTags((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const tags = [
    "조용한 주변 환경",
    "독특함",
    "가족이 지내기에 적합",
    "세련됨",
    "도심부에 위치",
    "넓은 공간",
    "깨끗한 숙소",
    "신속한 응답",
    "편리한 대중교통",
    "가성비 좋은 숙소",
    "역 근처",
    "편안한 침대",
    "바다 근처",
    "관광지 근처",
    "공항 근처",
    "오션뷰",
    "아늑한 분위기",
    "사진과 동일함",
    "TV/프로젝터 있음",
    "맛있는 조식",
  ];

  function tagSubmit() {
    setTags(() => [...selectedTags]);
    navigate("/hosting/description");
  }

  return (
    <>
      {/* 헤더 */}
      <header className="fixed top-0 left-0 w-full h-40 md:h-[90px] bg-white z-40">
        <div className="h-full flex items-center px-6 md:px-10">
          <div className="flex items-center justify-between w-full">
            <img
              src={logo}
              alt="logo"
              className="w-9 cursor-pointer"
              onClick={() => navigate("/")}
            />

            <button
              className="px-6 py-2 border border-neutral-400 rounded-full text-xs font-bold"
              onClick={() => navigate("/")}
            >
              나가기
            </button>
          </div>
        </div>
      </header>

      <main
        className="
          min-h-[calc(100vh-185px)]
          px-6
          pt-[110px]
          pb-[120px]
          flex
          flex-col
          items-center
        "
      >
        <div className="w-full max-w-[700px]">
          <h1 className="text-2xl lg:text-[35px] font-bold mb-3">
            주택에 대해 설명해주세요
          </h1>

          <p className="text-neutral-600 mb-10">
            숙소의 특징이 잘 드러나는 문구를 최대 2개까지 선택하실 수 있습니다.
            <br />
            선택한 문구로 숙소 설명을 작성하실 수 있도록 도와드릴게요.
          </p>

          <div className="flex w-full max-w-[700px] flex-wrap gap-3 mt-20">
            {tags.map((tag) => {
              const active = selectedTags.includes(tag);

              return (
                <button
                  key={tag}
                  onClick={() => toggleTags(tag)}
                  className={`
                    px-4 py-2 rounded-full text-sm border
                    transition
                    ${
                      active
                        ? "ring-2 ring-black  font-semibold"
                        : "hover:border-black"
                    }
                  `}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="fixed bottom-0 left-0 w-full h-[95px] bg-white z-40">
        <div className="grid grid-cols-3 h-1.5 w-full">
          <div className="bg-neutral-950" />
          <div className="bg-neutral-950" />
          <div className="bg-neutral-300" />
        </div>

        <div className="md:px-11 flex items-center justify-between h-[calc(100%-6px)]">
          <button
            className="border-b-2 text-sm"
            onClick={() => navigate("/hosting/title")}
          >
            뒤로
          </button>

          <button
            disabled={selectedTags.length === 0}
            className={`
              px-8 py-3 rounded-xl text-sm font-bold
              ${
                selectedTags.length > 0
                  ? "bg-neutral-950 text-white hover:bg-neutral-950/70"
                  : "bg-neutral-300 text-white cursor-not-allowed"
              }
            `}
            onClick={tagSubmit}
          >
            다음
          </button>
        </div>
      </footer>
    </>
  );
}
