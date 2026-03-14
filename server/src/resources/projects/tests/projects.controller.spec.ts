import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { randomBytes } from 'node:crypto'
import { Role } from '@prisma/client'
import { z } from 'zod'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'
import { projectResponseSchema } from '../projects.schema.js' // ← Importando o schema da resposta

// Inferindo o tipo diretamente do schema de resposta do Zod
type ProjectResponse = z.infer<typeof projectResponseSchema>

/**
 * Helpers para garantir unicidade e isolamento
 */
const generateUniqueEmail = (base: string) => `${base}-${randomBytes(4).toString('hex')}@example.com`
const generateUniqueSlug = (base: string) => `${base}-${randomBytes(4).toString('hex')}`

interface AuthSession {
  token: string
  userId: string
  email: string
}

async function createAndAuthenticateUser(role: Role = Role.USER): Promise<AuthSession> {
  const email = generateUniqueEmail('project-tester')
  const password = 'Password123!'

  const registerResponse = await request(app.server).post('/api/v1/users').send({
    name: 'Test User',
    email,
    password,
  })

  const userId = registerResponse.body.userId

  if (role !== Role.USER) {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    })
  }

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

describe('Projects Controller (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('🌐 Rotas Públicas', () => {
    it('should be able to list all projects', async () => {
      await prisma.project.create({
        data: {
          title: 'Public Test Project',
          slug: generateUniqueSlug('public-test'),
          description: 'A test project for public listing',
          content: 'Some long content goes here',
          featured: false,
        },
      })

      const response = await request(app.server).get('/api/v1/projects')

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(Array.isArray(response.body.projects)).toBe(true)
      expect(response.body.projects.length).toBeGreaterThan(0)
    })

    it('should filter featured projects when query is provided', async () => {
      const featuredSlug = generateUniqueSlug('featured-test')

      await prisma.project.create({
        data: {
          title: 'Featured Test Project',
          slug: featuredSlug,
          description: 'A test project for featured listing',
          content: 'Some long content goes here',
          featured: true,
        },
      })

      const response = await request(app.server).get('/api/v1/projects?featured=true')

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(Array.isArray(response.body.projects)).toBe(true)

      // ← ATUALIZADO: Tipagem rigorosa com Zod Infer (zero any)
      response.body.projects.forEach((project: ProjectResponse) => {
        expect(project.featured).toBe(true)
      })

      // ← ATUALIZADO: Tipagem rigorosa com Zod Infer (zero any)
      const found = response.body.projects.find((p: ProjectResponse) => p.slug === featuredSlug)
      expect(found).toBeDefined()
    })

    it('should get a project by slug and increment views', async () => {
      const slug = generateUniqueSlug('view-test')
      const project = await prisma.project.create({
        data: {
          title: 'View Test Project',
          slug,
          description: 'Testing views',
          content: 'Content here',
          views: 0,
        },
      })

      const getResponse = await request(app.server).get(`/api/v1/projects/${slug}`)
      expect(getResponse.statusCode).toBe(StatusCodes.OK)
      expect(getResponse.body.project.id).toBe(project.id)

      const patchResponse = await request(app.server).patch(`/api/v1/projects/${slug}/views`)
      expect(patchResponse.statusCode).toBe(StatusCodes.OK)
      expect(patchResponse.body.project.views).toBe(1)
    })
  })

  describe('🛡️ Rotas Administrativas', () => {
    it('should block normal users from creating a project', async () => {
      const normalUser = await createAndAuthenticateUser(Role.USER)

      const response = await request(app.server)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${normalUser.token}`)
        .send({
          title: 'Hacked Project',
          slug: generateUniqueSlug('hacked'),
          description: 'Trying to bypass admin',
          content: 'Should not be allowed',
        })

      expect(response.statusCode).toBe(StatusCodes.FORBIDDEN)
    })

    it('should allow ADMIN to create a project', async () => {
      const admin = await createAndAuthenticateUser(Role.ADMIN)
      const slug = generateUniqueSlug('admin-created')

      const response = await request(app.server)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          title: 'Admin Project',
          slug,
          description: 'A legitimate project',
          content: 'Content created by admin',
          tags: ['TypeScript', 'Fastify'],
          featured: true,
        })

      expect(response.statusCode).toBe(StatusCodes.CREATED)
      expect(response.body.projectId).toBeDefined()

      const dbProject = await prisma.project.findUnique({
        where: { id: response.body.projectId },
      })
      expect(dbProject?.title).toBe('Admin Project')
      expect(dbProject?.tags).toEqual(['TypeScript', 'Fastify'])
    })

    it('should allow ADMIN to update a project', async () => {
      const admin = await createAndAuthenticateUser(Role.ADMIN)

      const project = await prisma.project.create({
        data: {
          title: 'Old Title',
          slug: generateUniqueSlug('old-slug'),
          description: 'Old desc',
          content: 'Old content',
        },
      })

      const response = await request(app.server)
        .put(`/api/v1/projects/${project.id}`)
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          title: 'Updated Title',
          featured: true,
        })

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.body.project.title).toBe('Updated Title')
      expect(response.body.project.featured).toBe(true)
    })

    it('should allow ADMIN to delete a project', async () => {
      const admin = await createAndAuthenticateUser(Role.ADMIN)

      const project = await prisma.project.create({
        data: {
          title: 'Delete Target',
          slug: generateUniqueSlug('delete-target'),
          description: 'Will be deleted',
          content: 'Bye bye',
        },
      })

      const response = await request(app.server)
        .delete(`/api/v1/projects/${project.id}`)
        .set('Authorization', `Bearer ${admin.token}`)

      expect(response.statusCode).toBe(StatusCodes.NO_CONTENT)

      const checkDb = await prisma.project.findUnique({ where: { id: project.id } })
      expect(checkDb).toBeNull()
    })
  })
})
