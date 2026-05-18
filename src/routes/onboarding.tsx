import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroOcean from "@/assets/hero-ocean.jpg";
import founder from "@/assets/founder.jpg";
import buddyVideo from "@/assets/buddy-robot.mp4";
import foundation from "@/assets/foundation-mountain.png";
import jftLogo from "@/assets/jft-logo.png";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
  head: () => ({ meta: [{ title: "Welcome — BUDDY" }] }),
});

const SLIDES = [
  {
    eyebrow: "Chapter 1",
    title: "A vision four decades in the making",
    body: "Dr. Tissa Jinasena spent forty years building Sri Lanka's industrial backbone — from Loadstar's global factories to nurturing rural youth — dreaming of a tool that could pass that knowledge to the next generation.",
    media: founder,
  },
  {
    eyebrow: "Chapter 2",
    title: "Meet Buddy",
    body: "Buddy is your knowledge companion — built on AI, guided by wisdom. Whatever you find difficult, Buddy explains it patiently until you can say, 'I get it now.'",
    media: buddyVideo,
    isVideo: true,
  },
  {
    eyebrow: "Chapter 3",
    title: "Wisdom, not just information",
    body: "Buddy weaves an entrepreneurial mindset with the essence of Buddhist philosophy. The goal isn't facts — it's the ability to see the world, and yourself, clearly.",
    media: heroOcean,
  },
  {
    eyebrow: "Chapter 4",
    title: "Built for you, adaptive every day",
    body: "Pick your level — Beginner, Intermediate, or Advanced. Each daily quiz tunes tomorrow's lesson to exactly where you are. No two journeys are the same.",
    media: foundation,
  },
  {
    eyebrow: "Chapter 5",
    title: "You're never alone",
    body: "When something stumps you, Buddy AI is one tap away — and behind it stand mentors from the Jinasena Training Foundation, ready to walk with you.",
    media: jftLogo,
  },
];

function OnboardingPage() {
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  const last = i === SLIDES.length - 1;
  const [role, setRole] = useState<string>("student");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const auth = sessionStorage.getItem("buddy_fake_auth") === "1";
    if (!auth) { nav({ to: "/login" }); return; }
    setRole(sessionStorage.getItem("buddy_role") || "student");
    setEmail(sessionStorage.getItem("buddy_email") || "");
  }, [nav]);

  const finish = () => {
    if (email) localStorage.setItem("buddy_onboarded_" + email, "1");
    nav({ to: role === "teacher" ? "/teacher" : "/courses" });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-foreground text-background flex flex-col">
      {/* Top bar — fixed compact height */}
      <div className="flex justify-between items-center px-6 md:px-8 py-4 shrink-0">
        <div className="font-serif tracking-[0.4em] uppercase text-[10px] md:text-xs">Tissa Jinasena Group</div>
        <button onClick={finish} className="text-[10px] md:text-[11px] tracking-display uppercase opacity-60 hover:opacity-100 transition-opacity">Skip →</button>
      </div>

      {/* Middle content — flex-1 so it fills remaining space; min-h-0 prevents overflow */}
      <div className="flex-1 min-h-0 grid md:grid-cols-2 gap-6 md:gap-10 px-6 md:px-16 items-center pb-2">
        <div className="relative h-full max-h-[55vh] md:max-h-[70vh] overflow-hidden rounded-sm">
          {slide.isVideo ? (
           <video src={slide.media} autoPlay loop muted playsInline className="w-full h-full object-contain" />
          ) : (
            <img src={slide.media} alt="" className="w-full h-full object-contain" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-[10px] md:text-[11px] tracking-display uppercase text-accent mb-3 md:mb-5">— {slide.eyebrow}</div>
          <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl leading-tight">{slide.title}</h1>
          <p className="mt-3 md:mt-5 text-background/70 text-sm md:text-base leading-relaxed max-w-lg">{slide.body}</p>
        </div>
      </div>

      {/* Bottom controls — fixed compact height */}
      <div className="flex items-center justify-between px-6 md:px-16 py-5 md:py-7 shrink-0">
        <div className="flex gap-2">
          {SLIDES.map((_, idx) => (
            <div key={idx} className={`h-px transition-all ${idx === i ? "bg-accent w-10 md:w-12" : "bg-background/20 w-5 md:w-6"}`} />
          ))}
        </div>
        <div className="flex gap-2 md:gap-3">
          {i > 0 && (
            <button onClick={() => setI(i - 1)} className="px-5 md:px-6 py-2.5 md:py-3 text-[10px] md:text-xs tracking-[0.3em] uppercase border border-background/30 hover:border-background hover:bg-white hover:text-foreground transition-colors">
              ← Back
            </button>
          )}
          {!last ? (
            <button onClick={() => setI(i + 1)} className="px-6 md:px-8 py-2.5 md:py-3 text-[10px] md:text-xs tracking-[0.3em] uppercase bg-accent text-foreground hover:bg-white hover:text-foreground transition-colors">
              Next →
            </button>
          ) : (
            <button onClick={finish} className="px-6 md:px-8 py-2.5 md:py-3 text-[10px] md:text-xs tracking-[0.3em] uppercase bg-accent text-foreground hover:bg-white hover:text-foreground transition-colors">
              Get Started ✦
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
