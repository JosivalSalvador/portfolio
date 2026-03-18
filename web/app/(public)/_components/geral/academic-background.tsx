"use client";

import { motion } from "framer-motion";
import { GraduationCap, Calendar, BookOpen, Code2, Cpu } from "lucide-react";
import { staggerContainer, slideUp, bentoItem } from "@/lib/animations/fade";

// Seus dados reais em ordem cronológica de evolução
const ACADEMIC_DATA = [
  {
    id: 1,
    title: "Técnico em Informática",
    institution: "CETAM",
    period: "2018 — 2019",
    description:
      "Curso técnico completo (1.200h) onde consolidei minha base em lógica de programação, arquitetura de computadores, redes e banco de dados.",
    type: "Curso Técnico",
    icon: Cpu,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "from-emerald-500/10 via-emerald-500/5 to-transparent",
  },
  {
    id: 2,
    title: "Bacharelado em Ciência da Computação",
    institution: "UFAM",
    period: "2020 — Atual",
    description:
      "Formação acadêmica sólida focada em engenharia de software, estrutura de dados, algoritmos complexos e orientação a objetos (C, C++, Java).",
    type: "Graduação",
    icon: GraduationCap,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "from-blue-500/10 via-blue-500/5 to-transparent",
  },
  {
    id: 3,
    title: "Desenvolvimento Web Full Stack",
    institution: "Web Academy / IComp - UFAM",
    period: "2025",
    description:
      "Especialização intensiva (348h) englobando React, Node.js, TypeScript, CI/CD, Docker, além de forte introdução em Ciência de Dados e Machine Learning.",
    type: "Especialização",
    icon: Code2,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    glow: "from-purple-500/10 via-purple-500/5 to-transparent",
  },
];

export function AcademicBackground() {
  return (
    <section className="bg-background border-border/10 relative w-full overflow-hidden border-t py-24 md:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Cabeçalho da Seção */}
        <header className="mb-16 flex max-w-2xl flex-col items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideUp}
          >
            <div className="border-border/50 text-muted-foreground mb-4 flex w-max items-center gap-2 rounded-full border bg-[#171717]/50 px-3 py-1.5 text-sm font-medium backdrop-blur-xs">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>Educação</span>
            </div>
            <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-5xl">
              Trajetória{" "}
              <span className="text-muted-foreground">Acadêmica.</span>
            </h2>
            <p className="text-muted-foreground mt-6 text-base leading-relaxed md:text-lg">
              A base teórica rigorosa combinada com especializações práticas de
              mercado. O alicerce por trás da construção de sistemas escaláveis.
            </p>
          </motion.div>
        </header>

        {/* Lista de Formações - Ajustado para 3 colunas em Telas Grandes */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {ACADEMIC_DATA.map((item) => (
            <motion.div key={item.id} variants={bentoItem} className="h-full">
              <article className="glass-panel glow-border group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-[#050505] p-8 transition-colors hover:bg-[#0a0a0a]">
                {/* Efeito de brilho de fundo no hover (Spotlight Moderno) */}
                <div
                  className={`absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] ${item.glow} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100`}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <span
                      className={`flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs font-medium ${item.bg} ${item.color} ${item.border} backdrop-blur-md`}
                    >
                      <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {item.type}
                    </span>
                    <div className="text-muted-foreground flex items-center gap-2 rounded-full border border-white/8 bg-white/3 px-3 py-1 font-mono text-xs font-medium backdrop-blur-md">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      {item.period}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-foreground mb-3 text-xl font-bold tracking-tight sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground/90 mb-6 text-sm font-semibold">
                      {item.institution}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
