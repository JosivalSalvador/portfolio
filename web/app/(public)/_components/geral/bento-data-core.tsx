"use client";

import { motion } from "framer-motion";
import { BrainCircuit, TerminalSquare } from "lucide-react";
import { bentoItem } from "@/lib/animations/fade";

export function BentoDataCore() {
  return (
    <motion.div
      variants={bentoItem}
      className="glass-panel glow-border group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 md:p-8"
    >
      <div className="absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl transition-all group-hover:bg-orange-500/20" />

      <div className="relative z-10 flex items-start justify-between">
        <div className="border-border/50 text-foreground flex h-12 w-12 items-center justify-center rounded-lg border bg-[#171717]">
          <BrainCircuit className="h-6 w-6" />
        </div>
        <div className="flex gap-2">
          <span className="rounded-md border border-yellow-500/20 bg-yellow-500/10 px-2 py-1 font-mono text-[10px] font-medium text-yellow-400">
            Python
          </span>
          <span className="rounded-md border border-orange-500/20 bg-orange-500/10 px-2 py-1 font-mono text-[10px] font-medium text-orange-400">
            C / C++ / Java
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-6">
        <h3 className="text-foreground text-xl font-bold tracking-tight">
          Engenharia Core & Dados
        </h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Fundação sólida em algoritmos de baixo nível e orientação a objetos
          (C, C++, Java). Aliado a isso, trago forte base em Ciência de Dados e
          automações complexas com Python.
        </p>
      </div>

      <div className="border-border/50 text-muted-foreground relative z-10 mt-6 rounded-xl border bg-[#050505] p-4 font-mono text-xs leading-relaxed opacity-90 transition-opacity group-hover:opacity-100">
        <div className="border-border/50 mb-2 flex items-center gap-2 border-b pb-2">
          <TerminalSquare className="h-3 w-3 text-orange-400" />
          <span>model.py</span>
        </div>
        <p>
          <span className="text-purple-400">import</span> pandas{" "}
          <span className="text-purple-400">as</span> pd
        </p>
        <p>
          <span className="text-purple-400">from</span> sklearn.ensemble{" "}
          <span className="text-purple-400">import</span> RandomForest
        </p>
        <p className="mt-2">model = RandomForest()</p>
        <p>
          model.fit(X_train, y_train){" "}
          <span className="text-green-500/50"># Training...</span>
        </p>
      </div>
    </motion.div>
  );
}
