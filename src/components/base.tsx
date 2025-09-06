"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Pin, PinOff } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

type Message = {
  id: number;
  text?: string;
  audioUrl?: string;
  from: "bot" | string;
  status?: "sending" | "sent" | "failed";
  time: string;
  deviceId?: string;
};

export default function ChatbotUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pinnedMessage, setPinnedMessage] = useState<Message | null>(null);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [deviceId, setDeviceId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userPing, setUserPing] = useState<number | null>(null);
  // Generate or load unique device ID
  useEffect(() => {
    let id = localStorage.getItem("chatDeviceId");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("chatDeviceId", id);
    }
    setDeviceId(id);
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };
  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      try {
        const start = performance.now();

        const res = await fetch("/api/chat/load");
        const end = performance.now();
        const ping = Math.round(end - start);

        if (res.ok && isMounted) {
          const data: Message[] = await res.json();
          setMessages(data);
          setUserPing(ping);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    // Load immediately
    loadMessages();

    // Poll every 5 seconds
    const interval = setInterval(loadMessages, 5000);

    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const sendTextMessage = async (text: string) => {
    if (!text.trim() || isSending || !deviceId) return;

    const tempMessage: Message = { id: Date.now(), text, from: deviceId, status: "sending", time: "", deviceId };
    setMessages([...messages, tempMessage]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, from: deviceId }),
      });
      const data = await res.json();

      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempMessage.id ? { ...msg, status: "sent", time: data.time || getCurrentTime() } : msg
        )
      );
    } catch {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempMessage.id ? { ...msg, status: "failed", text: msg.text + " (failed)" } : msg
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  // -------------------
  // Pin message
  // -------------------
  const pinMessage = (msg: Message) => {
    setPinnedMessage(prev => (prev?.id === msg.id ? null : msg));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="fixed top-0 right-0 z-100 space-x-2 pointer-events-none opacity-50">
        {userPing !== null && (
          <div
            className={`p-1 text-sm rounded-bl-lg text-white ${
              userPing < 100
                ? "bg-green-600"
                : userPing < 500
                ? "bg-yellow-500"
                : "bg-red-600"
            }`}
          >
            {userPing}ms
          </div>
        )}
      </div>
      {pinnedMessage && (
        <div
          className={`fixed top-0 left-0 right-0 p-3 rounded-b-lg shadow-md flex justify-between items-center z-100 ${
            pinnedMessage.text?.startsWith("⚠️")
              ? "bg-yellow-500 text-black"
              : pinnedMessage.from === deviceId
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white"
          }`}
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {/* flex-1 + min-w-0 is needed for truncate to work in flex */}
            <span className="font-semibold truncate">{pinnedMessage.text}</span>
          </div>
          <button onClick={() => setPinnedMessage(null)}>
            <PinOff
              className={`w-5 h-5 ${
                pinnedMessage.text?.startsWith("⚠️") ? "text-black" : "text-white"
              }`}
            />
          </button>
        </div>
      )}

      <div className="fixed z-50 bottom-0 left-0 w-full h-screen sm:h-[calc(100vh-100px)] sm:w-[400px] sm:bottom-6 sm:left-6 flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white overflow-hidden sm:rounded-3xl shadow-2xl">
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.25 }}
                className={`relative flex flex-col ${msg.from === deviceId ? "self-end items-end" : "self-start items-start"}`}
              >
                <div className="absolute -top-2 text-sm p-2 rounded-bl-lg text-white">
                  {msg.from === deviceId ? "You" : deviceId}
                </div>
                <div className={`px-4 py-2 mt-6 rounded-2xl break-words whitespace-pre-wrap max-w-[80%] ${
                  msg.from === deviceId ? "bg-blue-600 text-white shadow-md" : "bg-gray-700 text-white shadow-sm"
                }`}>
                  {msg.text && <span>{msg.text}</span>}
                </div>
                <div className="flex items-center mt-1 text-xs text-gray-400 space-x-1">
                  <span>{msg.time}</span>
                  <button onClick={() => pinMessage(msg)} className="ml-1">
                    {pinnedMessage?.id === msg.id ? <PinOff className="w-4 h-4 text-yellow-400" /> : <Pin className="w-4 h-4 text-gray-400" />}
                  </button>
                  {msg.from === deviceId && (
                    <span className="flex-shrink-0">
                      {msg.status === "sending" && <Loader2 className="w-4 h-4 animate-spin text-gray-300" />}
                      {msg.status === "sent" && <Check className="w-4 h-4 text-green-400" />}
                      {msg.status === "failed" && <span className="text-red-400">!</span>}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div className="flex items-center p-3 border-t border-gray-700 bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendTextMessage(input)}
            placeholder="Type your message..."
            disabled={isSending}
            className="flex-1 rounded-full px-4 py-2 bg-gray-800 text-white outline-none placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
          />
          <button
            onClick={() => sendTextMessage(input)}
            disabled={isSending || !input.trim()}
            className="ml-2 px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700 shadow-lg transition duration-200 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
