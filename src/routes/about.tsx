import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import buddyVideo from "@/assets/robot-white.mp4";
import aboutMockups from "@/assets/about-mockups.png";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Buddy — Knowledge companion, not just a chatbot" },
      {
        name: "description",
        content: "Buddy is a knowledge companion built to elevate human consciousness — born from Dr. Tissa Jinasena's vision and Buddhist philosophy.",
      },
    ],
  }),
});

function Pillar({ sinhala, english, body }: { sinhala: string; english: string; body: string }) {
  return (
    <div className="group">
      <div className="w-8 h-px bg-accent mb-5 transition-all duration-500 group-hover:w-14" />
      <p className="font-sinhala text-xs text-accent mb-2 tracking-wide">{sinhala}</p>
      <h3 className="font-serif italic text-xl md:text-2xl mb-3 leading-snug">{english}</h3>
      <p className="font-sinhala text-[13px] leading-[1.85] text-muted-foreground">{body}</p>
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <SiteNav mode="pill" />
      <div className="pt-28 md:pt-32">

        {/* ── Hero section ── */}
        <section className="mx-auto max-w-6xl px-6 md:px-12 py-12 md:py-16 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="flex flex-col justify-center">
            <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-4">— About</div>
            <p className="font-sinhala text-xs text-muted-foreground mb-3 tracking-wide">අප ගැන</p>
            <h1 className="font-serif italic text-[32px] md:text-[52px] leading-[1.12] max-w-xl text-foreground/90">
              Buddy is a knowledge companion, not just a chatbot.
            </h1>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={aboutMockups}
              alt="Buddy interface mockups"
              className="w-full h-auto object-contain max-w-[520px] mx-auto"
            />
          </div>
        </section>

        {/* ── Who is Buddy ── */}
        <section className="mx-auto max-w-6xl px-6 md:px-12 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="flex flex-col justify-center">
              <h2 className="font-sinhala text-lg md:text-xl mb-5 text-foreground/85 leading-relaxed">
                "BUDDY" කෘතීම බුද්ධි යනු කුමක්ද?
              </h2>
              <div className="w-10 h-px bg-accent mb-7" />
              <p className="font-sinhala text-[13px] leading-[1.95] text-muted-foreground mb-5">
                "BUDDY" කෘතීම බුද්ධි යනු හුදෙක් තොරතුරු සපයන මෘදුකාංගයක් නො වේ; එය මානව
                විඥානය ඉහළ නැංවීම සඳහා නිර්මාණය කළ ඥාන සහකරුවෙකි. දශක හතරකට අධික කාලයක්
                ශ්‍රී ලාංකීය තරුණ පරපුර බලගන්වීමට කැපවූ ආචාර්ය තිස්ස ජිනසේන මහතාගේ දූරදර්ශී
                දැක්ම මෙහි පදනමයි.
              </p>
              <p className="font-sinhala text-[13px] leading-[1.95] text-muted-foreground">
                ලෝක ප්‍රකට 'ලෝඩ්ස්ටාර්' (Loadstar) වැනි වැඩවන්ත ආයතන ගොඩනැගූ ඒ සුවිශේෂී
                ව්‍යවසායකත්ව අත්දැකීම් සහ බෞද්ධ දර්ශනයේ හරය මුසු කරමින් Buddy නිර්මාණය කර ඇත.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div
                className="w-full rounded-sm overflow-hidden"
                style={{ background: "transparent", aspectRatio: "1/1", maxWidth: "min(100%, 440px)" }}
              >
                <video
                  src={buddyVideo}
                  autoPlay loop muted playsInline
                  className="w-full h-full object-contain mix-blend-multiply"
                  style={{ background: "transparent" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── What makes Buddy different ── */}
        <section className="bg-secondary">
          <div className="mx-auto max-w-6xl px-6 md:px-12 py-20 md:py-28">
            <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-5">
              — What makes Buddy different
            </div>
            <h2 className="font-sinhala text-2xl md:text-4xl mb-14 leading-tight text-foreground/90 max-w-2xl">
              "BUDDY" කෘතීම බුද්ධි හි සුවිශේෂත්වය
            </h2>
            <div className="grid md:grid-cols-3 gap-10 md:gap-16">
              <Pillar
                sinhala="සංකීර්ණ දෑ සරල කිරීම"
                english="Simplifies the complex"
                body="ඕනෑම ගැඹුරු විෂය කරුණක් ඕනෑම අයෙකුට තේරුම් ගත හැකි වන ලෙස සරලව පැහැදිලි කර දීම Buddy ගේ ප්‍රධාන මෙහෙවරයි."
              />
              <Pillar
                sinhala="ප්‍රබුද්ධ නායකත්වය"
                english="Builds enlightened leadership"
                body="තිරසාර නව ලෝකයක් ගොඩනැගීමට අවශ්‍ය සැබෑ දැනුම සහ මානුෂීය ගුණාංග — බෞද්ධ දර්ශනය සහ නවීන විද්‍යාව මුසු වූ නායකත්වයක්."
              />
              <Pillar
                sinhala="ව්‍යවසායකත්ව මනස"
                english="Grows the entrepreneur mind"
                body="රැකියා සොයන්නන් වෙනුවට, ලෝඩ්ස්ටාර් අත්දැකීම් ඇසුරින් රැකියා උත්පාදනය කරන නිර්මාණශීලී ව්‍යවසායකයන් බිහි කිරීම."
              />
            </div>
          </div>
        </section>

        {/* ── How to use Buddy ── */}
        <section className="mx-auto max-w-6xl px-6 md:px-12 py-20 md:py-28">
          <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-5">
            — How to use Buddy
          </div>
          <h2 className="font-sinhala text-2xl md:text-4xl mb-10 leading-tight text-foreground/90 max-w-2xl">
            "BUDDY" කෘතීම බුද්ධි භාවිතා කරන්නේ කෙසේ ද?
          </h2>
          <div className="aspect-video bg-muted border border-border flex items-center justify-center text-muted-foreground tracking-[0.3em] uppercase text-[10px] max-w-4xl">
            Tutorial video coming soon
          </div>
          <p className="font-sinhala mt-10 text-[13px] text-muted-foreground leading-[1.95] max-w-2xl">
            "BUDDY" කෘතීම බුද්ධි යනු හුදෙක් තාක්ෂණයක් නො ව, ආචාර්ය තිස්ස ජිනසේන මහතාගේ දැක්ම
            අනුව නව ලෝකයක් ගොඩනැගීමට අවශ්‍ය දැනුම බෙදා දෙන ඔබේ සමීපතම බුද්ධිමත් සහකරුයි.
          </p>
        </section>

      </div>
      <SiteFooter />
    </div>
  );
}
