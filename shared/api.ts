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
  id: string; // e.g., CASE-2024-0012
  date: string; // ISO string
  status: CaseStatus;
  description: string;
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
  role: "user" | "ai";
  content: string;
  timestamp: string; // ISO
  threadId?: string;
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
