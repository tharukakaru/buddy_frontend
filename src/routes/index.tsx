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
      <section className="relative h-[100svh] min-h-[680px] w-full bg-black text-white flex flex-col overflow-visible">
        {/* Wavy yellow blobs — looping ambient motion */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <svg className="absolute -left-40 -top-40 w-[55vw] h-[55vw] opacity-[0.18] blur-3xl animate-blob-a" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f4c542" d="M48.8,-58.2C61.1,-46.7,67.5,-29.4,69.6,-12.1C71.7,5.2,69.5,22.5,60.3,35.5C51.1,48.5,34.9,57.2,17.3,63.2C-0.3,69.3,-19.3,72.7,-34.7,65.6C-50.1,58.5,-61.9,40.9,-67,21.7C-72.1,2.5,-70.5,-18.3,-60.7,-32.2C-50.9,-46.1,-32.9,-53.1,-15.3,-58.9C2.3,-64.7,36.5,-69.7,48.8,-58.2Z" transform="translate(100 100)"/>
          </svg>
          <svg className="absolute right-[-15vw] top-[20vh] w-[40vw] h-[40vw] opacity-[0.14] blur-3xl animate-blob-b" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#e8a838" d="M42.2,-52.1C55.7,-42.5,68.2,-29.7,71.8,-14.5C75.4,0.7,70.1,18.4,60.5,32.9C50.9,47.4,37,58.7,20.8,64.6C4.6,70.5,-13.9,71,-29.4,64.3C-44.9,57.6,-57.4,43.8,-63.7,27.6C-70,11.5,-70.1,-6.9,-63.8,-22.6C-57.5,-38.3,-44.8,-51.2,-30.4,-60.4C-16,-69.6,0.1,-75.1,15.4,-72.4C30.7,-69.7,28.7,-61.8,42.2,-52.1Z" transform="translate(100 100)"/>
          </svg>
          <svg className="absolute left-[30vw] bottom-[-10vh] w-[35vw] h-[35vw] opacity-[0.12] blur-3xl animate-blob-c" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#fbd76b" d="M39.5,-49.4C52.6,-39.8,65.7,-29.3,69.6,-15.9C73.5,-2.6,68.2,13.6,59.2,26.5C50.2,39.4,37.5,49,23.1,55.6C8.7,62.2,-7.4,65.9,-22.7,62.6C-38,59.3,-52.5,49.1,-60.9,35C-69.3,20.9,-71.6,2.9,-66.6,-12.4C-61.5,-27.7,-49.1,-40.2,-35.4,-49.7C-21.7,-59.2,-6.7,-65.7,4.2,-70.7C15.2,-75.7,26.4,-58.9,39.5,-49.4Z" transform="translate(100 100)"/>
          </svg>
        </div>
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

        <div className="relative z-30 -mt-2 md:-mt-4 h-[34svh] min-h-[220px] overflow-visible">
          <ContainerScroll titleComponent={<></>} className="!h-[44rem] md:!h-[56rem] !p-0 overflow-visible">
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
        <div className="mx-auto max-w-[1500px] px-6 md:px-16 pt-56 md:pt-80 pb-24 md:pb-32 grid md:grid-cols-[0.8fr_1.35fr] gap-10 md:gap-12 items-start">
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
          <div className="relative md:mt-16 lg:mt-24 md:-mr-20 lg:-mr-32">
            <img src={knowledgeGrid} alt="Buddy knowledge interface" className="w-full h-auto object-contain scale-125 md:scale-150 lg:scale-[1.6] origin-right" />
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
