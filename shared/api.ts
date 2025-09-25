/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export type CaseStatus = "Open" | "In Review" | "Closed" | "On Hold";

export interface ForensicCase {
  id: string; // uuid
  caseNo: string;
  officer: string;
  ipcFir?: string;
  title: string;
  description?: string;
  files: Array<{ name: string; size: number; status: "simulated" | "pending" }>;
  createdAt: string; // ISO
  status: CaseStatus;
}

export type EvidenceCategory = "Chats" | "Calls" | "Media" | "Documents";

export interface EvidenceItem {
  id: string;
  category: EvidenceCategory;
  title: string;
  meta?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO
  threadId?: string;
}

// Backend chat record shape
export interface ChatRecord {
  _id: string;
  caseId: string;
  userId: string;
  role: "user" | "assistant";
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: string; // ISO
}

export interface CaseThread {
  id: string;
  title: string;
  category: EvidenceCategory;
  snippet?: string;
}

export interface EntityExtraction {
  emails: string[];
  phones: string[];
  crypto: string[];
  numbers: string[];
}

export interface CaseInsights {
  summary: string;
  entities: EntityExtraction;
  timeline: { label: string; date: string }[];
}
