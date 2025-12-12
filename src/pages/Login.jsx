import { useNavigate } from "react-router";
export default function Login() {
  const navigate = useNavigate();
  return (
    <>
      <div>
        <div className="fixed inset-0 flex items-center justify-center z-9999">
          <div className="bg-white w-96 p-8">
            <h2 className="text-base font-semibold mb-6 text-left">로그인</h2>

            <input
              type="text"
              placeholder="아이디"
              className="border border-gray-400 w-full p-2.5 rounded-md mb-3 placeholder:text-xs text-sm"
            />

            <input
              type="password"
              placeholder="비밀번호"
              className="border border-gray-400 w-full p-2.5 rounded-md mb-4 placeholder:text-xs text-sm"
            />

            <button className="w-full bg-rose-600 text-white p-3 rounded-md text-sm hover:bg-rose-700 transition cursor-pointer">
              로그인
            </button>

            <button
              onClick={() => navigate("/sign-up")}
              className="w-full mt-3 text-gray-600 text-sm hover:underline cursor-pointer"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
