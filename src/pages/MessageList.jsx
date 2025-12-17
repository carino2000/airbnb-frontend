import { useEffect, useRef, useState } from "react";

export default function MessageList() {
  // ================== 메시지 더미 데이터 ==================
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "김민지",
      last: "체크인 시간 몇 시에 가능할까요?",
      unread: 2,
      updatedAt: "방금",
      messages: [
        { id: "m1", from: "them", text: "안녕하세요! 예약 관련 문의드려요." },
        { id: "m2", from: "me", text: "안녕하세요 😊 어떤 점 도와드릴까요?" },
        { id: "m3", from: "them", text: "체크인 시간 몇 시에 가능할까요?" },
      ],
    },
    {
      id: 2,
      name: "박지훈",
      last: "네 확인했습니다!",
      unread: 0,
      updatedAt: "1시간 전",
      messages: [
        { id: "a1", from: "them", text: "주차 가능할까요?" },
        { id: "a2", from: "me", text: "네! 1대 무료 주차 가능합니다." },
        { id: "a3", from: "them", text: "네 확인했습니다!" },
      ],
    },
  ]);

  const [activeId, setActiveId] = useState(conversations[0].id);
  const [input, setInput] = useState("");

  const activeChat = conversations.find((c) => c.id === activeId);

  const bottomRef = useRef(null);

  // ================== 전송 ==================
  const handleSend = () => {
    if (!input.trim()) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: Date.now(), from: "me", text: input },
              ],
              last: input,
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
  }, [activeChat.messages]);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 h-[600px]">
      {/* 왼쪽: 대화 목록 */}
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

              {c.unread > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-2 rounded-full">
                  {c.unread}
                </span>
              )}
            </div>
          </div>
        ))}
      </aside>

      {/* 오른쪽: 채팅 */}
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
