import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, Clock, Users, Globe, CheckCircle2, ChevronDown, Award, BookOpen, Lock } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { COURSES, SAMPLE_DAY } from "@/lib/courses-data";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/courses/$courseId")({
  component: CourseDetail,
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const course = COURSES.find((c) => c.id === courseId);
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [openDay, setOpenDay] = useState<number | null>(1);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [user, loading, nav]);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Course not found.</p>
        <Link to="/courses" className="mt-4 text-sm border-b border-foreground">Back to courses</Link>
      </div>
    );
  }

  const days = Array.from({ length: course.days }, (_, i) => i + 1);

  return (
    <div>
      <SiteNav />
      <Toaster />

      {/* Hero — udemy dark style */}
      <section className="bg-foreground text-background pt-32 pb-12">
        <div className="mx-auto max-w-6xl px-6 md:px-12 grid md:grid-cols-[1.3fr_1fr] gap-10">
          <div>
            <div className="text-[11px] tracking-display uppercase text-background/60 mb-4">
              <Link to="/courses" className="hover:text-accent">Courses</Link>
              <span className="mx-2">›</span>
              <span>{course.category.split(" ")[0]}</span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl leading-tight mb-3">{course.title}</h1>
            {course.siTitle && <p className="font-sinhala text-xl text-background/70 mb-4">{course.siTitle}</p>}
            <p className="text-background/80 leading-relaxed mb-5">{course.longDesc || course.desc}</p>
            <div className="flex flex-wrap gap-3 items-center text-sm">
              {course.tag && (
                <span className="bg-accent/20 text-accent px-3 py-1 text-xs tracking-wider uppercase">{course.tag}</span>
              )}
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-accent text-accent" /> 4.5 (2,431 ratings)</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 8,567 learners</span>
            </div>
            <div className="mt-4 text-xs text-background/60 flex flex-wrap gap-4">
              <span>Created by <span className="text-background underline">Jinasena Padanama</span></span>
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> English · Sinhala</span>
            </div>
          </div>

          {/* Sticky enroll card */}
          <aside className="bg-background text-foreground border border-border md:-mb-32 md:translate-y-0 self-start">
            <div className="aspect-video bg-muted relative overflow-hidden">
              <img src={course.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-background/95 flex items-center justify-center">▶</div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="font-serif text-3xl">Free</div>
                <div className="text-xs text-muted-foreground">Unlock with mentor code</div>
              </div>
              <button
                onClick={() => toast.success("Enrolled! Day 1 unlocked.", { description: "Start with the introduction below." })}
                className="w-full bg-foreground text-background py-3 text-xs tracking-[0.3em] uppercase hover:bg-foreground/90">
                Start Learning
              </button>
              <button className="w-full border border-border py-3 text-xs tracking-[0.3em] uppercase hover:bg-secondary">
                Add to Wishlist
              </button>
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-2">This course includes</div>
                {course.includes.length ? course.includes.map((x) => (
                  <div key={x} className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>{x}</span></div>
                )) : (
                  <>
                    <div className="flex gap-2 items-start"><Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>{course.hours} hours · {course.days} days</span></div>
                    <div className="flex gap-2 items-start"><BookOpen className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>15 sub-topics & quiz per day</span></div>
                    <div className="flex gap-2 items-start"><Award className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>Certificate of completion</span></div>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 md:px-12 py-16 grid md:grid-cols-[1.3fr_1fr] gap-10">
        <div className="space-y-12 md:pr-8">
          {/* Level selector */}
          <div className="border border-border p-6">
            <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-3">Choose your starting level</div>
            <div className="grid grid-cols-3 gap-2">
              {(["Beginner", "Intermediate", "Advanced"] as const).map((l) => (
                <button key={l} onClick={() => setLevel(l)}
                  className={`py-2.5 text-xs tracking-[0.2em] uppercase border ${
                    level === l ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"
                  }`}>{l}</button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Buddy will reassess after each day's quiz: <strong>0–5 → Beginner, 5–10 → Intermediate, 10–15 → Advanced</strong>.
              Tomorrow's lesson is tuned for you.
            </p>
          </div>

          {/* What you'll learn */}
          <div>
            <h2 className="font-serif text-2xl md:text-3xl mb-5">What you'll learn</h2>
            <div className="grid sm:grid-cols-2 gap-3 border border-border p-6">
              {(course.whatYouLearn.length ? course.whatYouLearn : [
                "Build solid foundations from day one",
                "Apply concepts directly on the workshop floor",
                "Pass NVQ-style assessments with confidence",
                "Use Buddy AI as your always-on tutor",
              ]).map((x) => (
                <div key={x} className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>{x}</span></div>
              ))}
            </div>
          </div>

          {/* Course content / days */}
          <div>
            <h2 className="font-serif text-2xl md:text-3xl mb-2">Course content</h2>
            <p className="text-xs text-muted-foreground mb-5">
              {course.days} days · {course.hours} hours total · 8 hours/day recommended
            </p>
            <div className="border border-border divide-y divide-border">
              {days.map((d) => {
                const isOpen = openDay === d;
                const locked = d > 1;
                return (
                  <div key={d}>
                    <button
                      onClick={() => setOpenDay(isOpen ? null : d)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3 text-left">
                        {locked ? <Lock className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />}
                        <span className="font-serif text-base">Day {d}: {d === 1 ? SAMPLE_DAY.topic : `Module ${d}`}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">15 topics · 8 hours · Quiz</span>
                    </button>
                    {isOpen && d === 1 && (
                      <div className="px-5 pb-5 space-y-4 bg-secondary/30">
                        <div>
                          <div className="text-[10px] tracking-display uppercase text-muted-foreground mb-1">01.01 හැඳින්වීම · Introduction</div>
                          <p className="text-sm leading-relaxed">{SAMPLE_DAY.intro}</p>
                        </div>
                        <div>
                          <div className="text-[10px] tracking-display uppercase text-muted-foreground mb-2">01.02 උප මාතෘකා 15 · 15 Sub Topics</div>
                          <ol className="space-y-1.5 text-sm">
                            {SAMPLE_DAY.subTopics.map((s, i) => (
                              <li key={i} className="flex gap-3 py-1.5 px-2 hover:bg-background">
                                <span className="text-muted-foreground tabular-nums w-12">01.02.{String(i + 1).padStart(2, "0")}</span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <div className="text-[10px] tracking-display uppercase text-muted-foreground mb-1">01.03 සාරාංශය · Summary</div>
                          <p className="text-sm leading-relaxed">{SAMPLE_DAY.summary}</p>
                        </div>
                        <div className="flex items-center justify-between bg-foreground text-background px-4 py-3">
                          <div>
                            <div className="text-[10px] tracking-display uppercase opacity-60">01.04 ප්‍රශ්නාවලිය</div>
                            <div className="text-sm font-serif">End-of-day Quiz · 15 MCQ</div>
                          </div>
                          <button onClick={() => toast.success("Quiz complete — 12/15 ★", { description: "Tomorrow you'll move to Intermediate." })}
                            className="text-[10px] tracking-[0.25em] uppercase border border-background/40 px-4 py-2 hover:bg-background hover:text-foreground">
                            Take Quiz
                          </button>
                        </div>
                      </div>
                    )}
                    {isOpen && d !== 1 && (
                      <div className="px-5 pb-5 text-sm text-muted-foreground bg-secondary/30">
                        Unlocks after you complete Day {d - 1}'s quiz.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="font-serif text-2xl md:text-3xl mb-4">Description</h2>
            <p className="text-sm leading-[1.85] text-foreground/80">
              {course.longDesc || `This course is part of the Buddy JIT programme — international-standard curricula adapted for Sri Lankan learners and delivered in Sinhala. Each day blends theory, hands-on practice, and a 15-MCQ quiz. Buddy AI watches your progress and tunes the next day's lesson to your level.`}
            </p>
            <p className="text-sm leading-[1.85] text-foreground/80 mt-3">
              At any moment, the <strong>Buddy AI assistant</strong> is one tap away. Score under 5 on a quiz and Buddy will offer extra explanations, examples, and the option to message your mentor directly.
            </p>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
