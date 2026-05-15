import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Star, Clock, Users, Globe, CheckCircle2, ChevronDown, Award, Play,
  BookOpen, Lock, Smartphone, Infinity as InfinityIcon, FileText, Share2, Heart,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { COURSES, SAMPLE_DAY } from "@/lib/courses-data";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/courses_/$courseId")({
  component: CourseDetail,
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const course = COURSES.find((c) => c.id === courseId);
  const [openDay, setOpenDay] = useState<number | null>(1);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Course not found.</p>
        <Link to="/courses" className="mt-4 text-sm border-b">Back to courses</Link>
      </div>
    );
  }

  const days = Array.from({ length: course.days }, (_, i) => i + 1);
  const totalLectures = course.days * 15;

  return (
    <div className="bg-background">
      <SiteNav />
      <Toaster />

      {/* Udemy-style dark hero */}
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
              {course.longDesc || `${course.desc} Understand how it works and how to leverage this course to transform your career.`}
            </p>
            {course.tag && (
              <span className="inline-block bg-[#eceb98] text-[#3d3c0a] px-2 py-1 text-[11px] font-bold tracking-wide mb-3">
                {course.tag}
              </span>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] mb-3">
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-[#e0b651]">4.5</span>
                <span className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-[#e0b651] text-[#e0b651]" />)}
                </span>
                <span className="text-[#cec0fc] underline">(2,431 ratings)</span>
              </span>
              <span className="text-white/85">8,567 learners</span>
            </div>
            <p className="text-[13px] text-white/85 mb-2">
              Created by <span className="text-[#cec0fc] underline">Jinasena Padanama</span>
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[12px] text-white/80">
              <span>Last updated 1/2026</span>
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> English</span>
              <span>Sinhala [Auto]</span>
            </div>
          </div>

          {/* Sticky purchase card — Udemy style */}
          <aside className="bg-white text-foreground shadow-2xl md:-mb-32 md:translate-y-0 self-start">
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
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">Free</span>
                <span className="text-sm text-muted-foreground line-through">LKR 8,900</span>
                <span className="text-sm text-[#a435f0] font-semibold">100% off</span>
              </div>
              <div className="text-[12px] text-[#a435f0] font-semibold">
                ⏱ 2 days left at this price!
              </div>
              <button
                onClick={() => toast.success("Enrolled! Day 1 unlocked.")}
                className="w-full bg-[#a435f0] hover:bg-[#8710d8] text-white py-3 text-sm font-bold transition-colors">
                Enroll now
              </button>
              <button className="w-full border border-foreground py-3 text-sm font-bold hover:bg-secondary transition-colors">
                Add to cart
              </button>
              <p className="text-[11px] text-center text-muted-foreground">30-Day Money-Back Guarantee</p>
              <p className="text-[11px] text-center text-muted-foreground">Full Lifetime Access</p>

              <div className="pt-3">
                <div className="font-bold text-sm mb-2">This course includes:</div>
                <ul className="space-y-1.5 text-[13px]">
                  <li className="flex gap-2"><Play className="w-3.5 h-3.5 mt-0.5" /> {course.hours} hours on-demand video</li>
                  <li className="flex gap-2"><FileText className="w-3.5 h-3.5 mt-0.5" /> {course.days} downloadable resources</li>
                  <li className="flex gap-2"><InfinityIcon className="w-3.5 h-3.5 mt-0.5" /> Full lifetime access</li>
                  <li className="flex gap-2"><Smartphone className="w-3.5 h-3.5 mt-0.5" /> Access on mobile and TV</li>
                  <li className="flex gap-2"><Award className="w-3.5 h-3.5 mt-0.5" /> Certificate of completion</li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border text-[12px]">
                <button className="font-semibold underline flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Share</button>
                <button className="font-semibold underline">Gift this course</button>
                <button className="font-semibold underline flex items-center gap-1"><Heart className="w-3.5 h-3.5" /></button>
              </div>
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

          {/* Topics covered */}
          <div>
            <h2 className="text-xl font-bold mb-3">Explore related topics</h2>
            <div className="flex flex-wrap gap-2">
              {[course.category.split(" / ")[0], "Buddy AI", "NVQ L3/L4", "Sinhala Medium"].map(t => (
                <button key={t} className="text-[13px] font-semibold border border-border px-3 py-1.5 hover:bg-secondary">
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Course content */}
          <div>
            <h2 className="text-xl font-bold mb-1">Course content</h2>
            <div className="flex items-center justify-between mb-3 text-[13px]">
              <span>{course.days} sections · {totalLectures} lectures · {course.hours}h total length</span>
              <button className="text-[#5624d0] font-bold underline">Expand all sections</button>
            </div>
            <div className="border border-border">
              {days.map((d) => {
                const isOpen = openDay === d;
                const locked = d > 1;
                return (
                  <div key={d} className="border-b border-border last:border-b-0">
                    <button
                      onClick={() => setOpenDay(isOpen ? null : d)}
                      className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#f7f9fa] transition-colors bg-secondary/40">
                      <div className="flex items-center gap-3 text-left">
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        <span className="font-bold text-[14px]">Day {d}: {d === 1 ? SAMPLE_DAY.topic : `Module ${d}`}</span>
                      </div>
                      <span className="text-[13px]">15 lectures · 8h · Quiz</span>
                    </button>
                    {isOpen && d === 1 && (
                      <div className="bg-white">
                        <Row icon={<Play className="w-3.5 h-3.5" />} title="01.01 හැඳින්වීම · Introduction" preview right="03:21" />
                        {SAMPLE_DAY.subTopics.map((s, i) => (
                          <Row key={i} icon={<Play className="w-3.5 h-3.5" />}
                            title={`01.02.${String(i + 1).padStart(2, "0")} ${s}`}
                            right={`${5 + (i % 7)}:${String(10 + i).padStart(2, "0")}`}
                            locked={i > 1} />
                        ))}
                        <Row icon={<FileText className="w-3.5 h-3.5" />} title="01.03 සාරාංශය · Summary" right="2 pages" locked />
                        <Row icon={<Award className="w-3.5 h-3.5" />} title="01.04 ප්‍රශ්නාවලිය · End-of-day Quiz (15 MCQ)" right="15 questions" locked />
                      </div>
                    )}
                    {isOpen && d !== 1 && (
                      <div className="px-5 py-4 text-[13px] text-muted-foreground bg-white">
                        <Lock className="w-3.5 h-3.5 inline mr-1.5" />
                        Unlocks after you complete Day {d - 1}'s quiz.
                      </div>
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
              {course.longDesc || `This course is part of the Buddy JIT programme — international-standard curricula adapted for Sri Lankan learners and delivered in Sinhala. Each day blends theory, hands-on practice, and a 15-MCQ quiz. Buddy AI watches your progress and tunes the next day's lesson to your level.`}
            </p>
            <p className="text-[14px] leading-[1.8] text-foreground/85 mt-3">
              At any moment, the <strong>Buddy AI assistant</strong> is one tap away. Score under 5 on a quiz and Buddy will offer extra explanations, examples, and the option to message your mentor directly.
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
                <div className="text-[12px] text-foreground/80 space-y-1">
                  <p>★ 4.6 Instructor Rating · 12,431 Reviews · 35,000 Students · 15 Courses</p>
                </div>
                <p className="text-[14px] mt-3 leading-relaxed">
                  Built on Dr. Tissa Jinasena's four-decade vision — Buddy combines AI tutoring with mentor-led courses tailored to Sri Lankan trades.
                </p>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-bold mb-4">Student feedback</h2>
            <div className="grid grid-cols-[auto_1fr] gap-6 items-start">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#b4690e]">4.5</div>
                <div className="flex justify-center text-[#b4690e] my-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <div className="text-[12px] text-[#b4690e] font-semibold">Course Rating</div>
              </div>
              <div className="space-y-1.5 w-full max-w-md">
                {[80, 14, 4, 1, 1].map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-secondary"><div className="h-full bg-foreground" style={{ width: `${p}%` }} /></div>
                    <div className="flex text-[#b4690e]">
                      {Array.from({ length: 5 - i }).map((_, k) => <Star key={k} className="w-3 h-3 fill-current" />)}
                    </div>
                    <span className="text-[12px] text-[#5624d0] font-semibold w-10">{p}%</span>
                  </div>
                ))}
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

function Row({ icon, title, right, preview, locked }: { icon: React.ReactNode; title: string; right: string; preview?: boolean; locked?: boolean }) {
  return (
    <div className="flex items-center justify-between px-12 py-2.5 border-t border-border text-[13px] hover:bg-[#f7f9fa]">
      <div className="flex items-center gap-3">
        {locked ? <Lock className="w-3.5 h-3.5 text-muted-foreground" /> : <span className="text-muted-foreground">{icon}</span>}
        <span className={locked ? "text-foreground/80" : ""}>{title}</span>
        {preview && <button className="text-[#5624d0] font-bold underline">Preview</button>}
      </div>
      <span className="text-muted-foreground">{right}</span>
    </div>
  );
}
