import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { User, Mail, Phone, MapPin, GraduationCap, BookOpen, Award, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Profile — BUDDY" }] }),
});

function ProfilePage() {
  const nav = useNavigate();
  const [profile, setProfile] = useState<{ email: string; full_name: string; role: string } | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem("buddy_fake_auth") === "1";
    const role = sessionStorage.getItem("buddy_role") || "student";
    const email = sessionStorage.getItem("buddy_email") || "student@buddy.lk";
    if (!auth || role !== "student") {
      nav({ to: "/login" });
      return;
    }
    setProfile({ email, full_name: email.split("@")[0].replace(/\./g, " "), role });
  }, [nav]);

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center text-sm">Loading…</div>;
  }

  const signOut = () => {
    sessionStorage.removeItem("buddy_fake_auth");
    sessionStorage.removeItem("buddy_role");
    sessionStorage.removeItem("buddy_email");
    toast.success("Signed out");
    nav({ to: "/" });
  };

  const stats = [
    { label: "Courses Enrolled", value: "3", icon: BookOpen },
    { label: "Avg Quiz Score", value: "74%", icon: Award },
    { label: "Days Active", value: "21", icon: TrendingUp },
    { label: "Engagement", value: "Active", icon: User },
  ];

  const courses = [
    { name: "Basic Calculations", days: "10 / 12", pct: 80, status: "Needs Revision" },
    { name: "PD Training / Special Program", days: "21 / 21", pct: 100, status: "On Track" },
    { name: "English", days: "8 / 12", pct: 65, status: "Monitor" },
  ];

  return (
    <div>
      <SiteNav />
      <Toaster />

      <section className="bg-foreground text-background pt-32 pb-12">
        <div className="mx-auto max-w-5xl px-6 md:px-12 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-accent to-background/30 flex items-center justify-center text-3xl font-serif capitalize">
            {(profile.full_name || profile.email)[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-[10px] tracking-[0.4em] uppercase text-accent mb-2">— Student</div>
            <h1 className="font-serif text-4xl md:text-5xl capitalize">{profile.full_name}</h1>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-background/80">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {profile.email}</span>
              <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> Status: <strong className="text-accent">Approved</strong></span>
            </div>
          </div>
          <button onClick={signOut} className="text-[11px] tracking-[0.3em] uppercase border border-background/40 px-5 py-2.5 hover:bg-background hover:text-foreground transition-colors">
            Sign out
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 md:px-12 py-12 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="border border-border p-5">
              <s.icon className="w-4 h-4 text-accent mb-3" />
              <div className="text-2xl font-serif">{s.value}</div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <PersonalInfo profile={profile} />


        <div>
          <h2 className="font-serif text-2xl mb-5">My Courses</h2>
          <div className="border border-border divide-y divide-border">
            {courses.map(c => (
              <div key={c.name} className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="font-serif text-lg">{c.name}</div>
                  <div className="text-[12px] text-muted-foreground mt-0.5">{c.days} days</div>
                </div>
                <div className="flex-1 max-w-xs">
                  <div className="h-2 bg-secondary"><div className="h-full bg-accent" style={{ width: `${c.pct}%` }} /></div>
                  <div className="text-[11px] text-muted-foreground mt-1">{c.pct}% complete</div>
                </div>
                <span className={`text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 ${
                  c.status === "On Track" ? "bg-accent/15 text-accent" :
                  c.status === "Monitor" ? "bg-yellow-500/15 text-yellow-700" :
                  "bg-orange-500/15 text-orange-700"
                }`}>{c.status}</span>
                <Link to="/courses" className="text-[11px] tracking-[0.25em] uppercase border-b border-foreground hover:text-accent hover:border-accent">
                  Open →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null | undefined }) {
  return (
    <div className="flex gap-3">
      <span className="text-accent mt-0.5 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
      <div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{label}</div>
        <div className="text-sm mt-0.5">{value || "—"}</div>
      </div>
    </div>
  );
}

function PersonalInfo({ profile }: { profile: { email: string; full_name: string; role: string } }) {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState({
    full_name: profile.full_name,
    email: profile.email,
    student_id: "JTF-2026-0182",
    phone: "+94 77 123 4567",
    hometown: "Colombo",
    qualification: "GCE A/L",
  });
  const fields: Array<{ k: keyof typeof data; label: string; icon: React.ReactNode }> = [
    { k: "full_name", label: "Full Name", icon: <User /> },
    { k: "email", label: "Email", icon: <Mail /> },
    { k: "student_id", label: "Student ID", icon: <GraduationCap /> },
    { k: "phone", label: "Phone", icon: <Phone /> },
    { k: "hometown", label: "Home Town", icon: <MapPin /> },
    { k: "qualification", label: "Qualification", icon: <Award /> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-2xl">Personal Information</h2>
        {editing ? (
          <button
            onClick={() => { setEditing(false); toast.success("Profile updated"); }}
            className="text-[11px] tracking-[0.3em] uppercase bg-foreground text-background px-5 py-2.5 hover:bg-accent hover:text-foreground transition-colors"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-[11px] tracking-[0.3em] uppercase border border-foreground px-5 py-2.5 hover:bg-foreground hover:text-background transition-colors"
          >
            Edit
          </button>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-5 text-sm border border-border p-6">
        {fields.map((f) => (
          <div key={f.k} className="flex gap-3">
            <span className="text-accent mt-0.5 [&>svg]:w-4 [&>svg]:h-4">{f.icon}</span>
            <div className="flex-1">
              <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{f.label}</div>
              {editing ? (
                <input
                  value={data[f.k]}
                  onChange={(e) => setData((d) => ({ ...d, [f.k]: e.target.value }))}
                  className="mt-1 w-full border-b border-border bg-transparent text-sm py-1 focus:outline-none focus:border-accent"
                />
              ) : (
                <div className="text-sm mt-0.5">{data[f.k] || "—"}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

