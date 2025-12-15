import { useState } from "react";
import { useNavigate } from "react-router";
import {
  idCheck,
  emailCheck,
  emailCodeCheck,
  insertAccount,
} from "../util/DatabaseUtil.jsx";

import logo from "../assets/arbnb_logo-vertical.png";

export default function SignUp() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interestArea, setInterestArea] = useState("");
  const [code, setCode] = useState("");
  const [inputCode, setInputCode] = useState("");

  const isCodeSent = !!code;
  const disabledInputStyle =
    "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed";

  const [codeExpired, setCodeExpired] = useState("");

  const [idError, setIdError] = useState("");
  const [pwError, setPwError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");

  const navigate = useNavigate();

  // 아이디 체크
  function idCheckHandle(e) {
    const value = e.target.value;
    setId(value);

    if (!value) return setIdError("");

    if (value.length < 5 || value.length > 12)
      return setIdError("아이디는 5~12자 이내로 입력해주세요.");

    idCheck(value).then((obj) => {
      console.log(obj);
      setIdError(obj.duplicate ? "이미 가입된 아이디예요." : "");
    });
  }

  // 비밀번호 체크
  function pwHandle(e) {
    const value = e.target.value;
    setPw(value);

    const regex = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,20}$/;

    setPwError(regex.test(value) ? "" : "영어 소문자, 숫자 필수 입력해주세요.");
  }

  // 이메일
  function emailCheckHandle(e) {
    const value = e.target.value;
    setEmail(value);

    if (!value) return setEmailError("");

    emailCheck(value).then((obj) => {
      // console.log("이메일 체크 응답: ", obj);
      setEmailError(obj.duplicate ? "이미 가입된 이메일예요." : "");
    });
  }

  // 이메일 인증 코드 검증
  function emailCodeCheckHandle(evt) {
    const currentCode = code; // 서버 코드
    const value = evt.target.value; // 사용자 입력
    const now = new Date();

    setInputCode(value); //

    if (currentCode !== value) {
      setCodeError("유효하지 않은 인증 코드예요.");
    } else if (codeExpired < now) {
      setCodeError("이미 만료된 코드예요.");
    } else {
      setCodeError("");
    }
  }

  // 인증 코드 발송
  function emailCodeSendHandle(e) {
    e.preventDefault();

    if (emailError || !email) return alert("이메일을 정상적으로 입력해주세요.");

    emailCodeCheck(email).then((obj) => {
      setCode(obj.code);
      setCodeExpired(new Date(obj.expiredAt));
    });
  }

  // 회원가입 제출
  function signUpSubmitHandle(e) {
    e.preventDefault();

    const data = {
      accountId: id,
      pw,
      email,
      name,
      phoneNumber: phone,
      interestLocation: interestArea,
      emailCode: code,
      code: inputCode,
    };

    insertAccount(data).then((obj) => {
      console.log("회원가입 응답: ", obj);
      if (!obj.success) {
        alert("오류가 발생했어요. 다시 시도해주세요.");
      } else {
        alert("환영합니다!");
        navigate("/log-in");
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-10 bg-white relative text-sm">
      {/* 메인 컨테이너 */}
      <div className="mt-5 w-full max-w-xl p-10 space-y-8">
        <img
          src={logo}
          alt="logo"
          className="w-20 mx-auto"
          onClick={() => navigate("/")}
        />

        {/* 인증 전 입력폼 */}
        <form onSubmit={emailCodeSendHandle} className="space-y-4 mt-10">
          {/* 아이디 */}
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="font-medium text-[13px]">아이디</label>
            <div className="col-span-2 flex flex-col">
              <input
                onChange={idCheckHandle}
                disabled={isCodeSent}
                type="text"
                placeholder="5~12자 이내 입력"
                className={
                  "p-2.5 rounded-md border border-gray-400 placeholder:text-xs " +
                  (idError ? "border-red-500" : "border-gray-400") +
                  disabledInputStyle
                }
              />
              <div className="text-xs text-red-600 h-2 mt-1">{idError}</div>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="font-medium text-[13px]">비밀번호</label>
            <div className="col-span-2 flex flex-col">
              <input
                onChange={pwHandle}
                disabled={isCodeSent}
                type="password"
                placeholder="영어 소문자 + 숫자 조합, 8~20자 이내 입력"
                className={
                  "p-2.5 rounded-md border border-gray-400 placeholder:text-xs hover:cup" +
                  (pwError ? "border-red-500" : "border-gray-400") +
                  disabledInputStyle
                }
              />
              <div className="text-xs text-red-600 h-2 mt-1">{pwError}</div>
            </div>
          </div>

          {/* 이름 */}
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="font-medium text-[13px]">이름</label>
            <div className="col-span-2 flex flex-col">
              <input
                onChange={(e) => setName(e.target.value)}
                disabled={isCodeSent}
                type="text"
                placeholder="홍길동"
                className={
                  "p-2.5 rounded-md border border-gray-400 placeholder:text-xs " +
                  disabledInputStyle
                }
              />
              <div className="h-2"></div>
            </div>
          </div>

          {/* 이메일 */}
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="font-medium text-[13px]">이메일</label>
            <div className="col-span-2 flex flex-col">
              <input
                onChange={emailCheckHandle}
                disabled={isCodeSent}
                type="text"
                readOnly={!!code}
                placeholder="인증코드 받을 이메일 입력"
                className={
                  "p-2.5 rounded-md border border-gray-400 placeholder:text-xs " +
                  (emailError ? "border-red-500" : "border-gray-400") +
                  disabledInputStyle
                }
              />
              <div className="text-xs text-red-600 h-2 mt-1">{emailError}</div>
            </div>
          </div>

          {/* 전화번호 */}
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="font-medium text-[13px]">전화번호</label>
            <div className="col-span-2 flex flex-col">
              <input
                onChange={(e) => setPhone(e.target.value)}
                disabled={isCodeSent}
                type="text"
                placeholder="- (하이픈) 생략"
                className={
                  "p-2.5 rounded-md border border-gray-400 placeholder:text-xs " +
                  disabledInputStyle
                }
              />
              <div className="h-2"></div>
            </div>
          </div>

          {/* 관심지역 */}
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="font-medium text-[13px]">관심지역</label>
            <div className="col-span-2 flex flex-col">
              <input
                onChange={(e) => setInterestArea(e.target.value)}
                disabled={isCodeSent}
                type="text"
                placeholder="서울"
                className={
                  "border p-2.5 rounded-md border-gray-400 placeholder:text-xs bg-white" +
                  disabledInputStyle
                }
              />
              <div className="h-2"></div>
            </div>
          </div>

          <button
            disabled={isCodeSent || !!pwError || !!emailError || !!idError}
            className={
              "p-3 w-full rounded-md text-sm " +
              (isCodeSent
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-rose-600 text-white hover:bg-rose-700 cursor-pointer")
            }
          >
            인증코드 발송
          </button>
        </form>

        {/* 인증 코드 입력폼 */}
        {code && (
          <form
            onSubmit={signUpSubmitHandle}
            className="space-y-4 border border-gray-300 p-5 rounded-md"
          >
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="font-medium text-[13px]">인증코드</label>
              <div className="col-span-2 flex flex-col">
                <input
                  onChange={emailCodeCheckHandle}
                  type="text"
                  placeholder="인증코드 입력"
                  className={
                    "border p-2.5 rounded-md " +
                    (codeError ? "border-red-500" : "border-gray-400")
                  }
                />
                <div className="text-xs text-red-600 h-2 mt-1">{codeError}</div>
              </div>
            </div>

            <button
              disabled={!!codeError}
              className="bg-rose-600 text-white p-3 w-full rounded-md text-sm hover:bg-rose-700 cursor-pointer"
            >
              계정 생성하기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
