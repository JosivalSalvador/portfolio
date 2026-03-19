"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, Eye, Star, TerminalSquare } from "lucide-react";
import { ProjectResponse } from "@/types/index";
import { blurFadeIn, staggerContainer, slideUp } from "@/lib/animations/fade";
import { ProjectFormModal } from "./project-form-modal";
import { DeleteProjectDialog } from "./delete-project-dialog";

interface ProjectsDataTableProps {
  projects: ProjectResponse[];
}

export function ProjectsDataTable({ projects }: ProjectsDataTableProps) {
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(
    null,
  );
  const [deletingProject, setDeletingProject] =
    useState<ProjectResponse | null>(null);

  if (!projects || projects.length === 0) {
    return (
      <motion.div
        variants={blurFadeIn}
        initial="hidden"
        animate="visible"
        className="glass-panel border-border/50 bg-card/50 flex w-full flex-col items-center justify-center rounded-2xl border border-dashed py-28 text-center shadow-lg"
      >
        <div className="bg-muted/20 border-border/50 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border shadow-inner">
          <TerminalSquare className="text-muted-foreground/60 h-8 w-8" />
        </div>
        <h3 className="text-foreground mb-1 text-lg font-bold">
          Nenhum projeto alocado
        </h3>
        <p className="text-muted-foreground font-mono text-sm">
          Use o botão &quot;Novo Módulo&quot; para popular o banco de dados.
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
        className="glass-panel border-border/50 bg-card w-full overflow-hidden rounded-2xl border shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-border/40 bg-muted/10 text-muted-foreground border-b font-mono text-[10px] tracking-widest uppercase">
              <tr>
                <th className="px-6 py-5 font-bold">Módulo / Slug</th>
                <th className="px-6 py-5 font-bold">Status</th>
                <th className="px-6 py-5 font-bold">Métricas</th>
                <th className="px-6 py-5 text-right font-bold">Operações</th>
              </tr>
            </thead>
            <motion.tbody
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="divide-border/20 divide-y"
            >
              {projects.map((project) => (
                <motion.tr
                  variants={slideUp}
                  key={project.id}
                  className="hover:bg-muted/10 group transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-foreground font-bold transition-colors group-hover:text-emerald-400">
                        {project.title}
                      </span>
                      <span className="text-muted-foreground mt-1 font-mono text-[10px]">
                        /{project.slug}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {project.featured ? (
                      <div className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[9px] font-bold tracking-widest text-emerald-500 uppercase shadow-inner">
                        <Star className="h-3 w-3 fill-emerald-500" /> Destaque
                      </div>
                    ) : (
                      <span className="text-muted-foreground border-border/50 bg-muted/5 rounded-md border px-2.5 py-1 font-mono text-[9px] tracking-widest uppercase">
                        Padrão
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-muted-foreground bg-muted/10 border-border/30 flex w-fit items-center gap-2 rounded-md border px-2.5 py-1 font-mono text-[11px]">
                      <Eye className="h-3.5 w-3.5" />{" "}
                      {(project.views || 0).toLocaleString("pt-BR")} views
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-50 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => setEditingProject(project)}
                        className="text-muted-foreground rounded-lg border border-transparent p-2.5 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-500"
                        title="Editar Arquitetura"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingProject(project)}
                        className="hover:bg-destructive/10 hover:border-destructive/30 text-muted-foreground hover:text-destructive rounded-lg border border-transparent p-2.5 transition-all"
                        title="Desalocar Módulo"
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

      <ProjectFormModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        project={editingProject}
      />
      <DeleteProjectDialog
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        project={deletingProject}
      />
    </>
  );
}
