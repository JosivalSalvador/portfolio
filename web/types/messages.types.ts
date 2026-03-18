import { z } from "zod";
import {
  createMessageSchema,
  updateMessageStatusSchema,
  messageParamsSchema,
  messageListResponseSchema,
  messageResponseSchema,
} from "@/schemas/messages.schema";

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type UpdateMessageStatusInput = z.infer<
  typeof updateMessageStatusSchema
>;
export type MessageParamsInput = z.infer<typeof messageParamsSchema>;

// Usado para tipar os detalhes de uma mensagem no painel Admin
export type MessageResponse = z.infer<typeof messageResponseSchema>;

// Usado para tipar a Tabela do painel Admin (lista de mensagens)
export type MessageListResponse = z.infer<typeof messageListResponseSchema>;
