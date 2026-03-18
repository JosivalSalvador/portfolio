import { z } from "zod";

// =========================
// Schemas Auxiliares
// =========================

export const emailSchema = z
  .email({ message: "Formato de e-mail inválido" })
  .transform((value) => value.trim().toLowerCase());

// =========================
// Schema para Enviar Mensagem (Frontend -> API)
// =========================

export const createMessageSchema = z.object({
  name: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length >= 3, {
      message: "O nome deve ter no mínimo 3 caracteres",
    }),

  email: emailSchema,

  subject: z
    .string()
    .transform((value) => value.trim())
    .optional()
    .or(z.literal("")), // Assunto é opcional, aceita string vazia

  content: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length >= 10, {
      message: "A mensagem deve conter pelo menos 10 caracteres",
    }),
});

// ==========================================
// Schema para Atualizar Status (Exclusivo Admin)
// ==========================================

export const updateMessageStatusSchema = z.object({
  // Zod v4: removido required_error, usamos apenas message
  isRead: z.boolean({ message: "O status de leitura (isRead) é obrigatório" }),
});

// ==========================================
// Schema para Parâmetros de URL
// ==========================================

export const messageParamsSchema = z.object({
  id: z.uuid({ message: "Formato de ID inválido" }),
});

// ==========================================
// Schemas de Resposta (Retorno da API)
// ==========================================

export const messageResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  // Zod v4: top-level API
  email: z.email(),
  subject: z.string().nullable(),
  content: z.string(),
  isRead: z.boolean(),
  createdAt: z.coerce.date().optional(),
});

export const messageListResponseSchema = z.array(messageResponseSchema);
