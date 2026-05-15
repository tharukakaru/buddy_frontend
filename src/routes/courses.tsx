import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Star, Clock, Users, Heart, Check, BadgeCheck } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { COURSES, type Course } from "@/lib/courses-data";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/courses")({
  component: CoursesPage,
  head: () => ({
    meta: [
      { title: "Courses — Buddy JIT" },
      { name: "description", content: "International-standard courses for Sri Lankan youth." },
    ],
  }),
});

const CATEGORIES = [
  "All",
  "Foundation / Core Sciences",
  "Mechanical Engineering & Manufacturing",
  "Electrical & Automation",
  "Agriculture & Sustainability",
];

function CoursesPage() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  const visible = useMemo(
    () => COURSES.filter((c) =>
      (cat === "All" || c.category === cat) &&
      (q === "" || c.title.toLowerCase().includes(q.toLowerCase()) || c.desc.toLowerCase().includes(q.toLowerCase()))
    ),
    [cat, q]
  );

  return (
    <div>
      <SiteNav />
      <div className="pt-32">
        <section className="mx-auto max-w-6xl px-6 md:px-12 pb-12">
          <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-6">— Buddy JIT</div>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">All Courses</h1>
          <p className="text-muted-foreground max-w-xl mb-10">
            International-standard, AI-personalized — pick a course, set your level, and let Buddy adapt every day.
          </p>

          <div className="flex flex-col md:flex-row md:items-center gap-6 border-t border-b border-border py-5">
            <div className="flex items-center gap-3 flex-1">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses…"
                className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  className={`text-[11px] tracking-display uppercase px-3 py-2 border transition-colors ${
                    cat === c ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"
                  }`}>
                  {c === "All" ? "All" : c.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 md:px-12 pb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14">
            {visible.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
          {visible.length === 0 && (
            <div className="text-center py-20 text-muted-foreground text-sm">No courses match your search.</div>
          )}
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const [hover, setHover] = useState(false);

  const open = () => {
    if (!user) nav({ to: "/login" });
    else nav({ to: "/courses/$courseId", params: { courseId: course.id } });
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative cursor-pointer flex flex-col"
      onClick={open}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted rounded-sm">
        <img src={course.image} alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>

      <div className="pt-3 space-y-1.5">
        <h3 className="font-serif text-[15px] leading-tight line-clamp-2 group-hover:text-[#6d28d9] transition-colors">{course.title}</h3>
        {course.siTitle && (
          <p className="font-sinhala text-xs text-muted-foreground">{course.siTitle}</p>
        )}
        <p className="text-[11px] text-muted-foreground">{course.category.split(" ")[0]}</p>
        <div className="flex items-center gap-1 text-xs">
          <span className="font-semibold">4.5</span>
          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
          <span className="text-muted-foreground">(2,431)</span>
        </div>
        {course.tag && (
          <div className="flex gap-1.5 pt-1">
            <span className={`text-[9px] px-2 py-0.5 tracking-wider uppercase font-semibold ${
              course.tag === "Bestseller" ? "bg-teal-100 text-teal-800" :
              course.tag === "Premium" ? "bg-[#6d28d9] text-white" : "bg-amber-100 text-amber-800"
            }`}>{course.tag}</span>
          </div>
        )}
      </div>

      {/* Hover overlay — Udemy style */}
      {hover && (
        <div className="hidden md:block absolute z-30 top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-[115%] bg-white border border-border shadow-2xl p-5 pointer-events-none animate-in fade-in zoom-in-95 duration-150 rounded-sm">
          <h4 className="font-serif text-lg leading-snug mb-3 text-foreground">{course.title}</h4>
          <div className="flex gap-1.5 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-[#6d28d9] text-white tracking-wider uppercase font-semibold rounded-sm">
              <BadgeCheck className="w-3 h-3" /> Premium
            </span>
            {course.tag === "Bestseller" && (
              <span className="text-[10px] px-2 py-0.5 bg-teal-100 text-teal-800 tracking-wider uppercase font-semibold rounded-sm">Bestseller</span>
            )}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mb-1">Updated <span className="font-bold">January 2026</span></p>
          <p className="text-[11px] text-muted-foreground mb-3">{course.hours}h total · {course.level} · {course.days} days</p>
          <p className="text-[12px] leading-relaxed mb-3 text-foreground">{course.desc}</p>
          <ul className="space-y-1.5 text-[12px] mb-4">
            <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-foreground shrink-0 mt-0.5" /> Adaptive AI tutoring with Buddy</li>
            <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-foreground shrink-0 mt-0.5" /> Daily quizzes recalibrate your level</li>
            <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-foreground shrink-0 mt-0.5" /> Mentor support whenever you're stuck</li>
          </ul>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#6d28d9] hover:bg-[#5b21b6] text-white text-center py-2.5 text-[12px] font-bold tracking-wide rounded-sm">
              Enroll Now
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#6d28d9] flex items-center justify-center text-[#6d28d9]">
              <Heart className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Auto-redirect course CTA on landing page if not logged in is handled by CourseCard above.
// Re-export hook for guarded pages
export { useAuth as _useAuth };
