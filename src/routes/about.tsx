import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import buddyVideo from "@/assets/buddy-robot.mp4";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Buddy — Knowledge companion, not just a chatbot" },
      {
        name: "description",
        content:
          "Buddy is a knowledge companion built to elevate human consciousness — born from Dr. Tissa Jinasena's vision and Buddhist philosophy.",
      },
    ],
  }),
});

function Pillar({ sinhala, english, body }: { sinhala: string; english: string; body: string }) {
  return (
    <div className="group">
      <div className="w-8 h-px bg-accent mb-6 transition-all duration-500 group-hover:w-16" />
      <p className="font-sinhala text-xs text-accent mb-2 tracking-wide">{sinhala}</p>
      <h3 className="font-serif italic text-xl md:text-2xl mb-4 leading-snug">{english}</h3>
      <p className="font-sinhala text-[13px] leading-[1.85] text-muted-foreground">{body}</p>
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <SiteNav />
      <div className="pt-32">
        <section className="mx-auto max-w-5xl px-6 md:px-12 py-20">
          <div className="text-[10px] tracking-[0.3em] uppercase text-accent mb-6">
            — About
          </div>
          <p className="font-sinhala text-xs text-muted-foreground mb-4 tracking-wide">අප ගැන</p>
          <h1 className="font-serif italic text-4xl md:text-6xl leading-[1.1] max-w-3xl text-foreground/90">
            Buddy is a knowledge companion, not just a chatbot.
          </h1>
        </section>

        <section className="mx-auto max-w-5xl px-6 md:px-12 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-sinhala text-lg md:text-xl mb-6 text-foreground/85 leading-relaxed">
              "BUDDY" කෘතීම බුද්ධි යනු කුමක්ද?
            </h2>
            <div className="w-12 h-px bg-accent mb-8" />
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
          <div className="aspect-square max-w-sm mx-auto w-full rounded-sm overflow-hidden shadow-2xl ring-1 ring-accent/20 relative">
            <video
              src={buddyVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-transparent pointer-events-none" />
          </div>
        </section>

        <section className="bg-secondary">
          <div className="mx-auto max-w-5xl px-6 md:px-12 py-24">
            <div className="text-[10px] tracking-[0.3em] uppercase text-accent mb-6">
              — What makes Buddy different
            </div>
            <h2 className="font-sinhala text-2xl md:text-4xl mb-16 leading-tight text-foreground/90">
              "BUDDY" කෘතීම බුද්ධි හි සුවිශේෂත්වය
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
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

        <section className="mx-auto max-w-4xl px-6 md:px-12 py-32">
          <div className="text-[10px] tracking-[0.3em] uppercase text-accent mb-6">
            — How to use Buddy
          </div>
          <h2 className="font-sinhala text-2xl md:text-4xl mb-12 leading-tight text-foreground/90">
            "BUDDY" කෘතීම බුද්ධි භාවිතා කරන්නේ කෙසේ ද?
          </h2>
          <div className="aspect-video bg-muted border border-border flex items-center justify-center text-muted-foreground tracking-[0.3em] uppercase text-[10px]">
            Tutorial video coming soon
          </div>
          <p className="font-sinhala mt-12 text-[13px] text-muted-foreground leading-[1.95] text-center max-w-2xl mx-auto">
            "BUDDY" කෘතීම බුද්ධි යනු හුදෙක් තාක්ෂණයක් නො ව, ආචාර්ය තිස්ස ජිනසේන මහතාගේ දැක්ම
            අනුව නව ලෝකයක් ගොඩනැගීමට අවශ්‍ය දැනුම බෙදා දෙන ඔබේ සමීපතම බුද්ධිමත් සහකරුයි.
          </p>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
