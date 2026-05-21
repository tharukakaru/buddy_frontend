import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Star,
  Clock,
  Users,
  Globe,
  CheckCircle2,
  ChevronDown,
  Award,
  Play,
  BookOpen,
  Lock,
  Smartphone,
  Infinity as InfinityIcon,
  FileText,
  Share2,
  Heart,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getCourseDay,
  getDayQuiz,
  getSubjectDays,
  type CourseDay,
  type DayQuizQuestion,
  type SubjectDay,
} from "@/lib/course-api";
import {
  getCourseByCodeOrId,
  getCourseBySubject,
  SAMPLE_DAY,
  type Course,
} from "@/lib/courses-data";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/courses_/$courseId")({
  component: CourseDetail,
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const localCourse = getCourseByCodeOrId(courseId);
  const subjectCode = localCourse?.title ?? courseId;
  const course = getCourseBySubject(courseId) ?? createFallbackCourse(subjectCode);
  const [openDay, setOpenDay] = useState<number | null>(1);
  const daysQuery = useQuery({
    queryKey: ["subject-days", subjectCode],
    queryFn: () => getSubjectDays(subjectCode),
    staleTime: 1000 * 60 * 5,
  });

  const displayedDays = daysQuery.data?.length
    ? daysQuery.data
    : Array.from({ length: course.days }, (_, i) => createFallbackDay(subjectCode, i + 1));
  const selectedDay = displayedDays.find((day) => day.day_number === openDay);
  const courseDayQuery = useQuery({
    queryKey: ["course-day", subjectCode, selectedDay?.day_code],
    queryFn: () => getCourseDay(subjectCode, selectedDay!.day_code),
    enabled: Boolean(daysQuery.data?.length && selectedDay?.day_code),
    staleTime: 1000 * 60 * 5,
  });
  const quizQuery = useQuery({
    queryKey: ["day-quiz", subjectCode, selectedDay?.day_code, "beginner"],
    queryFn: () => getDayQuiz(subjectCode, selectedDay!.day_code, "beginner"),
    enabled: Boolean(daysQuery.data?.length && selectedDay?.day_code),
    staleTime: 1000 * 60 * 5,
  });

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Course not found.</p>
        <Link to="/courses" className="mt-4 text-sm border-b">
          Back to courses
        </Link>
      </div>
    );
  }

  const totalSections = displayedDays.length;
  const totalLectures = totalSections * 15;

  return (
    <div className="bg-background">
      <SiteNav variant="light" />
      <Toaster />

      {/* Udemy-style dark hero */}
      <section className="bg-[#1c1d1f] text-white pt-28 pb-10">
        <div className="mx-auto max-w-6xl px-6 md:px-10 grid md:grid-cols-[1.4fr_360px] gap-10">
          <div>
            <div className="text-[12px] text-white/65 mb-3">
              <Link to="/courses" className="text-[#cec0fc] hover:underline">
                Courses
              </Link>
              <span className="mx-2">›</span>
              <span className="text-[#cec0fc]">{course.category.split(" / ")[0]}</span>
              <span className="mx-2">›</span>
              <span>{course.title}</span>
            </div>
            <h1 className="font-serif text-3xl md:text-[34px] leading-tight mb-3">
              {course.title}
            </h1>
            {course.siTitle && (
              <p className="font-sinhala text-lg text-white/75 mb-3">{course.siTitle}</p>
            )}
            <p className="text-white/85 text-[15px] leading-relaxed mb-4">
              {course.longDesc ||
                `${course.desc} Understand how it works and how to leverage this course to transform your career.`}
            </p>
            {course.tag && (
              <span className="inline-block bg-[#fff3c4] text-[#5b3d00] px-3 py-1 text-[11px] font-bold tracking-wide mb-3 leading-tight">
                {course.tag === "Bestseller"
                  ? "Be grateful for free education given by Jinasena Padanama"
                  : course.tag}
              </span>
            )}
            <p className="text-[13px] text-white/85 mb-2">8,567 learners enrolled</p>
            <p className="text-[13px] text-white/85 mb-2">
              Created by <span className="text-[#cec0fc] underline">Jinasena Padanama</span>
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[12px] text-white/80">
              <span>Last updated 1/2026</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> English
              </span>
              <span>Sinhala [Auto]</span>
            </div>
          </div>

          {/* Sticky purchase card — Udemy style */}
          <aside className="bg-white text-foreground shadow-2xl md:-mb-32 md:translate-y-0 self-start">
            <div className="aspect-video bg-muted relative overflow-hidden cursor-pointer group">
              <img
                src={course.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 flex flex-col items-center justify-center text-white transition-colors">
                <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center mb-2">
                  <Play className="w-5 h-5 fill-foreground text-foreground ml-0.5" />
                </div>
                <span className="text-sm font-semibold">Preview this course</span>
              </div>
            </div>
            <div className="p-5">
              <button
                onClick={() => toast.success("Enrolled! Day 1 unlocked.")}
                className="w-full bg-[#a435f0] hover:bg-[#8710d8] text-white py-3 text-sm font-bold transition-colors"
              >
                Enroll now
              </button>
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
              {(course.whatYouLearn.length
                ? course.whatYouLearn
                : [
                    "Build solid foundations from day one",
                    "Apply concepts directly on the workshop floor",
                    "Pass NVQ-style assessments with confidence",
                    "Use Buddy AI as your always-on tutor",
                    "Master daily practice routines",
                    "Earn a recognized certificate",
                  ]
              ).map((x) => (
                <div key={x} className="flex gap-2 text-[13px]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{x}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Topics covered */}
          <div>
            <h2 className="text-xl font-bold mb-3">Explore related topics</h2>
            <div className="flex flex-wrap gap-2">
              {[course.category.split(" / ")[0], "Buddy AI", "NVQ L3/L4", "Sinhala Medium"].map(
                (t) => (
                  <button
                    key={t}
                    className="text-[13px] font-semibold border border-border px-3 py-1.5 hover:bg-secondary"
                  >
                    {t}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Course content */}
          <div>
            <h2 className="text-xl font-bold mb-1">Course content</h2>
            <div className="flex items-center justify-between mb-3 text-[13px]">
              <span>
                {totalSections} sections · {totalLectures} lectures · {course.hours}h total length
              </span>
              <button className="text-[#5624d0] font-bold underline">Expand all sections</button>
            </div>
            <div className="border border-border">
              {daysQuery.isLoading && (
                <div className="px-4 py-3 text-[13px] text-muted-foreground">
                  Loading live course modules...
                </div>
              )}
              {daysQuery.isError && (
                <div className="px-4 py-3 text-[13px] text-red-600">
                  Live modules failed to load. Showing local sample content.
                </div>
              )}
              {displayedDays.map((day) => {
                const isOpen = openDay === day.day_number;
                return (
                  <div key={day.day_id} className="border-b border-border last:border-b-0">
                    <button
                      onClick={() => setOpenDay(isOpen ? null : day.day_number)}
                      className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#f7f9fa] transition-colors bg-secondary/40"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                        <span className="font-bold text-[14px]">
                          Day {day.day_number}: {getDayTitle(day)}
                        </span>
                      </div>
                      <span className="text-[13px]">15 lectures · 8h · Quiz</span>
                    </button>
                    {isOpen && (
                      <DayContentRows
                        day={day}
                        courseDay={courseDayQuery.data}
                        isLoading={courseDayQuery.isLoading}
                        usesLiveData={Boolean(daysQuery.data?.length)}
                        quizQuestions={quizQuery.data}
                        isQuizLoading={quizQuery.isLoading}
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
              {course.longDesc ||
                `This course is part of the Buddy JIT programme — international-standard curricula adapted for Sri Lankan learners and delivered in Sinhala. Each day blends theory, hands-on practice, and a 15-MCQ quiz. Buddy AI watches your progress and tunes the next day's lesson to your level.`}
            </p>
            <p className="text-[14px] leading-[1.8] text-foreground/85 mt-3">
              At any moment, the <strong>Buddy AI assistant</strong> is one tap away. Score under 5
              on a quiz and Buddy will offer extra explanations, examples, and the option to message
              your mentor directly.
            </p>
          </div>

          {/* Instructor */}
          <div>
            <h2 className="text-xl font-bold mb-4">Instructor</h2>
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-foreground shrink-0" />
              <div>
                <p className="text-[#5624d0] font-bold underline text-[15px]">Jinasena Padanama</p>
                <p className="text-[13px] text-muted-foreground mb-2">
                  Knowledge companion for Sri Lanka
                </p>
                <div className="text-[12px] text-foreground/80 space-y-1">
                  <p>★ 4.6 Instructor Rating · 12,431 Reviews · 35,000 Students · 15 Courses</p>
                </div>
                <p className="text-[14px] mt-3 leading-relaxed">
                  Built on Dr. Tissa Jinasena's four-decade vision — Buddy combines AI tutoring with
                  mentor-led courses tailored to Sri Lankan trades.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="hidden md:block" />
      </div>

      <SiteFooter />
    </div>
  );
}

function createFallbackCourse(subjectCode: string): Course {
  return {
    id: subjectCode.toLowerCase(),
    code: subjectCode,
    title: subjectCode,
    desc: "International-standard Buddy JIT course content.",
    category: "Foundation",
    hours: 96,
    days: 12,
    level: "All Levels",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
    longDesc: "",
    whatYouLearn: [],
    includes: [],
  };
}

function createFallbackDay(subjectCode: string, dayNumber: number): SubjectDay {
  return {
    day_id: `${subjectCode}-${dayNumber}`,
    subject_code: subjectCode,
    day_number: dayNumber,
    day_code: `day-${dayNumber}`,
    title: dayNumber === 1 ? SAMPLE_DAY.topic : `Module ${dayNumber}`,
    title_si: null,
    title_en: dayNumber === 1 ? SAMPLE_DAY.topic : `Module ${dayNumber}`,
    phase: null,
    intro_text: dayNumber === 1 ? SAMPLE_DAY.intro : null,
    summary_text: dayNumber === 1 ? SAMPLE_DAY.summary : null,
  };
}

function getDayTitle(day: SubjectDay) {
  return day.title_en || day.title || day.title_si || `Module ${day.day_number}`;
}

function bilingualTitle(
  si: string | null | undefined,
  en: string | null | undefined,
  fallback: string,
) {
  const primary = si || en || fallback;
  return en && en !== primary ? `${primary} · ${en}` : primary;
}

function lessonNumber(dayNumber: number, section: number, item?: number) {
  const prefix = `${String(dayNumber).padStart(2, "0")}.${String(section).padStart(2, "0")}`;
  return item ? `${prefix}.${String(item).padStart(2, "0")}` : prefix;
}

function contentLevels(courseDay: CourseDay["subtopics"][number]) {
  const levels = courseDay.contents.map((content) => content.level).filter(Boolean);
  return levels.length ? levels.join(", ") : "Lesson";
}

function DayContentRows({
  day,
  courseDay,
  isLoading,
  usesLiveData,
  quizQuestions,
  isQuizLoading,
}: {
  day: SubjectDay;
  courseDay?: CourseDay | null;
  isLoading: boolean;
  usesLiveData: boolean;
  quizQuestions?: DayQuizQuestion[];
  isQuizLoading: boolean;
}) {
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const toggleLesson = (lessonId: string) => {
    setActiveLesson((current) => (current === lessonId ? null : lessonId));
  };
  const quizCount = quizQuestions?.length;

  if (isLoading) {
    return (
      <div className="px-5 py-4 text-[13px] text-muted-foreground bg-white">
        Loading lesson content...
      </div>
    );
  }

  if (!courseDay && usesLiveData) {
    return (
      <div className="px-5 py-4 text-[13px] text-muted-foreground bg-white">
        No lesson content found for this day yet.
      </div>
    );
  }

  if (!courseDay) {
    const introId = `${day.day_id}-intro`;
    const summaryId = `${day.day_id}-summary`;

    return (
      <div className="bg-white">
        <Row
          icon={<Play className="w-3.5 h-3.5" />}
          title={`${lessonNumber(day.day_number, 1)} ${bilingualTitle(day.title_si, day.title_en, getDayTitle(day))}`}
          preview={day.day_number === 1}
          right="Intro"
          expanded={activeLesson === introId}
          onClick={() => toggleLesson(introId)}
        />
        {activeLesson === introId && (
          <InlineLessonPanel>
            <p className="text-[14px] leading-7 text-foreground/85">
              {day.intro_text || SAMPLE_DAY.intro}
            </p>
          </InlineLessonPanel>
        )}
        {day.day_number === 1 &&
          SAMPLE_DAY.subTopics.map((topic, i) => (
            <Row
              key={topic}
              icon={<Play className="w-3.5 h-3.5" />}
              title={`${lessonNumber(day.day_number, 2, i + 1)} ${topic}`}
              right="Sample"
              locked={i > 1}
            />
          ))}
        <Row
          icon={<FileText className="w-3.5 h-3.5" />}
          title={`${lessonNumber(day.day_number, 3)} සාරාංශය · Summary`}
          right={day.summary_text ? "Summary" : "Pending"}
          locked
          expanded={activeLesson === summaryId}
          onClick={() => toggleLesson(summaryId)}
        />
        {activeLesson === summaryId && (
          <InlineLessonPanel>
            <p className="text-[14px] leading-7 text-foreground/85">
              {day.summary_text || SAMPLE_DAY.summary}
            </p>
          </InlineLessonPanel>
        )}
        <Row
          icon={<Award className="w-3.5 h-3.5" />}
          title={`${lessonNumber(day.day_number, 4)} ප්‍රශ්නාවලිය · End-of-day Quiz`}
          right="Quiz"
          locked
        />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Row
        icon={<Play className="w-3.5 h-3.5" />}
        title={`${lessonNumber(day.day_number, 1)} ${bilingualTitle(courseDay.title_si, courseDay.title_en, getDayTitle(courseDay))}`}
        preview
        right="Intro"
        expanded={activeLesson === "intro"}
        onClick={() => toggleLesson("intro")}
      />
      {activeLesson === "intro" && <IntroContentPanel courseDay={courseDay} />}
      {courseDay.subtopics.map((subtopic, i) => {
        const lessonId = `subtopic-${subtopic.subtopic_id}`;

        return (
          <div key={subtopic.subtopic_id}>
            <Row
              icon={<Play className="w-3.5 h-3.5" />}
              title={`${lessonNumber(day.day_number, 2, subtopic.subtopic_order || i + 1)} ${bilingualTitle(subtopic.title_si, subtopic.title_en, subtopic.subtopic_code ?? "Lesson")}`}
              right={contentLevels(subtopic)}
              expanded={activeLesson === lessonId}
              onClick={() => toggleLesson(lessonId)}
            />
            {activeLesson === lessonId && <SubtopicContentPanel subtopic={subtopic} />}
          </div>
        );
      })}
      {courseDay.summaries.map((summary, i) => {
        const lessonId = `summary-${summary.level}-${summary.topic_code ?? i}`;

        return (
          <div key={lessonId}>
            <Row
              icon={<FileText className="w-3.5 h-3.5" />}
              title={`${lessonNumber(day.day_number, 3, i + 1)} ${bilingualTitle(summary.topic_title_si, summary.topic_title_en, summary.topic_code ?? "Summary")}`}
              right={summary.level}
              expanded={activeLesson === lessonId}
              onClick={() => toggleLesson(lessonId)}
            />
            {activeLesson === lessonId && <SummaryContentPanel summary={summary} />}
          </div>
        );
      })}
      <Row
        icon={<FileText className="w-3.5 h-3.5" />}
        title={`${lessonNumber(day.day_number, 4)} සාරාංශය · Summary`}
        right={courseDay.summary_text ? "Summary" : "Pending"}
        expanded={activeLesson === "day-summary"}
        onClick={() => toggleLesson("day-summary")}
      />
      {activeLesson === "day-summary" && <DaySummaryContentPanel courseDay={courseDay} />}
      <Row
        icon={<Award className="w-3.5 h-3.5" />}
        title={`${lessonNumber(day.day_number, 5)} ප්‍රශ්නාවලිය · End-of-day Quiz`}
        right={isQuizLoading ? "Loading..." : quizCount ? `${quizCount} questions` : "Quiz"}
        expanded={activeLesson === "quiz"}
        onClick={() => toggleLesson("quiz")}
      />
      {activeLesson === "quiz" && (
        <QuizContentPanel isLoading={isQuizLoading} questions={quizQuestions} />
      )}
    </div>
  );
}

function InlineLessonPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-border bg-[#fbfbf8] px-5 py-5 md:px-12 animate-in fade-in slide-in-from-top-1 duration-150">
      <div className="space-y-3 md:pl-7">{children}</div>
    </div>
  );
}

function IntroContentPanel({ courseDay }: { courseDay: CourseDay }) {
  return (
    <InlineLessonPanel>
      {courseDay.phase && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {courseDay.phase}
        </p>
      )}
      {courseDay.intro_text ? (
        <p className="text-[14px] leading-7 text-foreground/85">{courseDay.intro_text}</p>
      ) : (
        <p className="text-[13px] text-muted-foreground">Intro content is not available yet.</p>
      )}
    </InlineLessonPanel>
  );
}

function SubtopicContentPanel({ subtopic }: { subtopic: CourseDay["subtopics"][number] }) {
  return (
    <InlineLessonPanel>
      <h4 className="font-semibold text-[14px] leading-snug">
        {bilingualTitle(subtopic.title_si, subtopic.title_en, subtopic.subtopic_code ?? "Lesson")}
      </h4>
      {subtopic.contents.length > 0 ? (
        subtopic.contents.map((content) => (
          <section key={`${subtopic.subtopic_id}-${content.level}`} className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {content.level}
            </p>
            {content.content_si && (
              <p className="font-sinhala text-[14px] leading-7 text-foreground/85">
                {content.content_si}
              </p>
            )}
            <InlineJsonList value={content.keywords} />
          </section>
        ))
      ) : (
        <p className="text-[13px] text-muted-foreground">Lesson content is not available yet.</p>
      )}
    </InlineLessonPanel>
  );
}

function SummaryContentPanel({ summary }: { summary: CourseDay["summaries"][number] }) {
  return (
    <InlineLessonPanel>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {summary.level}
      </p>
      <h5 className="text-[13px] font-semibold">
        {bilingualTitle(
          summary.topic_title_si,
          summary.topic_title_en,
          summary.topic_code ?? "Summary",
        )}
      </h5>
      {summary.summary_si ? (
        <p className="font-sinhala text-[14px] leading-7 text-foreground/85">
          {summary.summary_si}
        </p>
      ) : (
        <p className="text-[13px] text-muted-foreground">Summary content is not available yet.</p>
      )}
      <InlineJsonList value={summary.key_points} />
    </InlineLessonPanel>
  );
}

function DaySummaryContentPanel({ courseDay }: { courseDay: CourseDay }) {
  return (
    <InlineLessonPanel>
      {courseDay.summary_text ? (
        <p className="text-[14px] leading-7 text-foreground/85">{courseDay.summary_text}</p>
      ) : (
        <p className="text-[13px] text-muted-foreground">Day summary is not available yet.</p>
      )}
    </InlineLessonPanel>
  );
}

function QuizContentPanel({
  isLoading,
  questions,
}: {
  isLoading: boolean;
  questions?: DayQuizQuestion[];
}) {
  if (isLoading) {
    return (
      <InlineLessonPanel>
        <p className="text-[13px] text-muted-foreground">Loading quiz questions...</p>
      </InlineLessonPanel>
    );
  }

  return (
    <InlineLessonPanel>
      {questions?.length ? (
        <div className="space-y-4">
          {questions.map((question) => (
            <section key={question.question_no} className="space-y-2">
              <h5 className="font-sinhala text-[14px] font-semibold leading-7">
                {question.question_no}. {question.question_si}
              </h5>
              <InlineJsonList value={question.options} />
              {question.explanation_si && (
                <p className="font-sinhala text-[13px] leading-6 text-muted-foreground">
                  {question.explanation_si}
                </p>
              )}
            </section>
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-muted-foreground">Quiz questions are not available yet.</p>
      )}
    </InlineLessonPanel>
  );
}

function InlineJsonList({ value }: { value: unknown }) {
  const items = jsonToStrings(value);

  if (items.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className="bg-white px-2 py-1 text-[11px] text-muted-foreground">
          {item}
        </span>
      ))}
    </div>
  );
}

function jsonToStrings(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" || typeof item === "number" ? String(item) : ""))
      .filter(Boolean);
  }
  if (typeof value === "object") {
    return Object.values(value)
      .flatMap((item) => jsonToStrings(item))
      .filter(Boolean);
  }
  if (typeof value === "string" || typeof value === "number") return [String(value)];
  return [];
}

function Row({
  icon,
  title,
  right,
  preview,
  locked,
  expanded,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  right: string;
  preview?: boolean;
  locked?: boolean;
  expanded?: boolean;
  onClick?: () => void;
}) {
  const rowContent = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        {locked ? (
          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <span className="text-muted-foreground">{icon}</span>
        )}
        <span className={`min-w-0 ${locked ? "text-foreground/80" : ""}`}>{title}</span>
        {preview && <span className="text-[#5624d0] font-bold underline">Preview</span>}
      </div>
      <span className="shrink-0 text-muted-foreground">{right}</span>
    </>
  );

  const className = `flex w-full items-center justify-between gap-4 px-5 md:px-12 py-2.5 border-t border-border text-left text-[13px] transition-colors ${
    expanded ? "bg-[#f7f4ff]" : "bg-white hover:bg-[#f7f9fa]"
  }`;

  if (onClick) {
    return (
      <button type="button" aria-expanded={expanded} onClick={onClick} className={className}>
        {rowContent}
      </button>
    );
  }

  return <div className={className}>{rowContent}</div>;
}
