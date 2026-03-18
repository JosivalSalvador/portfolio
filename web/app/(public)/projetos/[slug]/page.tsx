import { notFound } from "next/navigation";
import { getProjectAction } from "@/actions/projects.actions";
import { ProjectHeader } from "../../_components/projetos/project-header";
import { ProjectContent } from "../../_components/projetos/project-content";
import { ViewTracker } from "../../_components/projetos/view-tracker";
import { ProjectArchitectureDiagram } from "../../_components/projetos/project-architecture-diagram";
import { ProjectResponse } from "@/types/index";

export const revalidate = 3600;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  let project: ProjectResponse;

  try {
    const response = await getProjectAction(slug);

    if (!response || !response.project) {
      notFound();
    }
    project = response.project;
  } catch (error) {
    console.error(`[System Error] Falha ao ler projeto /${slug}:`, error);
    notFound();
  }

  return (
    // Usa div, pois o layout principal já possui a tag <main>
    <div className="flex w-full flex-col pt-24 pb-32 md:pt-24">
      <ViewTracker slug={slug} />

      <ProjectHeader project={project} />

      <div className="container mx-auto mt-16 px-6 md:mt-24 lg:px-12">
        <ProjectArchitectureDiagram />
        <ProjectContent content={project.content} />
      </div>
    </div>
  );
}
