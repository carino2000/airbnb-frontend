import { useState } from "react";
import { useNavigate } from "react-router";
import { loginCheck } from "../util/DatabaseUtil";
import { useAccount, useToken } from "../stores/account-store";
import logo from "../assets/arbnb_logo-b.png";

export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [loginError, setLoginError] = useState(false);

  const { setAccount } = useAccount();
  const { setToken } = useToken();

  function submitHandle(evt) {
    evt.preventDefault();

    loginCheck(id, pw).then((obj) => {
      if (!obj.success) {
        setLoginError(true);
      } else {
        setToken(obj.token); // 토큰 저장
        setAccount(obj.data); // 계정 저장
        navigate("/");
      }
    });
  }

  return (
    <>
      <div>
        <header className="top-0 left-0 w-full h-40 md:h-[90px]">
          <div className="h-full flex items-center px-6 md:px-10">
            <div className="flex items-center justify-between w-full">
              {/* 왼쪽 로고 */}
              <img
                src={logo}
                alt="logo"
                className="w-9 cursor-pointer"
                onClick={() => navigate("/")}
              />

              {/* 오른쪽 나가기 */}
              <button
                className="py-1 border-b border-neutral-400 text-xs font-bold hover:cursor-pointer"
                onClick={() => navigate("/")}
              >
                나가기
              </button>
            </div>
          </div>
        </header>
        <main className="flex justify-center items-center min-h-[calc(100vh-90px)]">
          <div className="bg-white w-96 p-8">
            <h2 className="text-base font-semibold mb-6 text-left">로그인</h2>

            <form onSubmit={submitHandle}>
              <input
                type="text"
                placeholder="아이디"
                value={id}
                onChange={(e) => setId(e.target.value)}
                autoComplete="off"
                className="border border-gray-400 w-full p-2.5 rounded-md mb-3 placeholder:text-xs text-sm"
              />

              <input
                type="password"
                placeholder="비밀번호"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="border border-gray-400 w-full p-2.5 rounded-md mb-3 placeholder:text-xs text-sm"
              />
              {loginError && (
                <p className="text-red-500 text-xs mt-4">
                  아이디 또는 비밀번호가 일치하지 않습니다.
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-rose-600 text-white p-3 rounded-md text-sm hover:bg-rose-700 transition cursor-pointer"
              >
                로그인
              </button>

              <button
                type="button"
                onClick={() => navigate("/sign-up")}
                className="w-full mt-3 text-gray-600 text-sm hover:underline cursor-pointer"
              >
                회원가입
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
