import { useEffect, useRef, useState } from "react";
import { useToken, useAccount } from "../stores/account-store";
import { createMessage, getMessage } from "../util/DatabaseUtil";

export default function MessageList() {
  const token = useToken((s) => s.token);
  const { account } = useAccount(); // 로그인 유저

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");

  const activeChat = conversations.find((c) => c.id === activeId);
  const bottomRef = useRef(null);

  // ================== 메시지 전송 ==================
  const handleSend = async () => {
    if (!input.trim()) return;
    if (!token || !activeChat) return;

    const payload = {
      writerId: account.accountId,
      recipientId: activeChat.recipientId,
      content: input,
      reservationCode: "",
    };

    const result = await createMessage(payload, token);

    if (!result.success) {
      alert(result.message);
      return;
    }

    // 서버 성공 후 UI 상태 업데이트
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: result.messageData.id,
                  from: "me",
                  text: result.messageData.content,
                },
              ],
              last: result.messageData.content,
              unread: 0,
            }
          : c
      )
    );

    setInput("");
  };

  // ================== Enter 키 ==================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // ================== 스크롤 자동 ==================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  // ================== 메시지 조회 ==================
  useEffect(() => {
    if (!token || !account) return;

    getMessage(account.accountId, token).then((res) => {
      if (!res || !res.success) {
        alert(res?.message || "메시지 조회 실패");
        return;
      }

      const messageList = Array.isArray(res.messages) ? res.messages : [];

      const grouped = {};

      messageList.forEach((msg) => {
        const otherId =
          msg.writerId === account.accountId ? msg.recipientId : msg.writerId;

        if (!grouped[otherId]) {
          grouped[otherId] = {
            id: otherId,
            name: otherId,
            recipientId: otherId,
            last: msg.content,
            unread: 0,
            updatedAt: msg.createdAt,
            messages: [],
          };
        }

        grouped[otherId].messages.push({
          id: msg.id,
          from: msg.writerId === account.accountId ? "me" : "them",
          text: msg.content,
        });

        grouped[otherId].last = msg.content;
      });

      const list = Object.values(grouped);
      setConversations(list);
      if (list.length > 0) setActiveId(list[0].id);
    });
  }, [token, account]);

  // ====================================
  if (!activeChat) {
    return (
      <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 h-[600px]">
        <aside className="border rounded-xl overflow-y-auto bg-white">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className="px-4 py-3 cursor-pointer border-b hover:bg-neutral-50"
            >
              <p className="font-semibold text-sm">{c.name}</p>
              <p className="text-xs text-neutral-500 truncate">{c.last}</p>
            </div>
          ))}
        </aside>

        <div className="border rounded-xl flex items-center justify-center text-sm text-neutral-400 bg-white">
          대화를 선택해주세요
        </div>
      </section>
    );
  }

  // ================== UI ==================
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 h-[600px]">
      {/* 왼쪽 */}
      <aside className="border rounded-xl overflow-y-auto bg-white">
        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`px-4 py-3 cursor-pointer border-b ${
              activeId === c.id ? "bg-neutral-100" : "hover:bg-neutral-50"
            }`}
          >
            <div className="flex justify-between">
              <p className="font-semibold text-sm">{c.name}</p>
              <span className="text-xs text-neutral-400">{c.updatedAt}</span>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-xs text-neutral-500 truncate max-w-[220px]">
                {c.last}
              </p>
            </div>
          </div>
        ))}
      </aside>

      {/* 오른쪽 */}
      <div className="border rounded-xl flex flex-col bg-white">
        <div className="px-5 py-4 border-b font-semibold">
          {activeChat.name}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {activeChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.from === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[60%] px-4 py-2 rounded-2xl text-sm ${
                  msg.from === "me"
                    ? "bg-neutral-900 text-white rounded-br-md"
                    : "bg-neutral-100 rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t px-4 py-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요"
            className="flex-1 border rounded-full px-4 py-2 text-sm"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-neutral-900 text-white rounded-full text-sm"
          >
            전송
          </button>
        </div>
      </div>
    </section>
  );
}
