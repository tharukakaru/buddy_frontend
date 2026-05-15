import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import founder from "@/assets/founder.jpg";

export const Route = createFileRoute("/jtf")({
  component: JtfPage,
  head: () => ({
    meta: [
      { title: "JTF — Jinasena Training Foundation" },
      {
        name: "description",
        content:
          "AI technology meets an enlightened social mission — vocational training for rural Sri Lankan youth.",
      },
    ],
  }),
});

function Feature({ si, en, body }: { si: string; en: string; body: string }) {
  return (
    <div>
      <p className="font-sinhala text-sm text-muted-foreground mb-2">{si}</p>
      <h3 className="font-serif text-2xl mb-4">{en}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function JtfPage() {
  return (
    <div>
      <SiteNav />
      <div className="pt-32">
        <section className="mx-auto max-w-6xl px-6 md:px-12 py-16">
          <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-8">
            — Jinasena Training Foundation
          </div>
          <p className="font-sinhala text-base text-muted-foreground mb-6">
            ජිනසේන පුහුණු පදනම
          </p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] max-w-4xl">
            AI technology meets an enlightened social mission.
          </h1>
        </section>

        <section className="mx-auto max-w-6xl px-6 md:px-12 py-16 grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden bg-muted">
            <img
              src={founder}
              alt="Dr. Tissa Jinasena"
              className="w-full h-full object-cover"
            />
            <p className="text-[11px] tracking-display uppercase text-muted-foreground mt-4">
              Dr. Tissa Jinasena — Chairman
            </p>
          </div>
          <div>
            <blockquote className="font-serif text-2xl md:text-3xl leading-snug italic">
              "ග්‍රාමීය තරුණයා බලගැන්වීමේ සිහිනය සැබෑ කරමින් — knowledge that
              travels from the village to the world."
            </blockquote>
            <p className="text-[11px] tracking-display uppercase text-muted-foreground mt-6 mb-12">
              — ආචාර්ය තිස්ස ජිනසේන (සභාපති)
            </p>
            <p className="font-sinhala leading-relaxed text-muted-foreground mb-4">
              ජිනසේන සමූහ ව්‍යාපාරයේ නිර්මාතෘ සී. ජිනසේන මහතාගේ "ග්‍රාමීය තරුණයා
              බලගැන්වීමේ" සිහිනය සැබෑ කරමින් ආචාර්ය තිස්ස ජිනසේන මහතා විසින් මෙම
              පදනම ස්ථාපිත කරන ලදී.
            </p>
            <p className="font-sinhala leading-relaxed text-muted-foreground">
              අද වන විට ලෝකය තාක්ෂණික විප්ලවයකට මුහුණ දී සිටින අතර, එම තාක්ෂණය
              යහපත් අරමුණු සඳහා මෙහෙයවිය හැකි ශක්තිමත් මානුෂීය පදනමක් සහිත
              පරපුරක් බිහි කිරීම අපගේ වගකීමයි.
            </p>
          </div>
        </section>

        <section className="bg-secondary">
          <div className="mx-auto max-w-6xl px-6 md:px-12 py-24 grid md:grid-cols-3 gap-12">
            <Feature
              si="වෘත්තික පුහුණුව"
              en="Vocational Training"
              body="International-standard hands-on training that turns rural youth into world-class professionals."
            />
            <Feature
              si="AI තාක්ෂණය"
              en="AI & Modern Tools"
              body="Buddy AI and modern technology layered on top of deep traditional knowledge."
            />
            <Feature
              si="අනාගතය සඳහා සූදානම්"
              en="Future-Ready Mindset"
              body="A generation grounded in human values, ready to lead the technological revolution responsibly."
            />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 md:px-12 py-32 text-center">
          <h2 className="font-sinhala text-3xl md:text-5xl leading-tight mb-6">
            දැනුමෙන් සන්නද්ධ, ගුණධර්මයෙන් පිරිපුන් නව ලෝකයක් කරා.
          </h2>
          <p className="text-muted-foreground italic mb-10">
            Toward a new world — armed with knowledge, complete in virtue. Walk
            this journey with us.
          </p>
          <Link
            to="/courses"
            className="inline-block px-8 py-4 bg-foreground text-background text-xs tracking-display uppercase hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Browse JIT Courses
          </Link>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
