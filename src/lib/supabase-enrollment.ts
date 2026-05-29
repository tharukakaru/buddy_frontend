// ── Supabase enrollment + progress helpers ──────────────────────────────────
// Uses (supabase as any) to bypass stale generated types.

import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

// ── Enrollment ──────────────────────────────────────────────────────────────

export async function enrollStudent(courseId: string, email: string) {
  try {
    await db.from("enrollments").upsert({ email, course_id: courseId }, { onConflict: "email,course_id" });
  } catch {}
  try { localStorage.setItem(`buddy_enrolled_${courseId}_${email}`, "1"); } catch {}
}

export async function isEnrolledDB(courseId: string, email: string): Promise<boolean> {
  try {
    const { data } = await db.from("enrollments").select("id").eq("email", email).eq("course_id", courseId).maybeSingle();
    if (data) return true;
  } catch {}
  try { return localStorage.getItem(`buddy_enrolled_${courseId}_${email}`) === "1"; } catch { return false; }
}

export async function getEnrolledCoursesDB(email: string): Promise<string[]> {
  try {
    const { data } = await db.from("enrollments").select("course_id").eq("email", email);
    if (data?.length) return data.map((r: any) => r.course_id);
  } catch {}
  return [];
}

// ── Progress ────────────────────────────────────────────────────────────────

export async function getProgressDB(courseId: string, email: string): Promise<number> {
  try {
    const { data } = await db.from("students").select("course_progress").eq("email", email).maybeSingle();
    if (data?.course_progress) {
      return (data.course_progress as Record<string, number>)[courseId] ?? 0;
    }
  } catch {}
  try { return parseInt(localStorage.getItem(`buddy_progress_${courseId}_${email}`) || "0", 10); } catch { return 0; }
}

export async function setProgressDB(courseId: string, email: string, day: number) {
  try {
    const { data } = await db.from("students").select("course_progress").eq("email", email).maybeSingle();
    const current: Record<string, number> = (data?.course_progress as Record<string, number>) ?? {};
    current[courseId] = day;
    await db.from("students").update({ course_progress: current }).eq("email", email);
  } catch {}
  try { localStorage.setItem(`buddy_progress_${courseId}_${email}`, String(day)); } catch {}
}
