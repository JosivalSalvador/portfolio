"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TerminalSquare, Download, Check } from "lucide-react";
import { toast } from "sonner";
import { blurFadeIn, slideUp, staggerContainer } from "@/lib/animations/fade";

// Terminal com a pipeline CI/CD absurdamente completa
const bootSequence = [
  {
    text: "josival@system-out:~/portfolio$ git push origin dev",
    color: "text-muted-foreground",
  },
  { text: "> [husky] hooks de pre-commit... ✓ pass", color: "text-blue-400" },
  {
    text: "> [github_actions] iniciando CI (branch: dev)",
    color: "text-purple-400",
  },
  {
    text: "[lint/tsc] checagem de tipos e linting ✓ pass",
    color: "text-green-400",
  },
  {
    text: "[vitest] testes unitários (server & web) ✓ pass",
    color: "text-green-400",
  },
  { text: "[playwright] testes E2E (web) ✓ pass", color: "text-green-400" },
  {
    text: "[build] teste de build da aplicação ✓ pass",
    color: "text-green-400",
  },
  {
    text: "> abrindo PR para 'main' -> [cd] acionado",
    color: "text-yellow-400",
  },
  { text: "[docker] construindo imagens -> dockerhub", color: "text-cyan-400" },
  { text: "[deploy] api no render & web na vercel", color: "text-cyan-400" },
  { text: "➜ deploy 100% online.", color: "text-green-500 font-bold" },
];

export function HeroSection() {
  const [lines, setLines] = useState<number>(0);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setLines((prev) => (prev < bootSequence.length ? prev + 1 : prev));
    }, 550); // Aumentei minimamente para dar tempo de ler as novas linhas
    return () => clearInterval(timer);
  }, []);

  const handleDownloadClick = () => {
    setHasDownloaded(true);
    toast("sys.download", {
      description: "Download do currículo iniciado com sucesso.",
    });

    setTimeout(() => setHasDownloaded(false), 3000);
  };

  return (
    <section className="relative mt-14 flex min-h-[calc(100dvh-4rem)] w-full items-center overflow-hidden pt-12 pb-12 md:pt-16">
      <div className="bg-grid-white pointer-events-none absolute inset-0 z-0 opacity-[0.03]" />

      <div className="relative z-10 container mx-auto grid grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-8 lg:px-12">
        {/* COLUNA ESQUERDA: Textos e Ações */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start text-left"
        >
          <motion.div
            variants={blurFadeIn}
            className="glass-panel border-border/40 mb-6 flex items-center gap-3 rounded-md border px-3 py-1.5 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <span className="text-muted-foreground font-mono text-[10px] font-bold tracking-widest uppercase">
              Disponível para Estágio
            </span>
          </motion.div>

          <motion.h1
            variants={blurFadeIn}
            className="text-foreground text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl md:text-[4rem]"
          >
            Construindo <br className="hidden sm:block" />
            <span className="text-muted-foreground">sistemas do zero</span>{" "}
            <br className="hidden sm:block" />
            ao deploy.
          </motion.h1>

          <motion.p
            variants={slideUp}
            className="text-muted-foreground/80 mt-6 max-w-md text-base text-balance sm:text-lg"
          >
            Desenvolvedor Full Stack focado em arquiteturas escaláveis,
            automação e interfaces de alta performance.
          </motion.p>

          <motion.div
            variants={slideUp}
            className="mt-8 flex w-full flex-wrap items-center gap-4 sm:w-auto"
          >
            {/* BOTÃO CORRIGIDO: Agora ele sobe levemente, aumenta a sombra e dá um feedback visual real sem quebrar a cor */}
            <Link
              href="/projetos"
              className="glow-border group bg-foreground text-background flex w-full items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,255,255,0.2)] active:translate-y-0 active:scale-95 sm:w-auto"
            >
              <TerminalSquare className="h-4 w-4" />
              Executar Projetos
            </Link>

            <a
              href="/curriculo.pdf"
              download="Josival_CV.pdf"
              onClick={handleDownloadClick}
              className="glass-panel group text-foreground hover:border-border/50 flex w-full items-center justify-center gap-2 rounded-md border border-transparent px-6 py-3 font-mono text-sm font-medium transition-all hover:bg-white/5 sm:w-auto"
            >
              <span className="relative flex h-4 w-4 items-center justify-center">
                {hasDownloaded ? (
                  <Check className="scale-in-anim h-4 w-4 text-green-400" />
                ) : (
                  <Download className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-all group-hover:-translate-y-0.5" />
                )}
              </span>
              sys.get_cv()
            </a>
          </motion.div>
        </motion.div>

        {/* COLUNA DIREITA: Terminal CI/CD */}
        <motion.div
          initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto hidden w-full max-w-lg lg:flex"
        >
          <div className="glass-panel border-border/50 group relative w-full overflow-hidden rounded-lg border bg-[#0a0a0a]/90 shadow-2xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="border-border/50 flex h-10 items-center justify-between border-b bg-[#050505] px-4">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full border border-red-500/50 bg-red-500/20" />
                <div className="h-3 w-3 rounded-full border border-yellow-500/50 bg-yellow-500/20" />
                <div className="h-3 w-3 rounded-full border border-green-500/50 bg-green-500/20" />
              </div>
              <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                bash ~ deploy-pipeline
              </span>
            </div>

            <div className="relative flex min-h-75 flex-col gap-2 p-5 font-mono text-[11px] leading-relaxed sm:text-xs">
              {bootSequence.slice(0, lines).map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={line.color}
                >
                  {line.text}
                </motion.div>
              ))}

              {lines === bootSequence.length && (
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="bg-primary mt-1 h-4 w-2.5"
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
