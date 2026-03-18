"use client";

import { motion } from "framer-motion";
import { slideUp } from "@/lib/animations/fade";

interface DividerProps {
  label: string;
}

export function Divider({ label }: DividerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={slideUp}
      className="flex w-full items-center justify-center px-6 py-8"
    >
      <div className="flex w-full max-w-6xl items-center gap-4 opacity-80">
        {/* Linha sólida usando a exata cor do seu border no CSS */}
        <div className="h-px flex-1 bg-[#262626]" />

        {/* Texto estilo Terminal/Log */}
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#a3a3a3] uppercase">
          {`${label}`}
        </span>

        <div className="h-px flex-1 bg-[#262626]" />
      </div>
    </motion.div>
  );
}
