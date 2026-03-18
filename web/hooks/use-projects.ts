import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectsListAction,
  getProjectAction,
  incrementProjectViewsAction,
  createProjectAction,
  updateProjectAction,
  adminDeleteProjectAction,
} from "../actions/projects.actions";
import { CreateProjectInput, UpdateProjectInput } from "../types/index";
import { toast } from "sonner";

// ==========================================
// 🔍 QUERIES (Buscas Diretas via Actions)
// ==========================================

export function useProjectsList(featured?: boolean) {
  return useQuery({
    // A chave do cache agora reflete se estamos buscando todos ou só os destaques
    queryKey: ["projects", { featured }],
    queryFn: () => getProjectsListAction(featured),
  });
}

export function useProject(idOrSlug: string) {
  return useQuery({
    queryKey: ["project", idOrSlug],
    queryFn: () => getProjectAction(idOrSlug),
    // Previne que a query rode se o parâmetro ainda não estiver pronto na URL
    enabled: !!idOrSlug,
  });
}

// ==========================================
// ✍️ MUTAÇÕES (Modificações via Actions)
// ==========================================

export function useProjectsMutations() {
  const queryClient = useQueryClient();

  // ---- 🌐 Mutações Públicas (Visitantes) ----

  const incrementViews = useMutation({
    mutationFn: async (idOrSlug: string) => {
      const response = await incrementProjectViewsAction(idOrSlug);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (data) => {
      // Como a ação de view é silenciosa, não usamos toast aqui.
      // Apenas invalidamos o cache do projeto específico para a UI reagir (se necessário).
      if (data.data?.project) {
        queryClient.invalidateQueries({
          queryKey: ["project", data.data.project.slug],
        });
        queryClient.invalidateQueries({
          queryKey: ["project", data.data.project.id],
        });
      }
    },
    // Sem onError toast: falhas no analytics de view não devem atrapalhar o usuário
  });

  // ---- 👑 Mutações Exclusivas do Admin ----

  const createProject = useMutation({
    mutationFn: async (data: CreateProjectInput) => {
      const response = await createProjectAction(data);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Projeto criado com sucesso!");
      // Invalida a lista geral e a lista de destaques
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateProject = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProjectInput;
    }) => {
      const response = await updateProjectAction(id, data);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Projeto atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      // Invalida o cache do projeto atualizado tanto pelo ID quanto pelo Slug
      if (data.data?.project) {
        queryClient.invalidateQueries({
          queryKey: ["project", data.data.project.slug],
        });
        queryClient.invalidateQueries({
          queryKey: ["project", data.data.project.id],
        });
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const response = await adminDeleteProjectAction(id);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: () => {
      toast.success("Projeto excluído permanentemente do portfólio.");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    incrementViews,
    createProject,
    updateProject,
    deleteProject,
  };
}
