"use client";

import { useState, useRef } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function RealtimeChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      role: "assistant",
      content: "Halo! Saya adalah chatbot dengan kemampuan streaming kata per kata. Ketik pesan Anda di bawah dan perhatikan bagaimana server mengirimkan setiap kata secara langsung saat dibuat!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [metrics, setMetrics] = useState<{ ttft: number | null; chunks: number }>({
    ttft: null,
    chunks: 0,
  });

  // Ref untuk membatalkan stream jika user menekan Stop (Barge-in)
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    };

    const botMessageId = `bot-${Date.now()}`;
    const botPlaceholder: Message = {
      id: botMessageId,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMessage, botPlaceholder]);
    setInput("");
    setIsStreaming(true);
    setMetrics({ ttft: null, chunks: 0 });

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const startTime = performance.now();
    let firstTokenReceived = false;
    let chunkCount = 0;

    try {
      // 1. Panggil API Streaming
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
        signal: abortController.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error("Gagal terhubung ke endpoint streaming");
      }

      // 2. Gunakan ReadableStreamDefaultReader
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      // 3. Baca stream loop per chunk secara real-time
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Catat Time-to-First-Token (TTFT)
        if (!firstTokenReceived) {
          const ttftMs = Math.round(performance.now() - startTime);
          firstTokenReceived = true;
          setMetrics((m) => ({ ...m, ttft: ttftMs }));
        }

        chunkCount++;
        setMetrics((m) => ({ ...m, chunks: chunkCount }));

        // Decode bagian kata yang baru saja tiba dari server
        const textChunk = decoder.decode(value, { stream: true });

        // Update bubble chat bot secara bertahap (incremental)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, content: msg.content + textChunk }
              : msg
          )
        );
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, content: msg.content + " [⚠️ Dihentikan oleh pengguna]" }
              : msg
          )
        );
      } else {
        console.error("Gagal streaming:", err);
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 font-sans">
      {/* Header */}
      <header className="py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            Realtime Chatbot Streaming Engine
          </h1>
          <p className="text-xs text-zinc-500">
            HTTP Chunked Transfer &bull; Web ReadableStream &bull; Instant Barge-in
          </p>
        </div>
        {metrics.ttft !== null && (
          <div className="text-right text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              TTFT: {metrics.ttft}ms
            </span>
            <span className="text-zinc-400 ml-2">({metrics.chunks} chunks)</span>
          </div>
        )}
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-bl-none"
              }`}
            >
              <div className="font-semibold text-[11px] mb-1 opacity-70">
                {msg.role === "user" ? "Anda" : "AI Assistant"}
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">
                {msg.content || (
                  <span className="inline-flex items-center gap-1 text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                )}
                {isStreaming && msg.role === "assistant" && msg.content && (
                  <span className="inline-block w-1.5 h-4 bg-blue-500 ml-1 translate-y-0.5 animate-pulse" />
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="pt-2 pb-4 border-t border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isStreaming ? "Bot sedang mengetik..." : "Ketik pesan Anda..."}
            className="flex-1 rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isStreaming}
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStopStream}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-2 h-2 bg-white rounded-sm"></span>
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              Kirim
            </button>
          )}
        </form>
        <p className="text-[11px] text-zinc-400 mt-2 text-center">
          Klik tombol &quot;Stop&quot; saat bot berbicara untuk menguji fitur <strong>Barge-in / AbortController</strong> seketika.
        </p>
      </div>
    </div>
  );
}
