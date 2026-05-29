import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/lib/auth";
import {
  Users, BookOpen, TrendingUp, AlertTriangle, Search, Filter, ChevronRight,
  CheckCircle2, Activity, User, X, Mail, Phone, Briefcase, Sparkles, Camera,
  Key, Copy, Check,
} from "lucide-react";
import { getAllKeys, type EnrollmentKey } from "@/lib/enrollment-keys";
import { COURSES } from "@/lib/courses-data";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

export const Route = createFileRoute("/teacher")({
  component: TeacherDashboard,
  head: () => ({ meta: [{ title: "Teacher Dashboard — BUDDY" }] }),
});

type Status = "On Track" | "Monitor" | "Needs Support" | "At Risk";

type StudentRow = {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  progress: Record<string, number>;
  status: Status;
};

type SubjectRow = {
  name: string;
  courseId: string;
  students: number;
  avgProgress: number;
};

function getStatus(progress: Record<string, number>, courses: string[]): Status {
  if (!courses.length) return "At Risk";
  const avg = courses.reduce((a, id) => a + (progress[id] ?? 0), 0) / courses.length;
  if (avg >= 70) return "On Track";
  if (avg >= 40) return "Monitor";
  if (avg >= 20) return "Needs Support";
  return "At Risk";
}

function TeacherDashboard() {
  const nav = useNavigate();
  const [teacher, setTeacher] = useState<{ name: string; email: string } | null>(null);
  const [tab, setTab] = useState<"overview" | "students" | "subjects" | "keys">("overview");
  const [enrollKeys, setEnrollKeys] = useState<EnrollmentKey[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [showProfile, setShowProfile] = useState(false);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  const signOut = () => {
    sessionStorage.removeItem("buddy_fake_auth");
    sessionStorage.removeItem("buddy_role");
    sessionStorage.removeItem("buddy_email");
    nav({ to: "/" });
  };

  useEffect(() => {
    const auth = sessionStorage.getItem("buddy_fake_auth") === "1";
    const role = sessionStorage.getItem("buddy_role");
    const email = sessionStorage.getItem("buddy_email") || "teacher@buddy.lk";
    if (!auth || role !== "teacher") { nav({ to: "/login" }); return; }
    setTeacher({ email, name: sessionStorage.getItem("buddy_full_name") || email.split("@")[0].replace(/\./g, " ") });
    setEnrollKeys(getAllKeys());
    loadData();
  }, [nav]);

  async function loadData() {
    setLoading(true);
    try {
      // Load all students
      const { data: studentData } = await db.from("students").select("id, email, full_name, course_progress");
      // Load all enrollments
      const { data: enrollData } = await db.from("enrollments").select("email, course_id");

      if (studentData) {
        const enrollMap: Record<string, string[]> = {};
        (enrollData || []).forEach((e: any) => {
          if (!enrollMap[e.email]) enrollMap[e.email] = [];
          enrollMap[e.email].push(e.course_id);
        });

        const rows: StudentRow[] = studentData.map((s: any) => {
          const progress: Record<string, number> = s.course_progress ?? {};
          const enrolledCourses = enrollMap[s.email] ?? [];
          return {
            id: s.id.slice(0, 8).toUpperCase(),
            name: s.full_name || s.email.split("@")[0],
            email: s.email,
            enrolledCourses,
            progress,
            status: getStatus(progress, enrolledCourses),
          };
        });
        setStudents(rows);

        // Build subject stats
        const subjectMap: Record<string, { students: Set<string>; totalProgress: number }> = {};
        (enrollData || []).forEach((e: any) => {
          const course = COURSES.find(c => c.id === e.course_id);
          const name = course?.title ?? e.course_id;
          if (!subjectMap[name]) subjectMap[name] = { students: new Set(), totalProgress: 0 };
          subjectMap[name].students.add(e.email);
          // Find progress for this student+course
          const st = studentData.find((s: any) => s.email === e.email);
          const prog = (st?.course_progress ?? {})[e.course_id] ?? 0;
          subjectMap[name].totalProgress += prog;
        });

        const subjectRows: SubjectRow[] = Object.entries(subjectMap).map(([name, v]) => ({
          name,
          courseId: COURSES.find(c => c.title === name)?.id ?? name,
          students: v.students.size,
          avgProgress: v.students.size > 0 ? Math.round(v.totalProgress / v.students.size) : 0,
        }));
        setSubjects(subjectRows);
      }
    } catch (err) {
      console.error("Failed to load teacher data", err);
    }
    setLoading(false);
  }

  if (!teacher) return <div className="min-h-screen flex items-center justify-center text-sm">Loading…</div>;

  const filtered = students.filter(s =>
    (filter === "all" || s.status === filter) &&
    (q === "" || s.name.toLowerCase().includes(q.toLowerCase()) || s.email.toLowerCase().includes(q.toLowerCase()))
  );

  const totals = {
    students: students.length,
    onTrack: students.filter(s => s.status === "On Track").length,
    atRisk: students.filter(s => s.status === "At Risk" || s.status === "Needs Support").length,
    avgProgress: students.length
      ? Math.round(students.reduce((a, s) => {
          const courses = s.enrolledCourses;
          if (!courses.length) return a;
          return a + courses.reduce((b, id) => b + (s.progress[id] ?? 0), 0) / courses.length;
        }, 0) / students.length)
      : 0,
  };

  return (
    <div className="bg-background">
      <SiteNav mode="pill" />
      <Toaster />

      <section className="bg-foreground text-background pt-32 pb-10">
        <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-1">
            <div className="text-[10px] tracking-[0.4em] uppercase text-accent mb-2">— Teacher Dashboard</div>
            <h1 className="font-serif text-4xl md:text-5xl capitalize">Welcome, {teacher.name.split(" ")[0]}.</h1>
            <p className="text-background/70 mt-2 text-sm">Engineering Department · Senior Lecturer</p>
          </div>
          <button onClick={() => setShowProfile(true)} aria-label="Open profile"
            className="w-11 h-11 rounded-full bg-accent text-foreground flex items-center justify-center hover:bg-accent/90 transition-colors shrink-0">
            <User className="w-5 h-5" />
          </button>
        </div>
      </section>

      {showProfile && <TeacherProfilePanel teacher={teacher} onClose={() => setShowProfile(false)} onSignOut={signOut} />}

      <div className="mx-auto max-w-7xl px-6 md:px-12 py-10 space-y-10">
        <div className="flex gap-1 border-b border-border">
          {(["overview", "students", "subjects", "keys"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-3 text-[11px] tracking-[0.3em] uppercase border-b-2 -mb-px transition-colors ${
                tab === t ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>{t}</button>
          ))}
        </div>

        {loading && <div className="text-center py-20 text-sm text-muted-foreground">Loading real data…</div>}

        {!loading && tab === "overview" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat icon={Users} label="Total Students" value={totals.students.toString()} accent />
              <Stat icon={CheckCircle2} label="On Track" value={totals.onTrack.toString()} />
              <Stat icon={AlertTriangle} label="Need Support" value={totals.atRisk.toString()} warn />
              <Stat icon={TrendingUp} label="Avg Progress" value={`${totals.avgProgress}%`} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Panel title="Enrolled Students" icon={Activity}>
                {students.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-t border-border first:border-t-0 text-sm">
                    <div>
                      <div className="font-medium capitalize">{s.name}</div>
                      <div className="text-[12px] text-muted-foreground">{s.enrolledCourses.length} course{s.enrolledCourses.length !== 1 ? "s" : ""} · {s.email}</div>
                    </div>
                    <StatusPill status={s.status} />
                  </div>
                ))}
                {students.length === 0 && <p className="text-sm text-muted-foreground py-4">No students enrolled yet.</p>}
              </Panel>

              <Panel title="Students Needing Support" icon={AlertTriangle}>
                {students.filter(s => s.status === "At Risk" || s.status === "Needs Support").map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-t border-border first:border-t-0 text-sm">
                    <div>
                      <div className="font-medium capitalize">{s.name}</div>
                      <div className="text-[12px] text-muted-foreground">{s.enrolledCourses.length} enrolled · {s.status}</div>
                    </div>
                    <StatusPill status={s.status} />
                  </div>
                ))}
                {students.filter(s => s.status === "At Risk" || s.status === "Needs Support").length === 0 &&
                  <p className="text-sm text-muted-foreground py-4">No students need support right now. 🎉</p>}
              </Panel>
            </div>
          </>
        )}

        {!loading && tab === "students" && (
          <div className="space-y-5">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search students..."
                  className="w-full pl-10 pr-4 py-2.5 border border-border bg-transparent text-sm focus:outline-none focus:border-accent" />
              </div>
              <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase flex-wrap">
                <Filter className="w-3.5 h-3.5" />
                {(["all", "On Track", "Monitor", "Needs Support", "At Risk"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 border ${filter === f ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-border overflow-hidden">
              <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_40px] gap-3 px-5 py-3 bg-secondary/50 text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-semibold">
                <div>Student</div><div>Email</div><div>Courses</div><div>Status</div><div></div>
              </div>
              {filtered.length === 0 && (
                <div className="px-5 py-10 text-center text-sm text-muted-foreground">No students found.</div>
              )}
              {filtered.map((s, i) => (
                <div key={i} className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_40px] gap-3 px-5 py-3.5 border-t border-border items-center text-sm hover:bg-secondary/30">
                  <div className="font-medium capitalize">{s.name}</div>
                  <div className="text-[12px] text-muted-foreground truncate">{s.email}</div>
                  <div className="text-[13px]">{s.enrolledCourses.length}</div>
                  <div><StatusPill status={s.status} /></div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tab === "subjects" && (
          <div className="grid md:grid-cols-2 gap-4">
            {subjects.length === 0 && <p className="text-sm text-muted-foreground col-span-2 py-10 text-center">No enrollment data yet.</p>}
            {subjects.map(s => (
              <div key={s.name} className="border border-border p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <BookOpen className="w-4 h-4 text-accent mb-2" />
                    <div className="font-serif text-lg">{s.name}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center mt-4">
                  <div>
                    <div className="text-xl font-serif">{s.students}</div>
                    <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Students</div>
                  </div>
                  <div>
                    <div className="text-xl font-serif">{s.avgProgress}%</div>
                    <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Avg Progress</div>
                  </div>
                </div>
                <div className="mt-4 h-1.5 bg-secondary"><div className="h-full bg-accent" style={{ width: `${s.avgProgress}%` }} /></div>
              </div>
            ))}
          </div>
        )}

        {tab === "keys" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-accent" />
              <h2 className="font-serif text-xl">Course Enrollment Keys</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Share each 6-digit key with students so they can enroll in that course.
            </p>
            <div className="border border-border divide-y divide-border">
              {enrollKeys.map((ek) => {
                const course = COURSES.find((c) => c.id === ek.courseId);
                return <TeacherKeyRow key={ek.courseId} ek={ek} courseName={course?.title ?? ek.courseId} />;
              })}
              {enrollKeys.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">No enrollment keys found.</div>
              )}
            </div>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}

function TeacherKeyRow({ ek, courseName }: { ek: EnrollmentKey; courseName: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(ek.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="font-serif text-base truncate">{courseName}</div>
        <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mt-0.5">
          Key last updated: {new Date(ek.updatedAt).toLocaleString()}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="font-mono tracking-[0.5em] text-xl bg-accent/15 text-accent px-4 py-2 rounded-sm select-all">{ek.key}</div>
        <button onClick={copy} title="Copy key" className="text-xs border border-border p-2 hover:bg-secondary">
          {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent, warn }: { icon: any; label: string; value: string; accent?: boolean; warn?: boolean }) {
  return (
    <div className={`border p-5 ${accent ? "bg-foreground text-background border-foreground" : warn ? "border-orange-500/40" : "border-border"}`}>
      <Icon className={`w-4 h-4 mb-3 ${accent ? "text-accent" : warn ? "text-orange-600" : "text-accent"}`} />
      <div className="text-3xl font-serif">{value}</div>
      <div className={`text-[10px] tracking-[0.3em] uppercase mt-1 ${accent ? "text-background/70" : "text-muted-foreground"}`}>{label}</div>
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="border border-border p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-accent" />
        <h3 className="font-serif text-lg">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const cls = {
    "On Track": "bg-green-500/15 text-green-700",
    "Monitor": "bg-yellow-500/15 text-yellow-700",
    "Needs Support": "bg-orange-500/15 text-orange-700",
    "At Risk": "bg-red-500/15 text-red-700",
  }[status];
  return <span className={`text-[10px] tracking-[0.2em] uppercase px-2 py-1 ${cls}`}>{status}</span>;
}

function TeacherProfilePanel({ teacher, onClose, onSignOut }: { teacher: { name: string; email: string }; onClose: () => void; onSignOut: () => void }) {
  const [editing, setEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const handlePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePic(URL.createObjectURL(file));
    toast.success("Profile picture updated");
  };
  const [data, setData] = useState({
    full_name: teacher.name, email: teacher.email,
    phone: "+94 77 555 0142", age: "38",
    department: "Engineering", position: "Senior Lecturer", ai_literacy: "Intermediate",
  });
  const fields: Array<{ k: keyof typeof data; label: string; icon: React.ReactNode; type?: string }> = [
    { k: "full_name", label: "Full Name", icon: <User /> },
    { k: "email", label: "Email", icon: <Mail /> },
    { k: "phone", label: "Phone", icon: <Phone /> },
    { k: "age", label: "Age", icon: <User />, type: "number" },
    { k: "department", label: "Department", icon: <BookOpen /> },
    { k: "position", label: "Current Position", icon: <Briefcase /> },
    { k: "ai_literacy", label: "AI Literacy", icon: <Sparkles /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end" onClick={onClose}>
      <aside onClick={(e) => e.stopPropagation()} className="w-full max-w-md h-full bg-background border-l border-border overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="text-[10px] tracking-[0.3em] uppercase text-accent">— Teacher Profile</div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-6 flex items-center gap-4 border-b border-border">
          <div className="relative group w-16 h-16 shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-foreground/30 flex items-center justify-center text-xl font-serif capitalize overflow-hidden">
              {profilePic ? <img src={profilePic} alt="Profile" className="w-full h-full object-cover" /> : data.full_name[0]?.toUpperCase()}
            </div>
            <label className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-5 h-5 text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handlePicUpload} />
            </label>
          </div>
          <div>
            <div className="font-serif text-xl capitalize">{data.full_name}</div>
            <div className="text-xs text-muted-foreground">{data.position}</div>
          </div>
        </div>
        <div className="px-6 py-6 space-y-4">
          {fields.map((f) => (
            <div key={f.k} className="flex gap-3">
              <span className="text-accent mt-1 [&>svg]:w-4 [&>svg]:h-4">{f.icon}</span>
              <div className="flex-1">
                <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{f.label}</div>
                {editing ? (
                  f.k === "ai_literacy" ? (
                    <select value={data.ai_literacy} onChange={(e) => setData((d) => ({ ...d, ai_literacy: e.target.value }))}
                      className="mt-1 w-full border-b border-border bg-transparent text-sm py-1 focus:outline-none focus:border-accent">
                      <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                    </select>
                  ) : (
                    <input type={f.type || "text"} value={data[f.k]} onChange={(e) => setData((d) => ({ ...d, [f.k]: e.target.value }))}
                      className="mt-1 w-full border-b border-border bg-transparent text-sm py-1 focus:outline-none focus:border-accent" />
                  )
                ) : <div className="text-sm mt-0.5">{data[f.k] || "—"}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-5 border-t border-border space-y-2">
          {editing ? (
            <button onClick={() => { setEditing(false); toast.success("Profile updated"); }}
              className="w-full bg-foreground text-background py-3 text-[11px] tracking-[0.3em] uppercase hover:bg-accent hover:text-foreground transition-colors">Save</button>
          ) : (
            <button onClick={() => setEditing(true)}
              className="w-full border border-foreground py-3 text-[11px] tracking-[0.3em] uppercase hover:bg-foreground hover:text-background transition-colors">Edit</button>
          )}
          <button onClick={onSignOut}
            className="w-full border border-border py-3 text-[11px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">Sign out</button>
        </div>
      </aside>
    </div>
  );
}
