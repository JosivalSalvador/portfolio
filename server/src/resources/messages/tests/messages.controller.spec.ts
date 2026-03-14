import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { randomBytes } from 'node:crypto'
import { Role } from '@prisma/client'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'

/**
 * Auxiliares de teste para gerar dados únicos
 */
const generateUniqueEmail = (base: string) => `${base}-${randomBytes(4).toString('hex')}@example.com`

interface AuthSession {
  token: string
  userId: string
  email: string
}

/**
 * Helper E2E para criar e autenticar um usuário com um cargo específico
 */
async function createAndAuthenticateUser(role: Role = Role.USER): Promise<AuthSession> {
  const email = generateUniqueEmail('test')
  const password = 'Password123!'

  // 1. Registro via API E2E (ou via Prisma direto, mas pela API garante fluxos reais se houver trigger)
  const registerResponse = await request(app.server).post('/api/v1/users').send({
    name: 'Admin Test',
    email,
    password,
  })

  const userId = registerResponse.body.userId

  // 2. Força a role desejada via banco de dados (já que não dá pra registrar Admin direto via rota pública)
  if (role !== Role.USER) {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    })
  }

  // 3. Login
  const authResponse = await request(app.server).post('/api/v1/sessions').send({
    email,
    password,
  })

  return {
    token: authResponse.body.token,
    userId,
    email,
  }
}

describe('Messages Controller (E2E)', () => {
  beforeAll(async () => {
    // Aguarda o Fastify registrar todos os plugins e rotas antes de disparar as requisições
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  // Variável para guardar o ID de uma mensagem criada e usá-la nos testes de Admin
  let testMessageId: string

  describe('🌐 Rotas Públicas', () => {
    it('should be able to send a message without authentication', async () => {
      const response = await request(app.server)
        .post('/api/v1/messages') // Ajuste o prefixo '/api/v1' se a sua rota base for diferente
        .send({
          name: 'Visitante do Portfólio',
          email: generateUniqueEmail('contact'),
          subject: 'Oportunidade de Freelance',
          content: 'Olá! Gostaria de conversar sobre um projeto novo. Aguardo retorno.',
        })

      expect(response.statusCode).toBe(StatusCodes.CREATED)
      expect(response.body.message).toEqual('Message sent successfully.')
      expect(response.body.messageId).toBeDefined()

      // Salvamos o ID para usar nos blocos seguintes
      testMessageId = response.body.messageId
    })

    it('should return 400 BAD REQUEST when payload is invalid (Zod validation)', async () => {
      const response = await request(app.server).post('/api/v1/messages').send({
        name: 'A', // Muito curto (mínimo 3)
        email: 'email-invalido', // Formato errado
        content: 'Oi', // Muito curto (mínimo 10)
      })

      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
    })
  })

  describe('🛡️ Rotas Exclusivas de Admin', () => {
    it('should return FORBIDDEN when a regular user tries to list messages', async () => {
      const { token } = await createAndAuthenticateUser(Role.USER)

      const response = await request(app.server).get('/api/v1/messages').set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.FORBIDDEN)
    })

    it('should allow ADMIN to list all messages', async () => {
      const { token } = await createAndAuthenticateUser(Role.ADMIN)

      const response = await request(app.server).get('/api/v1/messages').set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(Array.isArray(response.body.messages)).toBe(true)

      // Validação de segurança de tipagem
      if (response.body.messages.length > 0) {
        expect(response.body.messages[0]).toHaveProperty('isRead')
        expect(response.body.messages[0]).toHaveProperty('content')
      }
    })

    it('should allow ADMIN to get a single message by ID', async () => {
      const { token } = await createAndAuthenticateUser(Role.ADMIN)

      const response = await request(app.server)
        .get(`/api/v1/messages/${testMessageId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.body.message.id).toBe(testMessageId)
      expect(response.body.message.subject).toBe('Oportunidade de Freelance')
    })

    it('should allow ADMIN to update the read status of a message', async () => {
      const { token } = await createAndAuthenticateUser(Role.ADMIN)

      const response = await request(app.server)
        .patch(`/api/v1/messages/${testMessageId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ isRead: true })

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.body.message).toEqual('Message status updated successfully.')
      expect(response.body.messageRecord.isRead).toBe(true)
    })

    it('should allow ADMIN to delete a message', async () => {
      const { token } = await createAndAuthenticateUser(Role.ADMIN)

      const response = await request(app.server)
        .delete(`/api/v1/messages/${testMessageId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.NO_CONTENT)

      // Garantir que sumiu do banco consultando novamente
      const fetchResponse = await request(app.server)
        .get(`/api/v1/messages/${testMessageId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(fetchResponse.statusCode).toBe(StatusCodes.NOT_FOUND)
    })
  })
})
