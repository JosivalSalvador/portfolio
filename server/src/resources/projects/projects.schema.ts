import { z } from 'zod'

// =========================
// Schemas Auxiliares
// =========================

const urlSchema = z.union([z.url({ message: 'Formato de URL inválido' }), z.literal('')]).optional()

const slugSchema = z
  .string()
  .transform((value) => value.trim().toLowerCase())
  .refine((value) => /^[a-z0-9-]+$/.test(value), {
    message: 'O slug deve conter apenas letras minúsculas, números e hifens (ex: meu-projeto)',
  })

// =========================
// Schema para Criar Projeto
// =========================

export const createProjectSchema = z.object({
  title: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length >= 3, {
      message: 'O título deve ter no mínimo 3 caracteres',
    }),

  slug: slugSchema,

  description: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length >= 10, {
      message: 'A descrição curta deve ter no mínimo 10 caracteres',
    }),

  content: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length >= 20, {
      message: 'O conteúdo detalhado deve ter no mínimo 20 caracteres',
    }),

  imageUrl: urlSchema,
  githubUrl: urlSchema,
  liveUrl: urlSchema,

  tags: z.array(z.string().transform((t) => t.trim())).default([]),

  featured: z.boolean().default(false),
})

// ==========================================
// Schema para Atualizar Projeto
// ==========================================

export const updateProjectSchema = z.object({
  title: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length >= 3, {
      message: 'O título deve ter no mínimo 3 caracteres',
    })
    .optional(),

  slug: slugSchema.optional(),

  description: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length >= 10, {
      message: 'A descrição curta deve ter no mínimo 10 caracteres',
    })
    .optional(),

  content: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length >= 20, {
      message: 'O conteúdo detalhado deve ter no mínimo 20 caracteres',
    })
    .optional(),

  imageUrl: urlSchema,
  githubUrl: urlSchema,
  liveUrl: urlSchema,

  tags: z.array(z.string().transform((t) => t.trim())).optional(),
  featured: z.boolean().optional(),
})

// ==========================================
// Schema para Parâmetros de URL
// ==========================================

export const projectParamsSchema = z.object({
  idOrSlug: z.string().min(1, { message: 'ID ou Slug é obrigatório' }),
})

// ==========================================
// Schema de Resposta (Retorno da API)
// ==========================================

export const projectResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  content: z.string(),
  imageUrl: z.string().nullable(),
  githubUrl: z.string().nullable(),
  liveUrl: z.string().nullable(),
  tags: z.array(z.string()),
  featured: z.boolean(),
  views: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
})

// Exporta um schema de resposta em lista (para a rota de buscar todos)
export const projectListResponseSchema = z.array(projectResponseSchema)
