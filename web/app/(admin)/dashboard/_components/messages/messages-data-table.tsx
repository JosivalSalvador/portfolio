"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MailOpen,
  Eye,
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
import { MessageViewerModal } from "./message-viewer-modal";
import { MessageResponse } from "@/types/index";
import { useMessagesMutations } from "@/hooks/use-messages";
import { Button } from "@/components/ui/button";

// ==========================================
// COMPONENTE INTERNO: Modal de Confirmação
// ==========================================
function DeleteMessageDialog({
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

  // A CORREÇÃO: Usando um micro-delay para evitar o erro de Cascading Renders do linter
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="pointer-events-auto fixed inset-0 z-200 flex items-center justify-center p-4">
          {/* Backdrop Escurecido */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050505]/90 backdrop-blur-xl"
            onClick={!isDeleting ? onClose : undefined}
          />

          {/* Caixa de Diálogo Premium OLED */}
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
                Excluir Mensagem
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Você está prestes a apagar este contato da sua caixa de entrada.
              </p>
              <p className="text-destructive/80 border-destructive/20 bg-destructive/5 mt-4 rounded-md border px-3 py-1.5 font-mono text-[11px] tracking-widest uppercase">
                Esta ação não pode ser desfeita.
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
// COMPONENTE PRINCIPAL: Tabela de Mensagens
// ==========================================
export function MessagesDataTable({
  messages,
}: {
  messages: MessageResponse[];
}) {
  const [viewingMessage, setViewingMessage] = useState<MessageResponse | null>(
    null,
  );

  const [messageToDelete, setMessageToDelete] =
    useState<MessageResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { deleteMessage } = useMessagesMutations();

  const handleDeleteRequest = (
    e: React.MouseEvent,
    message: MessageResponse,
  ) => {
    e.stopPropagation();
    setMessageToDelete(message);
  };

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;

    setIsDeleting(true);
    try {
      await deleteMessage.mutateAsync(messageToDelete.id);
      setMessageToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!messages || messages.length === 0) {
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
        <h3 className="text-foreground mb-1 text-lg font-bold">Inbox Vazia</h3>
        <p className="text-muted-foreground font-mono text-sm">
          Nenhuma mensagem recebida ainda.
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
                <th className="w-12 px-6 py-5 font-bold">St</th>
                <th className="px-6 py-5 font-bold">Remetente</th>
                <th className="px-6 py-5 font-bold">Assunto</th>
                <th className="px-6 py-5 font-bold">Data</th>
                <th className="px-6 py-5 text-right font-bold">Operações</th>
              </tr>
            </thead>
            <motion.tbody
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="divide-border/20 divide-y"
            >
              {messages.map((message) => (
                <motion.tr
                  variants={slideUp}
                  key={message.id}
                  className={`group hover:bg-muted/10 cursor-pointer transition-all duration-300 ${!message.isRead ? "bg-emerald-500/5 hover:bg-emerald-500/10" : ""}`}
                  onClick={() => setViewingMessage(message)}
                >
                  <td className="px-6 py-5">
                    {!message.isRead ? (
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20"></span>
                        <Mail className="h-4 w-4 text-emerald-500" />
                      </div>
                    ) : (
                      <div className="bg-muted/10 border-border/30 flex h-8 w-8 items-center justify-center rounded-full border">
                        <MailOpen className="text-muted-foreground/50 h-4 w-4" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`font-bold transition-colors ${!message.isRead ? "text-emerald-500" : "text-foreground group-hover:text-emerald-400"}`}
                      >
                        {message.name}
                      </span>
                      <span className="text-muted-foreground font-mono text-[10px]">
                        {message.email}
                      </span>
                    </div>
                  </td>
                  <td className="text-foreground/80 max-w-50 truncate px-6 py-5 font-medium">
                    {message.subject || "Sem Assunto"}
                  </td>
                  <td className="text-muted-foreground px-6 py-5 font-mono text-[11px]">
                    <div className="bg-muted/10 border-border/30 w-fit rounded-md border px-2.5 py-1">
                      {message.createdAt
                        ? new Date(message.createdAt).toLocaleDateString(
                            "pt-BR",
                          )
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-50 transition-opacity group-hover:opacity-100">
                      <button
                        className="text-muted-foreground rounded-lg border border-transparent p-2.5 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-500"
                        title="Ler Mensagem"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteRequest(e, message)}
                        className="hover:bg-destructive/10 hover:border-destructive/30 text-muted-foreground hover:text-destructive rounded-lg border border-transparent p-2.5 transition-all"
                        title="Deletar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </motion.div>

      <MessageViewerModal
        isOpen={!!viewingMessage}
        onClose={() => setViewingMessage(null)}
        message={viewingMessage}
      />

      <DeleteMessageDialog
        isOpen={!!messageToDelete}
        onClose={() => setMessageToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
