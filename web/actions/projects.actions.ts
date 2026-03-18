// web/actions/projects.actions.ts
"use server";

import { projectsService } from "../services/projects.service";
import { revalidatePath } from "next/cache";
import {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectResponse,
  ProjectListResponse,
  HttpError,
} from "../types/index";

// Mantendo o mesmo padrão de contrato estrito para os Hooks de UI (Mutações)
type ActionResponse<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

// ==========================================
// 🔍 ACTIONS DE BUSCA (GET - Para os Hooks / React Query / Server Components)
// ==========================================

export async function getProjectsListAction(
  featured?: boolean,
): Promise<{ projects: ProjectListResponse }> {
  // ← Agora sim, usando o tipo importado
  try {
    return await projectsService.listAll(featured);
  } catch (error: unknown) {
    const httpError = error as HttpError;
    throw new Error(httpError.message || "Falha ao listar os projetos.");
  }
}

export async function getProjectAction(idOrSlug: string) {
  try {
    return await projectsService.getOne(idOrSlug);
  } catch (error: unknown) {
    const httpError = error as HttpError;
    throw new Error(httpError.message || "Falha ao buscar o projeto.");
  }
}

// ==========================================
// 🌐 ACTIONS PÚBLICAS (Mutações / Portfólio)
// ==========================================

export async function incrementProjectViewsAction(
  idOrSlug: string,
): Promise<
  ActionResponse<{ project: { id: string; slug: string; views: number } }>
> {
  try {
    const response = await projectsService.incrementViews(idOrSlug);

    // Revalida a página do projeto para garantir que o número de visualizações atualize para o próximo visitante
    revalidatePath(`/projetos/${response.project.slug}`);
    revalidatePath("/");

    return {
      success: true,
      data: { project: response.project },
      message: response.message,
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao incrementar visualizações.",
    };
  }
}

// ==========================================
// 👑 ACTIONS DE ADMINISTRAÇÃO (Mutações / Staff Only)
// ==========================================

export async function createProjectAction(
  data: CreateProjectInput,
): Promise<ActionResponse<{ projectId: string }>> {
  try {
    const response = await projectsService.create(data);

    // Invalida a tabela do Admin e a Home (caso o projeto já nasça em destaque)
    revalidatePath("/dashboard/projects");
    revalidatePath("/");

    return {
      success: true,
      data: { projectId: response.projectId },
      message: response.message,
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao criar projeto.",
    };
  }
}

export async function updateProjectAction(
  id: string,
  data: UpdateProjectInput,
): Promise<ActionResponse<{ project: ProjectResponse }>> {
  try {
    const response = await projectsService.update(id, data);

    // Invalida a tabela do admin, a home e a página específica do projeto
    revalidatePath("/dashboard/projects");
    revalidatePath("/");
    revalidatePath(`/projetos/${response.project.slug}`);

    return {
      success: true,
      data: { project: response.project },
      message: response.message,
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao atualizar projeto.",
    };
  }
}

export async function adminDeleteProjectAction(
  id: string,
): Promise<ActionResponse> {
  try {
    await projectsService.adminDelete(id);

    // Atualiza a tabela do Admin removendo o projeto instantaneamente
    revalidatePath("/dashboard/projects");
    revalidatePath("/");

    return { success: true };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao excluir projeto.",
    };
  }
}
