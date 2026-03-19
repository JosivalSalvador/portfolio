"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, UserCog, User, Loader2, Save, X } from "lucide-react";
import { dialogEnter } from "@/lib/animations/fade";
import { Role, UserResponse } from "@/types/index";
import { Button } from "@/components/ui/button";
import { useUsersMutations } from "@/hooks/use-users";

interface RoleManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse | null;
}

export function RoleManagerDialog({
  isOpen,
  onClose,
  user,
}: RoleManagerDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(Role.USER);
  const [isSaving, setIsSaving] = useState(false);
  const { updateRole } = useUsersMutations();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Sincroniza a Role inicial quando o modal abre para um usuário específico
  useEffect(() => {
    if (user && isOpen) {
      setSelectedRole(user.role as Role);
    }
  }, [user, isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!mounted || !user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateRole.mutateAsync({
        id: user.id,
        data: { role: selectedRole },
      });
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar cargo:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="pointer-events-auto fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050505]/80 backdrop-blur-md"
          />

          <motion.div
            variants={dialogEnter}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="border-border/50 relative z-110 flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border bg-[#0a0a0a] shadow-2xl"
          >
            {/* Header do Dialog */}
            <div className="border-border/30 flex items-center justify-between border-b bg-[#050505] p-8">
              <div>
                <h3 className="text-foreground text-xl font-bold tracking-tight">
                  Gerenciar Permissões
                </h3>
                <p className="text-muted-foreground mt-1 font-mono text-[11px] tracking-widest uppercase">
                  Alvo:{" "}
                  <span className="font-bold text-emerald-500">
                    {user.name}
                  </span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="hover:bg-muted/30 text-muted-foreground hover:border-border/50 rounded-lg border border-transparent p-2.5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cards de Seleção de Cargo */}
            <div className="space-y-4 bg-[#0a0a0a] p-8">
              {/* Opção: ADMIN */}
              <button
                onClick={() => setSelectedRole(Role.ADMIN)}
                className={`flex w-full items-start gap-5 rounded-2xl border p-5 text-left transition-all duration-300 ${selectedRole === Role.ADMIN ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-border/40 hover:border-border/80 hover:bg-muted/5 bg-[#050505]"}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${selectedRole === Role.ADMIN ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-500" : "bg-muted/20 border-border/50 text-muted-foreground"}`}
                >
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span
                    className={`font-mono text-sm font-bold tracking-widest uppercase ${selectedRole === Role.ADMIN ? "text-emerald-500" : "text-foreground"}`}
                  >
                    Root / Admin
                  </span>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Acesso irrestrito a todas as funcionalidades do painel,
                    incluindo gestão de outros usuários e exclusão de projetos.
                  </p>
                </div>
              </button>

              {/* Opção: SUPPORTER */}
              <button
                onClick={() => setSelectedRole(Role.SUPPORTER)}
                className={`flex w-full items-start gap-5 rounded-2xl border p-5 text-left transition-all duration-300 ${selectedRole === Role.SUPPORTER ? "border-blue-500/50 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]" : "border-border/40 hover:border-border/80 hover:bg-muted/5 bg-[#050505]"}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${selectedRole === Role.SUPPORTER ? "border-blue-500/50 bg-blue-500/20 text-blue-500" : "bg-muted/20 border-border/50 text-muted-foreground"}`}
                >
                  <UserCog className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span
                    className={`font-mono text-sm font-bold tracking-widest uppercase ${selectedRole === Role.SUPPORTER ? "text-blue-500" : "text-foreground"}`}
                  >
                    Suporte Técnico
                  </span>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Acesso de leitura e resposta a mensagens. Bloqueado na
                    edição de produtos, categorias e usuários (Regra do Proxy).
                  </p>
                </div>
              </button>

              {/* Opção: USER */}
              <button
                onClick={() => setSelectedRole(Role.USER)}
                className={`flex w-full items-start gap-5 rounded-2xl border p-5 text-left transition-all duration-300 ${selectedRole === Role.USER ? "bg-muted/20 border-muted-foreground/50 shadow-inner" : "border-border/40 hover:border-border/80 hover:bg-muted/5 bg-[#050505]"}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${selectedRole === Role.USER ? "bg-muted/30 border-muted-foreground/50 text-foreground" : "bg-muted/20 border-border/50 text-muted-foreground"}`}
                >
                  <User className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span
                    className={`font-mono text-sm font-bold tracking-widest uppercase ${selectedRole === Role.USER ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    Instância Comum
                  </span>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Bloqueado no portal cativo (Sandbox). Nenhuma permissão
                    administrativa para acessar o dashboard.
                  </p>
                </div>
              </button>
            </div>

            {/* Ações */}
            <div className="border-border/30 flex items-center justify-end gap-4 border-t bg-[#050505] p-6">
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={isSaving}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/20 h-12 rounded-xl px-6"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || selectedRole === user.role}
                className="glow-border text-background h-12 rounded-xl bg-emerald-500 px-8 font-mono text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all hover:bg-emerald-600 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4.5 w-4.5" />
                )}
                {isSaving ? "Aplicando..." : "Confirmar Permissão"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
