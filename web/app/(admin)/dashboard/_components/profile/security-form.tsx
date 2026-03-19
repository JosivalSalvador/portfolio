"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  KeyRound,
  Loader2,
  Eye,
  EyeOff,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { slideUp } from "@/lib/animations/fade";
import { useUsersMutations } from "@/hooks/use-users";
import { toast } from "sonner";

export function SecurityForm() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { changePassword } = useUsersMutations();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const hasChanges =
    oldPassword.length > 0 &&
    newPassword.length > 0 &&
    confirmPassword.length > 0;

  // CORREÇÃO: Usando a tipagem oficial e moderna do React 19
  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    if (newPassword !== confirmPassword) {
      toast.error("A nova senha e a confirmação não coincidem.");
      return;
    }

    setIsUpdating(true);
    try {
      await changePassword.mutateAsync({ oldPassword, newPassword });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      className="glass-panel glow-border border-border/40 bg-card relative overflow-hidden rounded-3xl border shadow-2xl"
    >
      <div className="bg-foreground/5 pointer-events-none absolute top-0 right-0 -z-10 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      <div className="border-border/30 flex items-center gap-5 border-b bg-[#050505]/50 p-8">
        <div className="bg-foreground/5 border-border/40 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border shadow-inner">
          <ShieldAlert className="text-foreground/80 h-6 w-6" />
        </div>
        <div>
          <h3 className="text-foreground text-2xl font-bold tracking-tight">
            Segurança
          </h3>
          <p className="text-muted-foreground mt-1 font-mono text-[11px] tracking-widest uppercase">
            Gestão de credenciais criptográficas
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7 bg-[#0a0a0a] p-8">
        <div className="space-y-3">
          <label className="text-muted-foreground flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase">
            <Lock className="h-3.5 w-3.5" /> Senha Atual
          </label>
          <div className="relative">
            <input
              required
              type={showCurrent ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="border-border/50 text-foreground h-12 w-full rounded-xl border bg-[#050505] pr-12 pl-4 font-mono text-sm shadow-inner outline-hidden transition-all focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/20 absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 transition-colors"
            >
              {showCurrent ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
        </div>

        <div className="border-border/30 space-y-6 border-t pt-6">
          <div className="space-y-3">
            <label className="font-mono text-[11px] font-bold tracking-widest text-emerald-500 uppercase">
              Nova Senha
            </label>
            <div className="relative">
              <input
                required
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nova chave de acesso"
                className="border-border/50 text-foreground h-12 w-full rounded-xl border bg-[#050505] pr-12 pl-4 font-mono text-sm shadow-inner outline-hidden transition-all focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/20 absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 transition-colors"
              >
                {showNew ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="font-mono text-[11px] font-bold tracking-widest text-emerald-500 uppercase">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <input
                required
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova chave"
                className="border-border/50 text-foreground h-12 w-full rounded-xl border bg-[#050505] pr-12 pl-4 font-mono text-sm shadow-inner outline-hidden transition-all focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/20 absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end pt-6">
          <Button
            type="submit"
            disabled={isUpdating || !hasChanges}
            className={`group h-12 rounded-xl border px-8 font-mono text-xs font-bold tracking-widest uppercase shadow-sm transition-all ${
              hasChanges && !isUpdating
                ? "border-border/50 text-foreground bg-[#050505] hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                : "border-border/20 text-muted-foreground/50 cursor-not-allowed bg-[#050505] opacity-60"
            }`}
          >
            {isUpdating ? (
              <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin text-emerald-500" />
            ) : (
              <KeyRound
                className={`mr-2 h-4.5 w-4.5 transition-colors ${hasChanges ? "text-muted-foreground group-hover:text-emerald-500" : ""}`}
              />
            )}
            {isUpdating ? "Processando..." : "Rotacionar Chave"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
