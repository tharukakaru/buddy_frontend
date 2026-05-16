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
    <div className="min-h-screen bg-foreground text-background flex flex-col">
      <div className="flex justify-between items-center px-8 py-6">
        <div className="font-serif tracking-[0.4em] uppercase text-xs">Tissa Jinasena Group</div>
        <button onClick={finish} className="text-[11px] tracking-display uppercase opacity-60 hover:opacity-100">Skip →</button>
      </div>

      <div className="flex-1 grid md:grid-cols-2 gap-12 px-8 md:px-16 items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
          {slide.isVideo ? (
            <video src={slide.media} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          ) : (
            <img src={slide.media} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        </div>
        <div>
          <div className="text-[11px] tracking-display uppercase text-accent mb-6">— {slide.eyebrow}</div>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight">{slide.title}</h1>
          <p className="mt-6 text-background/70 text-base md:text-lg leading-relaxed max-w-lg">{slide.body}</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 md:px-16 py-10">
        <div className="flex gap-2">
          {SLIDES.map((_, idx) => (
            <div key={idx} className={`h-px transition-all ${idx === i ? "bg-accent w-12" : "bg-background/20 w-6"}`} />
          ))}
        </div>
        <div className="flex gap-3">
          {i > 0 && (
            <button onClick={() => setI(i - 1)} className="px-6 py-3 text-xs tracking-[0.3em] uppercase border border-background/30 hover:border-background">
              ← Back
            </button>
          )}
          {!last ? (
            <button onClick={() => setI(i + 1)} className="px-8 py-3 text-xs tracking-[0.3em] uppercase bg-accent text-foreground hover:bg-accent/90">
              Next →
            </button>
          ) : (
            <button onClick={finish} className="px-8 py-3 text-xs tracking-[0.3em] uppercase bg-accent text-foreground hover:bg-accent/90">
              Get Started ✦
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
