"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  UserCog,
  User as UserIcon,
  TerminalSquare,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  blurFadeIn,
  staggerContainer,
  slideUp,
  dialogEnter,
} from "@/lib/animations/fade";
import { RoleManagerDialog } from "./role-manager-dialog";
import { Role, UserResponse } from "@/types/index";
// Importamos o useProfile para saber quem está logado
import { useUsersMutations, useProfile } from "@/hooks/use-users";
import { Button } from "@/components/ui/button";

// ==========================================
// COMPONENTE INTERNO: Modal de Confirmação de Exclusão
// ==========================================
function DeleteUserDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="pointer-events-auto fixed inset-0 z-200 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050505]/90 backdrop-blur-xl"
            onClick={!isDeleting ? onClose : undefined}
          />

          <motion.div
            variants={dialogEnter}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="border-destructive/40 relative z-210 w-full max-w-md overflow-hidden rounded-3xl border bg-[#0a0a0a] shadow-[0_0_80px_rgba(239,68,68,0.15)]"
          >
            <div className="flex flex-col items-center p-8 text-center">
              <div className="bg-destructive/10 border-destructive/30 relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border shadow-inner">
                <div className="bg-destructive/20 absolute inset-0 animate-ping rounded-full opacity-20" />
                <AlertTriangle className="text-destructive h-10 w-10" />
              </div>
              <h3 className="text-foreground mb-3 text-2xl font-bold">
                Expulsar Usuário
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Você está prestes a excluir esta conta do banco de dados.
              </p>
              <p className="text-destructive/80 border-destructive/20 bg-destructive/5 mt-4 rounded-md border px-3 py-1.5 font-mono text-[11px] tracking-widest uppercase">
                Acesso será revogado imediatamente.
              </p>
            </div>
            <div className="border-border/30 flex gap-4 border-t bg-[#050505] p-5">
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={isDeleting}
                className="text-muted-foreground hover:bg-muted/20 h-12 flex-1 rounded-xl"
              >
                Abortar
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-12 flex-1 rounded-xl font-mono text-[11px] font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Confirmar Exclusão"
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ==========================================
// COMPONENTE PRINCIPAL: Tabela de Usuários
// ==========================================
export function UsersDataTable({ users }: { users: UserResponse[] }) {
  const [managingUser, setManagingUser] = useState<UserResponse | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { deleteUser } = useUsersMutations();

  // Pegamos o usuário logado para bloquear ações nele mesmo
  const { data: profileData } = useProfile();
  const currentUser = profileData?.user;

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUser.mutateAsync(userToDelete.id);
      setUserToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!users || users.length === 0) {
    return (
      <motion.div
        variants={blurFadeIn}
        initial="hidden"
        animate="visible"
        className="glass-panel border-border/50 bg-card/50 flex w-full flex-col items-center justify-center rounded-3xl border border-dashed py-28 text-center shadow-lg"
      >
        <div className="bg-muted/20 border-border/50 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border shadow-inner">
          <TerminalSquare className="text-muted-foreground/60 h-8 w-8" />
        </div>
        <h3 className="text-foreground mb-1 text-lg font-bold">
          Nenhum registro encontrado
        </h3>
        <p className="text-muted-foreground font-mono text-sm">
          O banco de dados não retornou usuários.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        variants={blurFadeIn}
        initial="hidden"
        animate="visible"
        className="glass-panel border-border/50 w-full overflow-hidden rounded-3xl border bg-[#0a0a0a] shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-border/40 text-muted-foreground border-b bg-[#050505] font-mono text-[10px] tracking-widest uppercase">
              <tr>
                <th className="px-6 py-5 font-bold">Usuário</th>
                <th className="px-6 py-5 font-bold">Nível de Acesso</th>
                <th className="px-6 py-5 font-bold">Registro Original</th>
                <th className="px-6 py-5 text-right font-bold">
                  Administração
                </th>
              </tr>
            </thead>
            <motion.tbody
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="divide-border/20 divide-y"
            >
              {users.map((user) => {
                // Checa se o usuário da linha é a mesma pessoa que está logada
                const isMe = currentUser?.id === user.id;

                return (
                  <motion.tr
                    variants={slideUp}
                    key={user.id}
                    className={`group hover:bg-muted/10 transition-all duration-300 ${isMe ? "bg-muted/5" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-muted/20 border-border/40 group-hover:bg-muted/30 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-inner transition-colors">
                          <UserIcon className="text-muted-foreground group-hover:text-foreground h-4.5 w-4.5 transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-foreground font-bold transition-colors group-hover:text-emerald-400">
                              {user.name}
                            </span>
                            {/* Badge visual se for o usuário atual */}
                            {isMe && (
                              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-widest text-emerald-500 uppercase">
                                Você
                              </span>
                            )}
                          </div>
                          <span className="text-muted-foreground bg-muted/10 border-border/30 w-fit rounded border px-2 py-0.5 font-mono text-[10px]">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {user.role === Role.ADMIN && (
                        <div className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[9px] font-bold tracking-widest text-emerald-500 uppercase shadow-inner">
                          <ShieldAlert className="h-3 w-3" /> Root / Admin
                        </div>
                      )}
                      {user.role === Role.SUPPORTER && (
                        <div className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 font-mono text-[9px] font-bold tracking-widest text-blue-500 uppercase shadow-inner">
                          <UserCog className="h-3 w-3" /> Suporte
                        </div>
                      )}
                      {user.role === Role.USER && (
                        <span className="text-muted-foreground border-border/50 bg-muted/5 rounded-md border px-2.5 py-1 font-mono text-[9px] tracking-widest uppercase">
                          Instância Comum
                        </span>
                      )}
                    </td>

                    <td className="text-muted-foreground px-6 py-4 font-mono text-[11px]">
                      <div className="bg-muted/10 border-border/30 w-fit rounded-md border px-2.5 py-1">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("pt-BR")
                          : "N/A"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-50 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => !isMe && setManagingUser(user)}
                          disabled={isMe}
                          className={`rounded-lg border border-transparent p-2.5 transition-all ${isMe ? "cursor-not-allowed opacity-30" : "text-muted-foreground hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-500"}`}
                          title={
                            isMe
                              ? "Você não pode alterar seu próprio cargo por aqui"
                              : "Gerenciar Permissões"
                          }
                        >
                          <UserCog className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => !isMe && setUserToDelete(user)}
                          disabled={isMe}
                          className={`rounded-lg border border-transparent p-2.5 transition-all ${isMe ? "cursor-not-allowed opacity-30" : "hover:bg-destructive/10 hover:border-destructive/30 text-muted-foreground hover:text-destructive"}`}
                          title={
                            isMe
                              ? "Você não pode excluir sua própria conta por aqui"
                              : "Deletar Usuário"
                          }
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>
      </motion.div>

      <RoleManagerDialog
        isOpen={!!managingUser}
        onClose={() => setManagingUser(null)}
        user={managingUser}
      />

      <DeleteUserDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
