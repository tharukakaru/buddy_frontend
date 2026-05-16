import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Users, BookOpen, TrendingUp, AlertTriangle, Search, Filter, ChevronRight,
  CheckCircle2, Activity,
} from "lucide-react";

export const Route = createFileRoute("/teacher")({
  component: TeacherDashboard,
  head: () => ({ meta: [{ title: "Teacher Dashboard — BUDDY" }] }),
});

type Status = "On Track" | "Monitor" | "Needs Support" | "At Risk";

const STUDENTS: Array<{ id: string; name: string; subject: string; expected: number; actual: number; quiz: number; engagement: "Active" | "Low"; status: Status; }> = [
  { id: "S001", name: "Tharuka Perera", subject: "Basic Calculations", expected: 35, actual: 38, quiz: 82, engagement: "Active", status: "On Track" },
  { id: "S002", name: "Nipun Silva", subject: "Engineering Drawing", expected: 35, actual: 31, quiz: 74, engagement: "Active", status: "Monitor" },
  { id: "S003", name: "Hasini Fernando", subject: "ICT", expected: 35, actual: 22, quiz: 58, engagement: "Low", status: "Needs Support" },
  { id: "S004", name: "Kavindu Jayasuriya", subject: "Workshop Technology", expected: 35, actual: 12, quiz: 42, engagement: "Low", status: "At Risk" },
  { id: "S005", name: "Sanduni Bandara", subject: "PLC", expected: 35, actual: 41, quiz: 91, engagement: "Active", status: "On Track" },
  { id: "S006", name: "Ravindu Kumar", subject: "Hydraulics & Pneumatics", expected: 35, actual: 30, quiz: 70, engagement: "Active", status: "Monitor" },
];

const SUBJECTS = [
  { name: "PD Training / Special Program", weight: 12.5, students: 28, avgQuiz: 81, avgProgress: 78 },
  { name: "English", weight: 12.5, students: 28, avgQuiz: 74, avgProgress: 65 },
  { name: "Basic Calculations", weight: 12.5, students: 28, avgQuiz: 76, avgProgress: 72 },
  { name: "Engineering Drawing", weight: 12.5, students: 28, avgQuiz: 69, avgProgress: 58 },
  { name: "ICT", weight: 12.5, students: 28, avgQuiz: 71, avgProgress: 62 },
  { name: "Workshop Technology", weight: 12.5, students: 28, avgQuiz: 65, avgProgress: 55 },
  { name: "PLC", weight: 12.5, students: 28, avgQuiz: 79, avgProgress: 70 },
  { name: "Hydraulics & Pneumatics", weight: 6.35, students: 28, avgQuiz: 72, avgProgress: 60 },
];

function TeacherDashboard() {
  const nav = useNavigate();
  const [teacher, setTeacher] = useState<{ name: string; email: string } | null>(null);
  const [tab, setTab] = useState<"overview" | "students" | "subjects">("overview");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");

  useEffect(() => {
    const auth = sessionStorage.getItem("buddy_fake_auth") === "1";
    const role = sessionStorage.getItem("buddy_role");
    const email = sessionStorage.getItem("buddy_email") || "teacher@buddy.lk";
    if (!auth || role !== "teacher") {
      nav({ to: "/login" });
      return;
    }
    setTeacher({ email, name: email.split("@")[0].replace(/\./g, " ") });
  }, [nav]);

  if (!teacher) {
    return <div className="min-h-screen flex items-center justify-center text-sm">Loading…</div>;
  }

  const filtered = STUDENTS.filter(s =>
    (filter === "all" || s.status === filter) &&
    (q === "" || s.name.toLowerCase().includes(q.toLowerCase()) || s.id.toLowerCase().includes(q.toLowerCase()))
  );

  const totals = {
    students: STUDENTS.length,
    onTrack: STUDENTS.filter(s => s.status === "On Track").length,
    atRisk: STUDENTS.filter(s => s.status === "At Risk" || s.status === "Needs Support").length,
    avgQuiz: Math.round(STUDENTS.reduce((a, s) => a + s.quiz, 0) / STUDENTS.length),
  };

  return (
    <div className="bg-background">
      <SiteNav />

      <section className="bg-foreground text-background pt-32 pb-10">
        <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-1">
            <div className="text-[10px] tracking-[0.4em] uppercase text-accent mb-2">— Teacher Dashboard</div>
            <h1 className="font-serif text-4xl md:text-5xl capitalize">Welcome, {teacher.name.split(" ")[0]}.</h1>
            <p className="text-background/70 mt-2 text-sm">
              Engineering Department · Senior Lecturer
            </p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("buddy_fake_auth");
              sessionStorage.removeItem("buddy_role");
              sessionStorage.removeItem("buddy_email");
              nav({ to: "/" });
            }}
            className="text-[11px] tracking-[0.3em] uppercase border border-background/40 px-5 py-2.5 hover:bg-background hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 md:px-12 py-10 space-y-10">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          {(["overview", "students", "subjects"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-3 text-[11px] tracking-[0.3em] uppercase border-b-2 -mb-px transition-colors ${
                tab === t ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat icon={Users} label="Total Students" value={totals.students.toString()} accent />
              <Stat icon={CheckCircle2} label="On Track" value={totals.onTrack.toString()} />
              <Stat icon={AlertTriangle} label="Need Support" value={totals.atRisk.toString()} warn />
              <Stat icon={TrendingUp} label="Avg Quiz Score" value={`${totals.avgQuiz}%`} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Panel title="Recent Activity" icon={Activity}>
                {[
                  { name: "Sanduni Bandara", action: "completed Day 8 quiz", score: "91%", time: "2h ago" },
                  { name: "Tharuka Perera", action: "started Module 4", score: "—", time: "3h ago" },
                  { name: "Hasini Fernando", action: "missed Day 6 quiz", score: "—", time: "1d ago" },
                  { name: "Kavindu Jayasuriya", action: "low quiz score", score: "42%", time: "1d ago" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-t border-border first:border-t-0 text-sm">
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-[12px] text-muted-foreground">{r.action} · {r.time}</div>
                    </div>
                    {r.score !== "—" && <span className="text-[11px] tracking-[0.2em] uppercase bg-secondary px-2 py-1">{r.score}</span>}
                  </div>
                ))}
              </Panel>

              <Panel title="Students Needing Support" icon={AlertTriangle}>
                {STUDENTS.filter(s => s.status === "At Risk" || s.status === "Needs Support").map(s => (
                  <div key={s.id} className="flex items-center justify-between py-3 border-t border-border first:border-t-0 text-sm">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-[12px] text-muted-foreground">Gap: {s.actual - s.expected}% · Quiz: {s.quiz}%</div>
                    </div>
                    <button className="text-[11px] tracking-[0.2em] uppercase border-b border-foreground hover:text-accent hover:border-accent">
                      Message
                    </button>
                  </div>
                ))}
              </Panel>
            </div>
          </>
        )}

        {tab === "students" && (
          <div className="space-y-5">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search students..."
                  className="w-full pl-10 pr-4 py-2.5 border border-border bg-transparent text-sm focus:outline-none focus:border-accent" />
              </div>
              <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase">
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
              <div className="grid grid-cols-[80px_1.5fr_1.5fr_1fr_1fr_1fr_1fr_40px] gap-3 px-5 py-3 bg-secondary/50 text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-semibold">
                <div>ID</div><div>Student</div><div>Subject</div>
                <div>Expected</div><div>Actual</div><div>Quiz</div><div>Status</div><div></div>
              </div>
              {filtered.map(s => {
                const gap = s.actual - s.expected;
                return (
                  <div key={s.id} className="grid grid-cols-[80px_1.5fr_1.5fr_1fr_1fr_1fr_1fr_40px] gap-3 px-5 py-3.5 border-t border-border items-center text-sm hover:bg-secondary/30">
                    <div className="text-[12px] text-muted-foreground">{s.id}</div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-[13px]">{s.subject}</div>
                    <div className="text-[13px]">{s.expected}%</div>
                    <div className="text-[13px]">{s.actual}% <span className={`text-[11px] ml-1 ${gap >= 0 ? "text-green-600" : "text-orange-600"}`}>({gap >= 0 ? "+" : ""}{gap})</span></div>
                    <div className="text-[13px]">{s.quiz}%</div>
                    <div><StatusPill status={s.status} /></div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "subjects" && (
          <div className="grid md:grid-cols-2 gap-4">
            {SUBJECTS.map(s => (
              <div key={s.name} className="border border-border p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <BookOpen className="w-4 h-4 text-accent mb-2" />
                    <div className="font-serif text-lg">{s.name}</div>
                  </div>
                  <span className="text-[11px] tracking-[0.2em] uppercase bg-secondary px-2 py-1">{s.weight}%</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center mt-4">
                  <div>
                    <div className="text-xl font-serif">{s.students}</div>
                    <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Students</div>
                  </div>
                  <div>
                    <div className="text-xl font-serif">{s.avgQuiz}%</div>
                    <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Avg Quiz</div>
                  </div>
                  <div>
                    <div className="text-xl font-serif">{s.avgProgress}%</div>
                    <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Progress</div>
                  </div>
                </div>
                <div className="mt-4 h-1.5 bg-secondary"><div className="h-full bg-accent" style={{ width: `${s.avgProgress}%` }} /></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SiteFooter />
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
