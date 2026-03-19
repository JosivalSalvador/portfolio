"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Save, Loader2, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { slideUp } from "@/lib/animations/fade";
import { useUsersMutations } from "@/hooks/use-users";
import { UserResponse, Role } from "@/types/index";

export function PersonalInfoForm({ user }: { user: UserResponse | null }) {
  const [isSaving, setIsSaving] = useState(false);
  const { updateProfile } = useUsersMutations();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const hasChanges =
    name.trim() !== (user?.name || "") || email.trim() !== (user?.email || "");

  // CORREÇÃO: Usando a tipagem oficial e moderna do React 19
  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        email: email.trim(),
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      className="glass-panel glow-border border-border/40 bg-card relative overflow-hidden rounded-3xl border shadow-2xl"
    >
      <div className="pointer-events-none absolute top-0 right-0 -z-10 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="border-border/30 flex flex-col gap-6 border-b bg-[#050505]/50 p-8 sm:flex-row sm:items-center">
        <div className="relative">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <User className="h-8 w-8 text-emerald-500" />
          </div>
          <div className="bg-background border-border/50 absolute -right-2 -bottom-2 rounded-full border p-1.5 shadow-md">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-foreground mb-2 text-2xl font-bold tracking-tight">
            Informações Básicas
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-muted-foreground bg-muted/20 border-border/30 rounded-md border px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase">
              ID: {user?.id?.split("-")[0] || "N/A"}
            </span>
            <span
              className={`rounded-md border px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest uppercase ${user?.role === Role.ADMIN ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "border-blue-500/30 bg-blue-500/10 text-blue-500"}`}
            >
              {user?.role === Role.ADMIN ? "Administrador" : "Suporte Técnico"}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7 bg-[#0a0a0a] p-8">
        <div className="space-y-3">
          <label className="text-muted-foreground flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase">
            <User className="h-3.5 w-3.5" /> Nome de Exibição
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-border/50 text-foreground h-12 w-full rounded-xl border bg-[#050505] px-4 text-sm shadow-inner outline-hidden transition-all focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"
            placeholder="Seu nome no sistema"
          />
        </div>

        <div className="space-y-3">
          <label className="text-muted-foreground flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase">
            <Mail className="h-3.5 w-3.5" /> E-mail (Credencial Primária)
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-border/50 text-foreground h-12 w-full rounded-xl border bg-[#050505] px-4 text-sm shadow-inner outline-hidden transition-all focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"
            placeholder="seu@email.com"
          />
        </div>

        <div className="mt-4 flex justify-end pt-6">
          <Button
            type="submit"
            disabled={isSaving || !hasChanges}
            className={`group h-12 rounded-xl border px-8 font-mono text-xs font-bold tracking-widest uppercase shadow-sm transition-all ${
              hasChanges && !isSaving
                ? "border-border/50 text-foreground bg-[#050505] hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                : "border-border/20 text-muted-foreground/50 cursor-not-allowed bg-[#050505] opacity-60"
            }`}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin text-emerald-500" />
            ) : (
              <Save
                className={`mr-2 h-4.5 w-4.5 transition-colors ${hasChanges ? "text-muted-foreground group-hover:text-emerald-500" : ""}`}
              />
            )}
            {isSaving ? "Sincronizando..." : "Gravar Alterações"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
