import type { PostgrestError } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export type Subject = {
  subject_id: string;
  subject_code: string;
  title: string;
  created_at: string;
};

export type SubjectDay = {
  day_id: string;
  subject_code: string;
  day_number: number;
  day_code: string;
  title: string | null;
  title_si: string | null;
  title_en: string | null;
  phase: string | null;
  intro_text: string | null;
  summary_text: string | null;
};

export type DaySummary = {
  level: string;
  topic_code: string | null;
  topic_title_si: string | null;
  topic_title_en: string | null;
  summary_si: string | null;
  key_points: Json;
};

export type SubtopicContent = {
  level: string;
  content_si: string | null;
  keywords: Json;
};

export type CourseSubtopic = {
  subtopic_id: string;
  subtopic_code: string | null;
  subtopic_order: number;
  title_si: string | null;
  title_en: string | null;
  contents: SubtopicContent[];
};

export type CourseDay = SubjectDay & {
  summaries: DaySummary[];
  subtopics: CourseSubtopic[];
};

export type DayQuizQuestion = {
  question_no: number;
  question_si: string;
  options: Json;
  correct_answer_index: number;
  explanation_si: string | null;
  skill: string | null;
};

type RpcClient = {
  rpc<T>(
    fn: string,
    args?: Record<string, unknown>,
  ): Promise<{ data: T | null; error: PostgrestError | null }>;
};

async function callRpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await (supabase as unknown as RpcClient).rpc<T>(fn, args);

  if (error) {
    throw new Error(`${fn} failed: ${error.message}`);
  }

  return data as T;
}

export function getSubjects() {
  return callRpc<Subject[]>("get_subjects");
}

export function getSubjectDays(subjectCode: string) {
  return callRpc<SubjectDay[]>("get_subject_days", {
    p_subject_code: subjectCode,
  });
}

export function getCourseDay(subjectCode: string, dayCode: string) {
  return callRpc<CourseDay | null>("get_course_day", {
    p_subject_code: subjectCode,
    p_day_code: dayCode,
  });
}

export function getDayQuiz(subjectCode: string, dayCode: string, level = "intermediate") {
  return callRpc<DayQuizQuestion[]>("get_day_quiz", {
    p_subject_code: subjectCode,
    p_day_code: dayCode,
    p_level: level,
  });
}
