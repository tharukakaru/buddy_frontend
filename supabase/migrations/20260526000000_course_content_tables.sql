-- Course content tables for Buddy JIT
-- Run this in your Supabase SQL editor or add to migrations

-- Subjects table (one per course e.g. PD, EN, BC, EL...)
CREATE TABLE IF NOT EXISTS public.subjects (
  subject_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subject days (Day 1, Day 2... per subject)
CREATE TABLE IF NOT EXISTS public.subject_days (
  day_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_code TEXT NOT NULL REFERENCES public.subjects(subject_code) ON DELETE CASCADE,
  day_number INT NOT NULL,
  day_code TEXT NOT NULL UNIQUE,
  title TEXT,
  title_si TEXT,
  title_en TEXT,
  phase TEXT,
  intro_text TEXT,
  summary_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(subject_code, day_number)
);

-- Topics / subtopics per day
CREATE TABLE IF NOT EXISTS public.day_subtopics (
  subtopic_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_code TEXT NOT NULL REFERENCES public.subject_days(day_code) ON DELETE CASCADE,
  subtopic_code TEXT,
  subtopic_order INT NOT NULL DEFAULT 1,
  title_si TEXT,
  title_en TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Content per subtopic (beginner/intermediate/advanced levels)
CREATE TABLE IF NOT EXISTS public.subtopic_contents (
  content_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subtopic_id UUID NOT NULL REFERENCES public.day_subtopics(subtopic_id) ON DELETE CASCADE,
  level TEXT NOT NULL DEFAULT 'beginner',
  content_si TEXT,
  keywords JSONB DEFAULT '[]'
);

-- Day summaries
CREATE TABLE IF NOT EXISTS public.day_summaries (
  summary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_code TEXT NOT NULL REFERENCES public.subject_days(day_code) ON DELETE CASCADE,
  level TEXT NOT NULL DEFAULT 'beginner',
  topic_code TEXT,
  topic_title_si TEXT,
  topic_title_en TEXT,
  summary_si TEXT,
  key_points JSONB DEFAULT '[]'
);

-- Quiz questions per day
CREATE TABLE IF NOT EXISTS public.day_quiz_questions (
  question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_code TEXT NOT NULL REFERENCES public.subject_days(day_code) ON DELETE CASCADE,
  level TEXT NOT NULL DEFAULT 'beginner',
  question_no INT NOT NULL,
  question_si TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer_index INT NOT NULL DEFAULT 0,
  explanation_si TEXT,
  skill TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS (read-only for authenticated users)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtopic_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_quiz_questions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read course content
CREATE POLICY "Authenticated can read subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read days" ON public.subject_days FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read subtopics" ON public.day_subtopics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read contents" ON public.subtopic_contents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read summaries" ON public.day_summaries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read quiz" ON public.day_quiz_questions FOR SELECT TO authenticated USING (true);

-- RPC: get all subjects
CREATE OR REPLACE FUNCTION public.get_subjects()
RETURNS SETOF public.subjects
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT * FROM public.subjects ORDER BY subject_code; $$;

-- RPC: get days for a subject
CREATE OR REPLACE FUNCTION public.get_subject_days(p_subject_code TEXT)
RETURNS SETOF public.subject_days
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT * FROM public.subject_days WHERE subject_code = p_subject_code ORDER BY day_number; $$;

-- RPC: get full course day with subtopics and summaries
CREATE OR REPLACE FUNCTION public.get_course_day(p_subject_code TEXT, p_day_code TEXT)
RETURNS JSON
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_day public.subject_days;
  v_subtopics JSON;
  v_summaries JSON;
BEGIN
  SELECT * INTO v_day FROM public.subject_days WHERE day_code = p_day_code AND subject_code = p_subject_code;
  IF NOT FOUND THEN RETURN NULL; END IF;

  SELECT json_agg(
    json_build_object(
      'subtopic_id', s.subtopic_id,
      'subtopic_code', s.subtopic_code,
      'subtopic_order', s.subtopic_order,
      'title_si', s.title_si,
      'title_en', s.title_en,
      'contents', (
        SELECT json_agg(json_build_object('level', c.level, 'content_si', c.content_si, 'keywords', c.keywords) ORDER BY c.level)
        FROM public.subtopic_contents c WHERE c.subtopic_id = s.subtopic_id
      )
    ) ORDER BY s.subtopic_order
  ) INTO v_subtopics FROM public.day_subtopics s WHERE s.day_code = p_day_code;

  SELECT json_agg(
    json_build_object('level', sm.level, 'topic_code', sm.topic_code, 'topic_title_si', sm.topic_title_si, 'topic_title_en', sm.topic_title_en, 'summary_si', sm.summary_si, 'key_points', sm.key_points)
    ORDER BY sm.level
  ) INTO v_summaries FROM public.day_summaries sm WHERE sm.day_code = p_day_code;

  RETURN json_build_object(
    'day_id', v_day.day_id, 'subject_code', v_day.subject_code, 'day_number', v_day.day_number,
    'day_code', v_day.day_code, 'title', v_day.title, 'title_si', v_day.title_si, 'title_en', v_day.title_en,
    'phase', v_day.phase, 'intro_text', v_day.intro_text, 'summary_text', v_day.summary_text,
    'subtopics', COALESCE(v_subtopics, '[]'::json),
    'summaries', COALESCE(v_summaries, '[]'::json)
  );
END;
$$;

-- RPC: get quiz questions for a day
CREATE OR REPLACE FUNCTION public.get_day_quiz(p_subject_code TEXT, p_day_code TEXT, p_level TEXT DEFAULT 'beginner')
RETURNS SETOF public.day_quiz_questions
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT * FROM public.day_quiz_questions WHERE day_code = p_day_code AND level = p_level ORDER BY question_no; $$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_subjects() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_subject_days(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_course_day(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_day_quiz(TEXT, TEXT, TEXT) TO authenticated;
