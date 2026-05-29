import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search, Heart, Check, BadgeCheck } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { COURSES, type Course } from "@/lib/courses-data";
import { ProtectedRoute } from "@/lib/auth";
import { enrollStudent, isEnrolledDB } from "@/lib/supabase-enrollment";
import { BuddyChat } from "@/components/BuddyChat";

export const Route = createFileRoute("/courses")({
  component: CoursesPage,
  head: () => ({
    meta: [
      { title: "Courses — Buddy JIT" },
      { name: "description", content: "International-standard courses for Sri Lankan youth." },
    ],
  }),
});

const CATEGORIES = ["All", "Foundation", "Engineering", "Technology", "Electrical", "Automation", "Mechanical"];

function isEnrolledInCourse(courseId: string, email: string): boolean {
  try { return localStorage.getItem(`buddy_enrolled_${courseId}_${email}`) === "1"; } catch { return false; }
}
// Sync enrollment state from Supabase on page load
async function syncEnrollments(email: string, setter: (ids: string[]) => void) {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const db = supabase as any;
    const { data } = await db.from("enrollments").select("course_id").eq("email", email);
    if (data?.length) {
      data.forEach((r: any) => localStorage.setItem(`buddy_enrolled_${r.course_id}_${email}`, "1"));
      setter(data.map((r: any) => r.course_id));
    }
  } catch {}
}

function CoursesPage() {
  const nav = useNavigate();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [enrollCourse, setEnrollCourse] = useState<Course | null>(null);
  const [email, setEmail] = useState("");

  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);

  useEffect(() => {
    const e = sessionStorage.getItem("buddy_email") || "";
    setEmail(e);
    if (e) syncEnrollments(e, setEnrolledIds);
  }, []);

  const visible = useMemo(
    () => COURSES.filter((c) =>
      (cat === "All" || c.category === cat) &&
      (q === "" || c.title.toLowerCase().includes(q.toLowerCase()) || c.desc.toLowerCase().includes(q.toLowerCase()))
    ),
    [cat, q]
  );

  const handleCourseClick = (course: Course) => {
    if (isEnrolledInCourse(course.id, email)) {
      nav({ to: "/courses/$courseId", params: { courseId: course.id } });
    } else {
      setEnrollCourse(course);
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <SiteNav mode="pill" />
        <div className="pt-32">
          <section className="mx-auto max-w-6xl px-6 md:px-12 pb-12">
            <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-6">— Buddy JIT</div>
            <h1 className="font-serif text-3xl md:text-5xl leading-[1.15] mb-6 max-w-4xl">
              Sri Lanka's first AI-powered vocational education ecosystem.
            </h1>
            <p className="text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              Education engineered around you. With fully personalized intelligence, Buddy is the companion that turns complex industrial training into an interactive, anywhere-anytime mastery experience.
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
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 md:px-12 pb-32">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14">
              {visible.map((c) => <CourseCard key={c.id} course={c} email={email} onClick={() => handleCourseClick(c)} />)}
            </div>
            {visible.length === 0 && (
              <div className="text-center py-20 text-muted-foreground text-sm">No courses match your search.</div>
            )}
          </section>
        </div>
        <SiteFooter />

        {enrollCourse && <EnrollModal course={enrollCourse} onClose={() => setEnrollCourse(null)} />}
        <BuddyChat />
      </div>
    </ProtectedRoute>
  );
}

function EnrollModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Enter the full 6-digit course code");
      return;
    }
    // Validate against stored enrollment keys
    const stored = localStorage.getItem("buddy_enrollment_keys_v1");
    const keys: Record<string, { key: string }> = stored ? JSON.parse(stored) : {};
    const entry = keys[course.id];
    if (!entry) {
      setError("No enrollment key set for this course. Contact your admin.");
      return;
    }
    if (code !== entry.key) {
      setError("Incorrect enrollment key. Check with your teacher.");
      return;
    }
    // Valid — enroll in Supabase + localStorage
    const email = sessionStorage.getItem("buddy_email") || "";
    enrollStudent(course.id, email);
    onClose();
    nav({ to: "/courses/$courseId", params: { courseId: course.id } });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="bg-background w-full max-w-md p-8 md:p-10 rounded-sm border border-border shadow-2xl"
      >
        <div className="text-[10px] tracking-[0.3em] uppercase text-accent mb-3">— Enroll</div>
        <h3 className="font-serif text-2xl md:text-3xl mb-2">{course.title}</h3>
        <p className="text-sm text-muted-foreground mb-6">Enter the 6-digit enrollment code provided by your mentor.</p>

        <input
          autoFocus
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          value={code}
          onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
          placeholder="• • • • • •"
          className="w-full border border-border rounded-md px-4 py-4 text-xl tracking-[0.6em] text-center font-mono focus:outline-none focus:border-accent"
        />
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 border border-border py-3 text-[11px] tracking-[0.25em] uppercase hover:bg-secondary">
            Cancel
          </button>
          <button type="submit" className="flex-1 bg-foreground text-background py-3 text-[11px] tracking-[0.25em] uppercase hover:bg-accent hover:text-foreground transition-colors">
            Enroll
          </button>
        </div>
      </form>
    </div>
  );
}

function CourseCard({ course, email, onClick }: { course: Course; email: string; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const alreadyEnrolled = isEnrolledInCourse(course.id, email);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted rounded-sm">
        <img src={course.image} alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        {alreadyEnrolled && (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-[9px] px-2 py-0.5 rounded-sm font-bold tracking-wide uppercase">
            Enrolled
          </div>
        )}
      </div>

      <div className="pt-3 space-y-1.5">
        <h3 className="font-serif text-[15px] leading-tight line-clamp-2 group-hover:text-[#6d28d9] transition-colors">{course.title}</h3>
        {course.siTitle && (
          <p className="font-sinhala text-xs text-muted-foreground">{course.siTitle}</p>
        )}
        <p className="text-[11px] text-muted-foreground">{course.category.split(" ")[0]}</p>

        {course.tag && (
          <div className="flex gap-1.5 pt-1">
            <span className={`text-[9px] px-2 py-0.5 tracking-wider uppercase font-semibold leading-tight ${
              course.tag === "Bestseller" ? "bg-amber-100 text-amber-900" :
              course.tag === "Premium" ? "bg-[#6d28d9] text-white" : "bg-amber-100 text-amber-800"
            }`}>
              {course.tag === "Bestseller" ? "Be grateful for free education given by Jinasena Padanama" : course.tag}
            </span>
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
              <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-900 tracking-wider uppercase font-semibold rounded-sm leading-tight">
                Be grateful for free education given by Jinasena Padanama
              </span>
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
            <div className={`flex-1 text-white text-center py-2.5 text-[12px] font-bold tracking-wide rounded-sm ${alreadyEnrolled ? "bg-green-600" : "bg-[#6d28d9] hover:bg-[#5b21b6]"}`}>
              {alreadyEnrolled ? "Continue Learning" : "Enroll Now"}
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
