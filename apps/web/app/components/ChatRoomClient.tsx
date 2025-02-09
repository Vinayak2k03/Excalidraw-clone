"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

interface ChatRoomClientProps {
  messages: { message: string }[];
  id: string;
}

export function ChatRoomClient({ messages, id }: ChatRoomClientProps) {
  const { socket, loading } = useSocket();
  const [chats, setChats] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId:id,
        })
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChats((prevChats)=>[...prevChats, { message: parsedData.message }]);
        }
      };
    }
  }, [socket, loading, id]);

  return (
    <div>
      {chats.map((m,index) => (
        <div key={index}>{m.message}</div>
      ))}

      <input
        type="text"
        value={currentMessage}
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
      />

      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message: currentMessage,
            })
          );

          setCurrentMessage("");
        }}
      >
        Send Message
      </button>
    </div>
  );
}
