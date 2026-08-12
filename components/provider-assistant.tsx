"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function cleanChatFormatting(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/\s+•\s+/g, "\n• ")
    .replace(/#{1,6}\s+/g, "")
    .trim();
}

function LinkedText({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return <>{parts.map((part, index) => {
    if (!/^https?:\/\//i.test(part)) return part;
    const href = part.replace(/[.,;!?)]$/, "");
    const trailing = part.slice(href.length);
    return <span key={index}><a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900">{href}</a>{trailing}</span>;
  })}</>;
}

function ChatMessageContent({ content }: { content: string }) {
  const lines = cleanChatFormatting(content).split(/\n+/).filter(Boolean);

  return (
    <div className="space-y-2.5">
      {lines.map((line, index) => line.startsWith("• ") ? (
        <div key={index} className="flex items-start gap-2.5 rounded-xl bg-blue-50/70 px-3 py-2.5">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
          <span><LinkedText text={line.slice(2)} /></span>
        </div>
      ) : (
        <p key={index}><LinkedText text={line} /></p>
      ))}
    </div>
  );
}

export function ProviderAssistant({
  providerId,
  providerName,
}: {
  providerId: string;
  providerName: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hi! I'm ${providerName} Assistant. What can I assist you with today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (!conversation) return;
    conversation.scrollTo({
      top: conversation.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();
    if (!message || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: message }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/provider-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          message,
          conversationHistory: nextMessages.slice(-6),
        }),
      });
      const data = await response.json();
      if (!response.ok || typeof data.reply !== "string") {
        throw new Error("Chat request failed");
      }
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I’m having trouble answering right now. Please use the provider contact details on this page for immediate help.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 lg:m-5 lg:ml-0 lg:min-h-0 lg:rounded-[1.5rem] lg:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-300/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-cyan-300/30 blur-3xl" />
      <div
        className="relative flex w-full max-w-md flex-col overflow-hidden rounded-[1.6rem] border border-blue-100 bg-white shadow-[0_24px_70px_-28px_rgba(37,99,235,0.38)]"
        style={{ fontFamily: 'Inter, "Avenir Next", "Segoe UI", sans-serif' }}
        aria-label={`${providerName} assistant`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">
              <Image src="/provider-assistant-icon.png" alt="" fill sizes="40px" className="object-cover" priority />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-950">{providerName} Assistant</p>
              <p className="flex items-center gap-1.5 text-xs text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Ready to help</p>
            </div>
          </div>
          <span className="ml-3 shrink-0 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">AI assistant</span>
        </div>

        <div ref={conversationRef} className="h-64 scroll-smooth space-y-4 overflow-y-auto bg-slate-50/70 p-5" aria-live="polite">
          {messages.map((chatMessage, index) => (
            <div
              key={`${chatMessage.role}-${index}`}
              className={chatMessage.role === "user"
                ? "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-blue-700 px-4 py-3 text-[0.9rem] font-medium leading-6 tracking-[-0.01em] text-white shadow-sm"
                : "max-w-[92%] whitespace-pre-wrap rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-[0.9rem] font-normal leading-6 tracking-[-0.01em] text-slate-700 shadow-sm"}
            >
              {chatMessage.role === "assistant"
                ? <ChatMessageContent content={chatMessage.content} />
                : cleanChatFormatting(chatMessage.content)}
            </div>
          ))}
          {isLoading && (
            <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3" aria-label="Assistant is typing">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400 [animation-delay:300ms]" />
            </div>
          )}
        </div>

        <form className="flex items-center gap-3 border-t border-slate-100 bg-white p-4" onSubmit={sendMessage}>
          <label className="sr-only" htmlFor={`provider-chat-${providerId}`}>Ask about {providerName}</label>
          <input
            id={`provider-chat-${providerId}`}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={1000}
            placeholder="Ask about this provider…"
            className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white shadow-md shadow-blue-200 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-45" aria-label="Send message">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 5.153a1.75 1.75 0 001.194 1.194L9.25 10.75l-4.363 1.164a1.75 1.75 0 00-1.194 1.194L2.279 18.26a.75.75 0 00.95.826l15-5.25a.75.75 0 000-1.414l-15-5.25z" /></svg>
          </button>
        </form>
        <p className="border-t border-slate-100 bg-white px-5 py-2 text-center text-[10px] leading-relaxed text-slate-400">AI-generated directory guidance. Confirm medical and booking details directly with the provider.</p>
      </div>
    </div>
  );
}
