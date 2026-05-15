import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ChevronRight, ChevronLeft, Sparkles, GraduationCap, Cpu, Sprout, Leaf, Brain, Heart } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import founder from "@/assets/founder.jpg";

export const Route = createFileRoute("/jtf")({
  component: JtfPage,
  head: () => ({
    meta: [
      { title: "JTF — Jinasena Training Foundation" },
      { name: "description", content: "Seven pillars of expertise — from personal development to consciousness, AI to indigenous medicine." },
    ],
  }),
});

const PILLARS = [
  { icon: Sparkles, si: "පුද්ගල පෞරුෂ වර්ධනය", en: "Personal Development",
    body: "තරුණයින් මත්ද්‍රව්‍ය හා සමාජ මාධ්‍ය ඇබ්බැහිවීම්වලින් මුදවා, නායකත්ව කුසලතා සහ ජීවිතයට නිවැරදි ඉලක්ක ලබා දීම." },
  { icon: GraduationCap, si: "අධ්‍යාපන සංවර්ධනය", en: "Education Development",
    body: "නිර්මාණශීලී අධ්‍යාපන ක්‍රමවේද හරහා රජයේ විභාගවල සමත් වීමේ ප්‍රතිශතය 40% සිට 80% දක්වා ඉහළ නැංවීම." },
  { icon: Cpu, si: "තාක්ෂණික නිපුණතාවය", en: "Technical Skill Development",
    body: "AI භාවිතය, රොබෝ තාක්ෂණය (Robotics) සහ මෙකට්‍රොනික්ස් (Mechatronics) වැනි උසස් තාක්ෂණයන් ග්‍රාමීය මට්ටමට ගෙන යාම." },
  { icon: Sprout, si: "ජීවනෝපාය සහ කාබනික කෘෂිකර්මය", en: "Livelihood & Organic Agriculture",
    body: "වස විසෙන් තොර කෘෂිකර්මාන්තය සහ තිරසාර ගොවි ගම්මාන හරහා ග්‍රාමීය ආර්ථිකය ශක්තිමත් කිරීම." },
  { icon: Leaf, si: "දේශීය වෛද්‍ය ප්‍රවර්ධනය", en: "Indigenous Medicine",
    body: "ස්වභාවධර්මය සහ හෙළ වෙදකම අතර ඇති සබඳතාවය සුරැකීම සහ දුර්ලභ ඖෂධීය ශාක සංරක්ෂණය කිරීම." },
  { icon: Brain, si: "විඥාන සංවර්ධනය", en: "Consciousness Development",
    body: "බෞද්ධ දර්ශනය පදනම් කරගත් ස්වයං-අවබෝධය තුළින්, විශ්වීය බුද්ධිය (Universal Intelligence) සමඟ බද්ධ වූ ප්‍රබුද්ධ මිනිසෙකු බිහි කිරීම." },
  { icon: Heart, si: "විශේෂ අවශ්‍යතා සහිත ප්‍රජාව සවිබල ගැන්වීම", en: "Empowering Differently Abled",
    body: "ගොළු සහ බිහිරි ප්‍රජාව වෙනුවෙන් නවීන මෘදුකාංග සහ AI තාක්ෂණය නිපදවමින් ඔවුන්ව සමාජයේ ප්‍රධාන ධාරාවට එක් කිරීම." },
];

function JtfPage() {
  const scroller = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const w = card ? card.offsetWidth + 24 : 320;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <div>
      <SiteNav />
      <div className="pt-32">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 md:px-12 py-16">
          <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-8">— Jinasena Training Foundation</div>
          <p className="font-sinhala text-base text-muted-foreground mb-6">ජිනසේන පුහුණු පදනම</p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] max-w-4xl">
            AI technology meets an enlightened social mission.
          </h1>
        </section>

        {/* Founder */}
        <section className="mx-auto max-w-6xl px-6 md:px-12 py-12 grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden bg-muted">
            <img src={founder} alt="Dr. Tissa Jinasena" className="w-full h-full object-cover" />
          </div>
          <div>
            <blockquote className="font-serif text-xl md:text-2xl leading-snug italic">
              "ග්‍රාමීය තරුණයා බලගැන්වීමේ සිහිනය සැබෑ කරමින් — knowledge that travels from the village to the world."
            </blockquote>
            <p className="text-[11px] tracking-display uppercase text-muted-foreground mt-6">— ආචාර්ය තිස්ස ජිනසේන (සභාපති)</p>
          </div>
        </section>

        {/* 7 expertise cards — horizontal scroll */}
        <section className="bg-secondary py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="flex items-end justify-between mb-10 gap-6">
              <div>
                <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-3">— Seven Pillars</div>
                <h2 className="font-serif text-3xl md:text-5xl leading-tight max-w-2xl">
                  Expertise that shapes a generation.
                </h2>
              </div>
              <div className="hidden md:flex gap-2 shrink-0">
                <button onClick={() => scrollBy(-1)} aria-label="Previous"
                  className="w-11 h-11 rounded-full border border-border hover:border-foreground bg-background flex items-center justify-center transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => scrollBy(1)} aria-label="Next"
                  className="w-11 h-11 rounded-full border border-foreground bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div ref={scroller}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 md:mx-0 md:px-0 scroll-smooth"
              style={{ scrollbarWidth: "none" }}>
              {PILLARS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <article key={i} data-card
                    className="snap-start shrink-0 w-[78%] sm:w-[46%] md:w-[calc(25%-18px)] bg-background border border-border p-7 rounded-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-11 h-11 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="font-sinhala text-[13px] text-accent mb-2 tracking-wide">{p.si}</p>
                    <h3 className="font-serif text-lg leading-snug mb-4">{p.en}</h3>
                    <p className="font-sinhala text-[12px] leading-[1.85] text-muted-foreground">{p.body}</p>
                    <div className="mt-6 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">0{i + 1} / 07</div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Premium content block */}
        <section className="mx-auto max-w-4xl px-6 md:px-12 py-28 md:py-36">
          <div className="border-l-2 border-accent pl-8 md:pl-12">
            <div className="text-[10px] tracking-[0.3em] uppercase text-accent mb-6">— Our Responsibility</div>
            <p className="font-sinhala text-base md:text-lg leading-[2] text-foreground/90 mb-8">
              අද වන විට ලෝකය තාක්ෂණික විප්ලවයකට මුහුණ දී සිටින අතර, එම තාක්ෂණය යහපත් අරමුණු සඳහා මෙහෙයවිය හැකි ශක්තිමත් මානුෂීය පදනමක් සහිත පරපුරක් බිහි කිරීම අපගේ වගකීමයි. ආචාර්ය තිස්ස ජිනසේන මහතාගේ දූරදර්ශී නායකත්වය යටතේ ජිනසේන පුහුණු පදනම නිරන්තරයෙන් කැපවී සිටින්නේ, AI තාක්ෂණය සහ බෞද්ධ දර්ශනයේ හරය මුසු කරමින් ශ්‍රී ලාංකීය තරුණ පරපුර ලෝකයේ ප්‍රමුඛයන් බවට පත් කිරීමටයි.
            </p>
            <p className="font-sinhala text-base md:text-lg leading-[2] text-foreground italic">
              දැනුමෙන් සන්නද්ධ, ගුණධර්මයෙන් පිරිපුන් නව ලෝකයක් කරා යන ගමනට ඔබත් අප සමඟ එක්වන්න.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-6 md:px-12 pb-32 text-center">
          <Link to="/courses"
            className="inline-block px-10 py-4 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
            Browse JIT Courses
          </Link>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
