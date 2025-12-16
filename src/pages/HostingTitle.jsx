import { useNavigate } from "react-router";
import { useState } from "react";
import logo from "../assets/arbnb_logo-b.png";
import { useAccommodation } from "../stores/account-store";

export default function HostingTitle() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const isFormValid = title.trim().length > 0 && title.length <= 50;
  const setAccommodation = useAccommodation((s) => s.setAccommodation);

  function titleSubmit() {
    setAccommodation((old) => ({
      ...old,
      name: title,
    }));
    navigate("/hosting/tags");
  }

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full h-[90px] bg-white z-40">
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

      {/* MAIN */}
      <main
        className="
          fixed
          top-[90px]
          left-0
          w-full
          h-[calc(100vh-185px)]
          flex
          justify-center
          px-6
          overflow-y-auto
        "
      >
        <div className="w-full max-w-[700px] py-12">
          {/* 타이틀 */}
          <div className="mb-14">
            <h1 className="text-2xl lg:text-[35px] font-bold leading-tight mb-4">
              이제 숙소 이름을 지어주세요
            </h1>

            <p className="text-neutral-700 leading-relaxed">
              숙소 이름은 짧을수록 효과적입니다. 나중에 언제든지 변경할 수
              있으니,
              <br />
              너무 걱정하지 마세요.
            </p>
          </div>

          {/* 입력 */}
          <div className="relative">
            <textarea
              maxLength={50}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
                w-full h-[150px]
                border border-neutral-300 rounded-xl
                p-4 text-base outline-none resize-none
                focus:border-black
              "
            />

            <span className="absolute bottom-3 right-4 text-sm text-neutral-500">
              {title.length}/50
            </span>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full h-[95px] bg-white z-40">
        <div className="grid grid-cols-3 h-1.5 w-full">
          <div className="bg-neutral-950" />
          <div className="bg-neutral-950" />
          <div className="bg-neutral-300" />
        </div>

        <div className="md:px-11 flex items-center justify-between h-[calc(100%-6px)]">
          <button
            className="border-b-2 cursor-pointer text-sm"
            onClick={() => navigate("/hosting/images")}
          >
            뒤로
          </button>

          <button
            disabled={!isFormValid}
            className={`
              px-8 py-3 rounded-xl text-sm font-bold
              ${
                isFormValid
                  ? "bg-neutral-950 text-white hover:bg-neutral-800"
                  : "bg-neutral-300 text-white cursor-not-allowed"
              }
            `}
            onClick={titleSubmit}
          >
            다음
          </button>
        </div>
      </footer>
    </>
  );
}
