import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, BookOpen } from "lucide-react";
import { askBuddy, type AskResponse } from "@/lib/buddy-api";

type Message = {
  id: string;
  role: "user" | "buddy";
  text: string;
  sources?: AskResponse["sources"];
};

export function BuddyChat({ subject }: { subject?: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "buddy",
      text: "හෙලෝ! මම Buddy. ඔබේ ඕනෑම ප්‍රශ්නයකට පිළිතුරු දෙන්නට සූදානම්. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");

    const userMsg: Message = { id: Date.now() + "u", role: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await askBuddy({ question: q, subject, limit: 3 });
      const buddyMsg: Message = {
        id: Date.now() + "b",
        role: "buddy",
        text: res.answer,
        sources: res.sources?.slice(0, 2),
      };
      setMessages((prev) => [...prev, buddyMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + "e",
          role: "buddy",
          text: "Sorry, I couldn't connect to the Buddy backend right now. Make sure the backend server is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full bg-accent text-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Ask Buddy AI"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[199] w-[360px] max-h-[560px] bg-white border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#1c1d1f] text-white">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-foreground">B</div>
            <div>
              <div className="text-sm font-semibold">Buddy AI</div>
              <div className="text-[10px] text-white/60">Your knowledge companion</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-accent text-foreground rounded-br-sm"
                      : "bg-[#f5f5f5] text-foreground rounded-bl-sm"
                  }`}
                >
                  <p className={m.role === "buddy" ? "font-sinhala" : ""}>{m.text}</p>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 space-y-1 border-t border-border/40 pt-2">
                      {m.sources.map((s) => (
                        <div key={s.chunk_id} className="flex items-start gap-1 text-[11px] text-muted-foreground">
                          <BookOpen className="w-3 h-3 shrink-0 mt-0.5" />
                          <span className="truncate">{s.title || s.source}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#f5f5f5] rounded-2xl rounded-bl-sm px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask anything..."
              className="flex-1 text-[13px] bg-[#f5f5f5] rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center disabled:opacity-40 hover:bg-accent/80 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
