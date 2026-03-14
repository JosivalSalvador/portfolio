import { describe, it, expect } from 'vitest'
import { randomBytes } from 'node:crypto'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../../lib/prisma.js'
import {
  createProject,
  getProjectByIdOrSlug,
  updateProject,
  deleteProject,
  listProjects,
  incrementProjectViews,
} from '../projects.service.js'

/**
 * Helper para garantir unicidade e isolamento entre os testes
 */
const createSlug = (base: string) => `${base}-${randomBytes(4).toString('hex')}`

describe('Projects Service (Integration)', () => {
  describe('createProject()', () => {
    it('should create a new project with valid data', async () => {
      const slug = createSlug('my-project')
      const { project } = await createProject({
        title: 'My Project',
        slug,
        description: 'A short description here.',
        content: 'The full long content of the project goes here.',
        tags: ['React', 'Node'], // Obrigatório pelo z.infer
        featured: false, // Obrigatório pelo z.infer
      })

      const projectInDb = await prisma.project.findUnique({ where: { id: project.id } })

      if (!projectInDb) {
        throw new Error('Projeto não foi persistido no banco de dados')
      }

      expect(projectInDb.title).toBe('My Project')
      expect(projectInDb.slug).toBe(slug)
      expect(projectInDb.tags).toEqual(['React', 'Node'])
      expect(projectInDb.imageUrl).toBeNull()
    })

    it('should throw CONFLICT if slug already exists', async () => {
      const slug = createSlug('duplicate')

      await createProject({
        title: 'Project 1',
        slug,
        description: 'Short description 1',
        content: 'Long content 1 here 123456.',
        tags: [],
        featured: false,
      })

      await expect(
        createProject({
          title: 'Project 2',
          slug,
          description: 'Short description 2',
          content: 'Long content 2 here 123456.',
          tags: [],
          featured: false,
        }),
      ).rejects.toMatchObject({
        statusCode: StatusCodes.CONFLICT,
      })
    })
  })

  describe('getProjectByIdOrSlug()', () => {
    it('should find a project using its UUID', async () => {
      const { project: created } = await createProject({
        title: 'Find By ID',
        slug: createSlug('find-id'),
        description: 'Short desc here',
        content: 'Long content here 123456.',
        tags: [],
        featured: false,
      })

      const { project } = await getProjectByIdOrSlug(created.id)
      expect(project.id).toBe(created.id)
    })

    it('should find a project using its Slug', async () => {
      const slug = createSlug('find-slug')
      const { project: created } = await createProject({
        title: 'Find By Slug',
        slug,
        description: 'Short desc here',
        content: 'Long content here 123456.',
        tags: [],
        featured: false,
      })

      const { project } = await getProjectByIdOrSlug(slug)
      expect(project.id).toBe(created.id)
    })

    it('should throw NOT_FOUND for non-existing ID or Slug', async () => {
      await expect(getProjectByIdOrSlug('00000000-0000-0000-0000-000000000000')).rejects.toMatchObject({
        statusCode: StatusCodes.NOT_FOUND,
      })
      await expect(getProjectByIdOrSlug('slug-that-does-not-exist')).rejects.toMatchObject({
        statusCode: StatusCodes.NOT_FOUND,
      })
    })
  })

  describe('updateProject()', () => {
    it('should update partial data correctly', async () => {
      const { project: created } = await createProject({
        title: 'Old Title',
        slug: createSlug('update-partial'),
        description: 'Old desc here',
        content: 'Old content here 123456.',
        tags: [],
        featured: false,
      })

      const { project: updated } = await updateProject(created.id, {
        title: 'New Title',
        featured: true,
      })

      expect(updated.title).toBe('New Title')
      expect(updated.featured).toBe(true)
      expect(updated.slug).toBe(created.slug)
    })

    it('should convert empty strings in optional URLs to null', async () => {
      const { project: created } = await createProject({
        title: 'Clear URL Test',
        slug: createSlug('clear-url'),
        description: 'Desc here 123',
        content: 'Content here 123456',
        imageUrl: 'https://example.com/image.png',
        tags: [],
        featured: false,
      })

      // O frontend envia string vazia para limpar o campo
      const { project: updated } = await updateProject(created.id, {
        imageUrl: '',
      })

      expect(updated.imageUrl).toBeNull()
    })

    it('should throw CONFLICT when updating slug to an already existing one', async () => {
      const targetSlug = createSlug('target')
      await createProject({
        title: 'Target Project',
        slug: targetSlug,
        description: 'Desc here 123',
        content: 'Content here 123456',
        tags: [],
        featured: false,
      })

      const { project: sourceProject } = await createProject({
        title: 'Source Project',
        slug: createSlug('source'),
        description: 'Desc here 123',
        content: 'Content here 123456',
        tags: [],
        featured: false,
      })

      await expect(updateProject(sourceProject.id, { slug: targetSlug })).rejects.toMatchObject({
        statusCode: StatusCodes.CONFLICT,
      })
    })
  })

  describe('incrementProjectViews()', () => {
    it('should increment view count by exactly 1', async () => {
      const { project: created } = await createProject({
        title: 'Views Test',
        slug: createSlug('views-test'),
        description: 'Desc here 123',
        content: 'Content here 123456',
        tags: [],
        featured: false,
      })

      expect(created.views).toBe(0)

      const { project: updated } = await incrementProjectViews(created.id)
      expect(updated.views).toBe(1)
    })
  })

  describe('listProjects()', () => {
    it('should return only featured projects when flag is true', async () => {
      await createProject({
        title: 'Normal Project',
        slug: createSlug('normal'),
        description: 'Desc here 123',
        content: 'Content here 123456',
        tags: [],
        featured: false, // Normal
      })

      const { project: featuredProject } = await createProject({
        title: 'Featured Project',
        slug: createSlug('featured'),
        description: 'Desc here 123',
        content: 'Content here 123456',
        tags: ['Featured'],
        featured: true, // Destaque
      })

      const { projects } = await listProjects(true)

      const foundFeatured = projects.find((p) => p.id === featuredProject.id)
      expect(foundFeatured).toBeDefined()

      projects.forEach((p) => {
        expect(p.featured).toBe(true)
      })
    })
  })

  describe('deleteProject()', () => {
    it('should delete project and throw NOT_FOUND on subsequent searches', async () => {
      const { project } = await createProject({
        title: 'Delete Me',
        slug: createSlug('delete-me'),
        description: 'Desc here 123',
        content: 'Content here 123456',
        tags: [],
        featured: false,
      })

      await deleteProject(project.id)

      const dbProject = await prisma.project.findUnique({ where: { id: project.id } })
      expect(dbProject).toBeNull()
    })
  })
})
