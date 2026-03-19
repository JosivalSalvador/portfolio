export default function ProfileLoading() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-6 pb-12">
      {/* Header Skeleton */}
      <div className="border-border/30 mb-10 flex flex-col justify-between gap-6 border-b pb-6 sm:flex-row sm:items-center">
        <div className="space-y-3">
          <div className="bg-muted/30 h-10 w-48 rounded-lg" />
          <div className="bg-muted/10 h-5 w-96 max-w-full rounded-md" />
        </div>
      </div>

      <div className="mt-2 grid grid-cols-1 items-start gap-6 lg:gap-8 xl:grid-cols-2">
        {/* Card Dados Pessoais Skeleton */}
        <div className="glass-panel border-border/40 overflow-hidden rounded-3xl border bg-[#0a0a0a]">
          <div className="border-border/30 flex flex-col gap-6 border-b bg-[#050505]/50 p-8 sm:flex-row sm:items-center">
            <div className="bg-muted/20 h-20 w-20 shrink-0 rounded-full" />
            <div className="flex-1 space-y-4">
              <div className="bg-muted/20 h-8 w-48 rounded-lg" />
              <div className="flex gap-3">
                <div className="bg-muted/10 h-7 w-24 rounded-md" />
                <div className="h-7 w-32 rounded-md bg-emerald-500/10" />
              </div>
            </div>
          </div>
          <div className="space-y-7 p-8">
            <div className="space-y-3">
              <div className="bg-muted/20 h-3 w-32 rounded-md" />
              <div className="border-border/20 h-12 w-full rounded-xl border bg-[#050505]" />
            </div>
            <div className="space-y-3">
              <div className="bg-muted/20 h-3 w-48 rounded-md" />
              <div className="border-border/20 h-12 w-full rounded-xl border bg-[#050505]" />
            </div>
            <div className="mt-4 flex justify-end pt-6">
              <div className="bg-muted/20 h-12 w-48 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Card Segurança Skeleton */}
        <div className="glass-panel border-border/40 overflow-hidden rounded-3xl border bg-[#0a0a0a]">
          <div className="border-border/30 flex items-center gap-5 border-b bg-[#050505]/50 p-8">
            <div className="bg-muted/20 h-14 w-14 shrink-0 rounded-xl" />
            <div className="space-y-2">
              <div className="bg-muted/20 h-7 w-32 rounded-md" />
              <div className="bg-muted/10 h-3 w-48 rounded-md" />
            </div>
          </div>
          <div className="space-y-7 p-8">
            <div className="space-y-3">
              <div className="bg-muted/20 h-3 w-24 rounded-md" />
              <div className="border-border/20 h-12 w-full rounded-xl border bg-[#050505]" />
            </div>
            <div className="border-border/20 space-y-6 border-t pt-6">
              <div className="space-y-3">
                <div className="h-3 w-28 rounded-md bg-emerald-500/20" />
                <div className="border-border/20 h-12 w-full rounded-xl border bg-[#050505]" />
              </div>
              <div className="space-y-3">
                <div className="h-3 w-40 rounded-md bg-emerald-500/20" />
                <div className="border-border/20 h-12 w-full rounded-xl border bg-[#050505]" />
              </div>
            </div>
            <div className="mt-4 flex justify-end pt-6">
              <div className="bg-muted/20 h-12 w-44 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
