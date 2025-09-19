import { useEffect, useRef, useState } from "react";
import { initialMessages } from "@/data/cases";
import { ChatMessage, ChatRecord, EntityExtraction } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Bot, Copy, RefreshCw, Share2, ThumbsUp, Trash2, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

function extractEntities(text: string): EntityExtraction {
  const emails = Array.from(text.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)).map((m) => m[0]);
  const phones = Array.from(text.matchAll(/\b\+?\d[\d .-]{7,}\b/g)).map((m) => m[0]);
  const crypto = Array.from(text.matchAll(/\b(bc1|[13])[A-HJ-NP-Za-km-z1-9]{25,39}\b/g)).map((m) => m[0]);
  const numbers = Array.from(text.matchAll(/\b\d+(?:\.\d+)?\b/g)).map((m) => m[0]);
  return { emails: [...new Set(emails)], phones: [...new Set(phones)], crypto: [...new Set(crypto)], numbers: [...new Set(numbers)] };
}

function highlightEntities(text: string) {
  const patterns = [
    { regex: /(bc1|[13])[A-HJ-NP-Za-km-z1-9]{25,39}/g, cls: "bg-amber-100/80 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200" },
    { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, cls: "bg-indigo-100/80 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200" },
    { regex: /\b\+?\d[\d .-]{7,}\b/g, cls: "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200" },
    { regex: /\b\d+(?:\.\d+)?\b/g, cls: "bg-sky-100/80 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200" },
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
  const { id: routeCaseId } = useParams();
  const caseId = routeCaseId ?? "";
  const apiBase = useMemo(() => {
    const fromEnv = (import.meta as any).env?.VITE_API_URL as string | undefined;
    if (fromEnv && typeof fromEnv === "string" && fromEnv.trim().length > 0) return fromEnv;
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:5000/api`;
  }, []);
  const [messages, setMessages] = useState<ChatMessage[]>(() => initialMessages[threadId] || []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiPending, setAiPending] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    if (!caseId) return;
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/chats/case/${caseId}`);
      if (!res.ok) throw new Error(`Failed to load messages (${res.status})`);
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Unexpected response (not JSON): ${text.slice(0, 120)}...`);
      }
      const data: ChatRecord[] = await res.json();
      const filtered = data.filter((d: any) => {
        const tid = d?.metadata?.threadId;
        return !threadId || tid === threadId;
      });
      const mapped: ChatMessage[] = filtered.map((d) => ({
        id: d._id,
        role: (d as any)?.metadata?.role === "assistant" ? "assistant" : "user",
        content: d.message,
        timestamp: new Date(d.timestamp ?? Date.now()).toISOString(),
      }));
      setMessages(mapped);
    } catch (err) {
      setMessages(initialMessages[threadId] || []);
      toast({ title: "Could not load messages", description: String(err instanceof Error ? err.message : err), variant: "destructive" as any });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId, threadId]);

  useEffect(() => {
    const all = messages.map((m) => m.content).join("\n");
    onEntities?.(extractEntities(all));
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight });
  }, [messages, onEntities]);

  const send = async () => {
    if (!input.trim() || !caseId) return;
    const toSend = input.trim();
    const optimistic: ChatMessage = { id: `temp-${Date.now()}`, role: "user", content: toSend, timestamp: new Date().toISOString() };
    setMessages((m) => [...m, optimistic]);
    setInput("");
    try {
      // 1) Persist user message to backend (case-based)
      const res = await fetch(`${apiBase}/chats/case`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, userId: "demo-user", message: toSend, metadata: { role: "user", threadId } }),
      });
      if (!res.ok) throw new Error(`Failed to send (${res.status})`);
      const ct1 = res.headers.get("content-type") || "";
      if (!ct1.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Unexpected response (not JSON): ${text.slice(0, 120)}...`);
      }
      const saved: ChatRecord = await res.json();
      setMessages((m) => m.map((msg) => (msg.id === optimistic.id ? { ...msg, id: saved._id } : msg)));

      // 2) Call RAG webhook and show assistant reply
      const ragUrl = "http://13.232.137.189:5678/webhook/f5bfb4b7-52b1-4c41-bab3-9b78809dec1b";
      setAiPending(true);
      const ragResp = await fetch(ragUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, userId: "demo-user", message: toSend }),
      });
      if (!ragResp.ok) throw new Error(`RAG request failed: ${ragResp.status}`);
      let ragData: any = {};
      try {
        const ragCt = ragResp.headers.get("content-type") || "";
        if (ragCt.includes("application/json")) ragData = await ragResp.json();
        else ragData = { response: await ragResp.text() };
      } catch {}
      const assistantText: string =
        (ragData && (ragData.answer ?? ragData.reply ?? ragData.response ?? ragData.message ?? ragData.text)) ?? "";
      const assistantMessage: ChatMessage = {
        id: `temp-assistant-${Date.now()}`,
        role: "assistant",
        content: assistantText || "(no response)",
        timestamp: new Date().toISOString(),
      };
      setMessages((m) => [...m, assistantMessage]);

      // 3) Persist assistant reply to backend (case-based)
      if (assistantText) {
        const saveAI = await fetch(`${apiBase}/chats/case`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caseId, userId: "assistant", message: assistantText, metadata: { role: "assistant", source: "rag", threadId } }),
        });
        if (saveAI.ok) {
          const ct2 = saveAI.headers.get("content-type") || "";
          const savedAI: ChatRecord = ct2.includes("application/json") ? await saveAI.json() : ({} as any);
          setMessages((m) => m.map((msg) => (msg.id === assistantMessage.id ? { ...msg, id: savedAI._id } : msg)));
        }
      }
    } catch (err) {
      toast({ title: "Send failed", description: String(err instanceof Error ? err.message : err), variant: "destructive" as any });
    }
    finally {
      setAiPending(false);
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`${apiBase}/chats/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setMessages((m) => m.filter((x) => x.id !== id));
    } catch (err) {
      toast({ title: "Delete failed", description: String(err instanceof Error ? err.message : err), variant: "destructive" as any });
    }
  };

  return (
    <section className="flex h-full flex-1 flex-col glass elev rounded-xl" data-loc="components/case/ChatPanel">
      <div className="border-b glass elev p-3 rounded-b-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-muted-foreground">AI Forensic Assistant</div>
            <p className="text-sm text-foreground/80">Ask questions about evidence, entities, or patterns.</p>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 rounded-md border border-border bg-card/90 backdrop-blur px-3 py-1.5 text-xs text-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm hover:shadow" disabled={loading}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-16rem)]" ref={viewportRef as any}>
        <motion.div
          className="space-y-4 px-6 py-6"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
        >
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                className="flex items-start gap-3"
                variants={{ hidden: { opacity: 0, y: 8, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1 } }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <div className="mt-1 rounded-full bg-muted p-2 text-muted-foreground shadow-sm">
                  {m.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={m.role === "user" ? "max-w-3xl rounded-2xl p-3 text-primary-foreground bg-gradient-to-br from-primary to-brand shadow-md transition-transform hover:translate-y-[-1px]" : "max-w-3xl rounded-2xl border glass p-3 elev transition-transform hover:translate-y-[-1px]"}>
                  <div className="prose prose-sm max-w-none">
                    <p className={m.role === "user" ? "leading-relaxed" : "leading-relaxed text-foreground/90"}>{highlightEntities(m.content)}</p>
                  </div>
                  {m.role === "assistant" && (
                    <div className="mt-2 flex items-center gap-3 text-muted-foreground">
                      <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} className="hover:text-foreground transition-colors"><Copy className="h-4 w-4" /></motion.button>
                      <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} className="hover:text-foreground transition-colors"><Share2 className="h-4 w-4" /></motion.button>
                      <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} className="hover:text-foreground transition-colors"><ThumbsUp className="h-4 w-4" /></motion.button>
                    </div>
                  )}
                  <div className="mt-2 flex justify-end">
                    <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} onClick={() => remove(m.id)} title="Delete" className="text-muted-foreground hover:text-foreground transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
            {aiPending && (
              <motion.div
                key="ai-typing"
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.28 }}
              >
                <div className="mt-1 rounded-full bg-muted p-2 text-muted-foreground shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="max-w-3xl rounded-2xl border glass p-3 elev">
                  <div className="h-4 w-40 rounded bg-muted/80 animate-pulse" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </ScrollArea>
      <div className="border-t glass elev p-3 rounded-t-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about evidence, search for entities, or request analysis..."
            className="h-12 rounded-xl glass elev border border-white/40 placeholder:text-foreground/50 focus-visible:ring-2 focus-visible:ring-brand/40"
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            disabled={loading}
          />
          <motion.button
            onClick={send}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center h-12 rounded-xl px-5 shadow-md hover:shadow-lg transition-all active:scale-[0.98] bg-primary text-primary-foreground"
            disabled={loading || !input.trim()}
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
