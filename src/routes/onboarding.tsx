import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";

// Onboarding slide images — all 9 client-provided designs
import slide01 from "@/assets/onboarding-01.jpg";
import slide02 from "@/assets/onboarding-02.jpg";
import slide03 from "@/assets/onboarding-03.jpg";
import slide04 from "@/assets/onboarding-04.jpg";
import slide05 from "@/assets/onboarding-05.jpg";
import slide06 from "@/assets/onboarding-06.jpg";
import slide07 from "@/assets/onboarding-07.jpg";
import slide08 from "@/assets/onboarding-08.jpg";
import slide09 from "@/assets/onboarding-09.jpg";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
  head: () => ({ meta: [{ title: "Welcome — BUDDY" }] }),
});

const SLIDES = [
  slide01, slide02, slide03, slide04, slide05,
  slide06, slide07, slide08, slide09,
];

function OnboardingPage() {
  const nav = useNavigate();
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [animating, setAnimating] = useState(false);
  const [role, setRole] = useState<string>("student");
  const [email, setEmail] = useState<string>("");

  // Touch / drag state for swipe gesture
  const touchStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

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

  const goTo = useCallback((next: number, dir: "next" | "back") => {
    if (animating || next === current) return;
    setDirection(dir);
    setPrev(current);
    setCurrent(next);
    setAnimating(true);
    setTimeout(() => {
      setPrev(null);
      setAnimating(false);
    }, 600);
  }, [animating, current]);

  const goNext = () => {
    if (current < SLIDES.length - 1) goTo(current + 1, "next");
  };
  const goBack = () => {
    if (current > 0) goTo(current - 1, "back");
  };

  // Touch/mouse swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    isDragging.current = true;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goBack();
    }
    touchStartX.current = null;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || touchStartX.current === null) return;
    const diff = touchStartX.current - e.clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goBack();
    }
    touchStartX.current = null;
    isDragging.current = false;
  };

  const last = current === SLIDES.length - 1;

  // Slide transform helpers — Pinterest-style: new slide comes from right,
  // old one peels away to the left with a slight scale-down
  const getSlideStyle = (idx: number): React.CSSProperties => {
    const isActive = idx === current;
    const isPrev = idx === prev;

    if (isActive) {
      return {
        zIndex: 2,
        transform: animating
          ? (direction === "next" ? "translateX(0)" : "translateX(0)")
          : "translateX(0)",
        opacity: 1,
        transition: "transform 0.6s cubic-bezier(0.76,0,0.24,1), opacity 0.4s ease",
        animation: animating
          ? (direction === "next" ? "slideInFromRight 0.6s cubic-bezier(0.76,0,0.24,1) forwards"
                                  : "slideInFromLeft 0.6s cubic-bezier(0.76,0,0.24,1) forwards")
          : "none",
      };
    }
    if (isPrev) {
      return {
        zIndex: 1,
        animation: animating
          ? (direction === "next" ? "slideOutToLeft 0.6s cubic-bezier(0.76,0,0.24,1) forwards"
                                  : "slideOutToRight 0.6s cubic-bezier(0.76,0,0.24,1) forwards")
          : "none",
        opacity: 1,
      };
    }
    // Hidden slides
    return {
      zIndex: 0,
      opacity: 0,
      transform: "translateX(100%)",
      transition: "none",
    };
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden relative select-none"
      style={{ background: "#000", cursor: isDragging.current ? "grabbing" : "grab" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={() => { isDragging.current = false; touchStartX.current = null; }}
    >
      {/* CSS keyframe animations */}
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideOutToLeft {
          from { transform: translateX(0) scale(1); opacity: 1; }
          to   { transform: translateX(-8%) scale(0.94); opacity: 0; }
        }
        @keyframes slideOutToRight {
          from { transform: translateX(0) scale(1); opacity: 1; }
          to   { transform: translateX(8%) scale(0.94); opacity: 0; }
        }
      `}</style>

      {/* Slide stack */}
      {SLIDES.map((src, idx) => {
        const isActive = idx === current;
        const isPrev = idx === prev;
        if (!isActive && !isPrev) return null;
        return (
          <div
            key={idx}
            className="absolute inset-0"
            style={getSlideStyle(idx)}
          >
            <img
              src={src}
              alt={`Onboarding slide ${idx + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        );
      })}

      {/* UI layer — always on top */}
      <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">

        {/* Top bar */}
        <div className="flex justify-between items-center px-6 md:px-8 py-4 shrink-0 pointer-events-auto">
          <div
            className="font-serif tracking-[0.4em] uppercase text-[10px] md:text-xs"
            style={{ color: "rgba(255,255,255,0.55)", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
          >
            Tissa Jinasena Group
          </div>
          <button
            onClick={finish}
            className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase transition-opacity"
            style={{ color: "rgba(255,255,255,0.5)", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          >
            Skip →
          </button>
        </div>

        <div className="flex-1" />

        {/* Bottom controls */}
        <div className="flex items-center justify-between px-6 md:px-14 py-5 md:py-7 shrink-0 pointer-events-auto">

          {/* Step indicators */}
          <div className="flex gap-[6px] items-center">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx, idx > current ? "next" : "back")}
                style={{
                  width: idx === current ? "28px" : "8px",
                  height: "3px",
                  borderRadius: "2px",
                  background: idx === current ? "#CCFF00" : "rgba(255,255,255,0.3)",
                  transition: "width 0.35s ease, background 0.3s ease",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 md:gap-3">
            {current > 0 && (
              <button
                onClick={goBack}
                className="px-5 md:px-6 py-2.5 md:py-3 text-[10px] md:text-xs tracking-[0.3em] uppercase transition-all"
                style={{
                  border: "1px solid rgba(255,255,255,0.35)",
                  color: "#fff",
                  background: "rgba(0,0,0,0.25)",
                  backdropFilter: "blur(8px)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.color = "#000";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(0,0,0,0.25)";
                  e.currentTarget.style.color = "#fff";
                }}
              >
                ← Back
              </button>
            )}
            {!last ? (
              <button
                onClick={goNext}
                className="px-6 md:px-8 py-2.5 md:py-3 text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold transition-colors"
                style={{ background: "#CCFF00", color: "#000" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.background = "#CCFF00")}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={finish}
                className="px-6 md:px-8 py-2.5 md:py-3 text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold transition-colors"
                style={{ background: "#CCFF00", color: "#000" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.background = "#CCFF00")}
              >
                Get Started ✦
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
