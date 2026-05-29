// buddy-api.ts
// Connects to the Buddy RAG backend at http://localhost:8000
// Switch BUDDY_API_BASE to your hosted URL when deploying.

export const BUDDY_API_BASE =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_BUDDY_API_URL) ||
  "http://localhost:8000";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AskRequest = {
  question: string;
  limit?: number;
  subject?: string;
  topic?: string;
  difficulty?: number;
  lang?: string;
  tags?: string[];
};

export type AskSource = {
  title: string;
  content: string;
  source: string;
  score: number;
  subject: string;
  topic: string;
  subtopic: string;
  difficulty: number;
  lang: string;
  page: number | null;
  chunk_id: string;
  tags: string[];
};

export type AskResponse = {
  question: string;
  answer: string;
  sources: AskSource[];
};

export type SearchRequest = {
  query: string;
  limit?: number;
  subject?: string;
  topic?: string;
  difficulty?: number;
  lang?: string;
  tags?: string[];
};

export type ProgressDashboard = {
  summary: Record<string, unknown>;
  progress: Record<string, unknown>[];
  recent_questions: Record<string, unknown>[];
  weak_areas: Record<string, unknown>[];
  recommendations: string[];
};

// ── API calls ─────────────────────────────────────────────────────────────────

export async function askBuddy(req: AskRequest): Promise<AskResponse> {
  const res = await fetch(`${BUDDY_API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limit: 3, lang: "en", ...req }),
  });
  if (!res.ok) throw new Error(`Buddy API error: ${res.status}`);
  return res.json();
}

export async function searchContent(req: SearchRequest): Promise<AskSource[]> {
  const res = await fetch(`${BUDDY_API_BASE}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limit: 5, lang: "en", ...req }),
  });
  if (!res.ok) throw new Error(`Search error: ${res.status}`);
  return res.json();
}

export async function getProgressDashboard(): Promise<ProgressDashboard> {
  const res = await fetch(`${BUDDY_API_BASE}/progress/me`);
  if (!res.ok) throw new Error(`Progress error: ${res.status}`);
  return res.json();
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BUDDY_API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Admin calls (require X-User-Role: admin header) ───────────────────────────

export async function adminListContent(limit = 20, offset = 0) {
  const res = await fetch(
    `${BUDDY_API_BASE}/admin/content?limit=${limit}&offset=${offset}`,
    { headers: { "X-User-Role": "admin" } }
  );
  if (!res.ok) throw new Error(`Admin list error: ${res.status}`);
  return res.json();
}

export async function adminIngestText(payload: {
  title: string;
  content: string;
  source?: string;
  subject?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: number;
  lang?: string;
  tags?: string[];
}) {
  const res = await fetch(`${BUDDY_API_BASE}/ingest/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-User-Role": "admin" },
    body: JSON.stringify({ lang: "en", difficulty: 1, ...payload }),
  });
  if (!res.ok) throw new Error(`Ingest error: ${res.status}`);
  return res.json();
}
