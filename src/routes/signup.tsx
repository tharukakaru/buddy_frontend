import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Sign up — BUDDY" }] }),
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
    <div className="min-h-screen grid md:grid-cols-[1fr_1.2fr]">
      <Toaster />
      <div className="hidden md:flex flex-col justify-between bg-foreground text-background p-12 sticky top-0 h-screen">
        <Link to="/" className="font-serif tracking-[0.4em] uppercase text-sm">Tissa Jinasena Group</Link>
        <div>
          <h1 className="font-serif text-5xl leading-tight">Join <em>Buddy</em>.</h1>
          <p className="mt-4 text-background/60 text-sm max-w-sm">
            Tell us a little about yourself. Every account is reviewed before activation.
          </p>
        </div>
        <p className="text-[11px] tracking-display uppercase text-background/40">Powered by AbsolX Core AI</p>
      </div>
      <div className="flex items-start justify-center p-8 md:p-16">
        <form onSubmit={submit} className="w-full max-w-md space-y-8">
          <div>
            <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-2">— Create account</div>
            <h2 className="font-serif text-3xl">Welcome to Buddy</h2>
          </div>

          {/* Role */}
          <div className="grid grid-cols-2 gap-3">
            {(["student", "teacher"] as const).map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`py-3 text-xs tracking-[0.25em] uppercase border transition-all ${
                  role === r ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"
                }`}>
                {r}
              </button>
            ))}
          </div>

          {/* Common */}
          <div className="space-y-4">
            <F label="Full Name *"><I value={form.full_name || ""} onChange={(v) => set("full_name", v)} /></F>
            <F label="Email *"><I type="email" value={form.email || ""} onChange={(v) => set("email", v)} /></F>
            <F label="Password *"><I type="password" value={form.password || ""} onChange={(v) => set("password", v)} /></F>
          </div>

          {role === "student" ? (
            <div className="space-y-4">
              <div className="text-[11px] tracking-display uppercase text-muted-foreground">— Student details</div>
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
            <div className="space-y-4">
              <div className="text-[11px] tracking-display uppercase text-muted-foreground">— Teacher details</div>
              <F label="Department"><I value={form.department || ""} onChange={(v) => set("department", v)} /></F>
              <F label="Designation"><I value={form.designation || ""} onChange={(v) => set("designation", v)} /></F>
              <div>
                <div className="text-[10px] tracking-display uppercase text-muted-foreground mb-2">Subjects</div>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((s) => (
                    <button type="button" key={s} onClick={() => toggleSubject(s)}
                      className={`text-xs px-3 py-1.5 border ${subjects.includes(s) ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button disabled={busy}
            className="w-full bg-foreground text-background py-3 text-xs tracking-[0.3em] uppercase hover:bg-foreground/90 disabled:opacity-50">
            {busy ? "Submitting…" : "Submit for Review"}
          </button>
          <p className="text-xs text-muted-foreground text-center">
            Already have an account? <Link to="/login" className="border-b border-foreground hover:text-accent hover:border-accent">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-display uppercase text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function I(props: { value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input type={props.type || "text"} value={props.value} onChange={(e) => props.onChange(e.target.value)}
      className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-accent" />
  );
}
