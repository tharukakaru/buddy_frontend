import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import buddyHead from "@/assets/buddy-head.png";
import knowledgeGrid from "@/assets/knowledge-grid.png";
import buddyVideo from "@/assets/robot-white.mp4";
import foundationLand from "@/assets/foundation-land.png";
import absolxLogo from "@/assets/absolx-logo.png";

// ── Hero slide images ──
import heroSlide1 from "@/assets/hero-slide-1.png";
import heroSlide2 from "@/assets/hero-slide-2.png";
import heroSlide3 from "@/assets/hero-slide-3.png";
import heroSlide4 from "@/assets/hero-slide-4.png";
import heroSlide5 from "@/assets/hero-slide-5.png";
import heroSlide6 from "@/assets/hero-slide-6.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "BUDDY — A knowledge companion by Jinasena Padanama" },
      { name: "description", content: "Buddy is a knowledge companion built on Dr. Tissa Jinasena's four-decade vision — wisdom that makes the complex simple." },
    ],
  }),
});

const HERO_SLIDES = [heroSlide1, heroSlide2, heroSlide3, heroSlide4, heroSlide5, heroSlide6];
const SLIDE_INTERVAL = 5000;

// ── Logo splash on first visit ──
function LogoSplash({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 600);
    const t2 = setTimeout(() => setPhase("out"), 2600);
    const t3 = setTimeout(() => onDone(), 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: "#000",
        opacity: phase === "out" ? 0 : 1,
        transition: phase === "out" ? "opacity 0.7s ease" : "none",
        pointerEvents: phase === "out" ? "none" : "all",
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 55% 38% at 50% 54%, #3a1d6e50 0%, transparent 70%)",
        animation: "splashPulse 2s ease-in-out infinite",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", alignItems: "center", gap: "14px",
        opacity: phase === "in" ? 0 : 1,
        transform: phase === "in" ? "translateY(20px) scale(0.95)" : "translateY(0) scale(1)",
        transition: "opacity 0.65s ease, transform 0.65s ease",
      }}>
        <div style={{
          fontFamily: "serif",
          fontSize: "clamp(60px, 15vw, 128px)",
          letterSpacing: "0.07em",
          color: "#fff",
          lineHeight: 1,
          textShadow: "0 0 80px rgba(180,130,255,0.35), 0 0 160px rgba(100,50,200,0.18)",
        }}>
          BU<span style={{ color: "#D4A017" }}>D</span>DY
        </div>

        <div style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(212,160,23,0.8), transparent)",
          width: phase === "hold" || phase === "out" ? "220px" : "0px",
          transition: "width 1s ease 0.1s",
        }} />

        <div style={{
          fontFamily: "serif", fontSize: "clamp(10px,1.8vw,13px)",
          color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em",
          marginTop: "4px",
        }}>
          බුද්ධිය යනු සංකීර්ණ දෑ සරල කිරීමේ හැකියාවයි
        </div>

        <div style={{
          fontSize: "9px", letterSpacing: "0.4em",
          color: "rgba(255,255,255,0.25)", textTransform: "uppercase",
          marginTop: "2px",
        }}>
          Tissa Jinasena Group Presents
        </div>
      </div>

      <style>{`@keyframes splashPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }`}</style>
    </div>
  );
}

// ── Hero slideshow ──
function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((next: number, dir: "next" | "back") => {
    if (animating || next === current) return;
    setDirection(dir);
    setPrev(current);
    setCurrent(next);
    setAnimating(true);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 750);
  }, [animating, current]);

  const advance = useCallback(() => {
    setCurrent(c => {
      const next = (c + 1) % HERO_SLIDES.length;
      setDirection("next");
      setPrev(c);
      setAnimating(true);
      setTimeout(() => { setPrev(null); setAnimating(false); }, 750);
      return next;
    });
  }, []);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, SLIDE_INTERVAL);
  };

  useEffect(() => {
    timerRef.current = setInterval(advance, SLIDE_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [advance]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      const next = diff > 0
        ? (current + 1) % HERO_SLIDES.length
        : (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
      goTo(next, diff > 0 ? "next" : "back");
      resetTimer();
    }
    touchStartX.current = null;
  };

  const getStyle = (idx: number): React.CSSProperties => {
    const isActive = idx === current;
    const isPrev = idx === prev;
    if (isActive) return {
      zIndex: 2,
      animation: animating
        ? `heroIn${direction === "next" ? "Right" : "Left"} 0.75s cubic-bezier(0.76,0,0.24,1) forwards`
        : "none",
    };
    if (isPrev) return {
      zIndex: 1,
      animation: animating
        ? `heroOut${direction === "next" ? "Left" : "Right"} 0.75s cubic-bezier(0.76,0,0.24,1) forwards`
        : "none",
    };
    return { zIndex: 0, opacity: 0 };
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "#000" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <style>{`
        @keyframes heroInRight  { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes heroInLeft   { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @keyframes heroOutLeft  { from{transform:translateX(0) scale(1);opacity:1} to{transform:translateX(-5%) scale(0.96);opacity:0} }
        @keyframes heroOutRight { from{transform:translateX(0) scale(1);opacity:1} to{transform:translateX(5%) scale(0.96);opacity:0} }
      `}</style>

      {/* ── CHANGED: reduced top padding so rectangle sits higher; increased maxHeight so it's less cropped ── */}
      <div className="px-2 pt-10 pb-4 md:px-3 md:pt-12 md:pb-6" style={{ background: "#000" }}>
        <div
          className="relative w-full overflow-hidden rounded-xl"
          style={{ aspectRatio: "16/9", maxHeight: "94vh" }}
        >

          {HERO_SLIDES.map((src, idx) => {
            const isActive = idx === current;
            const isPrev = idx === prev;
            if (!isActive && !isPrev) return null;
            return (
              <div key={idx} className="absolute inset-0" style={getStyle(idx)}>
                <img
                  src={src}
                  alt={`Hero slide ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                  draggable={false}
                />
              </div>
            );
          })}

          {/* Dot indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-[7px] items-center">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { goTo(idx, idx > current ? "next" : "back"); resetTimer(); }}
                aria-label={`Slide ${idx + 1}`}
                style={{
                  width: idx === current ? "32px" : "8px",
                  height: "3px",
                  borderRadius: "2px",
                  background: idx === current ? "#CCFF00" : "rgba(255,255,255,0.55)",
                  transition: "width 0.4s ease, background 0.3s",
                  border: "none", cursor: "pointer", padding: 0,
                }}
              />
            ))}
          </div>



          {/* Click zones */}
          <button className="absolute left-0 top-0 h-full w-1/3 z-10 opacity-0"
            onClick={() => { goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length, "back"); resetTimer(); }}
            aria-label="Previous slide" />
          <button className="absolute right-0 top-0 h-full w-1/3 z-10 opacity-0"
            onClick={() => { goTo((current + 1) % HERO_SLIDES.length, "next"); resetTimer(); }}
            aria-label="Next slide" />

        </div>
      </div>
    </section>
  );
}

function Index() {
  const nav = useNavigate();
  const goCourses = () => {
    const loggedIn = typeof window !== "undefined" && sessionStorage.getItem("buddy_fake_auth") === "1";
    nav({ to: loggedIn ? "/courses" : "/login" });
  };
  const goAbout = () => nav({ to: "/about" });

  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("buddy_splash_shown");
  });
  const handleSplashDone = () => {
    sessionStorage.setItem("buddy_splash_shown", "1");
    setShowSplash(false);
  };

  return (
    <div className="bg-background text-foreground">
      {showSplash && <LogoSplash onDone={handleSplashDone} />}

      <SiteNav mode="pill" />

      <HeroSlideshow />

      {/* Introduction */}
      <section className="bg-background text-foreground">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16 py-24 md:py-32 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <div className="flex gap-1 text-accent text-xl md:text-2xl font-serif mb-6 leading-none">
              <span>"</span><span>"</span>
            </div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-accent/80 mb-5">— Introduction</div>
            <h2 className="font-serif italic text-[26px] md:text-[38px] leading-[1.18] text-foreground/90 mb-8">
              A knowledge companion for the next generation of Sri Lanka.
            </h2>
            <p className="font-sinhala text-[11px] md:text-[12px] leading-[1.9] text-muted-foreground mb-4 max-w-md">
              "BUDDY" කෘතීම බුද්ධි යනු හුදෙක් තොරතුරු සපයන මෘදුකාංගයක් නො වේ; එය මානව විඥානය ඉහළ නැංවීම සඳහා නිර්මාණය කළ ඥාන සහකරුවෙකි. දශක හතරකට අධික කාලයක් ශ්‍රී ලාංකීය තරුණ පරපුර බලගන්වීමට කැපවූ ආචාර්ය තිස්ස ජිනසේන මහතාගේ දූරදර්ශී දැක්ම මෙහි පදනමයි.
            </p>
            <p className="text-[10px] md:text-[11px] leading-[1.85] text-muted-foreground/75 italic max-w-md">
              "Buddy is not merely an information tool — it is a knowledge companion designed to elevate human consciousness. Built on the four-decade vision of Dr. Tissa Jinasena, it weaves entrepreneurial mindset with the essence of Buddhist philosophy."
            </p>
          </div>
          <div className="flex items-center justify-center">
            <img src={knowledgeGrid} alt="Knowledge Grid" className="w-full h-auto object-contain" />
          </div>
        </div>
      </section>

      {/* Buddy AI — video */}
      <section className="bg-white text-foreground">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16 py-24 md:py-32 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="relative aspect-square max-w-[420px] mx-auto w-full rounded-sm overflow-hidden bg-white">
            <video src={buddyVideo} autoPlay loop muted playsInline preload="auto"
              className="w-full h-full object-cover mix-blend-multiply" />
          </div>
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-5">— Buddy AI</div>
            <h2 className="font-serif text-[32px] md:text-[44px] leading-[1.18] mb-6">
              From <em>"this is hard"</em> to <em>"I understand"</em>.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              Whatever you find difficult, Buddy explains it simply — until you can say "I get it now." Because true wisdom is not the accumulation of facts, but the ability to see the world clearly.
            </p>
            <button onClick={goAbout}
              className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors">
              Meet Buddy →
            </button>
          </div>
        </div>
      </section>

      {/* Foundation */}
      <section className="relative h-[80vh] overflow-hidden">
        <img src={foundationLand} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-6">
          <div className="text-[11px] tracking-[0.25em] uppercase opacity-75 mb-5">— The Foundation Network</div>
          <h2 className="font-serif text-[32px] md:text-[56px] max-w-3xl leading-tight">
            Four pillars. One vision for a more conscious society.
          </h2>
          <button onClick={() => nav({ to: "/foundation" })}
            className="mt-9 text-sm tracking-[0.2em] uppercase border-b border-white pb-1 hover:text-accent hover:border-accent transition-colors">
            Explore the network →
          </button>
        </div>
      </section>

      {/* Courses CTA */}
      <section className="bg-background text-foreground">
        <div className="mx-auto max-w-4xl px-6 md:px-16 py-24 md:py-32 text-center">
          <div className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-5">— JIT Courses</div>
          <h2 className="font-serif text-[32px] md:text-[52px] leading-tight">
            Cognitive Adaptability.<br />Technical Mastery.
          </h2>
          <p className="mt-3 text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
            The Multi-Skill Craftsman Pathway
          </p>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            The future of Sri Lankan vocational education isn't just about handling a tool — it's about commanding the entire system. Move beyond isolated trades. Master a comprehensive fusion of Electrical, Electronics, Mechatronics, and Industrial Logic.
          </p>
          <div className="mt-10 flex justify-center">
            <button onClick={goCourses}
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-foreground text-background text-xs tracking-[0.3em] uppercase overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px] hover:shadow-accent/60">
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
