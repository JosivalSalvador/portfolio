"use client";

import { motion } from "framer-motion";
import { Server, Database, Monitor, ArrowRight } from "lucide-react";
import { blurFadeIn } from "@/lib/animations/fade";

export function ProjectArchitectureDiagram() {
  return (
    <motion.div
      variants={blurFadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="glass-panel border-border/60 mb-16 w-full rounded-xl border p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] md:p-8"
    >
      <div className="border-border/40 mb-10 flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-foreground text-lg font-bold tracking-tight">
            Topologia do Sistema
          </h3>
          <p className="text-muted-foreground mt-1 font-mono text-[10px] tracking-widest uppercase">
            Fluxo de Dados & Infraestrutura
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-2">
        {/* Node 1: Client */}
        <div className="border-border/50 bg-background/50 glow-border flex flex-col items-center gap-4 rounded-xl border p-6 backdrop-blur-sm">
          <Monitor className="text-foreground h-8 w-8" />
          <div className="text-center">
            <p className="text-foreground font-mono text-sm font-bold">
              Interface Web
            </p>
            <p className="text-muted-foreground mt-1 font-mono text-[10px]">
              React / Next.js
            </p>
          </div>
        </div>

        {/* Link 1 */}
        <div className="text-muted-foreground hidden flex-col items-center px-4 md:flex">
          <ArrowRight className="text-border mb-1 h-5 w-5" />
          <span className="text-border font-mono text-[8px] tracking-widest uppercase">
            HTTP
          </span>
        </div>

        {/* Node 2: API */}
        <div className="relative flex flex-col items-center gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
          <Server className="h-8 w-8 text-emerald-500" />
          <div className="text-center">
            <p className="font-mono text-sm font-bold text-emerald-500">
              API Gateway
            </p>
            <p className="mt-1 font-mono text-[10px] text-emerald-500/70">
              Node / Fastify
            </p>
          </div>
        </div>

        {/* Link 2 */}
        <div className="text-muted-foreground hidden flex-col items-center px-4 md:flex">
          <ArrowRight className="text-border mb-1 h-5 w-5" />
          <span className="text-border font-mono text-[8px] tracking-widest uppercase">
            TCP
          </span>
        </div>

        {/* Node 3: Database */}
        <div className="border-border/50 bg-background/50 glow-border flex flex-col items-center gap-4 rounded-xl border p-6 backdrop-blur-sm">
          <Database className="text-foreground h-8 w-8" />
          <div className="text-center">
            <p className="text-foreground font-mono text-sm font-bold">
              Banco de Dados
            </p>
            <p className="text-muted-foreground mt-1 font-mono text-[10px]">
              Prisma / PostgreSQL
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
