import { getProjectsListAction } from "@/actions/projects.actions";
import { ProjectsList } from "../_components/projetos/projects-list";
import { ProjectsHeader } from "../_components/projetos/projects-header";
import { ProjectResponse } from "@/types/index";

export const revalidate = 3600;

export const metadata = {
  title: "Projetos",
  description: "Log completo de arquiteturas e sistemas desenvolvidos.",
};

export default async function ProjetosPage() {
  let projects: ProjectResponse[] = [];

  try {
    const response = await getProjectsListAction();
    projects = response.projects || [];
  } catch (error) {
    console.error(
      "[System Error] Falha na leitura do catálogo de projetos:",
      error,
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-6 pt-32 pb-24 lg:px-12">
      <ProjectsHeader />
      <ProjectsList projects={projects} />
    </div>
  );
}
