import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import { ChevronRight, ChevronLeft, Sparkles, GraduationCap, Cpu, Sprout, Leaf, Brain, Heart } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import founder from "@/assets/founder.jpg";
import jft1 from "@/assets/jft-1.jpg";
import jft2 from "@/assets/jft-2.jpg";
import jft3 from "@/assets/jft-3.jpg";
import jft4 from "@/assets/jft-4.jpg";
import jft5 from "@/assets/jft-5.jpg";
import jft6 from "@/assets/jft-6.jpg";

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

const GALLERY = [jft1, jft2, jft3, jft4, jft5, jft6];

function JtfPage() {
  const nav = useNavigate();
  const goCourses = () => {
    const loggedIn = typeof window !== "undefined" && sessionStorage.getItem("buddy_fake_auth") === "1";
    nav({ to: loggedIn ? "/courses" : "/login" });
  };
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
      <SiteNav mode="pill" />
      <div className="pt-32">

        {/* ── HERO SECTION ── */}
        <section className="mx-auto max-w-6xl px-6 md:px-12 py-12 md:py-16">
          <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-3">— Jinasena Training Foundation</div>
          <p className="font-sinhala text-sm text-muted-foreground mb-5">ජිනසේන පුහුණු පදනම</p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] max-w-4xl mb-10">
            AI technology meets an enlightened social mission.
          </h1>

          {/* Photo gallery row — 6 images */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 mb-12">
            {GALLERY.map((src, i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden rounded-sm">
                <img
                  src={src}
                  alt={`JTF activity ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
            <p className="font-sinhala text-[13px] md:text-[14px] leading-[1.95] text-muted-foreground">
              ආචාර්ය තිස්ස ජිනසේන මහතාගේ මූලික අරමුණ වන්නේ නවීන කෘතීම බුද්ධිය (AI) සහ උසස් තාක්ෂණය මානුෂීය මෙහෙවරක් සඳහා යොදා ගනිමින් වඩාත් යහපත් සමාජයක් ගොඩනැගීමයි. ලෝක ප්‍රකට 'ලෝඩ්ස්ටාර්' (Loadstar) වැනි දැවැන්ත කර්මාන්තශාලා ගොඩනැගූ ඒ සුවිශේෂී ව්‍යවසායකත්ව අත්දැකීම් (Entrepreneur Mindset) පදනම් කරගනිමින්, ග්‍රාමීය තරුණ පරපුර හුදෙක් රැකියා සොයන්නන් නොව, රැකියා උත්පාදනය කරන නිර්මාණශීලී ව්‍යවසායකයන් බවට පත් කිරීම අපගේ දැක්මයි.
            </p>
            <p className="font-sinhala text-[13px] md:text-[14px] leading-[1.95] text-muted-foreground">
              මෙම ක්‍රියාවලිය හුදෙක් තාක්ෂණයට පමණක් සීමා නොවී, බෞද්ධ දර්ශනය පදනම් කරගත් විඥාන සංවර්ධනය (Consciousness Development) ඔස්සේ තමා සහ විශ්වය පිළිබඳ අවබෝධයක් ඇති, ආධ්‍යාත්මිකව දියුණු මිනිසෙකු නිර්මාණය කිරීම අපගේ පරම අභිලාෂයයි.
            </p>
          </div>
        </section>

        {/* ── SEVEN PILLARS — horizontal scroll ── */}
        <section className="bg-secondary py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="flex items-end justify-between mb-10 gap-6">
              <div>
                <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-3">— Seven Pillars</div>
                <p className="font-sinhala text-sm text-muted-foreground mb-4">නව පරපුරක් හැඩ ගන්වන විෂය ක්ෂේත්‍ර.</p>
                <h2 className="font-serif text-3xl md:text-5xl leading-tight max-w-2xl">
                  Seven pillars shaping a new generation.
                </h2>
                <p className="text-[11px] tracking-[0.2em] text-muted-foreground mt-3 uppercase">
                  Each discipline blends ancient wisdom with modern technology — scroll to explore all seven.
                </p>
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
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-11 h-11 rounded-full bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">↗</span>
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

        {/* ── CHAIRMAN'S MESSAGE (KEPT) ── */}
        <section className="mx-auto max-w-6xl px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden bg-muted">
            <img src={founder} alt="Dr. Tissa Jinasena" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-accent mb-6">— Chairman's Message</div>
            <p className="font-sinhala text-base text-muted-foreground mb-6">සභාපතිතුමාගේ පණිවිඩය</p>
            <blockquote className="font-sinhala text-[14px] md:text-[15px] leading-[2] italic text-foreground/85">
              "පසුගිය වසර 45 පුරා මා උත්සාහ කළේ සිද්ධස්ථාන ප්‍රතිසංස්කරණය සහ තරුණ තරුණියන් දහස් ගණනකට පුහුණුව ලබා දීම හරහා මෙරට මානව විඥානය ඉහළ නැංවීමටයි. එහෙත් මානව විඥානය භයානක ලෙස පහත වැටෙමින් පවතින අතර, මිනිසා විසින්ම තමා ව විනාශ කරගන්නා තැනකට ලෝකය ගමන් කරමින් සිටී. අනාවැකි පළ වී ඇති පරිදි, මෙම සියවස තුළ සිදුවන විපර්යාසයෙන් ඉතිරි වන පිරිසට, තිරසාර නව ලෝකයක් ගොඩනැගීමට අවශ්‍ය සැබෑ දැනුම සහ AI වැනි නවීන තාක්ෂණයන් අප ලබා දිය යුතුය. බෞද්ධ දර්ශනය සහ නවීන විද්‍යාව මුසු වූ ප්‍රබුද්ධ නායකත්වයක් බිහි කිරීම අපගේ අපේක්ෂාවයි."
            </blockquote>
            <p className="text-[11px] tracking-display uppercase text-muted-foreground mt-6">— ආචාර්ය තිස්ස ජිනසේන (සභාපති)</p>
          </div>
        </section>

        {/* ── OUR RESPONSIBILITY ── */}
        <section style={{ background: "#1a1a1a" }} className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-amber-400/80 mb-6">— Our Responsibility</div>
              <p className="font-sinhala text-[13px] md:text-[14px] leading-[2] text-white/80 mb-8">
                අද වන විට ලෝකය තාක්ෂණික විප්ලවයකට මුහුණ දී සිටින අතර, එම තාක්ෂණය යහපත් අරමුණු සඳහා මෙහෙයවිය හැකි ශක්තිමත් මානුෂීය පදනමක් සහිත පරපුරක් බිහි කිරීම අපගේ වගකීමයි. ආචාර්ය තිස්ස ජිනසේන මහතාගේ දූරදර්ශී නායකත්වය යටතේ ජිනසේන පුහුණු පදනම නිරන්තරයෙන් කැපවී සිටින්නේ, AI තාක්ෂණය සහ බෞද්ධ දර්ශනයේ හරය මුසු කරමින් ශ්‍රී ලාංකීය තරුණ පරපුර ලෝකයේ ප්‍රමුඛයන් බවට පත් කිරීමටයි.
              </p>
              <p className="font-sinhala text-[13px] md:text-[14px] leading-[2] text-white italic mb-10">
                දැනුමෙන් සන්නද්ධ, ගුණධර්මයෙන් පිරිපුන් නව ලෝකයක් කරා යන ගමනට ඔබත් අප සමඟ එක්වන්න.
              </p>
              <button onClick={goCourses}
                className="inline-block px-8 py-4 bg-white text-black text-xs tracking-[0.3em] uppercase hover:bg-amber-400 transition-colors">
                JOIN US
              </button>
            </div>
            {/* Right side — real photo placeholder */}
            <div className="aspect-[4/3] overflow-hidden rounded-sm">
              <img src={jft1} alt="JTF Training" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* ── OUR JOURNEY ── */}
        <section className="bg-secondary py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6 md:px-12">
            <div className="text-[10px] tracking-[0.3em] uppercase text-accent mb-6">— Our Journey</div>
            <p className="font-sinhala text-base text-muted-foreground mb-4">අපගේ ගමන් මග: ජිනසේන පුහුණු පදනම</p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight max-w-3xl mb-10">
              From a village dream to a nation-building mission.
            </h2>
            <p className="font-sinhala text-[13px] md:text-sm leading-[1.95] text-foreground/85 max-w-3xl mb-12">
              ජිනසේන සමූහ ව්‍යාපාරයේ නිර්මාතෘ සී. ජිනසේන මහතාගේ "ග්‍රාමීය තරුණයා බලගැන්වීමේ" සිහිනය සැබෑ කරමින් ආචාර්ය තිස්ස ජිනසේන මහතා විසින් මෙම පදනම ස්ථාපිත කරන ලදී.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-8 border-t-2 border-accent">
                <p className="font-sinhala text-[13px] text-accent mb-2 tracking-wide">වෘත්තීය පුහුණුව</p>
                <h3 className="font-serif text-lg mb-4">Vocational Training</h3>
                <p className="font-sinhala text-[12px] leading-[1.85] text-muted-foreground">
                  2013 වසරේ සිට ක්‍රියාත්මක වන NVQ 4 මට්ටමේ කාර්මික මෙකට්‍රොනික්ස් පුහුණුව හරහා තරුණයින් 500කට අධික පිරිසක් ඉංජිනේරු ක්ෂේත්‍රයේ ඉහළ තලයට රැගෙන ගොස් ඇත.
                </p>
              </div>
              <div className="bg-background p-8 border-t-2 border-accent">
                <p className="font-sinhala text-[13px] text-accent mb-2 tracking-wide">ව්‍යවසායකත්වය</p>
                <h3 className="font-serif text-lg mb-4">Entrepreneurship</h3>
                <p className="font-sinhala text-[12px] leading-[1.85] text-muted-foreground">
                  ලෝඩ්ස්ටාර් අත්දැකීම් ඇසුරින් අප ලබා දෙන පුහුණුව නිසා, සිසුන්ගෙන් 90%ක්ම ප්‍රමුඛ පෙළේ කර්මාන්තශාලාවල සේවය කරන අතර, තවත් පිරිසක් සාර්ථක ව්‍යවසායකයන් ලෙස සිය ගම්මාන බලගන්වයි.
                </p>
              </div>
              <div className="bg-background p-8 border-t-2 border-accent">
                <p className="font-sinhala text-[13px] text-accent mb-2 tracking-wide">නොමිලේ සේවාව</p>
                <h3 className="font-serif text-lg mb-4">Free of Charge</h3>
                <p className="font-sinhala text-[12px] leading-[1.85] text-muted-foreground">
                  තෝරාගත් ග්‍රාමීය තරුණ ප්‍රජාව වෙත නවාතැන්, ආහාර, නිල ඇඳුම් සහ සියලුම ඉගැන්වීම් ද්‍රව්‍ය සම්පූර්ණයෙන්ම නොමිලේ ලබා දෙමින් සමාජ සාධාරණත්වය ඉටු කරමු.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mx-auto max-w-5xl px-6 md:px-12 py-28 md:py-36 text-center">
          <div className="text-[10px] tracking-[0.3em] uppercase text-accent mb-4">— Join Us</div>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-6 max-w-2xl mx-auto">
            Be part of a wiser Sri Lanka.
          </h2>
          <p className="font-sinhala text-[13px] leading-[1.95] text-muted-foreground max-w-xl mx-auto mb-10">
            දැනුමෙන් සන්නද්ධ, ගුණධර්මයෙන් පිරිපුන් නව ලෝකයක් කරා යන ගමනට ඔබත් අප සමඟ එක්වන්න.
          </p>
          <button onClick={goCourses}
            className="inline-block px-10 py-4 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
            Browse JIT Courses
          </button>
        </section>

      </div>
      <SiteFooter />
    </div>
  );
}
