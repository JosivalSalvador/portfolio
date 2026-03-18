"use client";

import { motion } from "framer-motion";

// Sua stack real, corrigida e formatada para o padrão da indústria.
const TECH_STACK = [
  "C",
  "C++",
  "Java",
  "Python",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Express",
  "Fastify",
  "React",
  "Next.js",
  "Prisma",
  "SQLite",
  "MySQL",
  "PostgreSQL",
  "Jest",
  "Vitest",
  "Playwright",
  "Docker",
  "CI/CD",
  "Husky",
  "GitHub Actions",
  "TailwindCSS",
  "Framer Motion",
];

export function TechStackMarquee() {
  // Duplicamos o array algumas vezes para garantir que a tela sempre esteja cheia,
  // permitindo um loop infinito perfeito com o Framer Motion.
  const duplicatedTech = [...TECH_STACK, ...TECH_STACK, ...TECH_STACK];

  return (
    <section className="border-border/40 relative flex w-full flex-col items-center justify-center overflow-hidden border-y bg-[#050505] py-6 sm:py-8">
      {/* Máscara de desfoque nas laterais (Faz o texto sumir suavemente nas bordas) */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_right,#050505_0%,transparent_15%,transparent_85%,#050505_100%)]" />

      {/* Container da Animação */}
      <div className="flex w-full overflow-hidden">
        <motion.div
          className="flex w-max items-center gap-12 pr-12 sm:gap-16 sm:pr-16"
          // O truque do loop: move de 0% a -33.33% (já que triplicamos o array original)
          animate={{ x: ["0%", "-33.3333%"] }}
          transition={{
            ease: "linear",
            duration: 40, // Aumentei um pouco a duração já que a sua lista é bem grande, para não passar voando
            repeat: Infinity,
          }}
        >
          {duplicatedTech.map((tech, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {/* Pontinho brilhante ao lado de cada tecnologia */}
              <div className="bg-muted-foreground/40 h-1.5 w-1.5 rounded-full" />
              <span className="text-muted-foreground/80 font-mono text-sm font-medium tracking-wider whitespace-nowrap uppercase sm:text-base">
                {tech}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
