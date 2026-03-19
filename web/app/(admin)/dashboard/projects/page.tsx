import { AdminHeader } from "../_components/geral/admin-header";
import { ProjectsDataTable } from "../_components/projects/projects-data-table";
import { CreateProjectButton } from "../_components/projects/create-project-button";
import { getProjectsListAction } from "@/actions/projects.actions";
import { ProjectResponse } from "@/types/index";

export const metadata = {
  title: "Gerenciar Projetos | System Admin",
};

export const revalidate = 0;

export default async function AdminProjectsPage() {
  let projects: ProjectResponse[] = [];

  try {
    const response = await getProjectsListAction();
    projects = response.projects || [];
  } catch (error) {
    console.error("[Admin Error] Falha ao carregar lista de projetos:", error);
  }

  return (
    <div className="flex w-full flex-col pb-12">
      <AdminHeader
        title="Repositório de Projetos"
        description="Gerencie os módulos do portfólio, edite documentações e controle projetos em destaque."
        action={<CreateProjectButton />}
      />

      <ProjectsDataTable projects={projects} />
    </div>
  );
}
