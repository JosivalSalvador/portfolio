"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, FileCode2 } from "lucide-react";
import {
  ProjectResponse,
  CreateProjectInput,
  UpdateProjectInput,
} from "@/types/index";
import { Button } from "@/components/ui/button";
import { useProjectsMutations } from "@/hooks/use-projects";
import {
  createProjectSchema,
  updateProjectSchema,
} from "@/schemas/projects.schema";
import { toast } from "sonner";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectResponse | null;
}

export function ProjectFormModal({
  isOpen,
  onClose,
  project,
}: ProjectFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { createProject, updateProject } = useProjectsMutations();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);
      const tagsString = formData.get("tags") as string;

      const payload = {
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        description: formData.get("description") as string,
        content: formData.get("content") as string,
        imageUrl: (formData.get("imageUrl") as string) || "",
        githubUrl: (formData.get("githubUrl") as string) || "",
        liveUrl: (formData.get("liveUrl") as string) || "",
        tags: tagsString
          ? tagsString
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        featured: formData.get("featured") === "on",
      };

      const schema = project ? updateProjectSchema : createProjectSchema;
      const validation = schema.safeParse(payload);

      if (!validation.success) {
        // CORREÇÃO AQUI: Usando .issues no lugar de .errors
        const firstErrorMessage =
          validation.error.issues[0]?.message ||
          "Verifique os dados preenchidos.";
        toast.error(firstErrorMessage);
        setIsSubmitting(false);
        return;
      }

      if (project) {
        await updateProject.mutateAsync({
          id: project.id,
          data: validation.data as UpdateProjectInput,
        });
      } else {
        await createProject.mutateAsync(validation.data as CreateProjectInput);
      }
      onClose();
    } catch (error) {
      console.error("Erro no formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="pointer-events-auto fixed inset-0 z-100 flex justify-end">
          {/* Backdrop Escurecido */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050505]/80 backdrop-blur-md"
          />

          {/* Painel Deslizante Sólido (Slide-Over) */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="border-border/50 relative z-110 flex h-dvh w-full max-w-3xl flex-col border-l bg-[#0a0a0a] shadow-[-20px_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* Cabeçalho */}
            <div className="border-border/30 flex shrink-0 items-center justify-between border-b bg-[#050505] px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 shadow-inner">
                  <FileCode2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-foreground text-xl font-bold tracking-tight">
                    {project
                      ? "Editar Arquitetura do Módulo"
                      : "Alocar Novo Módulo"}
                  </h2>
                  <p className="text-muted-foreground mt-1 font-mono text-[10px] tracking-widest uppercase">
                    {project
                      ? `ID: ${project.id.split("-")[0]}`
                      : "Aguardando persistência no banco"}
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

            {/* Formulário Rolável */}
            <div className="scrollbar-thin flex-1 overflow-y-auto bg-[#0a0a0a] p-8">
              <form
                id="project-form"
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2.5">
                    <label className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
                      Título do Projeto
                    </label>
                    <input
                      name="title"
                      required
                      defaultValue={project?.title || ""}
                      className="border-border/50 focus:bg-muted/10 text-foreground h-12 w-full rounded-xl border bg-[#050505] px-4 text-sm shadow-inner outline-hidden transition-all focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                      placeholder="Ex: MotoMatch"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
                      Slug (URL)
                    </label>
                    <input
                      name="slug"
                      required
                      defaultValue={project?.slug || ""}
                      className="border-border/50 focus:bg-muted/10 text-foreground h-12 w-full rounded-xl border bg-[#050505] px-4 font-mono text-sm shadow-inner outline-hidden transition-all focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                      placeholder="ex: moto-match"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
                    Descrição Curta
                  </label>
                  <input
                    name="description"
                    required
                    defaultValue={project?.description || ""}
                    className="border-border/50 focus:bg-muted/10 text-foreground h-12 w-full rounded-xl border bg-[#050505] px-4 text-sm shadow-inner outline-hidden transition-all focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                    placeholder="Resumo de 1 linha para o card."
                  />
                </div>

                <div className="border-border/30 grid grid-cols-1 gap-6 rounded-2xl border bg-[#050505]/50 p-6 shadow-inner md:grid-cols-2">
                  <div className="space-y-2.5">
                    <label className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
                      GitHub URL
                    </label>
                    <input
                      name="githubUrl"
                      defaultValue={project?.githubUrl || ""}
                      className="border-border/50 text-foreground h-12 w-full rounded-xl border bg-[#050505] px-4 font-mono text-sm outline-hidden transition-all focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
                      Live Deploy URL
                    </label>
                    <input
                      name="liveUrl"
                      defaultValue={project?.liveUrl || ""}
                      className="border-border/50 text-foreground h-12 w-full rounded-xl border bg-[#050505] px-4 font-mono text-sm outline-hidden transition-all focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
                    Imagem de Capa (URL)
                  </label>
                  <input
                    name="imageUrl"
                    defaultValue={project?.imageUrl || ""}
                    className="border-border/50 focus:bg-muted/10 text-foreground h-12 w-full rounded-xl border bg-[#050505] px-4 font-mono text-sm shadow-inner outline-hidden transition-all focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
                    Tags (Separadas por vírgula)
                  </label>
                  <input
                    name="tags"
                    defaultValue={project?.tags?.join(", ") || ""}
                    className="border-border/50 focus:bg-muted/10 text-foreground h-12 w-full rounded-xl border bg-[#050505] px-4 font-mono text-sm shadow-inner outline-hidden transition-all focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                    placeholder="React, Fastify, Prisma..."
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="font-mono text-[11px] font-bold tracking-widest text-emerald-500 uppercase">
                    Documentação Técnica (Markdown)
                  </label>
                  <textarea
                    name="content"
                    required
                    defaultValue={project?.content || ""}
                    rows={12}
                    className="border-border/50 text-muted-foreground focus:text-foreground w-full resize-none rounded-2xl border bg-[#050505] p-5 font-mono text-sm shadow-inner outline-hidden transition-all focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                    placeholder="## Arquitetura do Sistema..."
                  />
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    defaultChecked={project ? project.featured : false}
                    className="border-border/50 h-5 w-5 rounded bg-[#050505] text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0"
                  />
                  <div className="flex flex-col">
                    <label
                      htmlFor="featured"
                      className="text-foreground cursor-pointer text-sm font-bold"
                    >
                      Destacar na tela inicial
                    </label>
                    <span className="text-muted-foreground font-mono text-[10px]">
                      O projeto aparecerá na vitrine principal do portfólio.
                    </span>
                  </div>
                </div>
              </form>
            </div>

            {/* Rodapé Fixo */}
            <div className="border-border/30 flex shrink-0 items-center justify-end gap-4 border-t bg-[#050505] p-6">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/20 h-12 rounded-xl px-6"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="project-form"
                disabled={isSubmitting}
                className="glow-border text-background h-12 rounded-xl bg-emerald-500 px-8 font-mono text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all hover:bg-emerald-600 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4.5 w-4.5" />
                )}
                {isSubmitting ? "Gravando..." : "Persistir Módulo"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
