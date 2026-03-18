"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
  Eye,
  TerminalSquare,
  Code2,
} from "lucide-react";
import { ProjectResponse } from "@/types/index";
import { staggerContainer, slideUp } from "@/lib/animations/fade";

// Ícone do GitHub inline blindado
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

// Subcomponente isolado para gerenciar estado de erro de imagem individualmente
function ProjectCard({ project }: { project: ProjectResponse }) {
  const [imgError, setImgError] = useState(false);

  // Determina se devemos tentar renderizar a imagem
  const shouldRenderImage = Boolean(project.imageUrl) && !imgError;

  return (
    <Link
      href={`/projetos/${project.slug}`}
      className="glow-border glass-panel group border-border/40 hover:border-border/80 flex h-full w-full flex-col overflow-hidden rounded-xl border transition-all duration-500"
    >
      {/* Bloco Superior (Imagem ou Fallback Técnico) */}
      <div className="border-border/40 bg-muted/10 relative flex h-48 w-full items-center justify-center overflow-hidden border-b">
        {shouldRenderImage ? (
          <Image
            src={project.imageUrl!}
            alt={project.title}
            fill
            className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
            onError={() => setImgError(true)} // Se o link for inválido, cai pro Fallback
          />
        ) : (
          <div className="text-muted-foreground/30 group-hover:text-muted-foreground/50 flex flex-col items-center justify-center transition-colors duration-500">
            <Code2 className="mb-2 h-10 w-10" />
            <span className="font-mono text-[10px] tracking-widest uppercase">
              {project.imageUrl ? "IMG_LOAD_ERROR" : "IMG_NULL"}
            </span>
          </div>
        )}

        {/* Badge de Destaque Flutuante */}
        {project.featured && (
          <div className="bg-background/90 absolute top-3 right-3 rounded-md border border-emerald-500/30 px-2 py-1 backdrop-blur-md">
            <span className="font-mono text-[9px] font-bold tracking-widest text-emerald-500 uppercase">
              Destaque
            </span>
          </div>
        )}
      </div>

      {/* Bloco de Conteúdo */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="text-foreground line-clamp-1 text-xl font-bold tracking-tight transition-colors group-hover:text-emerald-400">
            {project.title}
          </h3>
          <ArrowUpRight className="text-muted-foreground h-5 w-5 shrink-0 transition-transform duration-300 group-hover:rotate-45 group-hover:text-emerald-400" />
        </div>

        <p className="text-muted-foreground mb-6 line-clamp-2 text-sm">
          {project.description}
        </p>

        {/* Tags Técnicas */}
        <div className="mt-auto mb-6 flex flex-wrap gap-2">
          {project.tags?.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="border-border/50 bg-background/50 text-muted-foreground rounded-md border px-2 py-1 font-mono text-[10px] uppercase"
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

        {/* Rodapé Metadados (Trata links inexistentes automaticamente) */}
        <div className="border-border/50 text-muted-foreground flex items-center justify-between border-t pt-4 font-mono text-[10px] tracking-widest uppercase">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" title="Visualizações">
              <Eye className="h-3.5 w-3.5" />
              <span>{project.views.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {Boolean(project.githubUrl) && (
              <div
                className="hover:text-foreground flex items-center gap-1 transition-colors"
                title="Repositório"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                <span className="sr-only">GitHub</span>
              </div>
            )}
            {Boolean(project.liveUrl) && (
              <div
                className="hover:text-foreground flex items-center gap-1 transition-colors"
                title="Deploy Online"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="sr-only">Live</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Componente Principal que exporta a lista
export function ProjectsList({ projects }: { projects: ProjectResponse[] }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="border-border glass-panel w-full rounded-lg border border-dashed py-20 text-center">
        <TerminalSquare className="text-muted-foreground/50 mx-auto mb-4 h-8 w-8" />
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
          O banco de dados retornou 0 instâncias.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid w-full grid-cols-1 gap-6 md:grid-cols-2"
    >
      {projects.map((project) => (
        <motion.div key={project.id} variants={slideUp} className="flex h-full">
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  );
}
