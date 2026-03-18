"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Eye,
  ExternalLink,
  Activity,
  Code2,
  Hash,
  Clock,
} from "lucide-react";
import { ProjectResponse } from "@/types/index";
import { staggerContainer, slideUp, blurFadeIn } from "@/lib/animations/fade";

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

export function ProjectHeader({ project }: { project: ProjectResponse }) {
  const isUpdated =
    project.updatedAt &&
    project.createdAt &&
    new Date(project.updatedAt) > new Date(project.createdAt);

  return (
    <motion.header
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="relative w-full"
    >
      <div className="container mx-auto max-w-7xl px-6 lg:px-12">
        {/* Topo: Voltar e IDs de Sistema */}
        <motion.div
          variants={blurFadeIn}
          className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center"
        >
          <Link
            href="/projetos"
            className="group text-muted-foreground flex w-fit items-center gap-2 font-mono text-xs transition-colors hover:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            ~/voltar
          </Link>

          {/* Renderização de todos os metadados do banco */}
          <div className="glass-panel text-muted-foreground flex flex-wrap items-center gap-4 rounded-md px-4 py-2 font-mono text-[10px] tracking-widest uppercase">
            <span
              className="text-foreground flex items-center gap-1.5"
              title="System ID"
            >
              <Hash className="h-3 w-3" />
              {project.id.split("-")[0]}
            </span>
            <span className="border-border/50 flex items-center gap-1.5 border-l pl-4 text-emerald-500">
              <Activity className="h-3 w-3" />
              OPERACIONAL
            </span>
            <span className="border-border/50 flex items-center gap-1.5 border-l pl-4">
              <Eye className="h-3 w-3" />
              {project.views.toLocaleString()} VIEWS
            </span>
          </div>
        </motion.div>

        {/* Textos Principais e Badge Destaque (Featured) */}
        <motion.div variants={blurFadeIn} className="mb-10">
          {project.featured && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              Módulo de Destaque
            </div>
          )}

          <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed md:max-w-3xl">
            {project.description}
          </p>
        </motion.div>

        {/* Tags, Datas (CreatedAt / UpdatedAt) e Links */}
        <motion.div variants={slideUp} className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            {project.tags?.map((tag) => (
              <span
                key={tag}
                className="border-border/50 bg-background/50 text-foreground rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase shadow-sm backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="border-border/40 flex flex-col justify-between gap-6 border-t pt-6 md:flex-row md:items-center">
            {/* Bloco de Timestamps */}
            <div className="text-muted-foreground flex items-center gap-4 font-mono text-[10px] uppercase">
              {project.createdAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  Criado:{" "}
                  {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                </span>
              )}
              {isUpdated && (
                <span className="border-border/50 flex items-center gap-1.5 border-l pl-4">
                  <Clock className="h-3 w-3" />
                  Update:{" "}
                  {new Date(project.updatedAt!).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-panel group text-foreground hover:bg-muted/30 flex items-center gap-2 rounded-md px-4.5 py-2 font-mono text-[11px] tracking-widest uppercase transition-colors"
                >
                  <GithubIcon className="h-4 w-4" />
                  Código Fonte
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="glow-border group bg-foreground text-background flex items-center gap-2 rounded-md px-4.5 py-2 font-mono text-[11px] font-bold tracking-widest uppercase transition-colors hover:bg-neutral-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  Deploy
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Imagem de Capa (Transparente para o Grid) */}
        <motion.div
          variants={slideUp}
          className="border-border/60 bg-background/50 glow-border relative mt-10 flex aspect-16/10 w-full flex-col overflow-hidden rounded-xl border shadow-xl backdrop-blur-md"
        >
          <div className="border-border/60 bg-muted/20 z-10 flex h-10 w-full items-center gap-2 border-b px-4 backdrop-blur-xl">
            <div className="h-3 w-3 rounded-full bg-neutral-600 shadow-inner transition-colors hover:bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-neutral-400 shadow-inner transition-colors hover:bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-neutral-300 shadow-inner transition-colors hover:bg-green-500/80" />
          </div>

          {project.imageUrl ? (
            <div className="relative w-full flex-1 bg-transparent p-3">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="rounded-lg object-cover shadow-md"
                priority
              />
            </div>
          ) : (
            <div className="text-muted-foreground/40 flex flex-1 flex-col items-center justify-center bg-transparent p-3">
              <Code2 className="mb-3 h-12 w-12" />
              <span className="font-mono text-[10px] tracking-widest uppercase">
                Sem preview visual
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
}
