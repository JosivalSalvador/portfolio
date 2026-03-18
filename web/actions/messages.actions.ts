// web/actions/messages.actions.ts
"use server";

import { messagesService } from "../services/messages.service";
import { revalidatePath } from "next/cache";
import {
  CreateMessageInput,
  UpdateMessageStatusInput,
  MessageResponse,
  MessageListResponse,
  HttpError,
} from "../types/index";

// Mantendo o mesmo padrão de contrato estrito para os Hooks de UI
type ActionResponse<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

// ==========================================
// 🔍 ACTIONS DE BUSCA (GET - Para Hooks / Server Components)
// ==========================================

export async function getMessagesListAction(): Promise<{
  messages: MessageListResponse;
}> {
  try {
    return await messagesService.listAll();
  } catch (error: unknown) {
    const httpError = error as HttpError;
    throw new Error(httpError.message || "Falha ao listar as mensagens.");
  }
}

export async function getMessageAction(
  id: string,
): Promise<{ message: MessageResponse }> {
  try {
    return await messagesService.getOne(id);
  } catch (error: unknown) {
    const httpError = error as HttpError;
    throw new Error(httpError.message || "Falha ao buscar a mensagem.");
  }
}

// ==========================================
// 🌐 ACTIONS PÚBLICAS (Mutações / Portfólio)
// ==========================================

export async function sendMessageAction(
  data: CreateMessageInput,
): Promise<ActionResponse<{ messageId: string }>> {
  try {
    const response = await messagesService.sendMessage(data);

    // Como o formulário é público e não altera dados exibidos em tela na Home,
    // não há necessidade estrita de um revalidatePath aqui.

    return {
      success: true,
      data: { messageId: response.messageId },
      message: response.message,
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao enviar a mensagem de contato.",
    };
  }
}

// ==========================================
// 👑 ACTIONS DE ADMINISTRAÇÃO (Mutações / Staff Only)
// ==========================================

export async function updateMessageStatusAction(
  id: string,
  data: UpdateMessageStatusInput,
): Promise<ActionResponse<{ messageRecord: MessageResponse }>> {
  try {
    const response = await messagesService.updateStatus(id, data);

    // Invalida a tabela da caixa de entrada e, se existir, a tela de detalhes
    revalidatePath("/dashboard/messages");
    revalidatePath(`/dashboard/messages/${id}`);

    return {
      success: true,
      data: { messageRecord: response.messageRecord },
      message: response.message,
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao atualizar o status de leitura.",
    };
  }
}

export async function adminDeleteMessageAction(
  id: string,
): Promise<ActionResponse> {
  try {
    await messagesService.adminDelete(id);

    // Atualiza a tabela do Admin removendo a linha da mensagem instantaneamente
    revalidatePath("/dashboard/messages");

    return { success: true };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao excluir a mensagem.",
    };
  }
}
