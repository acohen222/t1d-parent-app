"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, RefreshCw, ChevronDown, Square } from "lucide-react";
import PageShell from "@/components/PageShell";
import Disclaimer from "@/components/Disclaimer";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "Why might my child's blood sugar be high after breakfast?",
  "What could cause a sudden drop in blood sugar during the night?",
  "Why is blood sugar high even though we gave insulin?",
  "What causes blood sugar to spike during exercise?",
  "Why is blood sugar hard to control when my child is sick?",
];

function AskPageInner() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSentRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea as content grows
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 128)}px`;
  }, [input]);

  // Auto-send pre-filled question from dashboard card links (?q=...)
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !autoSentRef.current) {
      autoSentRef.current = true;
      sendMessage(decodeURIComponent(q));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;
    setErrorMsg(null);

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    // Add placeholder assistant message
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        const isConfig = body.toLowerCase().includes("anthropic_api_key");
        throw new Error(
          isConfig
            ? "The AI service isn't configured yet. Set ANTHROPIC_API_KEY in your environment."
            : `Server error (${res.status}): ${body || "Please try again."}`
        );
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream available.");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                throw new Error(`API error: ${parsed.error}`);
              }
              if (parsed.text) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + parsed.text,
                  };
                  return updated;
                });
              }
            } catch (parseErr) {
              if (parseErr instanceof Error && parseErr.message.startsWith("API error:")) {
                throw parseErr;
              }
              // ignore other parse errors
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // User cancelled — leave the partial response as-is
        return;
      }
      console.error(err);
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please check your connection and try again.";
      setErrorMsg(msg);
      setMessages((prev) => {
        const updated = [...prev];
        // Remove the empty placeholder
        if (updated[updated.length - 1]?.content === "") {
          updated.pop();
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreaming, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const cancelStream = () => {
    abortControllerRef.current?.abort();
  };

  const clearChat = () => {
    abortControllerRef.current?.abort();
    setMessages([]);
    setInput("");
    setErrorMsg(null);
  };

  return (
    <PageShell
      title="Ask Why"
      subtitle="Understand blood sugar patterns"
      headerRight={
        messages.length > 0 ? (
          <button
            onClick={clearChat}
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 py-1 px-2"
          >
            <RefreshCw size={13} />
            Clear
          </button>
        ) : undefined
      }
    >
      <div className="flex flex-col min-h-[calc(100vh-10rem)]">
        {/* Disclaimer */}
        <div className="px-4 pt-4">
          <Disclaimer />
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="mx-4 mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 leading-snug">
            {errorMsg}
          </div>
        )}

        {/* Empty state / Starter prompts */}
        {messages.length === 0 && (
          <div className="px-4 pt-5">
            <p className="text-sm text-stone-500 mb-3 font-medium">
              Common questions to get started:
            </p>
            <div className="flex flex-col gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-left text-sm bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-700 hover:border-[#4a7c59] hover:text-[#4a7c59] transition-colors active:scale-[0.98]"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <ChevronDown size={16} className="text-stone-300 animate-bounce" />
            </div>
          </div>
        )}

        {/* Message thread */}
        {messages.length > 0 && (
          <div className="flex-1 px-4 pt-4 pb-2 flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "user" ? (
                  <div className="max-w-[80%] bg-[#4a7c59] text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed">
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-[90%] bg-white border border-stone-100 rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed text-stone-800 shadow-sm">
                    {msg.content === "" && isStreaming ? (
                      <span className="inline-flex gap-1 items-center text-stone-400">
                        <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:300ms]" />
                      </span>
                    ) : (
                      <AssistantText content={msg.content} />
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <div className="sticky bottom-20 px-4 pb-2 pt-3 bg-[#f8f7f4]">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about a blood sugar pattern..."
              rows={1}
              className="flex-1 resize-none bg-white border border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#4a7c59] transition-colors leading-relaxed overflow-hidden"
              disabled={isStreaming}
            />
            {isStreaming ? (
              <button
                type="button"
                onClick={cancelStream}
                className="w-10 h-10 flex items-center justify-center bg-stone-400 text-white rounded-full transition-opacity shrink-0 mb-0.5"
                aria-label="Stop response"
              >
                <Square size={14} fill="white" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 flex items-center justify-center bg-[#4a7c59] text-white rounded-full disabled:opacity-40 transition-opacity shrink-0 mb-0.5"
              >
                <Send size={16} />
              </button>
            )}
          </form>
        </div>
      </div>
    </PageShell>
  );
}

export default function AskPage() {
  return (
    <Suspense>
      <AskPageInner />
    </Suspense>
  );
}

// Renders assistant markdown-like text: bold, bullets, numbered lists, headers
function AssistantText({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        // Ordered list item: "1. " or "2. " etc.
        const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-[#4a7c59] font-medium shrink-0 min-w-[1.2rem] text-right">
                {numberedMatch[1]}.
              </span>
              <span>{renderInlineBold(numberedMatch[2])}</span>
            </div>
          );
        }

        // Unordered list item
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <div key={i} className="flex gap-1.5">
              <span className="text-[#4a7c59] mt-0.5 shrink-0">•</span>
              <span>{renderInlineBold(line.slice(2))}</span>
            </div>
          );
        }

        // Heading: ### or ##
        if (line.startsWith("### ")) {
          return (
            <p key={i} className="font-semibold text-stone-700 text-[0.8rem] uppercase tracking-wide mt-1">
              {line.slice(4)}
            </p>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <p key={i} className="font-semibold text-stone-800">
              {line.slice(3)}
            </p>
          );
        }

        // Standalone bold line
        if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
          return (
            <p key={i} className="font-semibold text-stone-800">
              {line.slice(2, -2)}
            </p>
          );
        }

        if (line === "") return <div key={i} className="h-1" />;
        return <p key={i}>{renderInlineBold(line)}</p>;
      })}
    </div>
  );
}

function renderInlineBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
