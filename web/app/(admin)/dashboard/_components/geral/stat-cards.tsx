"use client";

import { motion } from "framer-motion";
import { FolderGit2, Eye, Mail, Users, Loader2 } from "lucide-react";
import { staggerContainer, slideUp } from "@/lib/animations/fade";
import { useProjectsList } from "@/hooks/use-projects";
import { useMessagesList } from "@/hooks/use-messages";
import { useUsersList } from "@/hooks/use-users";

// Componente utilitário para desenhar as linhas de gráfico de fundo
const Sparkline = ({ color }: { color: string }) => (
  <svg
    className="pointer-events-none absolute bottom-0 left-0 h-24 w-full opacity-[0.08]"
    preserveAspectRatio="none"
    viewBox="0 0 100 100"
  >
    <path d="M0,100 L0,50 Q25,70 50,40 T100,20 L100,100 Z" fill={color} />
    <path
      d="M0,50 Q25,70 50,40 T100,20"
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

export function StatCards() {
  const { data: projectsData, isLoading: loadingProjects } = useProjectsList();
  const { data: messagesData, isLoading: loadingMessages } = useMessagesList();
  const { data: usersData, isLoading: loadingUsers } = useUsersList();

  const projects = projectsData?.projects || [];
  const messages = messagesData?.messages || [];
  const users = usersData?.users || [];

  const totalViews = projects.reduce((acc, proj) => acc + (proj.views || 0), 0);
  const unreadMessages = messages.filter((m) => !m.isRead).length;

  const STATS = [
    {
      id: 1,
      title: "Projetos Ativos",
      value: loadingProjects ? "..." : projects.length.toString(),
      icon: FolderGit2,
      info: "Módulos implantados",
      color: "#10b981",
    },
    {
      id: 2,
      title: "Tráfego Total",
      value: loadingProjects ? "..." : totalViews.toLocaleString("pt-BR"),
      icon: Eye,
      info: "Impressões acumuladas",
      color: "#3b82f6",
    },
    {
      id: 3,
      title: "Caixa de Entrada",
      value: loadingMessages ? "..." : messages.length.toString(),
      icon: Mail,
      info: `${unreadMessages} não lida(s)`,
      color: "#a855f7",
    },
    {
      id: 4,
      title: "Contas de Sistema",
      value: loadingUsers ? "..." : users.length.toString(),
      icon: Users,
      info: "Instâncias alocadas",
      color: "#f59e0b",
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="mb-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
    >
      {STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div key={stat.id} variants={slideUp} className="h-full">
            <div className="border-border/50 group hover:border-border/80 relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[#0a0a0a] p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
              {/* Gráfico de Fundo (Sparkline) */}
              <Sparkline color={stat.color} />

              <div className="relative z-10 mb-8 flex items-center justify-between">
                <span className="text-muted-foreground group-hover:text-foreground/90 font-mono text-[10px] tracking-widest uppercase transition-colors">
                  {stat.title}
                </span>
                <div className="bg-background border-border/60 group-hover:bg-muted/30 flex h-10 w-10 items-center justify-center rounded-xl border shadow-inner transition-colors">
                  {stat.value === "..." ? (
                    <Loader2 className="text-muted-foreground h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" style={{ color: stat.color }} />
                  )}
                </div>
              </div>

              <div className="relative z-10 flex flex-1 flex-col justify-end">
                <span className="text-foreground text-4xl font-bold tracking-tight drop-shadow-sm lg:text-5xl">
                  {stat.value}
                </span>
                <div className="bg-muted/20 border-border/40 mt-3 flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 backdrop-blur-xs">
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: stat.color, opacity: 0.8 }}
                  />
                  <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                    {stat.info}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
