import { z } from 'zod'
import { createProjectSchema, updateProjectSchema, projectParamsSchema } from './projects.schema.js' // Mantendo a extensão .js caso seu tsconfig exija moduleResolution NodeNext

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type ProjectParamsInput = z.infer<typeof projectParamsSchema>
