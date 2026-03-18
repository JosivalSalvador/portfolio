"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { blurFadeIn, slideUp, staggerContainer } from "@/lib/animations/fade"; // Importando o orquestrador

export function Footer() {
  const [hasCopied, setHasCopied] = useState(false);
  const myEmail = "josivaljunior087@gmail.com";

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(myEmail);

    // Troca o ícone temporariamente
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);

    toast("sys.clipboard", {
      description: "Endereço de e-mail copiado para a área de transferência.",
    });
  };

  return (
    // Transformei o footer em uma tag HTML normal com position relative
    <footer className="border-border bg-background relative w-full overflow-hidden border-t pt-24 pb-12">
      {/* O Grid de Fundo com fade para preto no topo (Máscara) */}
      <div className="bg-grid-white pointer-events-none absolute inset-0 z-0 mask-[linear-gradient(to_bottom,transparent,black)] opacity-20" />

      {/* O Motion Div atua como orquestrador do stagger Container */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative z-10 container mx-auto flex flex-col items-center px-6 text-center lg:px-12"
      >
        <motion.div
          variants={blurFadeIn}
          className="flex flex-col items-center"
        >
          <span className="text-muted-foreground mb-6 flex items-center gap-3 font-mono text-xs tracking-widest uppercase">
            <span className="bg-border h-px w-6"></span>
            EOF
            <span className="bg-border h-px w-6"></span>
          </span>
          <h2 className="mb-8 text-3xl font-semibold tracking-tight text-balance md:text-5xl">
            Pronto para escalar seu próximo sistema?
          </h2>
        </motion.div>

        <motion.div
          variants={slideUp}
          className="mt-8 flex w-full flex-col flex-wrap justify-center gap-6 sm:flex-row sm:gap-10"
        >
          {[
            { name: "GitHub", href: "https://github.com/JosivalSalvador" },
            {
              name: "LinkedIn",
              href: "https://www.linkedin.com/in/josival-salvador-241b813b6/",
            },
          ].map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 text-sm font-medium transition-all"
            >
              {link.name}
              <ArrowUpRight className="text-muted-foreground/50 group-hover:text-foreground h-4 w-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ))}

          <button
            onClick={handleCopyEmail}
            className="group text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 text-sm font-medium transition-all focus:outline-none"
          >
            E-mail
            {/* Renderização condicional do ícone com animação leve */}
            <span className="relative flex h-4 w-4 items-center justify-center">
              {hasCopied ? (
                <Check className="text-primary scale-in-anim h-4 w-4" /> // Pode usar text-green-500 se preferir
              ) : (
                <Copy className="text-muted-foreground/50 group-hover:text-foreground h-4 w-4 transition-all group-hover:scale-110" />
              )}
            </span>
          </button>
        </motion.div>

        <motion.div
          variants={slideUp}
          className="text-muted-foreground/60 mt-24 flex w-full flex-col items-center justify-between gap-4 font-mono text-[10px] uppercase sm:flex-row sm:items-end sm:text-xs"
        >
          <span>Manaus, AM</span>
          <span>© {new Date().getFullYear()} — SYSTEM.OUT</span>
        </motion.div>
      </motion.div>
    </footer>
  );
}
