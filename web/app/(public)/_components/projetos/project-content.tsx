"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { slideUp } from "@/lib/animations/fade";
import { FileText } from "lucide-react";

interface ProjectContentProps {
  content: string;
}

export function ProjectContent({ content }: ProjectContentProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={slideUp}
      className="flex w-full justify-center py-12"
    >
      {/* O Container de Leitura (A "Folha" de Vidro que ancora o texto) */}
      <div className="glass-panel glow-border border-border/50 relative w-full max-w-5xl rounded-3xl border bg-[#050505]/80 p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-10 md:p-16 lg:p-20">
        {/* Cabeçalho do Documento */}
        <div className="border-border/40 mb-10 flex items-center gap-3 border-b pb-6">
          <FileText className="h-5 w-5 text-emerald-500" />
          <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
            Documentação Técnica do Sistema
          </span>
        </div>

        {/* O Texto Markdown (Agora max-w-none pois o container de cima já limita a largura) */}
        <div className="prose prose-invert prose-zinc md:prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4 prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:marker:text-emerald-500 prose-pre:border prose-pre:border-border/40 prose-pre:rounded-xl prose-pre:font-mono prose-pre:text-sm prose-pre:bg-[#0a0a0a]/60 prose-code:text-emerald-400 prose-code:bg-emerald-400/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none w-full max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </motion.section>
  );
}
