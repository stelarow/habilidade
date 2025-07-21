"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef, MouseEvent } from "react";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientSize?: number;
}

export function MagicCard({
  children,
  className,
  gradientColor = "#7c3aed",
  gradientOpacity = 0.8,
  gradientSize = 200,
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);
  
  const smoothMouseX = useSpring(mouseX, { duration: 0.3 });
  const smoothMouseY = useSpring(mouseY, { duration: 0.3 });

  const maskImage = useTransform(
    [smoothMouseX, smoothMouseY],
    ([latestX, latestY]) =>
      `radial-gradient(${gradientSize}px circle at ${latestX}px ${latestY}px, white, transparent)`
  );

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative overflow-hidden rounded-lg", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background: gradientColor,
          maskImage,
          WebkitMaskImage: maskImage,
          opacity: gradientOpacity,
        }}
      />
    </motion.div>
  );
}