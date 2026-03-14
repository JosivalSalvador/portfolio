import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import * as projectsController from './projects.controller.js'
import { verifyJwt } from '../../middlewares/verify-jwt.js'
import { verifyUserRole } from '../../middlewares/verify-user-role.js'

// Importando os schemas rigorosos
import {
  createProjectSchema,
  updateProjectSchema,
  projectParamsSchema,
  projectResponseSchema,
  projectListResponseSchema,
} from './projects.schema.js'

export async function projectsRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>()

  // ==========================================
  // 🌐 ROTAS PÚBLICAS (Seu Portfólio)
  // ==========================================

  /**
   * ROTA: Listar Projetos
   * GET /projects
   */
  router.get(
    '/projects',
    {
      schema: {
        tags: ['projects'],
        summary: 'List all projects (Public)',
        querystring: z.object({
          featured: z.string().optional(),
        }),
        response: {
          [StatusCodes.OK]: z.object({
            projects: projectListResponseSchema,
          }),
        },
      },
    },
    projectsController.listAll,
  )

  /**
   * ROTA: Buscar projeto específico (por ID ou Slug)
   * GET /projects/:idOrSlug
   */
  router.get(
    '/projects/:idOrSlug',
    {
      schema: {
        tags: ['projects'],
        summary: 'Get a single project by ID or Slug (Public)',
        params: projectParamsSchema, // Schema importado
        response: {
          [StatusCodes.OK]: z.object({
            project: projectResponseSchema,
          }),
          [StatusCodes.NOT_FOUND]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    projectsController.getOne,
  )

  /**
   * ROTA: Incrementar visualizações
   * PATCH /projects/:idOrSlug/views
   */
  router.patch(
    '/projects/:idOrSlug/views',
    {
      schema: {
        tags: ['projects'],
        summary: 'Increment views counter for a project (Public)',
        params: projectParamsSchema,
        response: {
          [StatusCodes.OK]: z.object({
            message: z.string(),
            // Retorna apenas os dados atualizados de view (como definido no service)
            project: z.object({
              id: z.uuid(),
              slug: z.string(),
              views: z.number().int(),
            }),
          }),
          [StatusCodes.NOT_FOUND]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    projectsController.incrementViews,
  )

  // ==========================================
  // 🛡️ ROTAS PRIVADAS (Painel Admin)
  // ==========================================

  /**
   * ROTA: Criar Projeto (Admin)
   * POST /projects
   */
  router.post(
    '/projects',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin', 'projects'],
        summary: 'Create a new project (Admin only)',
        body: createProjectSchema, // Schema importado
        response: {
          [StatusCodes.CREATED]: z.object({
            message: z.string(),
            projectId: z.uuid(), // Zod 4 style
          }),
          [StatusCodes.CONFLICT]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    projectsController.create,
  )

  /**
   * ROTA: Atualizar Projeto (Admin)
   * PUT /projects/:id
   */
  router.put(
    '/projects/:id',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin', 'projects'],
        summary: 'Update a project (Admin only)',
        params: z.object({ id: z.uuid() }), // Garante que a atualização requer um UUID
        body: updateProjectSchema, // Schema importado
        response: {
          [StatusCodes.OK]: z.object({
            message: z.string(),
            project: projectResponseSchema,
          }),
          [StatusCodes.CONFLICT]: z.object({
            message: z.string(),
          }),
          [StatusCodes.NOT_FOUND]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    projectsController.update,
  )

  /**
   * ROTA: Deletar Projeto (Admin)
   * DELETE /projects/:id
   */
  router.delete(
    '/projects/:id',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin', 'projects'],
        summary: 'Delete a project (Admin only)',
        params: z.object({ id: z.uuid() }),
        response: {
          [StatusCodes.NO_CONTENT]: z.null().describe('No content'),
        },
      },
    },
    projectsController.remove,
  )
}
