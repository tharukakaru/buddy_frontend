"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  textClassName?: string;
  className?: string;
}

export function AnimatedText({ text, textClassName, className }: AnimatedTextProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      <motion.span
        className={cn("inline-block", textClassName)}
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.6) 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
        }}
        animate={{
          backgroundPosition: ["200% 0%", "-200% 0%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {text}
      </motion.span>
    </div>
  );
}
