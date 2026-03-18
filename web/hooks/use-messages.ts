// web/hooks/use-messages.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMessagesListAction,
  getMessageAction,
  sendMessageAction,
  updateMessageStatusAction,
  adminDeleteMessageAction,
} from "../actions/messages.actions";
import { CreateMessageInput, UpdateMessageStatusInput } from "../types/index";
import { toast } from "sonner";

// ==========================================
// 🔍 QUERIES (Buscas Diretas via Actions)
// ==========================================

export function useMessagesList() {
  return useQuery({
    queryKey: ["messages"],
    queryFn: () => getMessagesListAction(),
  });
}

export function useMessage(id: string) {
  return useQuery({
    queryKey: ["message", id],
    queryFn: () => getMessageAction(id),
    enabled: !!id, // Só executa a busca se o ID estiver disponível
  });
}

// ==========================================
// ✍️ MUTAÇÕES (Modificações via Actions)
// ==========================================

export function useMessagesMutations() {
  const queryClient = useQueryClient();

  // ---- 🌐 Mutações Públicas (Visitantes) ----

  const sendMessage = useMutation({
    mutationFn: async (data: CreateMessageInput) => {
      const response = await sendMessageAction(data);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Sua mensagem foi enviada com sucesso!");
      // Nenhuma invalidação de cache necessária aqui, pois o visitante não vê a caixa de entrada
    },
    onError: (error: Error) => toast.error(error.message),
  });

  // ---- 👑 Mutações Exclusivas do Admin ----

  const updateMessageStatus = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMessageStatusInput;
    }) => {
      const response = await updateMessageStatusAction(id, data);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Status da mensagem atualizado!");
      // Invalida a lista de mensagens para atualizar a tabela do Admin
      queryClient.invalidateQueries({ queryKey: ["messages"] });

      // Se a resposta trouxe o registro atualizado, invalida o cache específico dele também
      if (data.data?.messageRecord) {
        queryClient.invalidateQueries({
          queryKey: ["message", data.data.messageRecord.id],
        });
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const response = await adminDeleteMessageAction(id);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: () => {
      toast.success("Mensagem excluída permanentemente.");
      // Invalida a lista para sumir da tabela
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    sendMessage,
    updateMessageStatus,
    deleteMessage,
  };
}
