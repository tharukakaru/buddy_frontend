import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  Globe, CheckCircle2, ChevronDown, Award, Play,
  Lock, FileText, Heart, ChevronRight,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getCourseDay, getDayQuiz, getSubjectDays, type CourseDay, type DayQuizQuestion, type SubjectDay } from "@/lib/course-api";
import { getCourseByCodeOrId, getCourseBySubject, SAMPLE_DAY, type Course } from "@/lib/courses-data";
import { BuddyChat } from "@/components/BuddyChat";
import { toast } from "sonner";
import { enrollStudent, isEnrolledDB, getProgressDB, setProgressDB } from "@/lib/supabase-enrollment";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/courses_/$courseId")({
  component: CourseDetail,
});

// ── Progress + Enrollment helpers (localStorage) ──────────────────────────────
// localStorage fallbacks (used synchronously during initial render)
function getProgressLocal(courseId: string, email: string): number {
  try { return parseInt(localStorage.getItem(`buddy_progress_${courseId}_${email}`) || "0", 10); } catch { return 0; }
}
function isEnrolledLocal(courseId: string, email: string): boolean {
  try { return localStorage.getItem(`buddy_enrolled_${courseId}_${email}`) === "1"; } catch { return false; }
}

// ── Component ─────────────────────────────────────────────────────────────────
function CourseDetail() {
  const { courseId } = Route.useParams();
  const localCourse = getCourseByCodeOrId(courseId);
  const subjectCode = localCourse?.code ?? courseId;
  const course = getCourseBySubject(courseId) ?? createFallbackCourse(subjectCode);

  const email = (typeof sessionStorage !== "undefined" && sessionStorage.getItem("buddy_email")) || "";
  const [enrolled, setEnrolled] = useState(false);
  const [completedDay, setCompletedDay] = useState(0);
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [enrollInput, setEnrollInput] = useState("");
  const [showEnrollBox, setShowEnrollBox] = useState(false);

  useEffect(() => {
    if (!course || !email) return;
    // Load from localStorage immediately for fast render
    setEnrolled(isEnrolledLocal(course.id, email));
    setCompletedDay(getProgressLocal(course.id, email));
    // Then sync from Supabase
    isEnrolledDB(course.id, email).then(v => { if (v) { setEnrolled(true); localStorage.setItem(`buddy_enrolled_${course.id}_${email}`, "1"); } });
    getProgressDB(course.id, email).then(v => { if (v > 0) { setCompletedDay(v); localStorage.setItem(`buddy_progress_${course.id}_${email}`, String(v)); } });
  }, [course?.id, email]);

  // Load days from Supabase
  const daysQuery = useQuery({
    queryKey: ["subject-days", subjectCode],
    queryFn: () => getSubjectDays(subjectCode),
    staleTime: 1000 * 60 * 5,
  });

  const displayedDays = daysQuery.data?.length
    ? daysQuery.data
    : Array.from({ length: course.days }, (_, i) => createFallbackDay(subjectCode, i + 1));

  const selectedDay = displayedDays.find((d) => d.day_number === openDay);

  const courseDayQuery = useQuery({
    queryKey: ["course-day", subjectCode, selectedDay?.day_code],
    queryFn: () => getCourseDay(subjectCode, selectedDay!.day_code),
    enabled: Boolean(enrolled && daysQuery.data?.length && selectedDay?.day_code),
    staleTime: 1000 * 60 * 5,
  });

  // FIXED: queryKey now matches "intermediate" so cache is correct
  const quizQuery = useQuery({
    queryKey: ["day-quiz", subjectCode, selectedDay?.day_code, "intermediate"],
    queryFn: () => getDayQuiz(subjectCode, selectedDay!.day_code, "intermediate"),
    enabled: Boolean(enrolled && daysQuery.data?.length && selectedDay?.day_code),
    staleTime: 1000 * 60 * 5,
  });

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Course not found.</p>
        <Link to="/courses" className="mt-4 text-sm border-b">Back to courses</Link>
      </div>
    );
  }

  const dayUnlocked = (dayNum: number) => !enrolled ? false : dayNum === 1 || dayNum <= completedDay + 1;

  const handleEnroll = () => {
    const stored = localStorage.getItem("buddy_enrollment_keys_v1");
    const keys: Record<string, { key: string }> = stored ? JSON.parse(stored) : {};
    const entry = keys[course.id];
    if (!entry) { toast.error("No enrollment key found. Contact your admin."); return; }
    if (enrollInput.trim() !== entry.key) { toast.error("Incorrect enrollment key. Check with your teacher."); return; }
    enrollStudent(course.id, email);
    setEnrolled(true);
    setShowEnrollBox(false);
    toast.success("Enrolled! Day 1 is now unlocked.");
    setOpenDay(1);
  };

  const handleCompleteDay = (day: number) => {
    if (day > completedDay) { setProgressDB(course.id, email, day); setCompletedDay(day); }
    if (day < displayedDays.length) {
      toast.success(`Day ${day} complete! Day ${day + 1} unlocked.`);
      setOpenDay(day + 1);
    } else {
      toast.success("🎉 Course complete!");
    }
  };

  const totalSections = displayedDays.length;

  return (
    <div className="bg-background">
      <SiteNav variant="light" mode="pill" />
      <Toaster />

      {/* Dark hero */}
      <section className="bg-[#1c1d1f] text-white pt-28 pb-10">
        <div className="mx-auto max-w-6xl px-6 md:px-10 grid md:grid-cols-[1.4fr_360px] gap-10">
          <div>
            <div className="text-[12px] text-white/65 mb-3">
              <Link to="/courses" className="text-[#cec0fc] hover:underline">Courses</Link>
              <span className="mx-2">›</span>
              <span className="text-[#cec0fc]">{course.category.split(" / ")[0]}</span>
              <span className="mx-2">›</span>
              <span>{course.title}</span>
            </div>
            <h1 className="font-serif text-3xl md:text-[34px] leading-tight mb-3">{course.title}</h1>
            {course.siTitle && <p className="font-sinhala text-lg text-white/75 mb-3">{course.siTitle}</p>}
            <p className="text-white/85 text-[15px] leading-relaxed mb-4">
              {course.longDesc || `${course.desc} Understand how it works and leverage this course to transform your career.`}
            </p>
            {course.tag && (
              <span className="inline-block bg-[#fff3c4] text-[#5b3d00] px-3 py-1 text-[11px] font-bold tracking-wide mb-3 leading-tight">
                {course.tag === "Bestseller" ? "Be grateful for free education given by Jinasena Padanama" : course.tag}
              </span>
            )}
            <p className="text-[13px] text-white/85 mb-2">8,567 learners enrolled</p>
            <p className="text-[13px] text-white/85 mb-2">Created by <span className="text-[#cec0fc] underline">Jinasena Padanama</span></p>
            <div className="flex flex-wrap items-center gap-4 text-[12px] text-white/80">
              <span>Last updated 1/2026</span>
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> English</span>
              <span>Sinhala [Auto]</span>
            </div>
          </div>

          {/* Enroll card */}
          <aside className="bg-white text-foreground shadow-2xl self-start">
            <div className="aspect-video bg-muted relative overflow-hidden cursor-pointer group">
              <img src={course.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 flex flex-col items-center justify-center text-white transition-colors">
                <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center mb-2">
                  <Play className="w-5 h-5 fill-foreground text-foreground ml-0.5" />
                </div>
                <span className="text-sm font-semibold">Preview this course</span>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {enrolled ? (
                <div className="text-center py-2">
                  <div className="text-sm font-bold text-green-700 mb-1">✓ You are enrolled</div>
                  <div className="text-[12px] text-muted-foreground">Day {completedDay} of {totalSections} completed</div>
                  <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent transition-all" style={{ width: `${Math.round((completedDay / totalSections) * 100)}%` }} />
                  </div>
                </div>
              ) : !showEnrollBox ? (
                <button onClick={() => setShowEnrollBox(true)}
                  className="w-full bg-[#a435f0] hover:bg-[#8710d8] text-white py-3 text-sm font-bold transition-colors">
                  Enroll with Key
                </button>
              ) : (
                <div className="space-y-2">
                  <label className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">6-digit enrollment key</label>
                  <input type="text" inputMode="numeric" maxLength={6}
                    value={enrollInput} onChange={e => setEnrollInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    className="w-full border border-border rounded px-4 py-2.5 text-center font-mono tracking-[0.5em] text-lg focus:outline-none focus:border-accent" />
                  <p className="text-[11px] text-muted-foreground">Get this key from your teacher.</p>
                  <button onClick={handleEnroll}
                    className="w-full bg-[#a435f0] hover:bg-[#8710d8] text-white py-2.5 text-sm font-bold transition-colors">
                    Confirm Enrollment
                  </button>
                  <button onClick={() => setShowEnrollBox(false)}
                    className="w-full border border-border py-2 text-xs text-muted-foreground hover:bg-secondary">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 md:px-10 py-12 grid md:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-10 md:pr-6 max-w-3xl">

          {/* What you'll learn */}
          <div className="border border-border p-6">
            <h2 className="text-xl font-bold mb-4">What you'll learn</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {(course.whatYouLearn.length ? course.whatYouLearn : [
                "Build solid foundations from day one",
                "Apply concepts directly on the workshop floor",
                "Pass NVQ-style assessments with confidence",
                "Use Buddy AI as your always-on tutor",
                "Master daily practice routines",
                "Earn a recognized certificate",
              ]).map((x) => (
                <div key={x} className="flex gap-2 text-[13px]"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /><span>{x}</span></div>
              ))}
            </div>
          </div>

          {/* Course content */}
          <div>
            <h2 className="text-xl font-bold mb-1">Course content</h2>
            <div className="flex items-center justify-between mb-3 text-[13px]">
              <span>{totalSections} sections · {totalSections * 15} lectures · {course.hours}h total</span>
            </div>

            {!enrolled && (
              <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded text-[13px] text-amber-800 flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0" /> Enroll with your teacher's key to unlock course sections.
              </div>
            )}

            {daysQuery.isLoading && <div className="px-4 py-3 text-[13px] text-muted-foreground border border-border">Loading live course modules...</div>}
            {daysQuery.isError && <div className="px-4 py-3 text-[13px] text-red-600 border border-border">Could not load live modules. Showing sample content.</div>}

            <div className="border border-border">
              {displayedDays.map((day) => {
                const isOpen = openDay === day.day_number;
                const unlocked = dayUnlocked(day.day_number);
                const done = day.day_number <= completedDay;

                return (
                  <div key={day.day_id} className={`border-b border-border last:border-b-0 ${isOpen && enrolled ? "ring-2 ring-inset ring-accent/30" : ""}`}>
                    <button
                      onClick={() => unlocked && setOpenDay(isOpen ? null : day.day_number)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 transition-colors bg-secondary/40 ${unlocked ? "hover:bg-[#f7f9fa] cursor-pointer" : "cursor-not-allowed opacity-60"}`}>
                      <div className="flex items-center gap-3 text-left">
                        {done
                          ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                          : unlocked
                            ? <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                            : <Lock className="w-4 h-4 text-muted-foreground shrink-0" />}
                        <span className="font-bold text-[14px]">
                          Day {day.day_number}: {getDayTitle(day)}
                          {done && <span className="ml-2 text-[11px] font-normal text-green-600">Complete</span>}
                        </span>
                      </div>
                      <span className="text-[13px] text-muted-foreground">15 lectures · 8h · Quiz</span>
                    </button>

                    {isOpen && unlocked && (
                      <DayContentRows
                        day={day}
                        courseDay={courseDayQuery.data}
                        isLoading={courseDayQuery.isLoading}
                        usesLiveData={Boolean(daysQuery.data?.length)}
                        quizQuestions={quizQuery.data}
                        isQuizLoading={quizQuery.isLoading}
                        isDone={done}
                        onComplete={() => handleCompleteDay(day.day_number)}
                        hasNext={day.day_number < displayedDays.length}
                        onNext={() => { setOpenDay(day.day_number + 1); }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h2 className="text-xl font-bold mb-3">Requirements</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-[14px]">
              <li>No prior experience needed — Buddy AI guides you from zero.</li>
              <li>A laptop or smartphone with internet access.</li>
              <li>8 hours per day of focused study time recommended.</li>
            </ul>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold mb-3">Description</h2>
            <p className="text-[14px] leading-[1.8] text-foreground/85">
              {course.longDesc || `This course is part of the Buddy JIT programme — adapted for Sri Lankan learners in Sinhala. Each day blends theory, hands-on practice, and a 15-MCQ quiz.`}
            </p>
          </div>

          {/* Instructor */}
          <div>
            <h2 className="text-xl font-bold mb-4">Instructor</h2>
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-foreground shrink-0" />
              <div>
                <p className="text-[#5624d0] font-bold underline text-[15px]">Jinasena Padanama</p>
                <p className="text-[13px] text-muted-foreground mb-2">Knowledge companion for Sri Lanka</p>
                <p className="text-[12px] text-foreground/80">★ 4.6 Rating · 12,431 Reviews · 35,000 Students</p>
              </div>
            </div>
          </div>
        </div>
        <aside className="hidden md:block" />
      </div>

      <BuddyChat subject={subjectCode} />
      <SiteFooter />
    </div>
  );
}

function createFallbackCourse(subjectCode: string): Course {
  return { id: subjectCode.toLowerCase(), code: subjectCode, title: subjectCode, desc: "Buddy JIT course.", category: "Foundation", hours: 96, days: 12, level: "All Levels", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80", longDesc: "", whatYouLearn: [], includes: [] };
}

function createFallbackDay(subjectCode: string, dayNumber: number): SubjectDay {
  return { day_id: `${subjectCode}-${dayNumber}`, subject_code: subjectCode, day_number: dayNumber, day_code: `day-${dayNumber}`, title: dayNumber === 1 ? SAMPLE_DAY.topic : `Module ${dayNumber}`, title_si: null, title_en: dayNumber === 1 ? SAMPLE_DAY.topic : `Module ${dayNumber}`, phase: null, intro_text: dayNumber === 1 ? SAMPLE_DAY.intro : null, summary_text: dayNumber === 1 ? SAMPLE_DAY.summary : null };
}

function getDayTitle(day: SubjectDay) {
  return day.title_en || day.title || day.title_si || `Module ${day.day_number}`;
}

function bilingualTitle(si: string | null | undefined, en: string | null | undefined, fallback: string) {
  const primary = si || en || fallback;
  return en && en !== primary ? `${primary} · ${en}` : primary;
}

function lessonNumber(dayNumber: number, section: number, item?: number) {
  const prefix = `${String(dayNumber).padStart(2, "0")}.${String(section).padStart(2, "0")}`;
  return item ? `${prefix}.${String(item).padStart(2, "0")}` : prefix;
}

function DayContentRows({ day, courseDay, isLoading, usesLiveData, quizQuestions, isQuizLoading, isDone, onComplete, hasNext, onNext }: {
  day: SubjectDay; courseDay?: CourseDay | null; isLoading: boolean; usesLiveData: boolean;
  quizQuestions?: DayQuizQuestion[]; isQuizLoading: boolean;
  isDone: boolean; onComplete: () => void; hasNext: boolean; onNext: () => void;
}) {
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const toggle = (id: string) => setActiveLesson(cur => cur === id ? null : id);

  if (isLoading) return <div className="px-5 py-4 text-[13px] text-muted-foreground bg-white">Loading lesson content...</div>;

  const footer = (
    <div className={`px-5 py-4 border-t border-border flex items-center justify-between ${isDone ? "bg-green-50" : "bg-secondary/20"}`}>
      {isDone ? (
        <>
          <span className="text-[13px] text-green-700 font-medium">✓ Day {day.day_number} complete</span>
          {hasNext && <button onClick={onNext} className="flex items-center gap-2 bg-accent text-foreground text-[12px] font-bold px-5 py-2.5">Go to Day {day.day_number + 1} <ChevronRight className="w-4 h-4" /></button>}
        </>
      ) : (
        <>
          <span className="text-[13px] text-muted-foreground">Finish Day {day.day_number} to unlock next</span>
          <button onClick={onComplete} className="flex items-center gap-2 bg-accent text-foreground text-[12px] font-bold px-5 py-2.5">Mark Complete & Continue <ChevronRight className="w-4 h-4" /></button>
        </>
      )}
    </div>
  );

  if (!courseDay) {
    return (
      <div className="bg-white">
        <Row icon={<Play className="w-3.5 h-3.5" />} title={`${lessonNumber(day.day_number, 1)} ${getDayTitle(day)}`} preview={day.day_number === 1} right="Intro" expanded={activeLesson === "intro"} onClick={() => toggle("intro")} />
        {activeLesson === "intro" && <InlineLessonPanel><p className="text-[14px] leading-7">{day.intro_text || SAMPLE_DAY.intro}</p></InlineLessonPanel>}
        {day.day_number === 1 && SAMPLE_DAY.subTopics.map((topic, i) => (
          <Row key={topic} icon={<Play className="w-3.5 h-3.5" />} title={`${lessonNumber(day.day_number, 2, i + 1)} ${topic}`} right="Sample" locked={!isDone && i > 1} />
        ))}
        <Row icon={<FileText className="w-3.5 h-3.5" />} title={`${lessonNumber(day.day_number, 3)} සාරාංශය · Summary`} right="Summary" locked={!isDone} />
        <Row icon={<Award className="w-3.5 h-3.5" />} title={`${lessonNumber(day.day_number, 4)} ප්‍රශ්නාවලිය · Quiz`} right="Quiz" locked={!isDone} />
        {footer}
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Row icon={<Play className="w-3.5 h-3.5" />} title={`${lessonNumber(day.day_number, 1)} ${bilingualTitle(courseDay.title_si, courseDay.title_en, getDayTitle(courseDay))}`} preview right="Intro" expanded={activeLesson === "intro"} onClick={() => toggle("intro")} />
      {activeLesson === "intro" && <InlineLessonPanel>{courseDay.intro_text ? <p className="text-[14px] leading-7">{courseDay.intro_text}</p> : <p className="text-[13px] text-muted-foreground">Intro not available yet.</p>}</InlineLessonPanel>}

      {courseDay.subtopics.map((subtopic, i) => {
        const id = `subtopic-${subtopic.subtopic_id}`;
        return (
          <div key={subtopic.subtopic_id}>
            <Row icon={<Play className="w-3.5 h-3.5" />} title={`${lessonNumber(day.day_number, 2, subtopic.subtopic_order || i + 1)} ${bilingualTitle(subtopic.title_si, subtopic.title_en, subtopic.subtopic_code ?? "Lesson")}`} right={subtopic.contents.map(c => c.level).join(", ") || "Lesson"} expanded={activeLesson === id} onClick={() => toggle(id)} />
            {activeLesson === id && (
              <InlineLessonPanel>
                {subtopic.contents.length > 0 ? subtopic.contents.map(content => (
                  <section key={content.level} className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{content.level}</p>
                    {content.content_si && <p className="font-sinhala text-[14px] leading-7">{content.content_si}</p>}
                  </section>
                )) : <p className="text-[13px] text-muted-foreground">Content not available yet.</p>}
              </InlineLessonPanel>
            )}
          </div>
        );
      })}

      {courseDay.summaries.map((summary, i) => {
        const id = `summary-${i}`;
        return (
          <div key={id}>
            <Row icon={<FileText className="w-3.5 h-3.5" />} title={`${lessonNumber(day.day_number, 3, i + 1)} ${bilingualTitle(summary.topic_title_si, summary.topic_title_en, summary.topic_code ?? "Summary")}`} right={summary.level} expanded={activeLesson === id} onClick={() => toggle(id)} />
            {activeLesson === id && <InlineLessonPanel>{summary.summary_si ? <p className="font-sinhala text-[14px] leading-7">{summary.summary_si}</p> : <p className="text-[13px] text-muted-foreground">Summary not available yet.</p>}</InlineLessonPanel>}
          </div>
        );
      })}

      <Row icon={<Award className="w-3.5 h-3.5" />} title={`${lessonNumber(day.day_number, 4)} ප්‍රශ්නාවලිය · Quiz`} right={isQuizLoading ? "Loading..." : quizQuestions?.length ? `${quizQuestions.length} questions` : "Quiz"} expanded={activeLesson === "quiz"} onClick={() => toggle("quiz")} />
      {activeLesson === "quiz" && (
        <InlineLessonPanel>
          {isQuizLoading
            ? <p className="text-[13px] text-muted-foreground">Loading quiz...</p>
            : quizQuestions?.length
              ? <InteractiveQuiz questions={quizQuestions} />
              : <p className="text-[13px] text-muted-foreground">Quiz not available yet.</p>}
        </InlineLessonPanel>
      )}
      {footer}
    </div>
  );
}

function InteractiveQuiz({ questions }: { questions: DayQuizQuestion[] }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const options = Array.isArray(q?.options) ? q.options as string[] : [];
  const selected = answers[current];
  const isCorrect = selected === q?.correct_answer_index;
  const score = questions.filter((qq, i) => answers[i] === qq.correct_answer_index).length;
  const pct = Math.round((score / questions.length) * 100);

  const handleSelect = (oi: number) => {
    if (revealed) return;
    setAnswers(a => ({ ...a, [current]: oi }));
    setRevealed(true);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setRevealed(false);
    } else {
      setFinished(true);
    }
  };

  const reset = () => { setAnswers({}); setCurrent(0); setRevealed(false); setFinished(false); };

  if (finished) {
    const grade = pct >= 90 ? { label: "Excellent!", color: "#16a34a", emoji: "🏆" }
      : pct >= 70 ? { label: "Good Job!", color: "#6d28d9", emoji: "✅" }
      : pct >= 50 ? { label: "Keep Going!", color: "#d97706", emoji: "📚" }
      : { label: "Try Again", color: "#dc2626", emoji: "💪" };

    return (
      <div className="rounded-xl overflow-hidden border border-border">
        <div style={{ background: grade.color }} className="p-8 text-white text-center">
          <div className="text-5xl mb-3">{grade.emoji}</div>
          <div className="font-serif text-4xl mb-1">{pct}%</div>
          <div className="text-white/80 text-sm tracking-widest uppercase">{grade.label}</div>
          <div className="text-white/60 text-[12px] mt-1">{score} / {questions.length} correct</div>
        </div>
        <div className="p-6 bg-white space-y-3">
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: grade.color }} />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {questions.map((qq, i) => {
              const correct = answers[i] === qq.correct_answer_index;
              return (
                <div key={i} className={`flex items-center gap-2 text-[12px] px-3 py-2 rounded ${correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  <span>{correct ? "✓" : "✗"}</span>
                  <span className="font-sinhala truncate">Q{i + 1}</span>
                </div>
              );
            })}
          </div>
          <button onClick={reset}
            className="w-full mt-2 py-3 text-[11px] tracking-[0.3em] uppercase border border-foreground hover:bg-foreground hover:text-background transition-colors">
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-white">
      {/* Progress bar */}
      <div className="h-1 bg-secondary">
        <div className="h-full bg-[#6d28d9] transition-all duration-500" style={{ width: `${((current) / questions.length) * 100}%` }} />
      </div>

      {/* Header */}
      <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-border">
        <span className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground">
          Question {current + 1} of {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
              i < current ? (answers[i] === questions[i].correct_answer_index ? "bg-green-500" : "bg-red-400")
              : i === current ? "bg-[#6d28d9]" : "bg-secondary"
            }`} />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="px-6 py-6">
        <p className="font-sinhala text-[15px] font-semibold leading-8 mb-6 text-foreground">
          {q.question_si}
        </p>

        <div className="space-y-3">
          {options.map((opt, oi) => {
            const isSelected = selected === oi;
            const isAnswer = q.correct_answer_index === oi;
            let bg = "bg-white border-border hover:border-[#6d28d9] hover:bg-[#f7f4ff]";
            let text = "text-foreground";
            if (revealed) {
              if (isAnswer) { bg = "bg-green-600 border-green-600"; text = "text-white"; }
              else if (isSelected) { bg = "bg-red-500 border-red-500"; text = "text-white"; }
              else { bg = "bg-white border-border opacity-50"; }
            } else if (isSelected) {
              bg = "bg-[#6d28d9] border-[#6d28d9]"; text = "text-white";
            }
            return (
              <button key={oi} disabled={revealed}
                onClick={() => handleSelect(oi)}
                className={`w-full text-left px-4 py-3.5 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${bg}`}>
                <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-bold shrink-0 font-mono
                  ${revealed && isAnswer ? "border-white text-white" : revealed && isSelected ? "border-white text-white" : isSelected ? "border-white text-white" : "border-current"}`}>
                  {["A","B","C","D"][oi]}
                </span>
                <span className={`font-sinhala text-[13px] leading-6 ${text}`}>{opt}</span>
                {revealed && isAnswer && <span className="ml-auto text-lg">✓</span>}
                {revealed && isSelected && !isAnswer && <span className="ml-auto text-lg">✗</span>}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {revealed && q.explanation_si && (
          <div className={`mt-4 p-4 rounded-lg text-[13px] font-sinhala leading-7 ${isCorrect ? "bg-green-50 border border-green-200 text-green-800" : "bg-orange-50 border border-orange-200 text-orange-800"}`}>
            <span className="font-bold mr-1">{isCorrect ? "✓ Correct!" : "✗ Incorrect."}</span>
            {q.explanation_si}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-5 flex items-center justify-between">
        <span className="text-[12px] text-muted-foreground">
          {revealed ? (isCorrect ? "Well done!" : "Better luck next time") : "Select an answer"}
        </span>
        {revealed && (
          <button onClick={handleNext}
            className="flex items-center gap-2 bg-[#6d28d9] hover:bg-[#5b21b6] text-white px-6 py-2.5 rounded-lg text-[12px] font-bold tracking-wide transition-colors">
            {current < questions.length - 1 ? "Next Question" : "See Results"}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function InlineLessonPanel({ children }: { children: React.ReactNode }) {
  return <div className="border-t border-border bg-[#fbfbf8] px-5 py-5 md:px-12"><div className="space-y-3 md:pl-7">{children}</div></div>;
}

function Row({ icon, title, right, preview, locked, expanded, onClick }: {
  icon: React.ReactNode; title: string; right: string; preview?: boolean; locked?: boolean; expanded?: boolean; onClick?: () => void;
}) {
  const cls = `flex w-full items-center justify-between gap-4 px-5 md:px-12 py-2.5 border-t border-border text-left text-[13px] transition-colors ${expanded ? "bg-[#f7f4ff]" : "bg-white hover:bg-[#f7f9fa]"}`;
  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        {locked ? <Lock className="w-3.5 h-3.5 text-muted-foreground" /> : <span className="text-muted-foreground">{icon}</span>}
        <span className={`min-w-0 ${locked ? "text-foreground/80" : ""}`}>{title}</span>
        {preview && <span className="text-[#5624d0] font-bold underline">Preview</span>}
      </div>
      <span className="shrink-0 text-muted-foreground">{right}</span>
    </>
  );
  if (onClick) return <button type="button" aria-expanded={expanded} onClick={onClick} className={cls}>{content}</button>;
  return <div className={cls}>{content}</div>;
}
