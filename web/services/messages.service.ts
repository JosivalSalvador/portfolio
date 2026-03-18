// web/services/messages.service.ts

import { httpClient } from "../lib/api/http-client";
import {
  CreateMessageInput,
  UpdateMessageStatusInput,
  MessageResponse,
  MessageListResponse,
} from "../types/index";

export const messagesService = {
  // ==========================================
  // 🌐 ROTAS PÚBLICAS (Visitantes)
  // ==========================================

  /**
   * Envia uma nova mensagem pelo formulário de contato do portfólio.
   */
  sendMessage: async (data: CreateMessageInput) => {
    return httpClient<{ message: string; messageId: string }>("/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // ==========================================
  // 👑 ROTAS DE ADMINISTRAÇÃO (Staff Only)
  // ==========================================

  /**
   * Lista todas as mensagens recebidas na caixa de entrada do painel.
   */
  listAll: async () => {
    return httpClient<{ messages: MessageListResponse }>("/messages", {
      method: "GET",
    });
  },

  /**
   * Puxa os detalhes completos de uma mensagem específica pelo ID.
   */
  getOne: async (id: string) => {
    return httpClient<{ message: MessageResponse }>(`/messages/${id}`, {
      method: "GET",
    });
  },

  /**
   * Atualiza o status de leitura de uma mensagem (isRead: true/false).
   */
  updateStatus: async (id: string, data: UpdateMessageStatusInput) => {
    return httpClient<{ message: string; messageRecord: MessageResponse }>(
      `/messages/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  },

  /**
   * Deleta permanentemente uma mensagem da caixa de entrada.
   */
  adminDelete: async (id: string) => {
    return httpClient<void>(`/messages/${id}`, {
      method: "DELETE",
    });
  },
};
