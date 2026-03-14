import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import * as projectsService from './projects.service.js'
import type { CreateProjectInput, UpdateProjectInput, ProjectParamsInput } from './projects.types.js'

// ==========================================
// 🌐 MÉTODOS PÚBLICOS (O frontend consome)
// ==========================================

/**
 * LISTAR TODOS OS PROJETOS
 * Aceita uma query string ?featured=true para puxar apenas destaques na Home
 */
export async function listAll(request: FastifyRequest, reply: FastifyReply) {
  // Ajuste aqui: cast de tipo na query
  const query = request.query as { featured?: string }
  const isFeaturedOnly = query.featured === 'true'

  const { projects } = await projectsService.listProjects(isFeaturedOnly)

  return reply.status(StatusCodes.OK).send({ projects })
}

/**
 * BUSCAR PROJETO ESPECÍFICO (Para a página de detalhes)
 * Busca tanto pelo UUID quanto pelo Slug (ex: /projects/crochedat-v2)
 */
export async function getOne(request: FastifyRequest, reply: FastifyReply) {
  // Ajuste aqui: cast usando o tipo exportado do schema
  const { idOrSlug } = request.params as ProjectParamsInput
  const { project } = await projectsService.getProjectByIdOrSlug(idOrSlug)

  return reply.status(StatusCodes.OK).send({ project })
}

/**
 * INCREMENTAR VISUALIZAÇÕES
 * Chamado pelo frontend assim que a página de detalhes do projeto carrega
 */
export async function incrementViews(request: FastifyRequest, reply: FastifyReply) {
  const { idOrSlug } = request.params as ProjectParamsInput
  const { project } = await projectsService.incrementProjectViews(idOrSlug)

  return reply.status(StatusCodes.OK).send({
    message: 'Project views incremented.',
    project, // Retorna os novos dados de view
  })
}

// ==========================================
// 🛡️ MÉTODOS EXCLUSIVOS DE ADMIN (Seu Painel)
// ==========================================

/**
 * CRIAR PROJETO (Admin)
 */
export async function create(request: FastifyRequest, reply: FastifyReply) {
  // Ajuste aqui: cast de tipo no body
  const body = request.body as CreateProjectInput
  const { project } = await projectsService.createProject(body)

  return reply.status(StatusCodes.CREATED).send({
    message: 'Project created successfully.',
    projectId: project.id,
  })
}

/**
 * ATUALIZAR PROJETO (Admin)
 */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  // Para atualizar, exigimos o ID específico por segurança
  const { id } = request.params as { id: string }
  const body = request.body as UpdateProjectInput

  const { project } = await projectsService.updateProject(id, body)

  return reply.status(StatusCodes.OK).send({
    message: 'Project updated successfully.',
    project,
  })
}

/**
 * DELETAR PROJETO (Admin)
 */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  await projectsService.deleteProject(id)

  return reply.status(StatusCodes.NO_CONTENT).send() // 204 No Content
}
