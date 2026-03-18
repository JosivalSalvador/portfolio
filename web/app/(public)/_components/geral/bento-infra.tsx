"use client";

import { motion } from "framer-motion";
import { Box, GitMerge, Container, ShieldCheck } from "lucide-react";
import { bentoItem } from "@/lib/animations/fade";

export function BentoInfra() {
  return (
    <motion.div
      variants={bentoItem}
      className="glass-panel glow-border group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 md:p-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(168,85,247,0.05)_0%,transparent_50%)] transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="border-border/50 text-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-lg border bg-[#171717]">
          <Box className="h-6 w-6" />
        </div>
        <h3 className="text-foreground text-xl font-bold tracking-tight">
          Infra & Qualidade
        </h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Testes (Jest, Vitest, Playwright), esteira de CI/CD (Husky + GitHub
          Actions) e containerização (Docker).
        </p>
      </div>

      <div className="border-border/50 relative z-10 mt-8 flex items-center justify-between rounded-xl border bg-[#050505]/50 p-4 opacity-80 transition-opacity group-hover:opacity-100">
        <div className="bg-border absolute top-1/2 right-8 left-8 h-px -translate-y-1/2 border-dashed" />

        <div className="relative z-10 flex flex-col items-center gap-2 bg-[#050505] p-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10">
            <ShieldCheck className="h-4 w-4 text-purple-400" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2 bg-[#050505] p-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10">
            <GitMerge className="h-4 w-4 text-blue-400" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2 bg-[#050505] p-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/10">
            <Container className="h-4 w-4 text-yellow-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
