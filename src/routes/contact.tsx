import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Jinasena Padanama" },
      {
        name: "description",
        content: "Get in touch with Jinasena Padanama. Let's build a more conscious world, together.",
      },
    ],
  }),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form:", form);
    alert("Thanks — we'll be in touch.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div>
      <SiteNav />
      <div className="pt-32">
        <section className="mx-auto max-w-6xl px-6 md:px-12 py-16">
          <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-8">
            — Contact
          </div>
          <p className="font-sinhala text-base text-muted-foreground mb-6">
            අප හා සම්බන්ධ වන්න
          </p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] max-w-4xl">
            Let's build a more conscious world, together.
          </h1>
        </section>

        <section className="mx-auto max-w-6xl px-6 md:px-12 py-16 grid md:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div>
              <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-3">
                Headquarters
              </div>
              <p className="font-serif text-2xl">Jinasena Padanama</p>
              <p className="text-muted-foreground">Mattegoda, Sri Lanka</p>
            </div>
            <div>
              <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-3">
                Email
              </div>
              <a
                href="mailto:hello@jinasena.lk"
                className="font-serif text-2xl hover:text-accent"
              >
                hello@jinasena.lk
              </a>
            </div>
            <div>
              <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-3">
                Follow
              </div>
              <div className="flex gap-6">
                {["YouTube", "Instagram", "Twitter"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="text-[11px] tracking-display uppercase border-b border-foreground pb-1 hover:text-accent hover:border-accent"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="bg-secondary p-8 md:p-12 space-y-6">
            <div>
              <label className="text-[11px] tracking-display uppercase text-muted-foreground">
                Name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent border-b border-foreground/30 py-2 focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-[11px] tracking-display uppercase text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent border-b border-foreground/30 py-2 focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-[11px] tracking-display uppercase text-muted-foreground">
                Message
              </label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-transparent border-b border-foreground/30 py-2 focus:outline-none focus:border-accent resize-none"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-foreground text-background text-xs tracking-display uppercase hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Send message
            </button>
          </form>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
