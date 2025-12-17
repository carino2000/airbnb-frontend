import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/arbnb_logo-b.png";
import camera from "../assets/free-icon-camera-5904494.png";
import { useImage } from "../stores/account-store";

export default function HostingImages() {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [step, setStep] = useState("select"); // select | review
  const fileInputRef = useRef(null);

  const setImage = useImage((s) => s.setImage);

  const hasImages = images.length > 0;

  function imageSubmit() {
    setImage(() => images.map((item) => item.file));
    navigate("/hosting/title");
  }

  /** 파일 선택 */
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    // 최신순 (방금 업로드한 게 위)
    setImages((prev) => [...newImages, ...prev]);
  };

  /** 사진 삭제 */
  const removeImage = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  return (
    <>
      {/* ================= 헤더 ================= */}
      <header className="fixed top-0 left-0 w-full h-40 md:h-[90px] bg-white z-40">
        <div className="h-full flex items-center px-6 md:px-10">
          <div className="flex items-center justify-between w-full">
            <img
              src={logo}
              alt="logo"
              className="w-9 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <button className="px-6 py-2 border rounded-full text-xs font-bold">
              나가기
            </button>
          </div>
        </div>
      </header>

      {/* ================= 메인 ================= */}
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
          {/* STEP 1 : 사진 선택 */}

          {step === "select" && (
            <>
              <h1
                className="text-2xl lg:text-[35px]
    font-bold
    leading-tight
    min-h-14
    mb-3"
              >
                숙소 사진 추가하기
              </h1>

              <p className="text-neutral-600 mb-10">
                숙소 등록을 시작하려면 사진 5장을 제출하셔야 합니다.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setOpenModal(true)}
                  className="w-full h-[420px] border-2 border-dashed rounded-2xl
                           flex flex-col items-center justify-center gap-4
                           hover:border-black transition"
                >
                  <img src={camera} className="w-16 h-16 opacity-80" />
                  <div className="px-4 py-2 border rounded-lg text-sm font-medium">
                    사진 추가하기
                  </div>
                </button>
              </div>
            </>
          )}

          {/* STEP 2 : 선택된 사진 확인 */}
          {step === "review" && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold mb-6">
                  사진이 잘 나왔는지 확인해 주세요
                </h2>

                {/* 🔥 사진 더 추가하기 버튼 (위로 이동) */}
                <button
                  onClick={() => setOpenModal(true)}
                  className="mb-4 flex items-center gap-2 text-sm font-medium"
                >
                  <span className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1"
                      stroke="currentColor"
                      className="w-6 h-6 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </span>
                  사진 더 추가하기
                </button>
              </div>

              {/* 사진 그리드 */}
              <div className="grid grid-cols-2 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden"
                  >
                    <img
                      src={img.preview}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-black/70
                       text-white rounded-full w-7 h-7 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* ================= 모달 ================= */}

      {openModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setOpenModal(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white w-[90%] max-w-[620px] rounded-2xl p-6">
              <div className="flex justify-between mb-4">
                <h2 className="font-bold">사진 업로드 ({images.length})</h2>
                <button onClick={() => setOpenModal(false)}>✕</button>
              </div>

              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full border border-dashed rounded-xl py-6 mb-6"
              >
                사진 찾아보기
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleFiles}
              />

              <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square">
                    <img
                      src={img.preview}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-black/70
                                 text-white rounded-full w-7 h-7 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setOpenModal(false)}>취소</button>
                <button
                  disabled={!hasImages}
                  onClick={() => {
                    setOpenModal(false);
                    setStep("review");
                  }}
                  className={`px-6 py-2 rounded-lg text-sm ${
                    hasImages
                      ? "bg-black text-white"
                      : "bg-neutral-300 text-white"
                  }`}
                >
                  업로드
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= 푸터 ================= */}
      <footer className="fixed bottom-0 left-0 w-full h-[95px] bg-white z-40">
        <div className="grid grid-cols-3 h-1.5">
          <div className="bg-neutral-950" />
          <div className="bg-neutral-950" />
          <div className="bg-neutral-300" />
        </div>

        <div className="px-6 md:px-11 flex justify-between items-center h-[calc(100%-6px)]">
          <button
            className="border-b-2 text-sm cursor-pointer"
            onClick={() => navigate("/hosting/amenities")}
          >
            뒤로
          </button>

          <button
            disabled={!hasImages}
            className={`px-8 py-3 rounded-xl font-bold text-sm cursor-pointer ${
              hasImages
                ? "bg-neutral-950 text-white"
                : "bg-neutral-300 text-white"
            }`}
            onClick={imageSubmit}
          >
            다음
          </button>
        </div>
      </footer>
    </>
  );
}
