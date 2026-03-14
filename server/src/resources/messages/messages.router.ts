import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import * as messagesController from './messages.controller.js'
import { verifyJwt } from '../../middlewares/verify-jwt.js'
import { verifyUserRole } from '../../middlewares/verify-user-role.js'

// Importando TUDO do seu arquivo de schemas
import {
  createMessageSchema,
  updateMessageStatusSchema,
  messageParamsSchema,
  messageResponseSchema,
  messageListResponseSchema,
} from './messages.schema.js'

export async function messagesRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>()

  // ==========================================
  // 🌐 ROTA PÚBLICA (Seu Portfólio)
  // ==========================================

  /**
   * ROTA: Enviar Mensagem (Contato)
   * POST /messages
   */
  router.post(
    '/messages',
    {
      schema: {
        tags: ['messages'],
        summary: 'Send a contact message (Public)',
        body: createMessageSchema, // Schema importado
        response: {
          [StatusCodes.CREATED]: z.object({
            message: z.string(),
            messageId: z.uuid(), // Zod v4 syntax
          }),
        },
      },
    },
    messagesController.sendMessage,
  )

  // ==========================================
  // 🛡️ ROTAS PRIVADAS (Painel Admin)
  // ==========================================

  /**
   * ROTA: Listar todas as mensagens (Admin)
   * GET /messages
   */
  router.get(
    '/messages',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin', 'messages'],
        summary: 'List all messages (Admin only)',
        response: {
          [StatusCodes.OK]: z.object({
            messages: messageListResponseSchema, // Array importado do schema
          }),
        },
      },
    },
    messagesController.listAll,
  )

  /**
   * ROTA: Ler mensagem específica (Admin)
   * GET /messages/:id
   */
  router.get(
    '/messages/:id',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin', 'messages'],
        summary: 'Get a single message (Admin only)',
        params: messageParamsSchema, // Schema importado
        response: {
          [StatusCodes.OK]: z.object({
            message: messageResponseSchema,
          }),
          [StatusCodes.NOT_FOUND]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    messagesController.getOne,
  )

  /**
   * ROTA: Atualizar status de leitura (Admin)
   * PATCH /messages/:id/status
   */
  router.patch(
    '/messages/:id/status',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin', 'messages'],
        summary: 'Mark message as read/unread (Admin only)',
        params: messageParamsSchema, // Schema importado
        body: updateMessageStatusSchema, // Schema importado
        response: {
          [StatusCodes.OK]: z.object({
            message: z.string(),
            messageRecord: messageResponseSchema, // Chave renomeada para casar com o controller
          }),
          [StatusCodes.NOT_FOUND]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    messagesController.updateStatus,
  )

  /**
   * ROTA: Deletar mensagem (Admin)
   * DELETE /messages/:id
   */
  router.delete(
    '/messages/:id',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin', 'messages'],
        summary: 'Delete a message (Admin only)',
        params: messageParamsSchema, // Schema importado
        response: {
          [StatusCodes.NO_CONTENT]: z.null().describe('No content'), // Zod v4 syntax
          [StatusCodes.NOT_FOUND]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    messagesController.remove,
  )
}
