"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  TerminalSquare,
  LogOut,
  Key,
  User,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { blurFadeIn, staggerContainer, slideUp } from "@/lib/animations/fade";
import { Button } from "@/components/ui/button";

interface UserData {
  name: string;
  email: string;
  role: string;
}

export function SandboxClient({ user }: { user: UserData | null }) {
  const { logout } = useAuth();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="glass-panel glow-border border-border/50 w-full max-w-2xl overflow-hidden rounded-3xl border shadow-[0_0_40px_rgba(0,0,0,0.5)]"
    >
      {/* Barra de Status */}
      <div className="border-border/40 bg-muted/20 flex h-10 w-full items-center gap-2 border-b px-4">
        <div className="h-3 w-3 rounded-full bg-neutral-600 shadow-inner" />
        <div className="h-3 w-3 rounded-full bg-neutral-400 shadow-inner" />
        <div className="h-3 w-3 rounded-full bg-green-500/80 shadow-inner" />
        <div className="ml-auto flex items-center gap-2">
          <Key className="h-3 w-3 text-emerald-500" />
          <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
            JWT_DECODED
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center p-8 text-center sm:p-12">
        <motion.div
          variants={blurFadeIn}
          className="glow-border mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10"
        >
          <ShieldCheck className="h-10 w-10 text-emerald-500" />
        </motion.div>

        <motion.h1
          variants={blurFadeIn}
          className="text-foreground mb-3 text-3xl font-bold tracking-tight"
        >
          Sessão Estabelecida
        </motion.h1>

        <motion.p
          variants={blurFadeIn}
          className="text-muted-foreground mb-10 max-w-md"
        >
          O proxy validou sua identidade. Você está em um ambiente restrito de
          demonstração (Sandbox).
        </motion.p>

        {/* Bloco de Informações Dinâmicas do Usuário */}
        {user && (
          <motion.div
            variants={slideUp}
            className="mb-10 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-2"
          >
            <div className="glass-panel border-border/40 flex items-start gap-3 rounded-xl border p-4">
              <User className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                  Credencial / Nome
                </p>
                <p className="text-foreground mt-1 font-medium">{user.name}</p>
              </div>
            </div>

            <div className="glass-panel border-border/40 flex items-start gap-3 rounded-xl border p-4">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <div>
                <p className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                  Access Level (Role)
                </p>
                <p className="mt-1 font-mono text-sm font-bold text-emerald-500">
                  {user.role}
                </p>
              </div>
            </div>

            <div className="glass-panel border-border/40 flex items-start gap-3 rounded-xl border p-4 sm:col-span-2">
              <Mail className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                  Endereço de E-mail
                </p>
                <p className="text-foreground mt-1 font-mono text-sm">
                  {user.email}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Log do Sistema */}
        <motion.div
          variants={slideUp}
          className="border-border/60 text-muted-foreground mb-10 w-full rounded-xl border bg-[#0a0a0a] p-4 text-left font-mono text-xs shadow-inner"
        >
          <div className="text-foreground/70 border-border/40 mb-2 flex items-center gap-2 border-b pb-2">
            <TerminalSquare className="h-4 w-4" />
            <span>sys_middleware_log</span>
          </div>
          <p className="text-emerald-400">{">"} Request URL: /</p>
          <p className="text-emerald-400">{">"} Intercepted by: proxy.ts</p>
          <p className="text-yellow-500">
            {">"} Action: Redirected to /home (Role: {user?.role || "UNKNOWN"})
          </p>
          <p className="text-muted-foreground mt-2 animate-pulse">
            {">"} Aguardando destruição de sessão...
          </p>
        </motion.div>

        {/* Ação Única: Logout */}
        <motion.div variants={slideUp} className="w-full">
          <Button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="border-foreground bg-foreground text-background hover:bg-background hover:text-foreground hover:border-foreground group h-12 w-full rounded-md border shadow-[0_0_10px_rgba(250,250,250,0.05)] transition-all duration-300"
          >
            {logout.isPending ? (
              "Limpando Cookies..."
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Encerrar Sessão e Retornar à Vitrine
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
