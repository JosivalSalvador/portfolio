"use client";

import { motion } from "framer-motion";
import { Server, DatabaseZap } from "lucide-react";
import { bentoItem } from "@/lib/animations/fade";

export function BentoBackend() {
  return (
    <motion.div
      variants={bentoItem}
      className="glass-panel glow-border group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 md:p-8"
    >
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-green-500/10 blur-3xl transition-all group-hover:bg-green-500/20" />

      <div className="relative z-10 flex items-start justify-between">
        <div className="border-border/50 text-foreground flex h-12 w-12 items-center justify-center rounded-lg border bg-[#171717]">
          <Server className="h-6 w-6" />
        </div>
        <div className="flex max-w-[50%] flex-wrap justify-end gap-2">
          <span className="rounded-md border border-green-500/20 bg-green-500/10 px-2 py-1 font-mono text-[10px] font-medium text-green-400">
            Fastify
          </span>
          <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 font-mono text-[10px] font-medium text-blue-400">
            PostgreSQL
          </span>
          <span className="rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-1 font-mono text-[10px] font-medium text-purple-400">
            Prisma
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-6">
        <h3 className="text-foreground text-xl font-bold tracking-tight">
          Arquitetura Backend
        </h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Este projeto é servido por <strong>Fastify</strong> e{" "}
          <strong>PostgreSQL</strong> via <strong>Prisma</strong>. Meu arsenal
          completo também inclui Node, Express, SQLite e MySQL para construir
          APIs robustas.
        </p>
      </div>

      <div className="border-border/50 text-muted-foreground relative z-10 mt-6 rounded-xl border bg-[#050505] p-4 font-mono text-xs leading-relaxed opacity-90 transition-opacity group-hover:opacity-100">
        <div className="border-border/50 mb-2 flex items-center gap-2 border-b pb-2">
          <DatabaseZap className="h-3 w-3 text-green-400" />
          <span>schema.prisma</span>
        </div>
        <p>
          <span className="text-purple-400">datasource</span> db {"{"}
        </p>
        <p className="pl-4">
          provider ={" "}
          <span className="text-green-400">&quot;postgresql&quot;</span>
        </p>
        <p className="pl-4">
          url = <span className="text-blue-400">env</span>(
          <span className="text-green-400">&quot;DATABASE_URL&quot;</span>)
        </p>
        <p>{"}"}</p>
      </div>
    </motion.div>
  );
}
