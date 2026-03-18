// web/services/projects.service.ts

import { httpClient } from "../lib/api/http-client";
import {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectResponse,
} from "../types/index";

export const projectsService = {
  // ==========================================
  // 🌐 ROTAS PÚBLICAS (O frontend consome)
  // ==========================================

  /**
   * Lista todos os projetos.
   * Aceita parâmetro opcional para buscar apenas os destaques (Home).
   */
  listAll: async (featured?: boolean) => {
    const query = featured ? "?featured=true" : "";
    return httpClient<{ projects: ProjectResponse[] }>(`/projects${query}`, {
      method: "GET",
    });
  },

  /**
   * Busca um projeto específico pelo UUID ou Slug
   */
  getOne: async (idOrSlug: string) => {
    return httpClient<{ project: ProjectResponse }>(`/projects/${idOrSlug}`, {
      method: "GET",
    });
  },

  /**
   * Incrementa silenciosamente o contador de visualizações de um projeto
   */
  incrementViews: async (idOrSlug: string) => {
    return httpClient<{
      message: string;
      project: { id: string; slug: string; views: number };
    }>(`/projects/${idOrSlug}/views`, {
      method: "PATCH",
    });
  },

  // ==========================================
  // 👑 ROTAS DE ADMINISTRAÇÃO (Staff Only)
  // ==========================================

  /**
   * Cria um novo projeto no banco de dados
   */
  create: async (data: CreateProjectInput) => {
    return httpClient<{ message: string; projectId: string }>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Atualiza os dados de um projeto existente
   */
  update: async (id: string, data: UpdateProjectInput) => {
    return httpClient<{ message: string; project: ProjectResponse }>(
      `/projects/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
  },

  /**
   * Deleta um projeto permanentemente
   */
  adminDelete: async (id: string) => {
    return httpClient<void>(`/projects/${id}`, {
      method: "DELETE",
    });
  },
};
