"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MagicCard({
  children,
  className,
}: MagicCardProps) {
  return (
    <motion.div
      className={cn("relative overflow-hidden rounded-lg", className)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}