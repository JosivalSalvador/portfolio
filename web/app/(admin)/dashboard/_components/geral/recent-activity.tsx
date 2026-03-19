"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, FolderGit2, Loader2, Clock } from "lucide-react";
import Link from "next/link";
import { blurFadeIn, staggerContainer, slideUp } from "@/lib/animations/fade";
import { useProjectsList } from "@/hooks/use-projects";
import { useMessagesList } from "@/hooks/use-messages";
import { Activity } from "lucide-react";

export function RecentActivity() {
  const { data: projectsData, isLoading: loadingProjects } = useProjectsList();
  const { data: messagesData, isLoading: loadingMessages } = useMessagesList();

  const isLoading = loadingProjects || loadingMessages;

  // Motor de Timeline Sintética (Busca as datas reais dos seus schemas!)
  const activities = [
    ...(projectsData?.projects || []).map((p) => ({
      id: `proj-${p.id}`,
      text: `Módulo ${p.title} implantado com sucesso`,
      time: p.createdAt ? new Date(p.createdAt) : new Date(),
      icon: FolderGit2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    })),
    ...(messagesData?.messages || []).map((m) => ({
      id: `msg-${m.id}`,
      text: `Nova requisição de ${m.name.split(" ")[0]}`,
      time: m.createdAt ? new Date(m.createdAt) : new Date(),
      icon: Mail,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 5); // Exibe os 5 eventos mais recentes

  return (
    <motion.div
      variants={blurFadeIn}
      initial="hidden"
      animate="visible"
      className="glass-panel glow-border border-border/50 bg-card flex h-full flex-col rounded-2xl border p-7 shadow-xl"
    >
      <div className="border-border/30 mb-8 flex items-center justify-between border-b pb-5">
        <h3 className="text-foreground text-xl font-bold tracking-tight">
          Registro de Eventos
        </h3>
        <div className="bg-muted/20 border-border/50 flex items-center gap-2 rounded-full border px-3 py-1.5">
          <Clock className="text-muted-foreground h-3.5 w-3.5" />
          <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
            Tempo Real
          </span>
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        className="relative flex flex-1 flex-col gap-7 pl-3"
      >
        {/* Fio condutor da Timeline */}
        <div className="from-border/80 via-border/30 absolute top-5 bottom-5 left-6.75 w-px bg-linear-to-b to-transparent" />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 opacity-60">
            <Loader2 className="text-muted-foreground mb-4 h-8 w-8 animate-spin" />
            <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
              Sincronizando logs...
            </span>
          </div>
        ) : activities.length > 0 ? (
          activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                variants={slideUp}
                className="group relative flex cursor-default items-start gap-6"
              >
                <div
                  className={`relative z-10 h-11 w-11 rounded-full ${activity.bg} border ${activity.border} flex shrink-0 items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
                >
                  <Icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-foreground/80 group-hover:text-foreground text-sm font-semibold transition-colors">
                    {activity.text}
                  </span>
                  <span className="text-muted-foreground bg-muted/10 border-border/30 mt-1.5 w-fit rounded-md border px-2 py-0.5 font-mono text-[11px]">
                    {activity.time.toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-muted-foreground flex flex-col items-center py-12 text-center font-mono text-sm">
            <Activity className="mb-3 h-8 w-8 opacity-20" />
            Nenhuma atividade detectada na infraestrutura.
          </div>
        )}
      </motion.div>

      <Link
        href="/dashboard/projects"
        className="text-muted-foreground bg-muted/10 border-border/40 group mt-8 flex items-center justify-center gap-2 rounded-xl border py-3 font-mono text-xs tracking-widest uppercase transition-colors hover:border-emerald-500/30 hover:text-emerald-400"
      >
        Explorar Bancos de Dados
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
