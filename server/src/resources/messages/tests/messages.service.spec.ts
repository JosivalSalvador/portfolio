import { describe, it, expect } from 'vitest'
import { randomBytes } from 'node:crypto'
import { StatusCodes } from 'http-status-codes'
import {
  createMessage,
  listAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
} from '../messages.service.js'
import { prisma } from '../../../lib/prisma.js'

/**
 * Helper para garantir unicidade e isolamento entre os testes (evita conflito de e-mails únicos, se houver essa constraint)
 */
const createEmail = (base: string) => `${base}-${randomBytes(4).toString('hex')}@test.com`

describe('Messages Service (Integration)', () => {
  describe('createMessage()', () => {
    it('should create a new message with a subject', async () => {
      const email = createEmail('contact')
      const { message } = await createMessage({
        name: 'John Doe',
        email,
        subject: 'Orçamento',
        content: 'Gostaria de solicitar um orçamento para um projeto.',
      })

      const messageInDb = await prisma.message.findUnique({ where: { id: message.id } })

      if (!messageInDb) {
        throw new Error('Mensagem não foi persistida no banco de dados')
      }

      expect(messageInDb.name).toBe('John Doe')
      expect(messageInDb.email).toBe(email)
      expect(messageInDb.subject).toBe('Orçamento')
      expect(messageInDb.content).toBe('Gostaria de solicitar um orçamento para um projeto.')
      expect(messageInDb.isRead).toBe(false) // Assumindo que o default no Prisma é false
    })

    it('should convert an empty subject to null to maintain database consistency', async () => {
      const email = createEmail('no-subject')
      const { message } = await createMessage({
        name: 'Jane Doe',
        email,
        subject: '', // String vazia vinda do frontend
        content: 'Apenas testando o envio de mensagens sem assunto.',
      })

      const messageInDb = await prisma.message.findUnique({ where: { id: message.id } })

      expect(messageInDb?.subject).toBeNull()
    })
  })

  describe('listAllMessages()', () => {
    it('should list all messages ordered by createdAt descending', async () => {
      // Cria duas mensagens para garantir a ordenação
      const email1 = createEmail('list1')
      const email2 = createEmail('list2')

      await createMessage({ name: 'User 1', email: email1, content: 'Primeira mensagem' })

      // Pequeno delay artificial (ou confie no DB) para garantir diferença no createdAt,
      // mas na prática a inserção sequencial já basta para o Prisma.
      await new Promise((resolve) => setTimeout(resolve, 10))

      await createMessage({ name: 'User 2', email: email2, content: 'Segunda mensagem' })

      const { messages } = await listAllMessages()

      expect(messages.length).toBeGreaterThanOrEqual(2)
      const firstMessage = messages[0]
      const secondMessage = messages[1]

      if (!firstMessage?.createdAt || !secondMessage?.createdAt) {
        throw new Error('Falha no teste: As mensagens não possuem data de criação (createdAt)')
      }

      // Verifica se a ordenação está correta (o primeiro item deve ser mais recente que o segundo)
      const firstMessageTime = new Date(firstMessage.createdAt).getTime()
      const secondMessageTime = new Date(secondMessage.createdAt).getTime()

      expect(firstMessageTime).toBeGreaterThanOrEqual(secondMessageTime)
    })
  })

  describe('getMessageById()', () => {
    it('should return message details by ID', async () => {
      const { message: created } = await createMessage({
        name: 'Search Me',
        email: createEmail('get-by-id'),
        content: 'Esta mensagem deve ser encontrada pelo ID.',
      })

      const { message } = await getMessageById(created.id)

      expect(message.id).toBe(created.id)
      expect(message.name).toBe('Search Me')
    })

    it('should throw NOT_FOUND for non-existing ID', async () => {
      await expect(getMessageById('00000000-0000-0000-0000-000000000000')).rejects.toMatchObject({
        statusCode: StatusCodes.NOT_FOUND,
      })
    })
  })

  describe('updateMessageStatus()', () => {
    it('should update the isRead status correctly', async () => {
      const { message: created } = await createMessage({
        name: 'Status Update',
        email: createEmail('status'),
        content: 'Testando alteração de status de leitura.',
      })

      // Status inicial deve ser false
      expect(created.isRead).toBe(false)

      const { message: updated } = await updateMessageStatus(created.id, { isRead: true })

      expect(updated.isRead).toBe(true)

      const dbMessage = await prisma.message.findUnique({ where: { id: created.id } })
      expect(dbMessage?.isRead).toBe(true)
    })

    it('should throw NOT_FOUND when updating status of a non-existing message', async () => {
      await expect(updateMessageStatus('00000000-0000-0000-0000-000000000000', { isRead: true })).rejects.toMatchObject(
        {
          statusCode: StatusCodes.NOT_FOUND,
        },
      )
    })
  })

  describe('deleteMessage()', () => {
    it('should delete message and throw NOT_FOUND on subsequent searches', async () => {
      const { message: created } = await createMessage({
        name: 'Delete Me',
        email: createEmail('delete-me'),
        content: 'Esta mensagem será apagada.',
      })

      await deleteMessage(created.id)

      const dbMessage = await prisma.message.findUnique({ where: { id: created.id } })
      expect(dbMessage).toBeNull()

      // Garantir que a busca via service também quebra com 404 agora
      await expect(getMessageById(created.id)).rejects.toMatchObject({
        statusCode: StatusCodes.NOT_FOUND,
      })
    })

    it('should throw NOT_FOUND when deleting a non-existing message', async () => {
      await expect(deleteMessage('00000000-0000-0000-0000-000000000000')).rejects.toMatchObject({
        statusCode: StatusCodes.NOT_FOUND,
      })
    })
  })
})
