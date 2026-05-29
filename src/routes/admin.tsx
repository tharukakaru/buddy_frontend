import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  listUsers, approveUser, rejectUser, deleteUser,
  isSuperAdmin, setSuperAdmin, type PendingUser,
} from "@/lib/approval-store";
import { Copy, Check, X, Trash2, Shield, RefreshCw, Key, RotateCcw } from "lucide-react";
import { getAllKeys, regenerateKey, type EnrollmentKey } from "@/lib/enrollment-keys";
import { COURSES } from "@/lib/courses-data";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Super Admin — BUDDY" }] }),
});

function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((x) => x + 1);
  const [enrollKeys, setEnrollKeys] = useState<EnrollmentKey[]>([]);
  const refreshKeys = () => setEnrollKeys(getAllKeys());

  useEffect(() => {
    setMounted(true);
    setEnrollKeys(getAllKeys());
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs tracking-[0.3em] uppercase text-muted-foreground">
        Loading…
      </div>
    );
  }

  const isAdmin = isSuperAdmin();
  const users = listUsers();

  // Filter buckets
  const pending = users.filter((u) => u.status === "pending");
  const approved = users.filter((u) => u.status === "approved");
  const rejected = users.filter((u) => u.status === "rejected");

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Toaster />
        <div className="max-w-md text-center border border-border p-10 rounded-sm">
          <Shield className="w-10 h-10 mx-auto text-accent mb-4" />
          <h1 className="font-serif text-2xl mb-2">Super Admin Required</h1>
          <p className="text-sm text-muted-foreground mb-6">
            This page is restricted. For development, click below to grant yourself super-admin access on this device.
          </p>
          <button
            onClick={() => { setSuperAdmin(true); refresh(); }}
            className="bg-foreground text-background px-6 py-3 text-[11px] tracking-[0.3em] uppercase hover:bg-accent hover:text-foreground transition-colors"
          >
            Grant Super Admin (dev)
          </button>
        </div>
      </div>
    );
  }

  const onApprove = (id: string) => {
    const u = approveUser(id);
    if (u?.code) {
      toast.success(`Approved — code: ${u.code}`);
    }
    refresh();
  };
  const onReject = (id: string) => { rejectUser(id); refresh(); toast("User rejected"); };
  const onDelete = (id: string) => { deleteUser(id); refresh(); toast("User deleted"); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-6 flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.4em] uppercase text-accent">— Super Admin</div>
            <h1 className="font-serif text-3xl">Account Reviews</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={refresh} className="text-[11px] tracking-[0.25em] uppercase border border-border px-4 py-2 hover:bg-secondary inline-flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button
              onClick={() => { setSuperAdmin(false); refresh(); }}
              className="text-[11px] tracking-[0.25em] uppercase border border-border px-4 py-2 hover:bg-secondary"
            >
              Revoke Admin
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 md:px-10 py-10 space-y-12">
        <Section title="Pending" count={pending.length} accent>
          {pending.length === 0 && <Empty msg="No pending applications." />}
          {pending.map((u) => (
            <UserRow key={u.id} u={u} onApprove={onApprove} onReject={onReject} onDelete={onDelete} />
          ))}
        </Section>

        <Section title="Approved" count={approved.length}>
          {approved.length === 0 && <Empty msg="No approved users yet." />}
          {approved.map((u) => (
            <UserRow key={u.id} u={u} onApprove={onApprove} onReject={onReject} onDelete={onDelete} />
          ))}
        </Section>

        <Section title="Rejected" count={rejected.length}>
          {rejected.length === 0 && <Empty msg="No rejected users." />}
          {rejected.map((u) => (
            <UserRow key={u.id} u={u} onApprove={onApprove} onReject={onReject} onDelete={onDelete} />
          ))}
        </Section>

        {/* ── Enrollment Keys ── */}
        <section>
          <div className="flex items-baseline gap-3 mb-4">
            <h2 className="font-serif text-2xl flex items-center gap-2"><Key className="w-5 h-5 text-accent" /> Enrollment Keys</h2>
            <span className="text-[11px] tracking-[0.25em] uppercase px-2 py-1 bg-secondary">{enrollKeys.length}</span>
          </div>
          <p className="text-[12px] text-muted-foreground mb-4">
            Each course has a unique 6-digit enrollment key. Share the key with students so they can enroll. Regenerate anytime to invalidate old keys.
          </p>
          <div className="border border-border divide-y divide-border">
            {enrollKeys.map((ek) => {
              const course = COURSES.find((c) => c.id === ek.courseId);
              return (
                <EnrollKeyRow
                  key={ek.courseId}
                  ek={ek}
                  courseName={course?.title ?? ek.courseId}
                  onRegenerate={() => {
                    regenerateKey(ek.courseId);
                    refreshKeys();
                    toast.success(`New key generated for ${course?.title ?? ek.courseId}`);
                  }}
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function EnrollKeyRow({ ek, courseName, onRegenerate }: { ek: EnrollmentKey; courseName: string; onRegenerate: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(ek.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    toast.success("Key copied");
  };
  return (
    <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="font-serif text-base truncate">{courseName}</div>
        <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mt-0.5">
          Updated {new Date(ek.updatedAt).toLocaleString()}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="font-mono tracking-[0.5em] text-xl bg-accent/15 text-accent px-4 py-2 rounded-sm select-all">{ek.key}</div>
        <button onClick={copy} title="Copy key" className="text-xs border border-border p-2 hover:bg-secondary">
          {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <button onClick={onRegenerate} title="Regenerate key" className="text-xs border border-border p-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function Section({ title, count, accent, children }: { title: string; count: number; accent?: boolean; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="font-serif text-2xl">{title}</h2>
        <span className={`text-[11px] tracking-[0.25em] uppercase px-2 py-1 ${accent ? "bg-accent text-foreground" : "bg-secondary"}`}>{count}</span>
      </div>
      <div className="border border-border divide-y divide-border">{children}</div>
    </section>
  );
}

function Empty({ msg }: { msg: string }) {
  return <div className="p-8 text-center text-sm text-muted-foreground">{msg}</div>;
}

function UserRow({
  u, onApprove, onReject, onDelete,
}: {
  u: PendingUser;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const copyCode = () => {
    if (!u.code) return;
    navigator.clipboard.writeText(u.code);
    toast.success("Code copied");
  };

  return (
    <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="font-serif text-lg capitalize truncate">{u.full_name || "(no name)"}</div>
        <div className="text-[12px] text-muted-foreground truncate">{u.email}</div>
        <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mt-1">
          {u.role} · {u.provider || "email"} · {new Date(u.created_at).toLocaleString()}
        </div>
      </div>

      {u.status === "approved" && u.code && (
        <div className="flex items-center gap-2">
          <div className="font-mono tracking-[0.4em] text-lg bg-accent/15 text-accent px-4 py-2 rounded-sm">{u.code}</div>
          <button onClick={copyCode} className="text-xs border border-border p-2 hover:bg-secondary"><Copy className="w-3.5 h-3.5" /></button>
        </div>
      )}

      <div className="flex gap-2">
        {u.status !== "approved" && (
          <button onClick={() => onApprove(u.id)} className="text-[10px] tracking-[0.25em] uppercase bg-accent text-foreground px-3 py-2 hover:bg-accent/90 inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Approve
          </button>
        )}
        {u.status !== "rejected" && (
          <button onClick={() => onReject(u.id)} className="text-[10px] tracking-[0.25em] uppercase border border-border px-3 py-2 hover:bg-secondary inline-flex items-center gap-1.5">
            <X className="w-3.5 h-3.5" /> Reject
          </button>
        )}
        <button onClick={() => onDelete(u.id)} className="text-[10px] tracking-[0.25em] uppercase border border-border px-3 py-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 inline-flex items-center gap-1.5">
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}
