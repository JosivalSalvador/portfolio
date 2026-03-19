import { AdminHeader } from "../_components/geral/admin-header";
import { MessagesDataTable } from "../_components/messages/messages-data-table";
import { getMessagesListAction } from "@/actions/messages.actions";
import { MessageResponse } from "@/types/index";

export const metadata = {
  title: "Inbox | System Admin",
};

export const revalidate = 0;

export default async function AdminMessagesPage() {
  let messages: MessageResponse[] = [];

  try {
    const response = await getMessagesListAction();
    messages = response.messages || [];
  } catch (error) {
    console.error("[Admin Error] Falha ao carregar caixa de entrada:", error);
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      <AdminHeader
        title="Caixa de Entrada"
        description="Acompanhe as mensagens, orçamentos e contatos enviados pelo formulário público."
      />

      <MessagesDataTable messages={messages} />
    </div>
  );
}
