export default function AdminProjectsLoading() {
  return (
    <div className="flex w-full animate-pulse flex-col pb-12">
      {/* Header Skeleton */}
      <div className="border-border/30 mb-10 flex flex-col justify-between gap-6 border-b pb-6 sm:flex-row sm:items-center">
        <div className="space-y-3">
          {/* Título */}
          <div className="bg-muted/20 h-10 w-72 rounded-lg" />
          {/* Descrição */}
          <div className="bg-muted/10 h-5 w-96 max-w-full rounded-md" />
        </div>

        {/* Botão Novo Módulo Skeleton */}
        <div className="h-11 w-40 shrink-0 rounded-lg border border-emerald-500/20 bg-emerald-500/10" />
      </div>

      {/* Tabela Skeleton (Design Premium) */}
      <div className="glass-panel border-border/50 w-full overflow-hidden rounded-2xl border bg-[#0a0a0a] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            {/* Cabeçalho da Tabela */}
            <thead className="border-border/40 bg-muted/5 border-b">
              <tr>
                <th className="px-6 py-5">
                  <div className="bg-muted/20 h-3 w-24 rounded-md" />
                </th>
                <th className="px-6 py-5">
                  <div className="bg-muted/20 h-3 w-16 rounded-md" />
                </th>
                <th className="px-6 py-5">
                  <div className="bg-muted/20 h-3 w-20 rounded-md" />
                </th>
                <th className="flex justify-end px-6 py-5">
                  <div className="bg-muted/20 h-3 w-24 rounded-md" />
                </th>
              </tr>
            </thead>

            {/* Linhas (Simulando 5 projetos carregando) */}
            <tbody className="divide-border/20 divide-y">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  {/* Coluna 1: Nome/Slug */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2.5">
                      <div className="bg-muted/20 h-5 w-48 rounded-md" />
                      <div className="bg-muted/10 h-3 w-32 rounded-md" />
                    </div>
                  </td>

                  {/* Coluna 2: Status (Destaque) */}
                  <td className="px-6 py-5">
                    <div className="bg-muted/10 h-6 w-20 rounded-md" />
                  </td>

                  {/* Coluna 3: Métricas */}
                  <td className="px-6 py-5">
                    <div className="bg-muted/10 h-7 w-24 rounded-md" />
                  </td>

                  {/* Coluna 4: Botões de Ação */}
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="bg-muted/10 h-9 w-9 rounded-lg" />
                      <div className="bg-muted/10 h-9 w-9 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
