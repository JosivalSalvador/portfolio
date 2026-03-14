import { z } from 'zod'
import { createMessageSchema, updateMessageStatusSchema, messageParamsSchema } from './messages.schema.js'

export type CreateMessageInput = z.infer<typeof createMessageSchema>
export type UpdateMessageStatusInput = z.infer<typeof updateMessageStatusSchema>
export type MessageParamsInput = z.infer<typeof messageParamsSchema>
