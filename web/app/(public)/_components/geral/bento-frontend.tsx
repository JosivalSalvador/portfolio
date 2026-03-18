"use client";

import { motion } from "framer-motion";
import {
  LayoutTemplate,
  MonitorSmartphone,
  MousePointerClick,
} from "lucide-react";
import { bentoItem } from "@/lib/animations/fade";

export function BentoFrontend() {
  return (
    <motion.div
      variants={bentoItem}
      className="glass-panel glow-border group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 md:p-8"
    >
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl transition-all group-hover:bg-blue-500/20" />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="border-border/50 text-foreground flex h-12 w-12 items-center justify-center rounded-lg border bg-[#171717]">
          <LayoutTemplate className="h-6 w-6" />
        </div>

        <div>
          <h3 className="text-foreground text-xl font-bold tracking-tight">
            Frontend Experience
          </h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Neste portfólio, utilizo <strong>Next.js</strong> e{" "}
            <strong>React</strong> para SSR dinâmico, estilizado com{" "}
            <strong>TailwindCSS</strong> e animado via{" "}
            <strong>Framer Motion</strong>.
          </p>
        </div>
      </div>

      <div className="border-border/50 relative z-10 mt-8 flex flex-col gap-3 rounded-xl border bg-[#050505]/50 p-4 opacity-80 transition-opacity group-hover:opacity-100">
        <div className="border-border/50 flex items-center gap-2 border-b pb-3">
          <MonitorSmartphone className="h-4 w-4 text-blue-400" />
          <div className="h-2 w-20 rounded-full bg-blue-500/30" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex w-full flex-col gap-2">
            <div className="bg-muted-foreground/40 h-2 w-3/4 rounded-full" />
            <div className="bg-muted-foreground/20 h-2 w-1/2 rounded-full" />
          </div>
          <MousePointerClick className="h-5 w-5 animate-pulse text-blue-400" />
        </div>
      </div>
    </motion.div>
  );
}
