export default function LoginModal({ onClose }) {
  return (
    <>
      {/* 배경 */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={onClose} />

      {/* 모달 */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="bg-white w-[380px] p-8 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold mb-6">로그인</h2>

          <input
            type="text"
            placeholder="아이디"
            className="border w-full p-3 rounded-md mb-3 text-sm"
          />

          <input
            type="password"
            placeholder="비밀번호"
            className="border w-full p-3 rounded-md mb-4 text-sm"
          />

          <button className="w-full bg-rose-600 text-white p-3 rounded-md text-sm hover:bg-rose-700">
            로그인
          </button>

          <button
            onClick={onClose}
            className="w-full mt-4 text-gray-600 text-sm hover:underline"
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
}
a;
