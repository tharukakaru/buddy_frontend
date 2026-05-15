import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GraduationCap, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import heroOcean from "@/assets/hero-ocean.jpg";
import absolxLogo from "@/assets/absolx-logo.png";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Create account — BUDDY" }] }),
});

const SUBJECTS = [
  "PD Training/Special Program", "English", "Basic Calculations",
  "Engineering Fundamentals", "Engineering Drawing", "ICT",
  "Electrical", "Electronics", "PLC", "Workshop Technology",
  "Machining", "Hydraulics and Pneumatics",
];

function SignupPage() {
  const nav = useNavigate();
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [subjects, setSubjects] = useState<string[]>([]);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.full_name) {
      return toast.error("Please fill in name, email and password.");
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
        data: { full_name: form.full_name, role },
      },
    });
    if (error) { setBusy(false); return toast.error(error.message); }
    const uid = data.user?.id;
    if (uid) {
      await supabase.from("profiles").update({
        full_name: form.full_name,
        role,
        status: "pending",
        age: role === "student" && form.age ? Number(form.age) : null,
        student_id: role === "student" ? form.student_id || null : null,
        phone: role === "student" ? form.phone || null : null,
        hometown: role === "student" ? form.hometown || null : null,
        qualification: role === "student" ? form.qualification || null : null,
        department: role === "teacher" ? form.department || null : null,
        designation: role === "teacher" ? form.designation || null : null,
        subjects: role === "teacher" ? subjects : null,
      }).eq("id", uid);
    }
    setBusy(false);
    toast.success("Application submitted — pending review", {
      description: "You'll get an email once an admin approves your account.",
      duration: 6000,
    });
    setTimeout(() => nav({ to: "/onboarding" }), 1200);
  };

  const toggleSubject = (s: string) =>
    setSubjects((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]);

  return (
    <div className="min-h-screen bg-background grid md:grid-cols-[1fr_1.15fr]">
      <Toaster />

      {/* LEFT — sticky brand panel */}
      <div className="relative hidden md:flex flex-col justify-between p-10 lg:p-14 text-white sticky top-0 h-screen overflow-hidden">
        <img src={heroOcean} alt="" className="absolute inset-0 h-full w-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/60 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(217,168,90,0.22),transparent_55%)]" />

        <Link to="/" className="relative font-serif tracking-[0.4em] uppercase text-[11px]">
          Tissa Jinasena Group
        </Link>

        <div className="relative max-w-md">
          <div className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-5">— Join Buddy</div>
          <h1 className="font-serif text-5xl lg:text-6xl leading-[0.95]">
            Begin your <em className="text-accent">journey</em>.
          </h1>
          <div className="mt-8 h-px w-12 bg-accent" />
          <p className="mt-6 text-white/65 text-[13px] leading-relaxed max-w-sm">
            Every account is reviewed before activation — to keep Buddy a thoughtful, mentored space.
          </p>
        </div>

        <div className="relative flex items-center gap-3 text-white/55">
          <span className="text-[10px] tracking-[0.3em] uppercase">Powered by</span>
          <img src={absolxLogo} alt="AbsolX" className="h-6 w-auto opacity-90" />
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="flex items-start justify-center p-6 md:p-12 lg:p-16">
        <form onSubmit={submit} className="w-full max-w-md space-y-8 py-8">
          <div>
            <div className="text-[10px] tracking-[0.35em] uppercase text-accent mb-3">— Create account</div>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">Tell us about you</h2>
            <p className="text-[13px] text-muted-foreground mt-3">
              Choose a role, fill in your details, and we'll review your application.
            </p>
          </div>

          {/* Role toggle — premium card style */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-secondary rounded-sm">
            <RoleCard active={role === "student"} onClick={() => setRole("student")}
              icon={<GraduationCap className="w-4 h-4" />} label="Student" />
            <RoleCard active={role === "teacher"} onClick={() => setRole("teacher")}
              icon={<Briefcase className="w-4 h-4" />} label="Teacher" />
          </div>

          {/* Common */}
          <div className="space-y-5">
            <F label="Full Name *"><I value={form.full_name || ""} onChange={(v) => set("full_name", v)} placeholder="e.g. Tharuka Perera" /></F>
            <F label="Email *"><I type="email" value={form.email || ""} onChange={(v) => set("email", v)} placeholder="you@example.com" /></F>
            <F label="Password *"><I type="password" value={form.password || ""} onChange={(v) => set("password", v)} placeholder="••••••••" /></F>
          </div>

          {role === "student" ? (
            <div className="space-y-5 pt-2 border-t border-border">
              <div className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground pt-4">— Student details</div>
              <div className="grid grid-cols-2 gap-4">
                <F label="Age"><I type="number" value={form.age || ""} onChange={(v) => set("age", v)} /></F>
                <F label="Student ID"><I value={form.student_id || ""} onChange={(v) => set("student_id", v)} /></F>
              </div>
              <F label="Phone"><I value={form.phone || ""} onChange={(v) => set("phone", v)} /></F>
              <F label="Home Town"><I value={form.hometown || ""} onChange={(v) => set("hometown", v)} /></F>
              <F label="Highest Educational Qualification"><I value={form.qualification || ""} onChange={(v) => set("qualification", v)} /></F>
              <F label="Photo URL (optional)"><I value={form.photo_url || ""} onChange={(v) => set("photo_url", v)} /></F>
            </div>
          ) : (
            <div className="space-y-5 pt-2 border-t border-border">
              <div className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground pt-4">— Teacher details</div>
              <F label="Department"><I value={form.department || ""} onChange={(v) => set("department", v)} /></F>
              <F label="Designation"><I value={form.designation || ""} onChange={(v) => set("designation", v)} /></F>
              <div>
                <div className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-3">Subjects</div>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((s) => (
                    <button type="button" key={s} onClick={() => toggleSubject(s)}
                      className={`text-[11px] px-3 py-1.5 border rounded-sm transition-all ${subjects.includes(s) ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button disabled={busy}
            className="group relative w-full bg-foreground text-background py-3.5 text-[11px] tracking-[0.35em] uppercase overflow-hidden transition-all hover:shadow-[0_15px_40px_-15px] hover:shadow-accent/60 disabled:opacity-50">
            <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative">{busy ? "Submitting…" : "Submit for Review"}</span>
          </button>

          <p className="text-[12px] text-muted-foreground text-center">
            Already have an account?{" "}
            <Link to="/login" className="border-b border-foreground hover:text-accent hover:border-accent">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function RoleCard({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className={`relative flex items-center justify-center gap-2 py-3 text-[11px] tracking-[0.3em] uppercase rounded-sm transition-all ${
        active ? "bg-background text-foreground shadow-sm ring-1 ring-foreground/10" : "text-muted-foreground hover:text-foreground"
      }`}>
      {icon}
      {label}
    </button>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function I(props: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <input type={props.type || "text"} value={props.value} onChange={(e) => props.onChange(e.target.value)}
      placeholder={props.placeholder}
      className="w-full bg-transparent border-b border-border py-2.5 text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/40" />
  );
}
