import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import * as messagesService from './messages.service.js'
import type { CreateMessageInput, UpdateMessageStatusInput, MessageParamsInput } from './messages.types.js'

// ==========================================
// 🌐 MÉTODOS PÚBLICOS (O frontend consome)
// ==========================================

/**
 * ENVIAR MENSAGEM (Público)
 * Chamado pelo formulário de contato do seu portfólio.
 */
export async function sendMessage(request: FastifyRequest, reply: FastifyReply) {
  // Cast explícito do body garantido pelo Zod
  const body = request.body as CreateMessageInput
  const { message } = await messagesService.createMessage(body)

  return reply.status(StatusCodes.CREATED).send({
    message: 'Message sent successfully.',
    messageId: message.id,
  })
}

// ==========================================
// 🛡️ MÉTODOS EXCLUSIVOS DE ADMIN (Seu Painel)
// ==========================================

/**
 * LISTAR TODAS AS MENSAGENS (Admin)
 * Para popular a sua caixa de entrada no painel.
 */
export async function listAll(request: FastifyRequest, reply: FastifyReply) {
  const { messages } = await messagesService.listAllMessages()

  return reply.status(StatusCodes.OK).send({ messages })
}

/**
 * LER MENSAGEM ESPECÍFICA (Admin)
 * Traz os detalhes de uma única mensagem.
 */
export async function getOne(request: FastifyRequest, reply: FastifyReply) {
  // Cast dos parâmetros da URL usando o tipo validado pelo Zod
  const { id } = request.params as MessageParamsInput
  const { message } = await messagesService.getMessageById(id)

  return reply.status(StatusCodes.OK).send({ message })
}

/**
 * ATUALIZAR STATUS DE LEITURA (Admin)
 * Marca como lida/não lida.
 */
export async function updateStatus(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as MessageParamsInput
  const body = request.body as UpdateMessageStatusInput

  // Renomeamos a variável extraída para evitar o conflito de nomes
  const { message: messageRecord } = await messagesService.updateMessageStatus(id, body)

  return reply.status(StatusCodes.OK).send({
    message: 'Message status updated successfully.',
    messageRecord, // <-- Problema resolvido! Chaves diferentes.
  })
}

/**
 * DELETAR MENSAGEM (Admin)
 * Limpa spans ou contatos antigos.
 */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as MessageParamsInput
  await messagesService.deleteMessage(id)

  return reply.status(StatusCodes.NO_CONTENT).send()
}
