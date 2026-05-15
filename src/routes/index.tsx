import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import heroOcean from "@/assets/hero-ocean.jpg";
import buddyRobot from "@/assets/buddy-robot.png";
import foundationLand from "@/assets/foundation-land.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "BUDDY — A knowledge companion by Jinasena Padanama" },
      {
        name: "description",
        content:
          "Buddy is a knowledge companion built on Dr. Tissa Jinasena's four-decade vision — wisdom that makes the complex simple.",
      },
    ],
  }),
});

function Index() {
  return (
    <div>
      <SiteNav />

      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={heroOcean}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-6 text-center">
          <div className="text-[10px] md:text-xs tracking-display uppercase opacity-80 mb-6">
            Jinasena Padanama presents
          </div>
          <h1 className="font-serif text-[18vw] md:text-[14vw] leading-[0.85] tracking-tight">
            BUDDY
          </h1>
          <p className="mt-8 max-w-xl text-sm md:text-base opacity-85 font-sinhala leading-relaxed">
            බුද්ධිය යනු සංකීර්ණ දෑ සරල කිරීමේ හැකියාවයි.
          </p>
          <p className="mt-2 max-w-xl text-xs md:text-sm opacity-65">
            Wisdom is the ability to make the complex simple.
          </p>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-display uppercase animate-bounce">
          ↓ Scroll
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-5xl px-6 md:px-12 py-32 md:py-48">
        <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-8">
          — Introduction
        </div>
        <h2 className="font-serif text-4xl md:text-6xl leading-tight">
          A knowledge companion for the next generation of Sri Lanka.
        </h2>
        <div className="mt-12 grid md:grid-cols-2 gap-12 text-base leading-relaxed">
          <p className="font-sinhala">
            "BUDDY" කෘතීම බුද්ධි යනු හුදෙක් තොරතුරු සපයන මෘදුකාංගයක් නො වේ; එය
            මානව විඥානය ඉහළ නැංවීම සඳහා නිර්මාණය කළ ඥාන සහකරුවෙකි. දශක හතරකට
            අධික කාලයක් ශ්‍රී ලාංකීය තරුණ පරපුර බලගන්වීමට කැපවූ ආචාර්ය තිස්ස
            ජිනසේන මහතාගේ දූරදර්ශී දැක්ම මෙහි පදනමයි.
          </p>
          <p className="text-muted-foreground">
            Buddy is not merely an information tool — it is a knowledge companion
            designed to elevate human consciousness. Built on the four-decade
            vision of Dr. Tissa Jinasena, it weaves entrepreneurial mindset with
            the essence of Buddhist philosophy.
          </p>
        </div>
      </section>

      {/* Buddy AI */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-32 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square max-w-md mx-auto w-full">
            <img
              src={buddyRobot}
              alt="Buddy AI mascot"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          <div>
            <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-6">
              — Buddy AI
            </div>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
              From <em>"this is hard"</em> to <em>"I understand"</em>.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Whatever you find difficult, Buddy explains it simply — until you
              can say "I get it now." Because true wisdom is not the
              accumulation of facts, but the ability to see the world clearly.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm tracking-display uppercase border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors"
            >
              Meet Buddy →
            </Link>
          </div>
        </div>
      </section>

      {/* Foundation */}
      <section className="relative h-[80vh] overflow-hidden">
        <img
          src={foundationLand}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-6">
          <div className="text-[11px] tracking-display uppercase opacity-80 mb-6">
            — The Foundation Network
          </div>
          <h2 className="font-serif text-4xl md:text-6xl max-w-3xl leading-tight">
            Four pillars. One vision for a more conscious society.
          </h2>
          <Link
            to="/foundation"
            className="mt-10 text-sm tracking-display uppercase border-b border-white pb-1 hover:text-accent hover:border-accent"
          >
            Explore the network →
          </Link>
        </div>
      </section>

      {/* Courses CTA */}
      <section className="mx-auto max-w-5xl px-6 md:px-12 py-32 text-center">
        <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-6">
          — JIT Courses
        </div>
        <h2 className="font-serif text-4xl md:text-6xl leading-tight">
          15 international-standard courses, built for Sri Lankan youth.
        </h2>
        <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
          Engineering, manufacturing, and agriculture — taught in Sinhala,
          mentored in person, unlocked one course at a time.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/courses"
            className="px-8 py-4 bg-foreground text-background text-xs tracking-display uppercase hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Browse Courses
          </Link>
          <Link
            to="/contact"
            className="px-8 py-4 border border-foreground text-xs tracking-display uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            Create Student Account
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
