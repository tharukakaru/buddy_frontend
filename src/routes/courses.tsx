import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Star, Clock, Users } from "lucide-react";
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

        <section className="mx-auto max-w-6xl px-6 md:px-12 pb-32">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
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
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={course.image} alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>

      <div className="pt-3 space-y-1">
        <h3 className="font-serif text-base leading-tight line-clamp-2">{course.title}</h3>
        {course.siTitle && (
          <p className="font-sinhala text-xs text-muted-foreground">{course.siTitle}</p>
        )}
        <p className="text-[11px] text-muted-foreground">{course.category.split(" ")[0]}</p>
        <div className="flex items-center gap-1 text-xs">
          <span className="font-semibold">4.5</span>
          <Star className="w-3 h-3 fill-accent text-accent" />
          <span className="text-muted-foreground">(2,431)</span>
        </div>
        <div className="flex gap-1.5 pt-1">
          {course.tag && (
            <span className={`text-[9px] px-2 py-0.5 tracking-wider uppercase ${
              course.tag === "Bestseller" ? "bg-accent/20 text-accent-foreground" :
              course.tag === "Premium" ? "bg-foreground text-background" : "bg-secondary"
            }`}>{course.tag}</span>
          )}
        </div>
      </div>

      {/* Hover overlay — Udemy style */}
      {hover && (
        <div className="hidden md:block absolute z-30 top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-[110%] bg-background border border-border shadow-2xl p-5 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <h4 className="font-serif text-base mb-2">{course.title}</h4>
          <div className="flex gap-1.5 mb-3">
            {course.tag && (
              <span className={`text-[9px] px-2 py-0.5 tracking-wider uppercase ${
                course.tag === "Bestseller" ? "bg-accent/20" : course.tag === "Premium" ? "bg-foreground text-background" : "bg-secondary"
              }`}>{course.tag}</span>
            )}
            <span className="text-[10px] px-2 py-0.5 bg-secondary uppercase tracking-wider">{course.level}</span>
          </div>
          <div className="text-xs text-muted-foreground mb-3 flex gap-3 flex-wrap">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.hours}h · {course.days} days</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />2,431</span>
          </div>
          <p className="text-xs leading-relaxed mb-3">{course.desc}</p>
          <ul className="space-y-1.5 text-xs">
            <li className="flex gap-2"><span className="text-accent">✓</span> Adaptive AI tutoring with Buddy</li>
            <li className="flex gap-2"><span className="text-accent">✓</span> Daily quizzes recalibrate your level</li>
            <li className="flex gap-2"><span className="text-accent">✓</span> Mentor support when you're stuck</li>
          </ul>
          <div className="mt-4 bg-foreground text-background text-center py-2.5 text-[11px] tracking-[0.25em] uppercase">
            Enroll Now
          </div>
        </div>
      )}
    </div>
  );
}

// Auto-redirect course CTA on landing page if not logged in is handled by CourseCard above.
// Re-export hook for guarded pages
export { useAuth as _useAuth };
