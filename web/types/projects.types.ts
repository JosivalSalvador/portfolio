import { z } from "zod";
import {
  createProjectSchema,
  updateProjectSchema,
  projectParamsSchema,
  projectListResponseSchema,
  projectResponseSchema,
} from "@/schemas/projects.schema";

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectParamsInput = z.infer<typeof projectParamsSchema>;

// Usado para tipar o estado do React na página de detalhes de 1 projeto
export type ProjectResponse = z.infer<typeof projectResponseSchema>;

// Usado para tipar o estado do React na Home (lista de projetos)
export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;
