import { useEffect, useState } from "react";
import { useAccount, useToken } from "../stores/account-store";

export default function MessageList() {
  const { token, setToken, clearToken } = useToken();
  const { account, setAccount, clearAccount } = useAccount();

  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState([]);

  // useEffect(() => {
  //   getMyMessageList(account.id).then((obj) => {
  //     if (obj.success) {
  //       setMessageList([...obj.messageRoom]);
  //     }
  //   });
  // }, []);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 h-[600px]">
      {/* ================= 왼쪽: 대화 목록 ================= */}
      <aside className="border rounded-xl overflow-y-auto bg-white">
        {/* 대화 아이템 (반복될 자리) */}
        <div className="px-4 py-3 border-b">
          <div className="flex justify-between">
            <p className="font-semibold text-sm text-neutral-800">
              사용자 이름
            </p>
            <span className="text-xs text-neutral-400">시간</span>
          </div>

          <div className="flex justify-between mt-1">
            <p className="text-xs text-neutral-500 truncate max-w-[220px]">
              마지막 메시지 미리보기
            </p>

            {/* 읽지 않은 메시지 뱃지 */}
            <span className="bg-rose-500 text-white text-[10px] px-2 rounded-full">
              2
            </span>
          </div>
        </div>
      </aside>

      {/* ================= 오른쪽: 채팅 영역 ================= */}
      <div className="border rounded-xl flex flex-col bg-white">
        {/* 상단: 상대 이름 */}
        <div className="px-5 py-4 border-b font-semibold">사용자 이름</div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {/* 상대 메시지 */}
          <div className="flex justify-start">
            <div className="max-w-[60%] px-4 py-2 rounded-2xl text-sm bg-neutral-100 rounded-bl-md">
              상대방 메시지
            </div>
          </div>

          {/* 내 메시지 */}
          <div className="flex justify-end">
            <div className="max-w-[60%] px-4 py-2 rounded-2xl text-sm bg-neutral-900 text-white rounded-br-md">
              내 메시지
            </div>
          </div>
        </div>

        {/* 입력창 */}
        <div className="border-t px-4 py-3 flex gap-2">
          <input
            placeholder="메시지를 입력하세요"
            className="flex-1 border rounded-full px-4 py-2 text-sm"
          />
          <button className="px-4 py-2 bg-neutral-900 text-white rounded-full text-sm">
            전송
          </button>
        </div>
      </div>
    </section>
  );
}
