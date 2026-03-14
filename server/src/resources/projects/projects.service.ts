import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../lib/prisma.js'
import { AppError } from '../../errors/app-error.js'
import type { CreateProjectInput, UpdateProjectInput } from './projects.types.js'

/**
 * Helper para identificar se a string recebida é um UUID válido.
 * Útil para permitir que a API busque tanto por ID quanto por Slug.
 */
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  return uuidRegex.test(str)
}

/**
 * CRIAR PROJETO (Exclusivo Admin)
 * Cadastra um novo projeto no banco. O slug deve ser único.
 */
export async function createProject(input: CreateProjectInput) {
  const projectExists = await prisma.project.findUnique({
    where: { slug: input.slug },
  })

  if (projectExists) {
    throw new AppError('A project with this slug already exists.', StatusCodes.CONFLICT)
  }

  // Se a Zod enviou string vazia nos links opcionais, convertemos para null
  // para manter a consistência no banco de dados.
  const dataToCreate = {
    ...input,
    imageUrl: input.imageUrl || null,
    githubUrl: input.githubUrl || null,
    liveUrl: input.liveUrl || null,
  }

  const project = await prisma.project.create({
    data: dataToCreate,
  })

  return { project }
}

/**
 * BUSCAR PROJETO POR ID OU SLUG (Público)
 * Usado pelo frontend para carregar a página de detalhes do projeto.
 */
export async function getProjectByIdOrSlug(idOrSlug: string) {
  const queryCondition = isUUID(idOrSlug) ? { id: idOrSlug } : { slug: idOrSlug }

  const project = await prisma.project.findUnique({
    where: queryCondition,
  })

  if (!project) {
    throw new AppError('Project not found.', StatusCodes.NOT_FOUND)
  }

  return { project }
}

/**
 * ATUALIZAR PROJETO (Exclusivo Admin)
 * Atualiza campos parciais do projeto.
 */
export async function updateProject(projectId: string, data: UpdateProjectInput) {
  const project = await prisma.project.findUnique({ where: { id: projectId } })

  if (!project) {
    throw new AppError('Project not found.', StatusCodes.NOT_FOUND)
  }

  // Verifica se o novo slug já está em uso por outro projeto
  if (data.slug && data.slug !== project.slug) {
    const slugExists = await prisma.project.findUnique({ where: { slug: data.slug } })
    if (slugExists) {
      throw new AppError('Slug already in use by another project.', StatusCodes.CONFLICT)
    }
  }

  // Limpeza para evitar erro de 'undefined' no Prisma (exactOptionalPropertyTypes)
  const cleanedData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))

  // Tratativa para converter strings vazias da atualização em null
  const updateData = {
    ...cleanedData,
    ...(cleanedData.imageUrl === '' && { imageUrl: null }),
    ...(cleanedData.githubUrl === '' && { githubUrl: null }),
    ...(cleanedData.liveUrl === '' && { liveUrl: null }),
  }

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: updateData,
  })

  return { project: updatedProject }
}

/**
 * DELETAR PROJETO (Exclusivo Admin)
 * Remove permanentemente um projeto do portfólio.
 */
export async function deleteProject(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } })

  if (!project) {
    throw new AppError('Project not found.', StatusCodes.NOT_FOUND)
  }

  await prisma.project.delete({ where: { id: projectId } })
}

/**
 * LISTAR TODOS OS PROJETOS (Público)
 * Retorna os projetos ordenados do mais recente para o mais antigo.
 * O frontend pode passar featured=true para puxar só os destaques para a Home.
 */
export async function listProjects(onlyFeatured: boolean = false) {
  const whereCondition = onlyFeatured ? { featured: true } : {}

  const projects = await prisma.project.findMany({
    where: whereCondition,
    orderBy: { createdAt: 'desc' },
  })

  return { projects }
}

/**
 * INCREMENTAR VISUALIZAÇÕES (Público)
 * Rota separada para adicionar +1 no contador de views usando a operação atômica do Prisma.
 */
export async function incrementProjectViews(idOrSlug: string) {
  const queryCondition = isUUID(idOrSlug) ? { id: idOrSlug } : { slug: idOrSlug }

  const project = await prisma.project.findUnique({
    where: queryCondition,
    select: { id: true },
  })

  if (!project) {
    throw new AppError('Project not found.', StatusCodes.NOT_FOUND)
  }

  const updatedProject = await prisma.project.update({
    where: { id: project.id },
    data: {
      views: {
        increment: 1, // Operação atômica do banco, super performática
      },
    },
    select: {
      id: true,
      slug: true,
      views: true,
    },
  })

  return { project: updatedProject }
}
