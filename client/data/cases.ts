import { ForensicCase, CaseThread, EvidenceItem, ChatMessage } from "@shared/api";

export const cases: ForensicCase[] = [
  {
    id: "CASE-2024-0012",
    date: "2025-08-14T09:12:00Z",
    status: "Open",
    description: "Suspected crypto fraud across multiple wallets and emails.",
  },
  {
    id: "CASE-2024-0013",
    date: "2025-06-21T10:00:00Z",
    status: "In Review",
    description: "Industrial espionage involving leaked documents and calls.",
  },
  {
    id: "CASE-2024-0014",
    date: "2025-03-05T16:45:00Z",
    status: "On Hold",
    description: "Harassment case analyzing chat transcripts and media.",
  },
  {
    id: "CASE-2024-0015",
    date: "2025-01-11T13:30:00Z",
    status: "Closed",
    description: "Ransomware negotiation transcript and payment tracing.",
  },
];

export const caseThreads: Record<string, CaseThread[]> = {
  "CASE-2024-0012": [
    { id: "t1", title: "Telegram: BTC tips", category: "Chats", snippet: "Send to bc1q..." },
    { id: "t2", title: "WhatsApp: Purchase", category: "Chats", snippet: "Wire 5,000 by Fri" },
    { id: "t3", title: "Call log 05/05", category: "Calls", snippet: "short call 2m" },
    { id: "t4", title: "Wallet screenshot", category: "Media", snippet: "balance 3.1 BTC" },
    { id: "t5", title: "Invoice.pdf", category: "Documents", snippet: "Vendor reference" },
  ],
  "CASE-2024-0013": [
    { id: "t6", title: "Slack thread", category: "Chats" },
    { id: "t7", title: "Voicemail", category: "Calls" },
  ],
  "CASE-2024-0014": [
    { id: "t8", title: "Instagram DM", category: "Chats" },
  ],
  "CASE-2024-0015": [
    { id: "t9", title: "Negotiation chat", category: "Chats" },
    { id: "t10", title: "Payment receipt", category: "Documents" },
  ],
};

export const evidenceItems: Record<string, EvidenceItem[]> = {
  "CASE-2024-0012": [
    { id: "e1", category: "Chats", title: "Telegram export", meta: "134 msgs" },
    { id: "e2", category: "Chats", title: "WhatsApp thread", meta: "57 msgs" },
    { id: "e3", category: "Calls", title: "Call log May", meta: "12 calls" },
    { id: "e4", category: "Media", title: "Wallet.png", meta: "512 KB" },
    { id: "e5", category: "Documents", title: "Invoice.pdf", meta: "2 pages" },
  ],
};

export const initialMessages: Record<string, ChatMessage[]> = {
  t1: [
    {
      id: "m1",
      role: "assistant",
      content:
        "Hello investigator. Ask me things like: Find all chats about Bitcoin, list emails, or summarize transfers over $1,000.",
      timestamp: new Date().toISOString(),
    },
    {
      id: "m2",
      role: "user",
      content: "Find all chats about Bitcoin and list wallet addresses.",
      timestamp: new Date().toISOString(),
    },
    {
      id: "m3",
      role: "assistant",
      content:
        "I found mentions: 'btc', address bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh, and email contact: ops@cryptohub.io. Two amounts: 0.75 and 2.35 BTC.",
      timestamp: new Date().toISOString(),
    },
  ],
};
