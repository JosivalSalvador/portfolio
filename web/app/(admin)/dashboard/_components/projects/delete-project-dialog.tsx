"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { ProjectResponse } from "@/types/index";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { dialogEnter } from "@/lib/animations/fade";
import { useProjectsMutations } from "@/hooks/use-projects";

interface DeleteProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectResponse | null;
}

export function DeleteProjectDialog({
  isOpen,
  onClose,
  project,
}: DeleteProjectDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteProject } = useProjectsMutations();

  if (!project) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProject.mutateAsync(project.id);
      onClose();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/90 p-4 backdrop-blur-xl"
          >
            <motion.div
              variants={dialogEnter}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="border-destructive/40 w-full max-w-md overflow-hidden rounded-3xl border bg-[#0a0a0a] shadow-[0_0_80px_rgba(239,68,68,0.15)]"
            >
              <div className="flex flex-col items-center p-8 text-center">
                <div className="bg-destructive/10 border-destructive/30 relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border shadow-inner">
                  <div className="bg-destructive/20 absolute inset-0 animate-ping rounded-full opacity-20" />
                  <AlertTriangle className="text-destructive h-10 w-10" />
                </div>
                <h3 className="text-foreground mb-3 text-2xl font-bold">
                  Destruição de Dados
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Você está prestes a desalocar permanentemente o módulo <br />
                  <span className="text-foreground bg-muted/30 mt-2 inline-block rounded-md px-2 py-0.5 font-mono font-bold">
                    /{project.slug}
                  </span>
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
                  onClick={handleDelete}
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
