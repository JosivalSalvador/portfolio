"use client";

import { motion } from "framer-motion";
import { blurFadeIn, staggerContainer, slideUp } from "@/lib/animations/fade";
import { FolderGit2 } from "lucide-react";

export function ProjectsHeader() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="border-border/50 mb-12 flex w-full flex-col border-b pb-10"
    >
      <motion.div
        variants={blurFadeIn}
        className="mb-6 flex items-center gap-3"
      >
        <div className="flex items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 p-2">
          <FolderGit2 className="h-4 w-4 text-emerald-500" />
        </div>
        <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
          ~/workspace/projects_log
        </span>
      </motion.div>

      <motion.h1
        variants={blurFadeIn}
        className="text-foreground text-4xl font-semibold tracking-tight md:text-5xl"
      >
        Projetos & Arquitetura
      </motion.h1>

      <motion.p
        variants={slideUp}
        className="text-muted-foreground mt-4 max-w-2xl text-sm leading-relaxed md:text-base"
      >
        Catálogo técnico de sistemas desenvolvidos. Contém detalhes de
        arquitetura, modelagem de banco de dados e integrações construídas para
        o Web Academy e soluções independentes.
      </motion.p>
    </motion.div>
  );
}
