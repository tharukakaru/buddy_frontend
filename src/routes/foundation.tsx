import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles, GraduationCap, Cpu, Sprout, Leaf, Brain, Heart } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import founder from "@/assets/founder.jpg";
import jft1 from "@/assets/jft-1.jpg";
import jft2 from "@/assets/jft-2.jpg";
import jft3 from "@/assets/jft-3.jpg";
import jft4 from "@/assets/jft-4.jpg";
import jft5 from "@/assets/jft-5.jpg";
import jft6 from "@/assets/jft-6.jpg";

const GALLERY = [jft1, jft2, jft3, jft4, jft5, jft6];

export const Route = createFileRoute("/foundation")({
  component: FoundationPage,
  head: () => ({
    meta: [
      { title: "JFT — Jinasena Training Foundation" },
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

function FoundationPage() {
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
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 md:px-12 py-16">
          <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-8">— Jinasena Training Foundation</div>
          <p className="font-sinhala text-base text-muted-foreground mb-6">ජිනසේන පුහුණු පදනම</p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] max-w-4xl">
            AI technology meets an enlightened social mission.
          </h1>
          <div className="grid md:grid-cols-2 gap-10 mt-12 max-w-5xl">
            <p className="font-sinhala text-[13px] md:text-[14px] leading-[2] text-muted-foreground">
              ආචාර්ය තිස්ස ජිනසේන මහතාගේ මූලික අරමුණ වන්නේ නවීන කෘතීම බුද්ධිය (AI) සහ උසස් තාක්ෂණය මානුෂීය මෙහෙවරක් සඳහා යොදා ගනිමින් වඩාත් යහපත් සමාජයක් ගොඩනැගීමයි. ලෝක ප්‍රකට 'ලෝඩ්ස්ටාර්' (Loadstar) වැනි දැවැන්ත කර්මාන්තශාලා ගොඩනැගූ ඒ සුවිශේෂී ව්‍යවසායකත්ව අත්දැකීම් (Entrepreneur Mindset) පදනම් කරගනිමින්, ග්‍රාමීය තරුණ පරපුර හුදෙක් රැකියා සොයන්නන් නොව, රැකියා උත්පාදනය කරන නිර්මාණශීලී ව්‍යවසායකයන් බවට පත් කිරීම අපගේ දැක්මයි.
            </p>
            <p className="font-sinhala text-[13px] md:text-[14px] leading-[2] text-muted-foreground">
              මෙම ක්‍රියාවලිය හුදෙක් තාක්ෂණයට පමණක් සීමා නොවී, බෞද්ධ දර්ශනය පදනම් කරගත් විඥාන සංවර්ධනය (Consciousness Development) ඔස්සේ තමා සහ විශ්වය පිළිබඳ අවබෝධයක් ඇති, ආධ්‍යාත්මිකව දියුණු මිනිසෙකු නිර්මාණය කිරීම අපගේ පරම අභිලාෂයයි.
            </p>
          </div>
        </section>

        {/* Chairman's message */}
        <section className="mx-auto max-w-6xl px-6 md:px-12 py-16 md:py-20">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5">
              <div className="aspect-[4/5] overflow-hidden bg-muted rounded-sm">
                <img src={founder} alt="Dr. Tissa Jinasena" className="w-full h-full object-cover" />
              </div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-4">— Chairman</p>
              <p className="font-sinhala text-[13px] text-foreground mt-1">ආචාර්ය තිස්ස ජිනසේන</p>
            </div>
            <div className="md:col-span-7 relative">
              <div className="text-[10px] tracking-[0.3em] uppercase text-accent mb-4">— Chairman's Message</div>
              <p className="font-sinhala text-base text-muted-foreground mb-6">සභාපතිතුමාගේ පණිවිඩය</p>
              <span aria-hidden className="font-serif text-7xl md:text-9xl leading-none text-accent/30 select-none block -mb-6">“</span>
              <blockquote className="font-sinhala text-[14px] md:text-[15px] leading-[2.05] italic text-foreground/90 border-l-2 border-accent pl-6">
                පසුගිය වසර 45 පුරා මා උත්සාහ කළේ සිද්ධස්ථාන ප්‍රතිසංස්කරණය සහ තරුණ තරුණියන් දහස් ගණනකට පුහුණුව ලබා දීම හරහා මෙරට මානව විඥානය ඉහළ නැංවීමටයි. එහෙත් මානව විඥානය භයානක ලෙස පහත වැටෙමින් පවතින අතර, මිනිසා විසින්ම තමා ව විනාශ කරගන්නා තැනකට ලෝකය ගමන් කරමින් සිටී. අනාවැකි පළ වී ඇති පරිදි, මෙම සියවස තුළ සිදුවන විපර්යාසයෙන් ඉතිරි වන පිරිසට, තිරසාර නව ලෝකයක් ගොඩනැගීමට අවශ්‍ය සැබෑ දැනුම සහ AI වැනි නවීන තාක්ෂණයන් අප ලබා දිය යුතුය. බෞද්ධ දර්ශනය සහ නවීන විද්‍යාව මුසු වූ ප්‍රබුද්ධ නායකත්වයක් බිහි කිරීම අපගේ අපේක්ෂාවයි.
              </blockquote>
            </div>
          </div>
        </section>

        {/* Gallery strip — between the two headings */}
        <section className="mx-auto max-w-7xl px-6 md:px-12 pt-4 pb-10">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {GALLERY.map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-sm bg-muted">
                <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* 7 expertise cards — Udemy-style horizontal scroller */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="flex items-end justify-between mb-10 gap-6">
              <div>
                <h2 className="font-serif text-2xl md:text-4xl leading-tight max-w-2xl">
                  Seven pillars shaping a new generation.
                </h2>
                <p className="text-muted-foreground text-sm mt-3 max-w-xl">
                  Each discipline blends ancient wisdom with modern technology — scroll to explore all seven.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => scrollBy(-1)} aria-label="Previous"
                  className="w-10 h-10 rounded-full border border-border hover:border-foreground bg-background flex items-center justify-center transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => scrollBy(1)} aria-label="Next"
                  className="w-10 h-10 rounded-full border border-foreground bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center transition-colors">
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
                    className="snap-start shrink-0 w-[78%] sm:w-[46%] md:w-[calc(25%-18px)] bg-background border-t-2 border-foreground pt-6 group">
                    <div className="w-11 h-11 rounded-full border border-border flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div className="mb-4 text-foreground">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg leading-snug mb-2">{p.en}</h3>
                    <p className="font-sinhala text-[12px] text-accent mb-4 tracking-wide">{p.si}</p>
                    <p className="font-sinhala text-[12px] leading-[1.85] text-muted-foreground">{p.body}</p>
                    <div className="mt-6 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">0{i + 1} / 07</div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story strip — content showcase */}
        <section className="bg-foreground text-background py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-12 grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5 md:sticky md:top-32">
              <div className="text-[10px] tracking-[0.3em] uppercase text-accent mb-5">— The Journey</div>
              <h2 className="font-serif text-3xl md:text-5xl leading-[1.1]">
                From a village dream<br />to a nation-building mission.
              </h2>
              <p className="font-sinhala text-[13px] text-accent mt-6 mb-3">අපගේ ගමන් මග: ජිනසේන පුහුණු පදනම</p>
              <p className="font-sinhala text-background/75 text-[13px] md:text-sm leading-[2] max-w-md">
                ජිනසේන සමූහ ව්‍යාපාරයේ නිර්මාතෘ සී. ජිනසේන මහතාගේ "ග්‍රාමීය තරුණයා බලගැන්වීමේ" සිහිනය සැබෑ කරමින් ආචාර්ය තිස්ස ජිනසේන මහතා විසින් මෙම පදනම ස්ථාපිත කරන ලදී.
              </p>
              <p className="text-background/70 text-sm md:text-base leading-[1.85] mt-6 max-w-md">
                Founded on C. Jinasena's vision to empower rural youth, and led today by Dr. Tissa Jinasena, the Foundation turns world-class industrial experience into an open invitation — free of charge, available to anyone with the will to learn.
              </p>
            </div>
            <div className="md:col-span-7 grid sm:grid-cols-2 gap-5">
              {[
                { k: "01", t: "Vocational Training", b: "Since 2013, our NVQ Level 4 Mechatronics programme has lifted over 500 youth into the upper echelons of engineering." },
                { k: "02", t: "Entrepreneurship", b: "Built on Loadstar-grade experience — 90% of graduates work in leading factories, others build the next generation of village industries." },
                { k: "03", t: "Free of Charge", b: "Lodging, meals, uniforms, materials — all completely free for selected rural youth. Social justice is non-negotiable." },
                { k: "04", t: "Buddhist + AI", b: "Modern AI tooling married to consciousness development — a generation that is wise as well as skilled." },
              ].map((c) => (
                <div key={c.k} className="border border-background/15 p-6 hover:border-accent transition-colors">
                  <div className="text-[10px] tracking-[0.3em] text-accent">{c.k}</div>
                  <h3 className="font-serif text-lg mt-3 mb-2">{c.t}</h3>
                  <p className="text-background/70 text-[13px] leading-[1.85]">{c.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        <section className="mx-auto max-w-7xl px-6 md:px-12 pb-24 md:pb-32">
          <div className="grid md:grid-cols-5 rounded-sm overflow-hidden border border-border bg-background">
            <div className="md:col-span-2 p-8 md:p-12 flex flex-col justify-between gap-8 bg-secondary">
              <div>
                <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-accent border border-accent/40 rounded-full px-3 py-1 mb-6">
                  Our Responsibility
                </span>
                <p className="font-sinhala text-[13px] md:text-sm leading-[2] text-foreground/90 mb-5">
                  අද වන විට ලෝකය තාක්ෂණික විප්ලවයකට මුහුණ දී සිටින අතර, එම තාක්ෂණය යහපත් අරමුණු සඳහා මෙහෙයවිය හැකි ශක්තිමත් මානුෂීය පදනමක් සහිත පරපුරක් බිහි කිරීම අපගේ වගකීමයි. ආචාර්ය තිස්ස ජිනසේන මහතාගේ දූරදර්ශී නායකත්වය යටතේ ජිනසේන පුහුණු පදනම නිරන්තරයෙන් කැපවී සිටින්නේ, AI තාක්ෂණය සහ බෞද්ධ දර්ශනයේ හරය මුසු කරමින් ශ්‍රී ලාංකීය තරුණ පරපුර ලෝකයේ ප්‍රමුඛයන් බවට පත් කිරීමටයි.
                </p>
                <p className="font-sinhala text-[13px] md:text-sm leading-[2] text-foreground italic">
                  දැනුමෙන් සන්නද්ධ, ගුණධර්මයෙන් පිරිපුන් නව ලෝකයක් කරා යන ගමනට ඔබත් අප සමඟ එක්වන්න.
                </p>
              </div>
              <Link to="/contact"
                className="inline-flex w-fit items-center gap-2 px-6 py-3 bg-foreground text-background text-[11px] tracking-[0.25em] uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
                Join Us
              </Link>
            </div>
            <div className="md:col-span-3 relative min-h-[280px] md:min-h-[420px] bg-muted">
              <img src={founder} alt="Dr. Tissa Jinasena" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
