import { useState, useEffect } from "react";

// 회원정보 수정
function InfoForm({ onSubmit, account }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interestLocation: "",
  });
  useEffect(() => {
    if (account) {
      setForm({
        name: account.name ?? "",
        email: account.email ?? "",
        phone: account.phoneNumber ?? "",
        interestLocation: account.interestLocation ?? "",
      });
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <Field
        label="이름"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="홍길동"
      />
      <Field
        label="이메일"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="example@email.com"
      />
      <Field
        label="전화번호"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="- (하이픈) 생략"
      />
      <Field
        label="관심 지역"
        name="interestLocation"
        value={form.interestLocation}
        onChange={handleChange}
        placeholder="부산"
      />

      <div className="pt-8">
        <button className="w-full p-3 bg-rose-600 text-white rounded-md font-medium">
          저장
        </button>
      </div>
    </form>
  );
}
// 비밀번호 변경
function PasswordForm({ onSubmit }) {
  const [form, setForm] = useState({
    oldPw: "",
    newPw: "",
    newPwConfirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <Field
        label="현재 비밀번호"
        name="oldPw"
        type="password"
        onChange={handleChange}
        placeholder="영어 소문자 + 숫자 조합, 8~20자 이내 입력"
      />
      <Field
        label="새 비밀번호"
        name="newPw"
        type="password"
        onChange={handleChange}
        placeholder="영어 소문자 + 숫자 조합, 8~20자 이내 입력"
      />
      <Field
        label="새 비밀번호 확인"
        name="newPwConfirm"
        type="password"
        onChange={handleChange}
      />

      <div className="pt-8">
        <button className="w-full p-3 bg-rose-600 text-white rounded-md font-medium">
          비밀번호 변경
        </button>
      </div>
    </form>
  );
}
// 회원탈퇴
function WithdrawForm({ onSubmit }) {
  const [pw, setPw] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="space-y-8">
      <div className="bg-red-50 border border-red-200 p-4 rounded-md text-sm text-red-700">
        계정을 탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다.
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <Field
          label="비밀번호 확인"
          type="password"
          onChange={(e) => setPw(e.target.value)}
        />

        <div className="pt-8">
          <button className="w-full p-3 bg-red-600 text-white rounded-md font-medium">
            계정 탈퇴
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, value, type = "text", placeholder, onChange }) {
  return (
    <div className="grid grid-cols-[160px_1fr] items-center gap-6">
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      <input
        name={name}
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full p-3 rounded-md border border-gray-300 placeholder:text-xs"
      />
    </div>
  );
}

export { InfoForm, PasswordForm, WithdrawForm, Field };
