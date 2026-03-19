import { AdminHeader } from "../_components/geral/admin-header";
import { UsersDataTable } from "../_components/users/users-data-table";
import { getUsersListAction } from "@/actions/users.actions";
import { UserResponse } from "@/types/index";

export const metadata = {
  title: "Controle de Acesso | System Admin",
};

export const revalidate = 0;

export default async function AdminUsersPage() {
  let users: UserResponse[] = [];

  try {
    const response = await getUsersListAction();
    users = response.users || [];
  } catch (error) {
    console.error("[Admin Error] Falha ao carregar lista de usuários:", error);
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      <AdminHeader
        title="Controle de Acesso (RBAC)"
        description="Gerencie permissões, promova contas a Suporte ou conceda privilégios de Administrador."
      />

      <UsersDataTable users={users} />
    </div>
  );
}
