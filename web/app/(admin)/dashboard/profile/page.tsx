import { AdminHeader } from "../_components/geral/admin-header";
import { PersonalInfoForm } from "../_components/profile/personal-info-form";
import { SecurityForm } from "../_components/profile/security-form";
import { getProfileAction } from "@/actions/users.actions";
import { UserResponse } from "@/types/index";

export const metadata = {
  title: "Configurações de Conta | System Admin",
};

// Removemos a leitura manual de cookies e usamos a sua Action!
export default async function ProfilePage() {
  let user: UserResponse | null = null;

  try {
    const response = await getProfileAction();
    user = response.user || null;
  } catch (error) {
    console.error("[Profile] Erro ao buscar dados do perfil:", error);
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      <AdminHeader
        title="Meu Perfil"
        description="Gerencie seus dados pessoais, credenciais de acesso e informações da conta."
      />

      <div className="mt-2 grid grid-cols-1 items-start gap-6 lg:gap-8 xl:grid-cols-2">
        <PersonalInfoForm user={user} />
        <SecurityForm />
      </div>
    </div>
  );
}
