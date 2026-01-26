"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Mic, Paperclip, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { BotType } from "@/lib/bot-personalities";
import type { LandingPageCMSContent } from "@/lib/cms/landing-page-types";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  botType?: BotType;
}

interface InteractiveChatDemoProps {
  content: LandingPageCMSContent;
}

// Generate UUID for messages
function generateId(): string {
  return crypto.randomUUID();
}

// Helper to parse **bold** markdown
function formatBoldText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function InteractiveChatDemo({ content }: InteractiveChatDemoProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedExec, setSelectedExec] = useState<BotType>("collaborative");
  const [rateLimitHit, setRateLimitHit] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || rateLimitHit) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    // Scroll after user message
    setTimeout(scrollToBottom, 100);

    try {
      // Convert messages to API format
      const apiMessages = [...messages, userMessage].map((m) => ({
        id: m.id,
        role: m.role,
        parts: [{ type: "text" as const, text: m.content }],
      }));

      const response = await fetch("/api/demo/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          botType: selectedExec,
        }),
      });

      if (response.status === 429) {
        const data = await response.json();
        setRateLimitHit(true);
        setError(data.message);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Stream the response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "",
        botType: selectedExec,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              // Handle text delta from AI SDK
              if (data.type === "text-delta" && data.textDelta) {
                accumulatedContent += data.textDelta;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: accumulatedContent }
                      : m,
                  ),
                );
                scrollToBottom();
              }
            } catch {
              // Ignore parse errors for non-JSON lines
            }
          }
        }
      }
    } catch (err) {
      console.error("Demo chat error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  }, [input, isLoading, messages, selectedExec, scrollToBottom, rateLimitHit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getExecutiveInfo = (botType: BotType) => {
    if (botType === "alexandria") {
      return {
        name: content.executives.alex_name,
        title: content.executives.alex_role,
        image: content.executives.alex_image,
      };
    }
    if (botType === "kim") {
      return {
        name: content.executives.kim_name,
        title: content.executives.kim_role,
        image: content.executives.kim_image,
      };
    }
    return {
      name: "Alexandria & Kim",
      title: "Executive Team",
      image: content.executives.alex_image,
    };
  };

  const suggestedQuestions = [
    "What's a good go-to-market strategy for a SaaS startup?",
    "How do I improve my sales conversion rate?",
    "Help me create a brand positioning statement",
  ];

  return (
    <div className="relative w-full">
      {/* Browser Chrome */}
      <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xl shadow-stone-900/10">
        {/* Window Controls */}
        <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50/80 px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-red-400" />
            <div className="size-2.5 rounded-full bg-yellow-400" />
            <div className="size-2.5 rounded-full bg-green-400" />
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-md bg-white px-3 py-1 shadow-sm">
            <Image
              src={content.header.logo_url}
              alt="AI Boss Brainz"
              className="h-4 w-auto"
              width={80}
              height={16}
            />
            <span className="text-[11px] text-stone-500">
              app.bossybrainz.ai
            </span>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="h-[420px] overflow-hidden bg-gradient-to-b from-stone-50/30 to-white sm:h-[440px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 bg-white/95 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 shadow-sm">
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium text-stone-600">
                Try it live!
              </span>
            </div>

            {/* Executive Selector - Interactive */}
            <div className="flex items-center gap-1 rounded-full bg-stone-100 p-1">
              {[
                {
                  id: "alexandria" as const,
                  img: content.executives.alex_image,
                },
                { id: "kim" as const, img: content.executives.kim_image },
                { id: "collaborative" as const, icon: true },
              ].map((exec) => (
                <button
                  key={exec.id}
                  type="button"
                  onClick={() => setSelectedExec(exec.id)}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full transition-all",
                    selectedExec === exec.id
                      ? "bg-white shadow-sm ring-1 ring-stone-200"
                      : "hover:bg-stone-200/50",
                  )}
                  title={
                    exec.id === "alexandria"
                      ? content.executives.alex_name
                      : exec.id === "kim"
                        ? content.executives.kim_name
                        : "Both Executives"
                  }
                >
                  {exec.icon ? (
                    <div className="flex -space-x-1">
                      <Image
                        src={content.executives.alex_image}
                        className="size-4 rounded-full border border-white"
                        alt=""
                        width={16}
                        height={16}
                      />
                      <Image
                        src={content.executives.kim_image}
                        className="size-4 rounded-full border border-white"
                        alt=""
                        width={16}
                        height={16}
                      />
                    </div>
                  ) : (
                    <Image
                      src={exec.img as string}
                      className="size-6 rounded-full"
                      alt=""
                      width={24}
                      height={24}
                    />
                  )}
                </button>
              ))}
            </div>

            <Link
              href="/login"
              className="flex h-8 items-center gap-1.5 rounded-lg bg-gradient-to-br from-red-500 to-red-600 px-3 text-xs font-medium text-white shadow-sm transition-all hover:from-red-600 hover:to-red-700"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Messages Area */}
          <div className="h-[calc(100%-140px)] space-y-4 overflow-y-auto p-4">
            {/* Empty state with suggestions */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full flex-col items-center justify-center text-center"
              >
                <div className="mb-4 flex -space-x-3">
                  <Image
                    src={content.executives.alex_image}
                    className="size-12 rounded-full border-2 border-white shadow-lg"
                    alt=""
                    width={48}
                    height={48}
                  />
                  <Image
                    src={content.executives.kim_image}
                    className="size-12 rounded-full border-2 border-white shadow-lg"
                    alt=""
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-stone-800">
                  Try it yourself!
                </h3>
                <p className="mb-4 max-w-xs text-sm text-stone-500">
                  Ask our AI executives anything about marketing, sales, or
                  business strategy.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setInput(q)}
                      className="rounded-full bg-stone-100 px-3 py-1.5 text-xs text-stone-600 transition-colors hover:bg-stone-200"
                    >
                      {q.length > 40 ? `${q.slice(0, 40)}...` : q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "flex w-full",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {message.role === "assistant" ? (
                    <div className="max-w-[90%] sm:max-w-[85%]">
                      <div className="relative flex flex-col gap-2 rounded-2xl border border-stone-200 bg-gradient-to-br from-white to-stone-50/50 px-4 py-3 shadow-sm">
                        <div className="absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-gradient-to-b from-rose-400 to-rose-600" />

                        <div className="flex items-center gap-2.5 pl-3">
                          <div className="relative">
                            <Image
                              src={
                                getExecutiveInfo(
                                  message.botType || "collaborative",
                                ).image
                              }
                              alt=""
                              className="size-8 rounded-full border-2 border-rose-100 shadow-sm"
                              width={32}
                              height={32}
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-green-500" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-stone-800">
                              {
                                getExecutiveInfo(
                                  message.botType || "collaborative",
                                ).name
                              }
                            </div>
                            <div className="text-[11px] text-stone-500">
                              {
                                getExecutiveInfo(
                                  message.botType || "collaborative",
                                ).title
                              }
                            </div>
                          </div>
                        </div>

                        <div className="pl-3 text-xs leading-relaxed text-stone-700">
                          {message.content ? (
                            message.content.split("\n").map((line, i) => (
                              <span key={i}>
                                {formatBoldText(line)}
                                {i < message.content.split("\n").length - 1 && (
                                  <br />
                                )}
                              </span>
                            ))
                          ) : (
                            <span className="flex items-center gap-2 text-stone-500">
                              <Loader2 className="size-3 animate-spin" />
                              Thinking...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-[85%] rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm text-stone-800 shadow-sm sm:max-w-[70%]">
                      {message.content}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[85%]">
                  <div className="relative flex flex-col gap-2 rounded-2xl border border-stone-200 bg-gradient-to-br from-white to-stone-50/50 px-4 py-3 shadow-sm">
                    <div className="absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-gradient-to-b from-rose-400 to-rose-600" />
                    <div className="flex items-center gap-2.5 pl-3">
                      <Image
                        src={getExecutiveInfo(selectedExec).image}
                        alt=""
                        className="size-8 rounded-full border-2 border-rose-100 shadow-sm"
                        width={32}
                        height={32}
                      />
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.15,
                              }}
                              className="size-1.5 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 shadow-sm"
                            />
                          ))}
                        </div>
                        <span className="animate-pulse text-xs text-stone-500">
                          Crafting response...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <div className="rounded-lg bg-amber-50 px-4 py-2 text-center text-sm text-amber-800">
                  {error}
                  {rateLimitHit && (
                    <Link
                      href="/login"
                      className="ml-2 font-semibold text-red-600 underline"
                    >
                      Sign up free
                    </Link>
                  )}
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-stone-100 bg-white/80 px-4 pb-4 pt-3 backdrop-blur-xl">
            <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-sm transition-all focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-100">
              <button
                type="button"
                className="text-stone-300 cursor-not-allowed"
                disabled
                title="Attachments available in full version"
              >
                <Paperclip className="size-4" />
              </button>
              <button
                type="button"
                className="text-stone-300 cursor-not-allowed"
                disabled
                title="Voice available in full version"
              >
                <Mic className="size-4" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  rateLimitHit
                    ? "Sign up to continue..."
                    : "Ask anything about business strategy..."
                }
                disabled={rateLimitHit}
                className="flex-1 bg-transparent text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading || rateLimitHit}
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg transition-all",
                  input.trim() && !isLoading && !rateLimitHit
                    ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm hover:from-red-600 hover:to-red-700"
                    : "bg-stone-100 text-stone-400",
                )}
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-stone-400">
              {rateLimitHit
                ? "Demo limit reached"
                : `${5 - messages.filter((m) => m.role === "user").length} demo messages remaining`}
              {" | "}
              <Link href="/login" className="text-red-500 hover:underline">
                Sign up for unlimited access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
