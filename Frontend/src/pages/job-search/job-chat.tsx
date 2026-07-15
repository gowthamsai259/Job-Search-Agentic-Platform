import { useEffect, useRef, useState } from "react";
import { socket } from "../../services/socket";
import React from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  setJobs: React.Dispatch<React.SetStateAction<any[]>>;
}

const JobChat = ({ setJobs }: Props) => {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("agent_event", (event) => {

      console.log(event);

      if (event.type === "assistant_message") {

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: event?.data?.message ?? event.message,
          },
        ]);

        setJobs(event.data.jobs ?? event.data)

      }

    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("agent_event");
      socket.disconnect();
    };

  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {

    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: userMessage,
      },
    ]);

    socket.emit("chat", {
      message: userMessage,
    });

    setMessage("");
  };

  return (
    <div className="flex h-full flex-col bg-white">

      <div className="border-b px-6 py-4">
        <h2 className="text-xl font-bold">
          Job Search Assistant
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Ask me to find jobs anywhere in the world.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">

        {messages.map((msg) => (

          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              {msg.content}
            </div>

          </div>

        ))}

        <div ref={bottomRef} />

      </div>

      <div className="border-t bg-white p-4">

        <div className="flex gap-3">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Find Remote AI jobs..."
            className="flex-1 rounded-xl border px-4 py-3"
          />

          <button
            onClick={sendMessage}
            className="rounded-xl bg-blue-600 px-6 text-white"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
};

export default JobChat;