export default function AdminMessagesLoading() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-6 pb-12">
      {/* Header Skeleton */}
      <div className="border-border/30 mb-10 flex flex-col justify-between gap-6 border-b pb-6 sm:flex-row sm:items-center">
        <div className="space-y-3">
          <div className="bg-muted/30 h-10 w-64 rounded-lg" />
          <div className="bg-muted/10 h-5 w-96 max-w-full rounded-md" />
        </div>
      </div>

      {/* Tabela Skeleton (Design Premium) */}
      <div className="glass-panel border-border/40 w-full overflow-hidden rounded-3xl border bg-[#0a0a0a] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            {/* Cabeçalho da Tabela */}
            <thead className="border-border/40 border-b bg-[#050505]">
              <tr>
                <th className="w-12 px-6 py-5">
                  <div className="bg-muted/20 h-3 w-6 rounded-md" />
                </th>
                <th className="px-6 py-5">
                  <div className="bg-muted/20 h-3 w-24 rounded-md" />
                </th>
                <th className="px-6 py-5">
                  <div className="bg-muted/20 h-3 w-32 rounded-md" />
                </th>
                <th className="px-6 py-5">
                  <div className="bg-muted/20 h-3 w-20 rounded-md" />
                </th>
                <th className="flex justify-end px-6 py-5">
                  <div className="bg-muted/20 h-3 w-20 rounded-md" />
                </th>
              </tr>
            </thead>

            {/* Linhas (Simulando 5 mensagens carregando) */}
            <tbody className="divide-border/20 divide-y">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  {/* Status (St) */}
                  <td className="px-6 py-5">
                    <div className="bg-muted/20 h-8 w-8 rounded-full" />
                  </td>

                  {/* Remetente */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                      <div className="bg-muted/20 h-4 w-32 rounded-md" />
                      <div className="bg-muted/10 h-3 w-40 rounded-md" />
                    </div>
                  </td>

                  {/* Assunto */}
                  <td className="px-6 py-5">
                    <div className="bg-muted/10 h-4 w-64 rounded-md" />
                  </td>

                  {/* Data */}
                  <td className="px-6 py-5">
                    <div className="bg-muted/10 h-6 w-24 rounded-md" />
                  </td>

                  {/* Ações */}
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
