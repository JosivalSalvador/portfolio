import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../lib/prisma.js'
import { AppError } from '../../errors/app-error.js'
import type { CreateMessageInput, UpdateMessageStatusInput } from './messages.types.js'

/**
 * CRIAR MENSAGEM (Público)
 * Chamado quando alguém preenche o formulário de contato no portfólio.
 */
export async function createMessage(input: CreateMessageInput) {
  // Se o Zod aceitou string vazia no subject opcional, convertemos para null
  // para manter o banco de dados limpo e consistente.
  const dataToCreate = {
    ...input,
    subject: input.subject || null,
  }

  const message = await prisma.message.create({
    data: dataToCreate,
  })

  return { message }
}

/**
 * LISTAR TODAS AS MENSAGENS (Exclusivo Admin)
 * Retorna as mensagens ordenadas das mais recentes para as mais antigas.
 */
export async function listAllMessages() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return { messages }
}

/**
 * BUSCAR MENSAGEM POR ID (Exclusivo Admin)
 * Usado para abrir a mensagem detalhada no painel.
 */
export async function getMessageById(messageId: string) {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
  })

  if (!message) {
    throw new AppError('Message not found.', StatusCodes.NOT_FOUND)
  }

  return { message }
}

/**
 * ATUALIZAR STATUS DE LEITURA (Exclusivo Admin)
 * Marca a mensagem como lida (true) ou não lida (false).
 */
export async function updateMessageStatus(messageId: string, data: UpdateMessageStatusInput) {
  const message = await prisma.message.findUnique({ where: { id: messageId } })

  if (!message) {
    throw new AppError('Message not found.', StatusCodes.NOT_FOUND)
  }

  const updatedMessage = await prisma.message.update({
    where: { id: messageId },
    data: { isRead: data.isRead },
  })

  return { message: updatedMessage }
}

/**
 * DELETAR MENSAGEM (Exclusivo Admin)
 * Remove a mensagem do banco de dados (excluir spam ou limpar a caixa de entrada).
 */
export async function deleteMessage(messageId: string) {
  const message = await prisma.message.findUnique({ where: { id: messageId } })

  if (!message) {
    throw new AppError('Message not found.', StatusCodes.NOT_FOUND)
  }

  await prisma.message.delete({ where: { id: messageId } })
}
