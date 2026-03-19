"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MailOpen, User, Calendar, CheckCheck, Loader2 } from "lucide-react";
import { MessageResponse } from "@/types/index";
import { Button } from "@/components/ui/button";
import { useMessagesMutations } from "@/hooks/use-messages";

interface MessageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: MessageResponse | null;
}

export function MessageViewerModal({
  isOpen,
  onClose,
  message,
}: MessageViewerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const { updateMessageStatus } = useMessagesMutations();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!mounted || !message) return null;

  const handleMarkAsRead = async () => {
    setIsMarkingRead(true);
    try {
      await updateMessageStatus.mutateAsync({
        id: message.id,
        data: { isRead: true }, // Utilizando a tipagem correta do backend
      });
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setIsMarkingRead(false);
    }
  };

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="pointer-events-auto fixed inset-0 z-100 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050505]/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="border-border/50 relative z-110 flex h-dvh w-full max-w-2xl flex-col border-l bg-[#0a0a0a] shadow-[-20px_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="border-border/30 flex shrink-0 items-center justify-between border-b bg-[#050505] px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 shadow-inner">
                  <MailOpen className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-foreground text-xl font-bold tracking-tight">
                    Inspeção de Mensagem
                  </h2>
                  <p className="text-muted-foreground mt-1 font-mono text-[10px] tracking-widest uppercase">
                    ID: {message.id.split("-")[0]}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="hover:bg-muted/30 text-muted-foreground hover:border-border/50 rounded-lg border border-transparent p-2.5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Conteúdo da Mensagem */}
            <div className="scrollbar-thin flex-1 overflow-y-auto bg-[#0a0a0a] p-8">
              <div className="space-y-8">
                {/* Metadados do Remetente */}
                <div className="glass-panel border-border/40 space-y-5 rounded-2xl border bg-[#050505]/50 p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="bg-muted/20 border-border/40 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border">
                      <User className="text-muted-foreground h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
                        Remetente
                      </span>
                      <span className="text-foreground text-base font-bold">
                        {message.name}
                      </span>
                      <span className="text-muted-foreground bg-muted/10 border-border/30 w-fit rounded border px-2 py-0.5 font-mono text-xs">
                        {message.email}
                      </span>
                    </div>
                  </div>

                  <div className="border-border/30 flex items-start gap-4 border-t pt-5">
                    <div className="bg-muted/20 border-border/40 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border">
                      <Calendar className="text-muted-foreground h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
                        Data de Recebimento
                      </span>
                      <span className="text-foreground bg-muted/10 border-border/30 w-fit rounded border px-2.5 py-1 font-mono text-sm">
                        {message.createdAt
                          ? new Date(message.createdAt).toLocaleString(
                              "pt-BR",
                              { dateStyle: "long", timeStyle: "short" },
                            )
                          : "Indisponível"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Corpo do E-mail */}
                <div>
                  <h3 className="text-foreground mb-4 text-2xl font-bold tracking-tight">
                    {message.subject || "Sem Assunto"}
                  </h3>
                  <div className="border-border/40 rounded-2xl border bg-[#050505] p-6 shadow-inner">
                    <p className="text-muted-foreground font-sans text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações (Footer) */}
            <div className="border-border/30 flex shrink-0 items-center justify-between gap-4 border-t bg-[#050505] p-6">
              {!message.isRead ? (
                <Button
                  onClick={handleMarkAsRead}
                  disabled={isMarkingRead}
                  className="glow-border text-background h-12 w-full rounded-xl bg-emerald-500 font-mono text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all hover:bg-emerald-600 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                >
                  {isMarkingRead ? (
                    <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <CheckCheck className="mr-2 h-4.5 w-4.5" />
                  )}
                  {isMarkingRead ? "Processando..." : "Marcar como Lida"}
                </Button>
              ) : (
                <div className="text-muted-foreground bg-muted/10 border-border/30 flex w-full items-center justify-center gap-2 rounded-xl border py-3.5 text-center font-mono text-xs tracking-widest uppercase shadow-inner">
                  <CheckCheck className="h-4.5 w-4.5 text-emerald-500" />
                  Mensagem já processada e lida
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
