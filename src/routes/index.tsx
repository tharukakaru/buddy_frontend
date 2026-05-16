import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import buddyHead from "@/assets/buddy-head.png";
import knowledgeGrid from "@/assets/knowledge-grid.png";
import buddyVideo from "@/assets/robot-white.mp4";
import foundationLand from "@/assets/foundation-land.jpg";
import absolxLogo from "@/assets/absolx-logo.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "BUDDY — A knowledge companion by Jinasena Padanama" },
      { name: "description", content: "Buddy is a knowledge companion built on Dr. Tissa Jinasena's four-decade vision — wisdom that makes the complex simple." },
    ],
  }),
});

function Index() {
  const nav = useNavigate();
  const goCourses = () => nav({ to: sessionStorage.getItem("buddy_fake_auth") === "1" ? "/courses" : "/login" });
  const goAbout = () => nav({ to: "/about" });

  return (
    <div className="bg-background text-foreground">
      <SiteNav variant="light" mode="pill" />

      {/* Hero — solid black with container scroll animation */}
      <section className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-black text-white flex flex-col">
        <div className="pt-28 md:pt-32 pb-0 flex flex-col items-center text-center px-6 relative z-10">
          <div className="text-[10px] md:text-xs tracking-[0.3em] uppercase opacity-70 mb-6">
            Tissa Jinasena Group Presents
          </div>
          <h1 className="font-serif text-[15vw] md:text-[9vw] leading-[0.85] tracking-tight">
            BUDDY
          </h1>
          <p className="mt-6 max-w-xl text-xs md:text-sm opacity-85 font-sinhala leading-relaxed">
            බුද්ධිය යනු සංකීර්ණ දෑ සරල කිරීමේ හැකියාවයි.
          </p>
          <p className="mt-2 max-w-xl text-[10px] md:text-xs opacity-60">
            Wisdom is the ability to make the complex simple.
          </p>
          <div className="mt-6 flex flex-col items-center">
            <span className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase opacity-70">Powered by</span>
            <img src={absolxLogo} alt="AbsolX" className="h-14 md:h-16 w-auto -mt-2" />
          </div>
        </div>

        <div className="relative z-30 -mt-2 md:-mt-4 h-[34svh] min-h-[220px]">
          <ContainerScroll titleComponent={<></>} className="!h-[44rem] md:!h-[56rem] !p-0">
            <img
              src={buddyHead}
              alt="Buddy AI"
              className="mx-auto h-full w-full object-cover rounded-2xl"
              draggable={false}
            />
          </ContainerScroll>
        </div>
      </section>

      {/* Introduction — text left, knowledge-grid right (image-34 layout) */}
      <section className="relative bg-background text-foreground z-10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16 pt-32 md:pt-48 pb-24 md:pb-32 grid md:grid-cols-[0.95fr_1.15fr] gap-10 md:gap-16 items-start">
          <div className="relative">
            <div className="flex gap-1 text-accent text-xl md:text-2xl font-serif mb-8 leading-none">
              <span>"</span><span>"</span>
            </div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-accent/80 mb-6">— Introduction</div>
            <h2 className="font-serif italic text-[28px] md:text-[40px] leading-[1.15] text-foreground/90 mb-10 max-w-xl">
              A knowledge companion for the<br />next generation of Sri Lanka.
            </h2>
            <p className="font-sinhala text-[11px] md:text-[12px] leading-[1.9] text-muted-foreground mb-4 max-w-md">
              "BUDDY" කෘතීම බුද්ධි යනු හුදෙක් තොරතුරු සපයන මෘදුකාංගයක් නො වේ; එය මානව විඥානය ඉහළ නැංවීම සඳහා නිර්මාණය කළ ඥාන සහකරුවෙකි. දශක හතරකට අධික කාලයක් ශ්‍රී ලාංකීය තරුණ පරපුර බලගන්වීමට කැපවූ ආචාර්ය තිස්ස ජිනසේන මහතාගේ දූරදර්ශී දැක්ම මෙහි පදනමයි.
            </p>
            <p className="text-[10px] md:text-[11px] leading-[1.85] text-muted-foreground/80 italic max-w-md">
              "Buddy is not merely an information tool — it is a knowledge companion designed to elevate human consciousness. Built on the four-decade vision of Dr. Tissa Jinasena, it weaves entrepreneurial mindset with the essence of Buddhist philosophy."
            </p>
          </div>
          <div className="relative md:-mt-4 md:-mr-8">
            <img src={knowledgeGrid} alt="Buddy knowledge interface" className="w-full h-auto object-contain" />
          </div>
        </div>
      </section>

      {/* Buddy AI — white bg with autoplay video */}
      <section className="bg-white text-foreground">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-32 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square max-w-md mx-auto w-full rounded-sm overflow-hidden bg-white">
            <video src={buddyVideo} autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-6">— Buddy AI</div>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
              From <em>"this is hard"</em> to <em>"I understand"</em>.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Whatever you find difficult, Buddy explains it simply — until you can say "I get it now." Because true wisdom is not the accumulation of facts, but the ability to see the world clearly.
            </p>
            <button onClick={goAbout} className="inline-flex items-center gap-2 text-sm tracking-display uppercase border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors">
              Meet Buddy →
            </button>
          </div>
        </div>
      </section>

      {/* Foundation — mountain */}
      <section className="relative h-[80vh] overflow-hidden">
        <img src={foundationLand} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-6">
          <div className="text-[11px] tracking-display uppercase opacity-80 mb-6">— The Foundation Network</div>
          <h2 className="font-serif text-4xl md:text-6xl max-w-3xl leading-tight">
            Four pillars. One vision for a more conscious society.
          </h2>
          <button onClick={() => nav({ to: "/foundation" })}
            className="mt-10 text-sm tracking-display uppercase border-b border-white pb-1 hover:text-accent hover:border-accent">
            Explore the network →
          </button>
        </div>
      </section>

      {/* Courses CTA */}
      <section className="bg-background text-foreground">
        <div className="mx-auto max-w-5xl px-6 md:px-12 py-32 text-center">
          <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-6">— JIT Courses</div>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight">
            15 international-standard courses, built for Sri Lankan youth.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
            Engineering, manufacturing, and agriculture — taught in Sinhala, mentored in person, unlocked one course at a time.
          </p>
          <div className="mt-12 flex justify-center">
            <button onClick={goCourses}
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-foreground text-background text-xs tracking-[0.3em] uppercase overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px] hover:shadow-accent/60">
              <span className="absolute inset-0 bg-gradient-to-r from-accent via-accent/80 to-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative">Browse Courses</span>
              <span className="relative transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
