"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { blurFadeIn } from "@/lib/animations/fade";

interface AdminHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function AdminHeader({ title, description, action }: AdminHeaderProps) {
  return (
    <motion.div
      variants={blurFadeIn}
      initial="hidden"
      animate="visible"
      className="border-border/30 mb-10 flex flex-col justify-between gap-6 border-b pb-6 sm:flex-row sm:items-center"
    >
      <div className="space-y-2">
        <h1 className="from-foreground via-foreground/90 to-muted-foreground bg-linear-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent drop-shadow-sm md:text-4xl">
          {title}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed md:text-base">
          {description}
        </p>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}
