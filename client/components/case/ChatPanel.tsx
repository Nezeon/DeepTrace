import { useEffect, useMemo, useRef, useState } from "react";
import { initialMessages } from "@/data/cases";
import { ChatMessage, EntityExtraction } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

function extractEntities(text: string): EntityExtraction {
  const emails = Array.from(text.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)).map((m) => m[0]);
  const phones = Array.from(text.matchAll(/\b\+?\d[\d .-]{7,}\b/g)).map((m) => m[0]);
  const crypto = Array.from(text.matchAll(/\b(bc1|[13])[A-HJ-NP-Za-km-z1-9]{25,39}\b/g)).map((m) => m[0]);
  const numbers = Array.from(text.matchAll(/\b\d+(?:\.\d+)?\b/g)).map((m) => m[0]);
  return { emails: [...new Set(emails)], phones: [...new Set(phones)], crypto: [...new Set(crypto)], numbers: [...new Set(numbers)] };
}

function highlightEntities(text: string) {
  const patterns = [
    { regex: /(bc1|[13])[A-HJ-NP-Za-km-z1-9]{25,39}/g, cls: "bg-amber-100/80 text-amber-800" },
    { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, cls: "bg-indigo-100/80 text-indigo-800" },
    { regex: /\b\+?\d[\d .-]{7,}\b/g, cls: "bg-emerald-100/80 text-emerald-800" },
    { regex: /\b\d+(?:\.\d+)?\b/g, cls: "bg-sky-100/80 text-sky-800" },
  ];
  let parts: (string | JSX.Element)[] = [text];
  patterns.forEach(({ regex, cls }) => {
    const newParts: (string | JSX.Element)[] = [];
    parts.forEach((p) => {
      if (typeof p !== "string") return newParts.push(p);
      let lastIndex = 0;
      for (const m of p.matchAll(regex)) {
        const start = m.index ?? 0;
        if (start > lastIndex) newParts.push(p.slice(lastIndex, start));
        newParts.push(
          <mark key={`${m[0]}-${start}-${cls}`} className={`rounded px-1 ${cls}`}>
            {m[0]}
          </mark>,
        );
        lastIndex = start + m[0].length;
      }
      if (lastIndex < p.length) newParts.push(p.slice(lastIndex));
    });
    parts = newParts;
  });
  return parts;
}

interface Props {
  threadId: string;
  onEntities?: (e: EntityExtraction) => void;
}

export default function ChatPanel({ threadId, onEntities }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => initialMessages[threadId] || []);
  const [input, setInput] = useState("");
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages[threadId] || []);
  }, [threadId]);

  useEffect(() => {
    const all = messages.map((m) => m.content).join("\n");
    onEntities?.(extractEntities(all));
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight });
  }, [messages, onEntities]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: `${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      const ents = extractEntities(userMsg.content);
      const summaryBits: string[] = [];
      if (ents.emails.length) summaryBits.push(`emails: ${ents.emails.join(", ")}`);
      if (ents.crypto.length) summaryBits.push(`crypto: ${ents.crypto.join(", ")}`);
      if (ents.phones.length) summaryBits.push(`phones: ${ents.phones.join(", ")}`);
      const aiText =
        summaryBits.length > 0
          ? `I extracted ${summaryBits.join("; ")}. I will cross-reference in all threads.`
          : `I'll analyze the dataset for: "${userMsg.content}" and return findings.`;
      const aiMsg: ChatMessage = {
        id: `${Date.now()}-ai`,
        role: "ai",
        content: aiText,
        timestamp: new Date().toISOString(),
      };
      setMessages((m) => [...m, aiMsg]);
    }, 500);
  };

  return (
    <section className="flex h-full flex-1 flex-col" data-loc="components/case/ChatPanel">
      <ScrollArea className="h-[calc(100vh-14rem)]" ref={viewportRef as any}>
        <div className="space-y-4 px-6 py-4">
          {messages.map((m) => (
            <div key={m.id} className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-muted p-2 text-muted-foreground">
                {m.role === "ai" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className="max-w-3xl rounded-lg border bg-white p-3 shadow-sm">
                <div className="prose prose-sm max-w-none text-foreground/90">
                  <p className="leading-relaxed">{highlightEntities(m.content)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t bg-white p-3">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about this case (e.g., Find chats about Bitcoin)"
            className="h-12 rounded-xl"
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
          />
          <Button onClick={send} className="h-12 rounded-xl px-5">
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
