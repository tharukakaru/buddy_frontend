import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroOcean from "@/assets/hero-ocean.jpg";
import founder from "@/assets/founder.jpg";
import buddyVideo from "@/assets/buddy-robot.mp4";
import foundation from "@/assets/foundation-mountain.png";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
  head: () => ({ meta: [{ title: "Welcome — BUDDY" }] }),
});

const SLIDES = [
  {
    eyebrow: "Chapter 1",
    title: "A vision four decades in the making",
    body: "Dr. Tissa Jinasena spent forty years building Sri Lanka's industrial backbone — and dreaming of a tool that could pass that knowledge to the next generation.",
    media: founder,
  },
  {
    eyebrow: "Chapter 2",
    title: "Meet Buddy",
    body: "Buddy is your knowledge companion. Whatever you find difficult, Buddy explains it simply — until you can say 'I get it now.'",
    media: buddyVideo,
    isVideo: true,
  },
  {
    eyebrow: "Chapter 3",
    title: "Wisdom, not just information",
    body: "Buddy weaves entrepreneurial mindset with the essence of Buddhist philosophy. The goal isn't facts — it's the ability to see the world clearly.",
    media: heroOcean,
  },
  {
    eyebrow: "Chapter 4",
    title: "Built for you, adaptive every day",
    body: "Pick a level — Beginner, Intermediate, or Advanced. Each daily quiz tunes tomorrow's lesson to exactly where you are.",
    media: foundation,
  },
  {
    eyebrow: "Chapter 5",
    title: "You're not alone",
    body: "When something stumps you, Buddy AI is one tap away — and your mentors are right behind it.",
    media: foundation,
  },
];

function OnboardingPage() {
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  const last = i === SLIDES.length - 1;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) nav({ to: "/login" });
    });
  }, [nav]);

  const finish = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", data.user.id);
    }
    nav({ to: "/courses" });
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
