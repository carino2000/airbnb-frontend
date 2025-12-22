import { useEffect, useState } from "react";
import { useAccount, useToken } from "../stores/account-store";
import {
  createMessage,
  getMessage,
  getMyMessageList,
} from "../util/DatabaseUtil";

export default function MessageList() {
  const { token } = useToken();
  const { account } = useAccount();

  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState({
    recipientId: null,
    reservationCode: null,
    data: [],
  });

  /* =========================
     내 메시지룸 목록 조회
  ========================= */
  useEffect(() => {
    if (!account?.id || !token) return;

    getMyMessageList(account.id, token).then((obj) => {
      if (obj?.success && Array.isArray(obj.messageRooms)) {
        setMessageList(obj.messageRooms);
      } else {
        setMessageList([]);
      }
    });
  }, [account?.id, token]);

  /* =========================
     메시지룸 선택
  ========================= */
  function selectMessageRoom(reservationCode, recipientId) {
    if (!reservationCode || !recipientId) return;

    console.log(reservationCode, token);
    getMessage(reservationCode, token).then((obj) => {
      if (obj?.success && Array.isArray(obj.messages)) {
        setMessage({
          recipientId,
          reservationCode,
          data: obj.messages,
        });
      } else {
        setMessage({
          recipientId,
          reservationCode,
          data: [],
        });
      }
    });
  }

  /* =========================
     메시지 전송
  ========================= */
  function messageSendHandle(evt) {
    evt.preventDefault();

    if (!message.reservationCode || !message.recipientId) return;

    const content = evt.target.messageInput.value.trim();
    if (!content) return;

    const data = {
      reservationCode: message.reservationCode,
      writerId: account.id,
      recipientId: message.recipientId,
      content,
    };

    createMessage(data, token).then((obj) => {
      if (obj?.success) {
        evt.target.messageInput.value = "";
        selectMessageRoom(data.reservationCode, data.recipientId);
      } else {
        window.alert("메시지 전송 오류입니다.");
      }
    });
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 h-[600px]">
      {/* =========================
          왼쪽: 대화 목록
      ========================= */}
      <aside className="border rounded-xl overflow-y-auto bg-white">
        {messageList.map((room) => (
          <div
            key={room.reservationCode}
            onClick={() =>
              selectMessageRoom(room.reservationCode, room.recipientId)
            }
            className="px-4 py-3 border-b cursor-pointer hover:bg-neutral-50"
          >
            <div className="flex justify-between">
              <p className="font-semibold text-sm">{room.recipientId} 님</p>
              <span className="text-xs text-neutral-400">
                {room.lastReceiveTime}
              </span>
            </div>

            <div className="flex justify-between mt-1">
              <p className="text-xs text-neutral-500 truncate max-w-[220px]">
                {room.lastMessage}
              </p>
              {room.unReadCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-2 rounded-full">
                  {room.unReadCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </aside>

      {/* =========================
          오른쪽: 채팅 영역
      ========================= */}
      <div className="border rounded-xl flex flex-col bg-white">
        <div className="px-5 py-4 border-b font-semibold">
          {message.recipientId}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {message.data.map((item) =>
            item.writerId === message.recipientId ? (
              <div key={item.id} className="flex justify-start">
                <div className="bg-neutral-100 px-4 py-2 rounded-2xl text-sm">
                  {item.content}
                </div>
              </div>
            ) : (
              <div key={item.id} className="flex justify-end">
                <div className="bg-neutral-900 text-white px-4 py-2 rounded-2xl text-sm">
                  {item.content}
                </div>
              </div>
            )
          )}
        </div>

        <form
          onSubmit={messageSendHandle}
          className="border-t px-4 py-3 flex gap-2"
        >
          <input
            name="messageInput"
            placeholder="메시지를 입력하세요"
            className="flex-1 border rounded-full px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-neutral-900 text-white px-4 py-2 rounded-full text-sm"
          >
            전송
          </button>
        </form>
      </div>
    </section>
  );
}
