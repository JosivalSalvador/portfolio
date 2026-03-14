import type { FastifyInstance } from 'fastify'
import { usersRoutes } from '../resources/users/users.router.js' // Importar
import { sessionsRoutes } from '../resources/auth/sessions.router.js' // Importar
import { refreshRoutes } from '../resources/tokens/refresh.router.js' // Importar
import { projectsRoutes } from '../resources/projects/projects.router.js'
import { messagesRoutes } from '../resources/messages/messages.router.js'

export async function routesV1(app: FastifyInstance) {
  // Aqui você registra todos os recursos da versão 1
  app.register(usersRoutes)
  app.register(sessionsRoutes)
  app.register(refreshRoutes)
  app.register(projectsRoutes)
  app.register(messagesRoutes)
}
