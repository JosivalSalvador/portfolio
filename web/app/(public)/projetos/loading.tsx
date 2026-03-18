import { GridBackground } from "@/components/ui/grid-background";

export default function ProjetosLoading() {
  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center pt-32 pb-24">
      <GridBackground />

      <div className="flex w-full max-w-6xl flex-col gap-12 px-6 md:px-12">
        {/* Skeleton do Header */}
        <div className="border-border/50 w-full border-b pb-8">
          <div className="bg-border/50 mb-6 h-4 w-32 animate-pulse rounded-full" />
          <div className="bg-muted/40 mb-4 h-12 w-3/4 animate-pulse rounded-md" />
          <div className="bg-border/30 h-4 w-1/2 animate-pulse rounded-md" />
        </div>

        {/* Skeleton do Grid de Projetos */}
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-muted/10 border-border/30 flex h-100 w-full animate-pulse flex-col rounded-xl border p-4"
            >
              <div className="bg-muted/20 mb-4 h-48 w-full rounded-lg" />
              <div className="bg-muted/30 mb-2 h-6 w-2/3 rounded-md" />
              <div className="bg-border/20 mb-1 h-4 w-full rounded-md" />
              <div className="bg-border/20 mt-auto h-4 w-4/5 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
