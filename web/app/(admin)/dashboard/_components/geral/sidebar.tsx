"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Mail,
  Users as UsersIcon,
  LogOut,
  TerminalSquare,
  UserCog,
  ChevronsUpDown,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-users";
import { Role } from "@/types/index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Adicionamos a flag "adminOnly" para blindar a UI
const NAV_LINKS = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    adminOnly: false,
  },
  {
    href: "/dashboard/projects",
    label: "Projetos",
    icon: FolderGit2,
    adminOnly: false,
  },
  {
    href: "/dashboard/messages",
    label: "Mensagens",
    icon: Mail,
    adminOnly: false,
  },
  {
    href: "/dashboard/users",
    label: "Usuários",
    icon: UsersIcon,
    adminOnly: true,
  }, // Exclusivo Root
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const { data: profileData, isLoading: isLoadingProfile } = useProfile();
  const user = profileData?.user;

  // Extrai as iniciais do nome (ex: "Josival Junior" -> "JJ")
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <aside className="border-border/40 fixed top-0 left-0 z-50 hidden h-dvh w-64 flex-col border-r bg-[#050505]/95 shadow-[4px_0_24px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:flex">
      {/* Logotipo */}
      <div className="border-border/40 flex h-16 items-center border-b px-6">
        <Link
          href="/dashboard"
          className="text-foreground group flex items-center gap-3 transition-all hover:text-emerald-400"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 transition-shadow duration-500 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <TerminalSquare className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          <span className="font-mono text-sm font-bold tracking-widest uppercase">
            Sys.Admin
          </span>
        </Link>
      </div>

      {/* Navegação Dinâmica Baseada em Role */}
      <nav className="mt-4 flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-muted-foreground mb-3 px-3 font-mono text-[10px] tracking-widest uppercase">
          Módulos do Sistema
        </span>

        {NAV_LINKS.filter(
          (link) => !link.adminOnly || user?.role === Role.ADMIN,
        ).map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);

          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${isActive ? "bg-emerald-500/10 text-emerald-400 shadow-inner" : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"}`}
            >
              {isActive && (
                <div className="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-md bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
              )}
              <Icon
                className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-emerald-400" : "text-muted-foreground group-hover:text-foreground"}`}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé: Botão de Perfil */}
      <div className="border-border/40 border-t bg-[#0a0a0a] p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="border-border/60 group flex w-full items-center justify-between rounded-xl border bg-[#0f0f0f] px-3 py-3 shadow-sm outline-hidden transition-all hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] focus-visible:ring-2 focus-visible:ring-emerald-500">
              <div className="flex items-center gap-3 overflow-hidden">
                {/* Avatar com Iniciais */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 shadow-inner transition-colors group-hover:bg-emerald-500/20">
                  {isLoadingProfile ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />
                  ) : (
                    <span className="font-mono text-xs font-bold text-emerald-500">
                      {user?.name ? getInitials(user.name) : "US"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start truncate text-left">
                  <span className="text-foreground w-24 truncate font-mono text-[11px] font-bold tracking-widest uppercase">
                    {isLoadingProfile
                      ? "Carregando"
                      : user?.name?.split(" ")[0] || "Usuário"}
                  </span>
                  <span
                    className={`font-mono text-[9px] uppercase transition-colors ${user?.role === Role.ADMIN ? "text-emerald-500" : "text-blue-500"}`}
                  >
                    {user?.role === Role.ADMIN
                      ? "Root / Admin"
                      : user?.role === Role.SUPPORTER
                        ? "Suporte"
                        : "Comum"}
                  </span>
                </div>
              </div>
              <ChevronsUpDown className="text-muted-foreground group-hover:text-foreground h-4 w-4 shrink-0 transition-colors" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={12}
            className="border-border/60 z-50 mb-2 w-60 rounded-xl bg-[#0a0a0a] p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          >
            <DropdownMenuLabel className="text-muted-foreground flex flex-col px-2 py-1.5 font-mono text-[10px] tracking-widest uppercase">
              Logado como
              <span className="text-foreground mt-0.5 font-bold">
                {user?.email || "..."}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/40 my-1" />

            <DropdownMenuItem
              asChild
              className="hover:bg-muted/30 focus:bg-muted/30 cursor-pointer rounded-lg py-3 transition-colors"
            >
              <Link
                href="/dashboard/profile"
                className="text-foreground flex w-full items-center font-medium"
              >
                <UserCog className="mr-3 h-4 w-4 text-emerald-500" />
                Configurar Perfil
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border/40 my-1" />

            <DropdownMenuItem
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg py-3 font-medium transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              {logout.isPending ? "Encerrando..." : "Encerrar Sessão"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
