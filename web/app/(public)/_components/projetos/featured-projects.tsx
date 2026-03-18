"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Eye,
  TerminalSquare,
  Code2,
} from "lucide-react";
import { staggerContainer, slideUp, blurFadeIn } from "@/lib/animations/fade";
import { ProjectResponse } from "@/types/index";

// Ícone do GitHub Inline Blindado
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// Subcomponente isolado para gerenciar estado de imagem e links limpos
function FeaturedProjectCard({ project }: { project: ProjectResponse }) {
  const [imgError, setImgError] = useState(false);
  const shouldRenderImage = Boolean(project.imageUrl) && !imgError;

  return (
    <div className="glow-border glass-panel group border-border/40 hover:border-border/80 flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-500">
      {/* Banner da Imagem (Linkável) */}
      <Link
        href={`/projetos/${project.slug}`}
        className="border-border/40 bg-muted/10 relative flex h-56 w-full items-center justify-center overflow-hidden border-b"
      >
        {shouldRenderImage ? (
          <Image
            src={project.imageUrl!}
            alt={project.title}
            fill
            className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-muted-foreground/30 group-hover:text-muted-foreground/50 flex flex-col items-center justify-center transition-colors duration-500">
            <Code2 className="mb-2 h-10 w-10" />
            <span className="font-mono text-[10px] tracking-widest uppercase">
              {project.imageUrl ? "IMG_LOAD_ERROR" : "IMG_NULL"}
            </span>
          </div>
        )}

        {/* Badge de Views */}
        <div className="bg-background/90 border-border/50 text-muted-foreground absolute top-3 right-3 flex items-center gap-1.5 rounded-md border px-2 py-1 backdrop-blur-md">
          <Eye className="h-3 w-3" />
          <span className="font-mono text-[10px] font-bold tracking-widest">
            {project.views.toLocaleString()}
          </span>
        </div>
      </Link>

      {/* Conteúdo do Card */}
      <div className="flex flex-1 flex-col p-6">
        <Link
          href={`/projetos/${project.slug}`}
          className="group/title mb-3 flex w-fit items-start justify-between gap-4"
        >
          <h3 className="text-foreground text-2xl font-bold tracking-tight transition-colors group-hover/title:text-emerald-400">
            {project.title}
          </h3>
          <ArrowUpRight className="text-muted-foreground mt-1 h-5 w-5 shrink-0 transition-transform duration-300 group-hover/title:rotate-45 group-hover/title:text-emerald-400" />
        </Link>

        <p className="text-muted-foreground mb-6 line-clamp-2 text-sm">
          {project.description}
        </p>

        {/* Tags Técnicas */}
        <div className="mt-auto mb-8 flex flex-wrap gap-2">
          {project.tags?.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="border-border/50 bg-background/50 text-muted-foreground rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase"
            >
              {tag}
            </span>
          ))}
          {project.tags && project.tags.length > 4 && (
            <span className="text-muted-foreground self-center font-mono text-[10px]">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        {/* Rodapé com Links Limpos (Sem quebrar o HTML) */}
        <div className="border-border/50 flex items-center justify-between border-t pt-5">
          <Link
            href={`/projetos/${project.slug}`}
            className="text-muted-foreground font-mono text-xs tracking-widest uppercase transition-colors hover:text-emerald-400"
          >
            Explorar arquitetura
          </Link>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-md p-1.5 transition-colors"
                aria-label="Código Fonte"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground rounded-md p-1.5 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                aria-label="Acessar Produção"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// COMPONENTE PRINCIPAL
// ==============================================
interface FeaturedProjectsProps {
  projects: ProjectResponse[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    // Fundo transparente para herdar o GridBackground global
    <section className="relative w-full overflow-hidden bg-transparent pb-24 md:pt-32 md:pb-32">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Cabeçalho Técnico */}
        <header className="border-border/40 mb-12 flex flex-col justify-between gap-8 border-b pb-8 md:flex-row md:items-end">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex max-w-2xl flex-col items-start"
          >
            <motion.div
              variants={blurFadeIn}
              className="mb-4 flex items-center gap-2"
            >
              <TerminalSquare className="h-4 w-4 text-emerald-500" />
              <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                ~/system/featured_modules
              </span>
            </motion.div>

            <motion.h2
              variants={blurFadeIn}
              className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Projetos em Destaque
            </motion.h2>

            <motion.p
              variants={blurFadeIn}
              className="text-muted-foreground mt-4 text-sm leading-relaxed md:text-base"
            >
              Aplicações construídas com arquiteturas escaláveis. Da modelagem
              de dados no Prisma à construção de interfaces interativas.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideUp}
          >
            <Link
              href="/projetos"
              className="glow-border group bg-foreground text-background hover:bg-muted-foreground flex items-center gap-2 rounded-md px-5 py-2.5 font-mono text-xs font-bold tracking-widest uppercase transition-all"
            >
              Log Completo
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </header>

        {/* Grid de Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={slideUp} className="h-full">
              <FeaturedProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
